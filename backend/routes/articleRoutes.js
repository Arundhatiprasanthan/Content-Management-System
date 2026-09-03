const express = require("express");

const router = express.Router();

const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  submitArticle,
} = require("../controllers/articleController");

const {
  protect,
  optionalAuth,
} = require("../middleware/authMiddleware");

// =========================
// PUBLIC / OPTIONAL AUTH
// =========================

// Get all published articles
router
  .route("/")
  .get(optionalAuth, getArticles)
  .post(protect, createArticle);

// Get single article
router
  .route("/:id")
  .get(optionalAuth, getArticleById)
  .put(protect, updateArticle)
  .delete(protect, deleteArticle);

// Submit article for admin review
router
  .route("/:id/submit")
  .patch(protect, submitArticle);

module.exports = router;