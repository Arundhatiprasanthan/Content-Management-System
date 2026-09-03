const express = require("express");

const router = express.Router();

const {
  getAdminDashboard,

  // Articles
  getPendingArticles,
  getArticleForReview,
  approveArticle,
  requestArticleChanges,
  rejectArticle,

  // Quizzes
  getPendingQuizzes,
  getQuizForReview,
  approveQuiz,
  requestQuizChanges,
  rejectQuiz,
} = require("../controllers/adminController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ==========================================
// ADMIN DASHBOARD
// ==========================================

router.get(
  "/dashboard",
  protect,
  authorize("Admin"),
  getAdminDashboard
);

// ==========================================
// ARTICLE REVIEW
// ==========================================

router.get(
  "/articles/review",
  protect,
  authorize("Admin"),
  getPendingArticles
);

router.get(
  "/articles/:id",
  protect,
  authorize("Admin"),
  getArticleForReview
);

router.patch(
  "/articles/:id/approve",
  protect,
  authorize("Admin"),
  approveArticle
);

router.patch(
  "/articles/:id/request-changes",
  protect,
  authorize("Admin"),
  requestArticleChanges
);

router.patch(
  "/articles/:id/reject",
  protect,
  authorize("Admin"),
  rejectArticle
);

// ==========================================
// QUIZ REVIEW
// ==========================================

router.get(
  "/quizzes/review",
  protect,
  authorize("Admin"),
  getPendingQuizzes
);

router.get(
  "/quizzes/:id",
  protect,
  authorize("Admin"),
  getQuizForReview
);

router.patch(
  "/quizzes/:id/approve",
  protect,
  authorize("Admin"),
  approveQuiz
);

router.patch(
  "/quizzes/:id/request-changes",
  protect,
  authorize("Admin"),
  requestQuizChanges
);

router.patch(
  "/quizzes/:id/reject",
  protect,
  authorize("Admin"),
  rejectQuiz
);

module.exports = router;