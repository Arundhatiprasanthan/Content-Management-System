const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getQuizByArticle,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitQuizAttempt,
  getQuizResults,
  getMyAttempts
} = require('../controllers/quizController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// User quiz attempts list (must be before /:id route)
router.get('/user/attempts', protect, getMyAttempts);

// Article quiz endpoint
router.get('/article/:articleId', optionalAuth, getQuizByArticle);

// Quiz CRUD & Attempt routes
router.route('/')
  .post(protect, createQuiz);

router.route('/:id')
  .get(optionalAuth, getQuizById)
  .put(protect, updateQuiz)
  .delete(protect, deleteQuiz);

router.route('/:id/attempt')
  .post(optionalAuth, submitQuizAttempt);

router.route('/:id/results')
  .get(protect, getQuizResults);

module.exports = router;
