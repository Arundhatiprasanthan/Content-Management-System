const express = require("express");

const router = express.Router();

const {
  createQuiz,
  getQuizByArticle,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitQuizAttempt,
  getQuizResults,
  getMyAttempts,
} = require("../controllers/quizController");

const {
  protect,
  optionalAuth,
} = require("../middleware/authMiddleware");

// User quiz attempts
router.get(
  "/user/attempts",
  protect,
  getMyAttempts
);

// Get quiz by article
router.get(
  "/article/:articleId",
  optionalAuth,
  getQuizByArticle
);

// Create quiz
router.post(
  "/",
  protect,
  createQuiz
);

// Get / update / delete quiz
router
  .route("/:id")
  .get(optionalAuth, getQuizById)
  .put(protect, updateQuiz)
  .delete(protect, deleteQuiz);

// Submit quiz attempt
router.post(
  "/:id/attempt",
  optionalAuth,
  submitQuizAttempt
);

// Get quiz results
router.get(
  "/:id/results",
  protect,
  getQuizResults
);

module.exports = router;