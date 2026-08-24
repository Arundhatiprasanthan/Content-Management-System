const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  submitArticle
} = require('../controllers/articleController');

// Dynamically integrate real auth middleware when available from Auth & User Management module
let protect = (req, res, next) => next();

try {
  const authMiddleware = require('../middleware/authMiddleware');
  if (authMiddleware.protect) {
    protect = authMiddleware.protect;
  } else if (typeof authMiddleware === 'function') {
    protect = authMiddleware;
  }
} catch (err) {
  // Real auth middleware not yet merged; routes consume req.user when provided
}

router.route('/')
  .get(protect, getArticles)
  .post(protect, createArticle);

router.route('/:id')
  .get(protect, getArticleById)
  .put(protect, updateArticle)
  .delete(protect, deleteArticle);

router.route('/:id/submit')
  .patch(protect, submitArticle);

module.exports = router;
