const http = require('http');
const app = require('../server');

let server;
const PORT = 5566;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    if (data) {
      reqHeaders['Content-Length'] = Buffer.byteLength(data);
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path,
        method,
        headers: reqHeaders
      },
      (res) => {
        let resBody = '';
        res.on('data', (chunk) => (resBody += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(resBody);
            resolve({ statusCode: res.statusCode, body: parsed });
          } catch (e) {
            resolve({ statusCode: res.statusCode, body: resBody });
          }
        });
      }
    );

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting Comprehensive Quiz System Verification...\n');

  try {
    server = app.listen(PORT);
    console.log(`Server listening on port ${PORT}`);

    // 1. GET /api/quizzes (List approved quizzes)
    const listRes = await request('GET', '/api/quizzes');
    console.log(`[${listRes.statusCode}] GET /api/quizzes - Found ${listRes.body.count} approved quizzes`);
    if (!listRes.body.success || !Array.isArray(listRes.body.data) || listRes.body.data.length === 0) {
      throw new Error('Failed to retrieve approved quizzes');
    }

    const firstQuiz = listRes.body.data[0];
    console.log(`  Quiz Title: "${firstQuiz.title}"`);
    console.log(`  Questions count: ${firstQuiz.questions.length}`);

    // Verify security: correctAnswer should NOT be present in reader view
    if (firstQuiz.questions[0].correctAnswer !== undefined) {
      throw new Error('SECURITY VIOLATION: correctAnswer leaked to reader in GET /api/quizzes!');
    }
    console.log('✅ Security check passed: correctAnswer masked from readers');

    // 2. GET /api/quizzes/article/:articleId
    const articleId = firstQuiz.articleId ? (firstQuiz.articleId._id || firstQuiz.articleId) : '66cc00000000000000000101';
    const byArticleRes = await request('GET', `/api/quizzes/article/${articleId}`);
    console.log(`[${byArticleRes.statusCode}] GET /api/quizzes/article/:articleId - Retrieved "${byArticleRes.body.data?.title}"`);
    if (!byArticleRes.body.success) {
      throw new Error('Failed to get quiz by article');
    }

    // 3. POST /api/quizzes/:id/attempts (Create/Initialize attempt)
    const initRes = await request(
      'POST',
      `/api/quizzes/${firstQuiz._id}/attempts`,
      {},
      { 'x-user-id': '66cc00000000000000000001', 'x-user-role': 'Reader' }
    );
    console.log(`[${initRes.statusCode}] POST /api/quizzes/:id/attempts - Attempt ID: ${initRes.body.data?.attemptId}`);
    if (!initRes.body.success || !initRes.body.data?.attemptId) {
      throw new Error('Failed to initialize quiz attempt');
    }
    const attemptId = initRes.body.data.attemptId;

    // 4. POST /api/quizzes/:id/attempt (Submit quiz answers and calculate score)
    // Send answers [0, 0, 0]
    const submitRes = await request(
      'POST',
      `/api/quizzes/${firstQuiz._id}/attempt`,
      {
        answers: [0, 0, 0],
        attemptId
      },
      { 'x-user-id': '66cc00000000000000000001', 'x-user-role': 'Reader' }
    );
    console.log(`[${submitRes.statusCode}] POST /api/quizzes/:id/attempt - Score: ${submitRes.body.data?.score}/${submitRes.body.data?.total} (${submitRes.body.data?.percentage}%)`);
    if (!submitRes.body.success || submitRes.body.data.score === undefined) {
      throw new Error('Failed to submit quiz attempt');
    }

    // Verify results detail in response
    const resultQuestions = submitRes.body.data.questions;
    if (!resultQuestions || resultQuestions.length === 0 || resultQuestions[0].explanation === undefined) {
      throw new Error('Result submission did not return explanations or questions breakdown');
    }
    console.log(`✅ Result details verified: ${resultQuestions.length} questions evaluated with explanations`);

    // 5. GET /api/quizzes/attempts/:attemptId (Get specific attempt details)
    const getAttemptRes = await request('GET', `/api/quizzes/attempts/${attemptId}`);
    console.log(`[${getAttemptRes.statusCode}] GET /api/quizzes/attempts/:attemptId - Status: ${getAttemptRes.body.data?.status}, Score: ${getAttemptRes.body.data?.score}`);
    if (!getAttemptRes.body.success) {
      throw new Error('Failed to retrieve specific attempt');
    }

    // 6. GET /api/quizzes/user/attempts (Get user attempt history)
    const historyRes = await request(
      'GET',
      '/api/quizzes/user/attempts',
      null,
      { 'x-user-id': '66cc00000000000000000001', 'x-user-role': 'Reader' }
    );
    console.log(`[${historyRes.statusCode}] GET /api/quizzes/user/attempts - History count: ${historyRes.body.data?.length}`);
    if (!historyRes.body.success || !Array.isArray(historyRes.body.data) || historyRes.body.data.length === 0) {
      throw new Error('Failed to retrieve user attempt history');
    }

    // 7. Test invalid answers validation
    const invalidRes = await request('POST', `/api/quizzes/${firstQuiz._id}/attempt`, { answers: 'not an array' });
    console.log(`[${invalidRes.statusCode}] POST with invalid answers rejected with: "${invalidRes.body.message}"`);
    if (invalidRes.statusCode !== 400) {
      throw new Error('Server should return 400 when answers is not an array');
    }

    console.log('\n🎉 ALL QUIZ BACKEND SYSTEM TESTS PASSED SUCCESSFULLY! 🌟\n');
  } catch (error) {
    console.error('❌ Test Failed:', error);
    process.exit(1);
  } finally {
    if (server) server.close();
  }
}

runTests();
