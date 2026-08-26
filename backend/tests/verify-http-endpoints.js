const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = require('../server');
const User = require('../models/User');
const Article = require('../models/Article');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Notification = require('../models/Notification');

let server;
const PORT = 5555;

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
            resolve({ status: res.status, statusCode: res.statusCode, body: parsed });
          } catch (e) {
            resolve({ status: res.status, statusCode: res.statusCode, body: resBody });
          }
        });
      }
    );

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runHttpTests() {
  console.log('🌐 Testing Express HTTP Endpoints for Quiz & Notifications...\n');

  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lumen_cms');
    server = app.listen(PORT);

    // 1. Health check
    const health = await request('GET', '/health');
    console.log(`✅ GET /health [${health.statusCode}]: ${health.body.message}`);

    // Setup Test Author & Article
    const author = await User.create({
      name: 'Syed Zaid Test',
      email: 'syed_http_test@lumen.test',
      password: 'pass',
      role: 'Author'
    });

    const article = await Article.create({
      title: 'HTTP Networking Deep Dive',
      description: 'Understanding HTTP/1.1, HTTP/2, and HTTP/3 protocols.',
      content: 'Detailed explanations of TCP handshakes, TLS, and HTTP framing.',
      category: 'Technology',
      authorId: author._id,
      status: 'Published'
    });

    // 2. Author creates Quiz via POST /api/quizzes
    const createQuizRes = await request(
      'POST',
      '/api/quizzes',
      {
        articleId: article._id.toString(),
        title: 'HTTP Networking Quiz',
        questions: [
          {
            question: 'What is the default port for HTTPS?',
            options: ['80', '443', '8080', '22'],
            correctAnswer: 1,
            explanation: 'HTTPS operates over TLS on standard port 443.'
          },
          {
            question: 'Which HTTP method is idempotent?',
            options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
            correctAnswer: 1,
            explanation: 'PUT is designed to be idempotent.'
          }
        ]
      },
      {
        'x-user-id': author._id.toString(),
        'x-user-role': 'Author',
        'x-user-name': author.name
      }
    );

    console.log(`✅ POST /api/quizzes [${createQuizRes.statusCode}]: Quiz ID ${createQuizRes.body.data._id}`);
    const quizId = createQuizRes.body.data._id;

    // 3. Reader gets Quiz via GET /api/quizzes/article/:articleId
    const getQuizRes = await request('GET', `/api/quizzes/article/${article._id}`);
    console.log(`✅ GET /api/quizzes/article/:id [${getQuizRes.statusCode}]: ${getQuizRes.body.data.title}`);
    
    // Check answer masking
    const q1 = getQuizRes.body.data.questions[0];
    if (q1.correctAnswer !== undefined) {
      throw new Error('❌ Security error: correctAnswer leaked in GET /api/quizzes/article/:id');
    }
    console.log('✅ Reader view answer masking confirmed over HTTP');

    // 4. Reader submits attempt via POST /api/quizzes/:id/attempt
    const reader = await User.create({
      name: 'Reader Sam',
      email: 'reader_sam@lumen.test',
      password: 'pass',
      role: 'Reader'
    });

    const submitRes = await request(
      'POST',
      `/api/quizzes/${quizId}/attempt`,
      { answers: [1, 1] }, // Both correct!
      {
        'x-user-id': reader._id.toString(),
        'x-user-role': 'Reader',
        'x-user-name': reader.name
      }
    );

    console.log(`✅ POST /api/quizzes/:id/attempt [${submitRes.statusCode}]: Score ${submitRes.body.data.score}/${submitRes.body.data.total} (${submitRes.body.data.percentage}%)`);

    // 5. Author checks notifications via GET /api/notifications
    const notifsRes = await request(
      'GET',
      '/api/notifications',
      null,
      {
        'x-user-id': author._id.toString(),
        'x-user-role': 'Author'
      }
    );

    console.log(`✅ GET /api/notifications [${notifsRes.statusCode}]: ${notifsRes.body.data.length} notifications, Unread: ${notifsRes.body.unreadCount}`);

    // 6. Author marks all read via PATCH /api/notifications/read-all
    const markAllRes = await request(
      'PATCH',
      '/api/notifications/read-all',
      null,
      {
        'x-user-id': author._id.toString(),
        'x-user-role': 'Author'
      }
    );

    console.log(`✅ PATCH /api/notifications/read-all [${markAllRes.statusCode}]: ${markAllRes.body.message}`);

    // Cleanup
    await Promise.all([
      QuizAttempt.deleteMany({ quizId }),
      Quiz.deleteMany({ _id: quizId }),
      Article.deleteMany({ _id: article._id }),
      Notification.deleteMany({ userId: { $in: [author._id, reader._id] } }),
      User.deleteMany({ _id: { $in: [author._id, reader._id] } })
    ]);

    console.log('\n🎉 ALL HTTP ENDPOINT TESTS PASSED! 🚀\n');
  } catch (err) {
    console.error('❌ HTTP Test Error:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    await mongoose.disconnect();
  }
}

runHttpTests();
