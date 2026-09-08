const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getArticleComments,
  createComment,
  getCommentById,
  createReply,
  getCommentReplies,
  updateComment,
  deleteComment,
  toggleLikeComment,
  reportComment,
  getReportedComments
} = require('../controllers/commentController');
const { protect, optionalAuth, authorize } = require('../middleware/authMiddleware');

// Admin moderation endpoint (must precede /:id)
router.get('/reported', protect, authorize('Admin'), getReportedComments);

// Article-scoped endpoints (when mounted under /api/articles/:articleId/comments)
router
  .route('/')
  .get(optionalAuth, getArticleComments)
  .post(protect, createComment);

// Reply endpoints
router
  .route('/:commentId/replies')
  .get(optionalAuth, getCommentReplies)
  .post(protect, createReply);

// Interaction endpoints
router.post('/:commentId/like', protect, toggleLikeComment);
router.post('/:commentId/report', protect, reportComment);

// Single comment CRUD endpoints
router
  .route('/:id')
  .get(optionalAuth, getCommentById)
  .put(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
