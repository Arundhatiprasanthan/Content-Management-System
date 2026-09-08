const express = require("express");

const router = express.Router();

const {
  getApprovedQuizzes,
  createQuiz,
  getQuizByArticle,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  createQuizAttempt,
  submitQuizAttempt,
  getAttemptById,
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

<<<<<<< Updated upstream
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
=======
// 1. User quiz attempts list (must be before /:id route)
router.get('/user/attempts', optionalAuth, getMyAttempts);

// 2. Specific attempt detail by attemptId
router.get('/attempts/:attemptId', optionalAuth, getAttemptById);

// 3. Article quiz endpoint
router.get('/article/:articleId', optionalAuth, getQuizByArticle);

// 4. Approved quizzes list / Create quiz
router.route('/')
  .get(optionalAuth, getApprovedQuizzes)
  .post(protect, createQuiz);

// 5. Attempt creation & submission routes
router.route('/:id/attempts')
  .post(optionalAuth, createQuizAttempt);
>>>>>>> Stashed changes

// Submit quiz attempt
router.post("/:id/attempt", protect, submitQuizAttempt);
// Get quiz results
router.get(
  "/:id/results",
  protect,
  getQuizResults
);

<<<<<<< Updated upstream
module.exports = router;
=======
router.route('/:id/results')
  .get(optionalAuth, getQuizResults);

// 6. Single quiz CRUD by quiz ID
router.route('/:id')
  .get(optionalAuth, getQuizById)
  .put(protect, updateQuiz)
  .delete(protect, deleteQuiz);

module.exports = router;
>>>>>>> Stashed changes
