const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Article = require('../models/Article');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Notification = require('../models/Notification');

const quizService = require('../services/quizService');
const notificationService = require('../services/notificationService');

async function runTests() {
  console.log('🧪 Starting Quiz & Notification Backend Verification Tests...\n');

  try {
    // 1. Connect DB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lumen_cms');
    console.log('✅ Database connected');

    // 2. Setup Test Author & Reader Users
    await User.deleteMany({ email: { $in: ['test_author@lumen.test', 'test_reader@lumen.test'] } });

    const author = await User.create({
      name: 'Test Author',
      email: 'test_author@lumen.test',
      password: 'hashed_password_123',
      role: 'Author'
    });

    const reader = await User.create({
      name: 'Test Reader',
      email: 'test_reader@lumen.test',
      password: 'hashed_password_123',
      role: 'Reader'
    });

    console.log('✅ Author and Reader test accounts created');

    // 3. Setup Test Article
    const article = await Article.create({
      title: 'The Evolution of Modern Web Browsers',
      description: 'An overview of how web browsers transformed the internet.',
      content: 'Full article body content exploring HTML, CSS, JavaScript engines, and modern browser architectures.',
      category: 'Technology',
      tags: ['web', 'browsers', 'javascript'],
      authorId: author._id,
      status: 'Published',
      readingTime: 5
    });

    console.log(`✅ Test article created: "${article.title}" (ID: ${article._id})`);

    // 4. Test Quiz Creation
    const sampleQuestions = [
      {
        question: 'Which organization created the first graphical web browser Mosaic?',
        options: ['NCSA', 'W3C', 'CERN', 'IEEE'],
        correctAnswer: 0,
        explanation: 'Mosaic was developed at the National Center for Supercomputing Applications (NCSA).'
      },
      {
        question: 'What JavaScript engine powers Google Chrome and Node.js?',
        options: ['SpiderMonkey', 'JavaScriptCore', 'V8', 'Chakra'],
        correctAnswer: 2,
        explanation: 'V8 is Google open source high-performance JavaScript and WebAssembly engine.'
      },
      {
        question: 'In what year was the first version of HTML published by Tim Berners-Lee?',
        options: ['1989', '1991', '1995', '2000'],
        correctAnswer: 1,
        explanation: 'HTML 1.0 specifications were released in 1991.'
      }
    ];

    const quiz = await quizService.createQuiz(
      {
        articleId: article._id,
        title: 'Web Browsers Knowledge Quiz',
        description: 'Test your understanding of modern browser history.',
        questions: sampleQuestions
      },
      author
    );

    console.log(`✅ Quiz created successfully (ID: ${quiz._id}) with ${quiz.questions.length} questions`);

    // 5. Test Quiz Sanitization for Readers (Security Check)
    const readerView = await quizService.getQuizByArticle(article._id, reader);
    const hasLeakedAnswers = readerView.questions.some(q => q.correctAnswer !== undefined);
    if (hasLeakedAnswers) {
      throw new Error('❌ SECURITY FAILURE: Correct answers were leaked in Reader view!');
    }
    console.log('✅ Security Check Passed: Correct answers are hidden from Readers');

    // 6. Test Quiz View for Author (Author can see correct answers)
    const authorView = await quizService.getQuizById(quiz._id, author);
    const authorSeesAnswers = authorView.questions.every(q => q.correctAnswer !== undefined);
    if (!authorSeesAnswers) {
      throw new Error('❌ Author view should include correct answers for editing');
    }
    console.log('✅ Author Check Passed: Author has full access to answer keys');

    // 7. Test Quiz Attempt Submission & Automated Scoring
    // Reader answers: Q0 -> 0 (Correct), Q1 -> 2 (Correct), Q2 -> 0 (Incorrect, correct is 1)
    const readerAnswers = [0, 2, 0];
    const attemptResult = await quizService.submitAttempt(quiz._id, readerAnswers, reader);

    console.log('✅ Quiz Attempt Processed:');
    console.log(`   - Score: ${attemptResult.score} / ${attemptResult.total}`);
    console.log(`   - Percentage: ${attemptResult.percentage}%`);

    if (attemptResult.score !== 2 || attemptResult.total !== 3 || attemptResult.percentage !== 67) {
      throw new Error(`❌ Score mismatch: Expected 2/3 (67%), got ${attemptResult.score}/${attemptResult.total} (${attemptResult.percentage}%)`);
    }

    if (!attemptResult.questions[0].correct || !attemptResult.questions[1].correct || attemptResult.questions[2].correct) {
      throw new Error('❌ Question evaluation breakdown incorrect!');
    }
    console.log('✅ Automated Scoring Engine verified accurately');

    // 8. Test Attempt History Retrieval
    const userAttempts = await quizService.getUserAttempts(reader._id);
    if (userAttempts.length === 0) {
      throw new Error('❌ Failed to retrieve user attempt history');
    }
    console.log(`✅ User attempt history verified (${userAttempts.length} attempt found)`);

    // 9. Test Notification Engine
    const authorNotifs = await notificationService.getUserNotifications(author._id);
    console.log(`✅ Author notifications verified: Total ${authorNotifs.notifications.length}, Unread: ${authorNotifs.unreadCount}`);

    if (authorNotifs.notifications.length === 0) {
      throw new Error('❌ Author should have received notifications for quiz creation / attempt');
    }

    // 10. Test Marking Single Notification Read
    const firstNotifId = authorNotifs.notifications[0]._id;
    const updatedNotif = await notificationService.markAsRead(firstNotifId, author._id);
    if (!updatedNotif.read) {
      throw new Error('❌ markAsRead failed to update read status');
    }
    console.log('✅ Notification markAsRead verified');

    // 11. Test Mark All As Read
    await notificationService.markAllAsRead(author._id);
    const unreadAfter = await notificationService.getUnreadCount(author._id);
    if (unreadAfter !== 0) {
      throw new Error(`❌ Expected 0 unread notifications, got ${unreadAfter}`);
    }
    console.log('✅ Notification markAllAsRead verified (Unread count = 0)');

    // Clean up test data
    await Promise.all([
      QuizAttempt.deleteMany({ quizId: quiz._id }),
      Quiz.deleteMany({ _id: quiz._id }),
      Article.deleteMany({ _id: article._id }),
      Notification.deleteMany({ userId: { $in: [author._id, reader._id] } }),
      User.deleteMany({ _id: { $in: [author._id, reader._id] } })
    ]);

    console.log('\n🎉 ALL QUIZ & NOTIFICATION BACKEND TESTS PASSED SUCCESSFULLY! 🚀\n');
  } catch (error) {
    console.error('\n❌ Test Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runTests();
