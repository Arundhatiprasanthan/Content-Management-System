const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Article = require('../models/Article');
const notificationService = require('../services/notificationService');

// Seeded in-memory store for standalone evaluation when MongoDB is offline
let memoryComments = [
  {
    _id: '66cc00000000000000000101',
    articleId: '1',
    userId: {
      _id: '66cc00000000000000000002',
      name: 'Syed Zaid (Author)',
      email: 'author@lumen.test',
      role: 'Author',
      profileImage: ''
    },
    parentCommentId: null,
    content: 'Welcome to the discussion! Feel free to ask questions about CRISPR, molecular biology, or ethical implications.',
    likes: ['66cc00000000000000000003'],
    isEdited: false,
    editedAt: null,
    isDeleted: false,
    reports: [],
    reportCount: 0,
    status: 'Active',
    createdAt: new Date(Date.now() - 3600 * 1000 * 5),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 5)
  },
  {
    _id: '66cc00000000000000000102',
    articleId: '1',
    userId: {
      _id: '66cc00000000000000000003',
      name: 'Lena Kaufmann',
      email: 'reader@lumen.test',
      role: 'Reader',
      profileImage: ''
    },
    parentCommentId: '66cc00000000000000000101',
    content: 'Thank you for the thorough breakdown! The section on real-world clinical applications was especially eye-opening.',
    likes: [],
    isEdited: false,
    editedAt: null,
    isDeleted: false,
    reports: [],
    reportCount: 0,
    status: 'Active',
    createdAt: new Date(Date.now() - 3600 * 1000 * 2),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 2)
  }
];

const isDbConnected = () => Boolean(mongoose.connection && mongoose.connection.readyState === 1);

/**
 * Helper to build a recursive/threaded tree of comments
 */
const buildCommentTree = (comments, currentUserId = null, userRole = null) => {
  const commentMap = new Map();
  const roots = [];

  comments.forEach((comment) => {
    const commentObj = comment.toObject ? comment.toObject() : { ...comment };
    const likesArray = commentObj.likes || [];
    const likesCount = likesArray.length;
    const isLiked = currentUserId
      ? likesArray.some((id) => id.toString() === currentUserId.toString())
      : false;

    const authorId = commentObj.userId?._id
      ? commentObj.userId._id.toString()
      : commentObj.userId?.toString();

    const canEdit = !commentObj.isDeleted && Boolean(currentUserId && authorId === currentUserId.toString());
    const canDelete = Boolean(
      currentUserId && (authorId === currentUserId.toString() || userRole === 'Admin')
    );

    const formattedComment = {
      ...commentObj,
      likesCount,
      isLiked,
      canEdit,
      canDelete,
      replies: []
    };

    commentMap.set(commentObj._id.toString(), formattedComment);
  });

  commentMap.forEach((comment) => {
    if (comment.parentCommentId) {
      const parent = commentMap.get(comment.parentCommentId.toString());
      if (parent) {
        parent.replies.push(comment);
      } else {
        roots.push(comment);
      }
    } else {
      roots.push(comment);
    }
  });

  return roots;
};

/**
 * @desc    Get comments for an article (hierarchical tree)
 * @route   GET /api/articles/:articleId/comments
 * @access  Public / Optional Auth
 */
const getArticleComments = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { sort = 'newest' } = req.query;

    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: 'Article ID is required'
      });
    }

    const currentUserId = req.user ? (req.user.id || req.user._id) : null;
    const userRole = req.user ? req.user.role : null;

    let rawComments = [];

    if (isDbConnected()) {
      const query = { articleId: articleId.toString() };
      if (!req.user || req.user.role !== 'Admin') {
        query.status = { $ne: 'Hidden' };
      }
      rawComments = await Comment.find(query)
        .populate('userId', 'name email role profileImage bio')
        .sort({ createdAt: 1 });
    } else {
      // Memory store fallback
      rawComments = memoryComments.filter(
        (c) =>
          String(c.articleId) === String(articleId) &&
          (!req.user || req.user.role === 'Admin' || c.status !== 'Hidden')
      );
    }

    let commentTree = buildCommentTree(rawComments, currentUserId, userRole);

    if (sort === 'newest') {
      commentTree.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'oldest') {
      commentTree.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'most_liked') {
      commentTree.sort((a, b) => b.likesCount - a.likesCount);
    }

    const totalComments = rawComments.length;
    const topLevelCount = commentTree.length;

    res.status(200).json({
      success: true,
      articleId,
      totalComments,
      topLevelCount,
      data: commentTree
    });
  } catch (error) {
    console.error('getArticleComments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve comments',
      error: error.message
    });
  }
};

/**
 * @desc    Create a new top-level comment
 * @route   POST /api/articles/:articleId/comments
 * @access  Private
 */
const createComment = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { content, parentCommentId = null } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot be empty'
      });
    }

    if (content.trim().length > 3000) {
      return res.status(400).json({
        success: false,
        message: 'Comment content exceeds maximum limit of 3000 characters'
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to post a comment'
      });
    }

    let formattedComment;

    if (isDbConnected()) {
      const newComment = await Comment.create({
        articleId: articleId.toString(),
        userId: req.user._id,
        parentCommentId: parentCommentId || null,
        content: content.trim()
      });

      const populatedComment = await Comment.findById(newComment._id).populate(
        'userId',
        'name email role profileImage bio'
      );

      formattedComment = {
        ...populatedComment.toObject(),
        likesCount: 0,
        isLiked: false,
        canEdit: true,
        canDelete: true,
        replies: []
      };

      try {
        if (mongoose.Types.ObjectId.isValid(articleId)) {
          const article = await Article.findById(articleId);
          if (article && article.authorId && article.authorId.toString() !== req.user._id.toString()) {
            await notificationService.createNotification({
              userId: article.authorId,
              type: 'comment',
              title: 'New Comment on Your Article',
              message: `${req.user.name || 'A reader'} commented: "${content.slice(0, 60)}"`,
              link: `/article/${articleId}`
            });
          }
        }
      } catch (_) {}
    } else {
      // Memory store fallback
      const newMem = {
        _id: 'mem_' + Date.now(),
        articleId: String(articleId),
        userId: {
          _id: req.user._id,
          name: req.user.name || 'User',
          email: req.user.email || 'user@lumen.test',
          role: req.user.role || 'Reader',
          profileImage: ''
        },
        parentCommentId: parentCommentId || null,
        content: content.trim(),
        likes: [],
        likesCount: 0,
        isLiked: false,
        isEdited: false,
        editedAt: null,
        isDeleted: false,
        reports: [],
        reportCount: 0,
        status: 'Active',
        canEdit: true,
        canDelete: true,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryComments.unshift(newMem);
      formattedComment = newMem;
    }

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully',
      data: formattedComment
    });
  } catch (error) {
    console.error('createComment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to post comment',
      error: error.message
    });
  }
};

/**
 * @desc    Get a single comment by ID
 * @route   GET /api/comments/:id
 * @access  Public / Optional Auth
 */
const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user ? (req.user.id || req.user._id) : null;

    let commentObj = null;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid comment ID' });
      }
      const comment = await Comment.findById(id).populate('userId', 'name email role profileImage bio');
      if (comment) commentObj = comment.toObject();
    } else {
      commentObj = memoryComments.find((c) => String(c._id) === String(id));
    }

    if (!commentObj) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const authorId = commentObj.userId?._id ? commentObj.userId._id.toString() : commentObj.userId?.toString();
    const formattedComment = {
      ...commentObj,
      likesCount: commentObj.likes ? commentObj.likes.length : 0,
      isLiked: currentUserId ? (commentObj.likes || []).some((uId) => uId.toString() === currentUserId.toString()) : false,
      canEdit: !commentObj.isDeleted && Boolean(currentUserId && authorId === currentUserId.toString()),
      canDelete: Boolean(currentUserId && (authorId === currentUserId.toString() || req.user?.role === 'Admin'))
    };

    res.status(200).json({ success: true, data: formattedComment });
  } catch (error) {
    console.error('getCommentById error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve comment', error: error.message });
  }
};

/**
 * @desc    Reply to an existing comment
 * @route   POST /api/comments/:commentId/replies
 * @access  Private
 */
const createReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Reply content cannot be empty' });
    }

    if (content.trim().length > 3000) {
      return res.status(400).json({ success: false, message: 'Reply content exceeds 3000 characters' });
    }

    let formattedReply = null;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ success: false, message: 'Invalid parent comment ID' });
      }

      const parentComment = await Comment.findById(commentId);
      if (!parentComment) {
        return res.status(404).json({ success: false, message: 'Parent comment not found' });
      }

      const reply = await Comment.create({
        articleId: parentComment.articleId,
        userId: req.user._id,
        parentCommentId: parentComment._id,
        content: content.trim()
      });

      const populatedReply = await Comment.findById(reply._id).populate(
        'userId',
        'name email role profileImage bio'
      );

      formattedReply = {
        ...populatedReply.toObject(),
        likesCount: 0,
        isLiked: false,
        canEdit: true,
        canDelete: true,
        replies: []
      };

      try {
        const parentAuthorId = parentComment.userId ? parentComment.userId.toString() : null;
        if (parentAuthorId && parentAuthorId !== req.user._id.toString()) {
          await notificationService.createNotification({
            userId: parentComment.userId,
            type: 'comment',
            title: 'New Reply to Your Comment',
            message: `${req.user.name || 'Someone'} replied: "${content.slice(0, 60)}"`,
            link: `/article/${parentComment.articleId}`
          });
        }
      } catch (_) {}
    } else {
      // Memory store fallback
      const parentComment = memoryComments.find((c) => String(c._id) === String(commentId));
      if (!parentComment) {
        return res.status(404).json({ success: false, message: 'Parent comment not found' });
      }

      const newReplyMem = {
        _id: 'mem_reply_' + Date.now(),
        articleId: parentComment.articleId,
        userId: {
          _id: req.user._id,
          name: req.user.name || 'User',
          email: req.user.email || 'user@lumen.test',
          role: req.user.role || 'Reader',
          profileImage: ''
        },
        parentCommentId: parentComment._id,
        content: content.trim(),
        likes: [],
        likesCount: 0,
        isLiked: false,
        isEdited: false,
        editedAt: null,
        isDeleted: false,
        reports: [],
        reportCount: 0,
        status: 'Active',
        canEdit: true,
        canDelete: true,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryComments.push(newReplyMem);
      formattedReply = newReplyMem;
    }

    res.status(201).json({
      success: true,
      message: 'Reply posted successfully',
      data: formattedReply
    });
  } catch (error) {
    console.error('createReply error:', error);
    res.status(500).json({ success: false, message: 'Failed to post reply', error: error.message });
  }
};

/**
 * @desc    Get replies for a specific comment
 * @route   GET /api/comments/:commentId/replies
 * @access  Public / Optional Auth
 */
const getCommentReplies = async (req, res) => {
  try {
    const { commentId } = req.params;
    const currentUserId = req.user ? (req.user.id || req.user._id) : null;
    const userRole = req.user ? req.user.role : null;

    let replies = [];

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ success: false, message: 'Invalid comment ID' });
      }
      const dbReplies = await Comment.find({ parentCommentId: commentId, status: { $ne: 'Hidden' } })
        .populate('userId', 'name email role profileImage bio')
        .sort({ createdAt: 1 });
      replies = dbReplies.map((r) => r.toObject());
    } else {
      replies = memoryComments.filter(
        (c) => String(c.parentCommentId) === String(commentId) && c.status !== 'Hidden'
      );
    }

    const formattedReplies = replies.map((replyObj) => {
      const authorId = replyObj.userId?._id ? replyObj.userId._id.toString() : replyObj.userId?.toString();
      return {
        ...replyObj,
        likesCount: replyObj.likes ? replyObj.likes.length : 0,
        isLiked: currentUserId ? (replyObj.likes || []).some((id) => id.toString() === currentUserId.toString()) : false,
        canEdit: !replyObj.isDeleted && Boolean(currentUserId && authorId === currentUserId.toString()),
        canDelete: Boolean(currentUserId && (authorId === currentUserId.toString() || userRole === 'Admin'))
      };
    });

    res.status(200).json({ success: true, count: formattedReplies.length, data: formattedReplies });
  } catch (error) {
    console.error('getCommentReplies error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve replies', error: error.message });
  }
};

/**
 * @desc    Edit a comment (Ownership validation required)
 * @route   PUT /api/comments/:id
 * @access  Private
 */
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content cannot be empty' });
    }

    if (content.trim().length > 3000) {
      return res.status(400).json({ success: false, message: 'Comment content exceeds 3000 characters' });
    }

    const currentUserId = req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid comment ID' });
      }

      const comment = await Comment.findById(id);
      if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
      if (comment.isDeleted) return res.status(400).json({ success: false, message: 'Cannot edit a deleted comment' });

      if (comment.userId.toString() !== currentUserId && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Access denied. You can only edit your own comments.' });
      }

      comment.content = content.trim();
      comment.isEdited = true;
      comment.editedAt = new Date();
      await comment.save();

      const updated = await Comment.findById(id).populate('userId', 'name email role profileImage bio');
      return res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        data: {
          ...updated.toObject(),
          likesCount: updated.likes ? updated.likes.length : 0,
          isLiked: updated.likes ? updated.likes.some((uId) => uId.toString() === currentUserId) : false,
          canEdit: true,
          canDelete: true
        }
      });
    } else {
      // Memory store fallback
      const comment = memoryComments.find((c) => String(c._id) === String(id));
      if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
      if (comment.isDeleted) return res.status(400).json({ success: false, message: 'Cannot edit a deleted comment' });

      const authorId = comment.userId?._id ? comment.userId._id.toString() : comment.userId?.toString();
      if (authorId !== currentUserId && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Access denied. You can only edit your own comments.' });
      }

      comment.content = content.trim();
      comment.isEdited = true;
      comment.editedAt = new Date();

      return res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        data: {
          ...comment,
          likesCount: comment.likes ? comment.likes.length : 0,
          isLiked: comment.likes ? comment.likes.some((uId) => uId.toString() === currentUserId) : false,
          canEdit: true,
          canDelete: true
        }
      });
    }
  } catch (error) {
    console.error('updateComment error:', error);
    res.status(500).json({ success: false, message: 'Failed to update comment', error: error.message });
  }
};

/**
 * @desc    Delete a comment (Ownership validation required)
 *          Soft-deletes if comment has replies to preserve thread hierarchy
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid comment ID' });
      }

      const comment = await Comment.findById(id);
      if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

      if (comment.userId.toString() !== currentUserId && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Access denied. You can only delete your own comments.' });
      }

      const replyCount = await Comment.countDocuments({ parentCommentId: comment._id });

      if (replyCount > 0) {
        comment.isDeleted = true;
        comment.content = '[This comment has been deleted]';
        await comment.save();
        return res.status(200).json({
          success: true,
          message: 'Comment deleted (preserved for thread context)',
          isSoftDeleted: true,
          data: comment
        });
      }

      await Comment.findByIdAndDelete(comment._id);
      return res.status(200).json({ success: true, message: 'Comment deleted successfully', isSoftDeleted: false });
    } else {
      // Memory store fallback
      const commentIndex = memoryComments.findIndex((c) => String(c._id) === String(id));
      if (commentIndex === -1) return res.status(404).json({ success: false, message: 'Comment not found' });

      const comment = memoryComments[commentIndex];
      const authorId = comment.userId?._id ? comment.userId._id.toString() : comment.userId?.toString();

      if (authorId !== currentUserId && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Access denied. You can only delete your own comments.' });
      }

      const hasReplies = memoryComments.some((c) => String(c.parentCommentId) === String(id));
      if (hasReplies) {
        comment.isDeleted = true;
        comment.content = '[This comment has been deleted]';
        return res.status(200).json({
          success: true,
          message: 'Comment deleted (preserved for thread context)',
          isSoftDeleted: true,
          data: comment
        });
      }

      memoryComments.splice(commentIndex, 1);
      return res.status(200).json({ success: true, message: 'Comment deleted successfully', isSoftDeleted: false });
    }
  } catch (error) {
    console.error('deleteComment error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete comment', error: error.message });
  }
};

/**
 * @desc    Toggle like/upvote on a comment
 * @route   POST /api/comments/:commentId/like
 * @access  Private
 */
const toggleLikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const currentUserId = req.user._id.toString();

    let likesArray = [];
    let isLiked = false;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ success: false, message: 'Invalid comment ID' });
      }

      const comment = await Comment.findById(commentId);
      if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

      const alreadyLikedIndex = comment.likes.findIndex((id) => id.toString() === currentUserId);
      if (alreadyLikedIndex > -1) {
        comment.likes.splice(alreadyLikedIndex, 1);
        isLiked = false;
      } else {
        comment.likes.push(req.user._id);
        isLiked = true;
      }
      await comment.save();
      likesArray = comment.likes;
    } else {
      // Memory store fallback
      const comment = memoryComments.find((c) => String(c._id) === String(commentId));
      if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

      if (!comment.likes) comment.likes = [];
      const alreadyIndex = comment.likes.findIndex((id) => id.toString() === currentUserId);
      if (alreadyIndex > -1) {
        comment.likes.splice(alreadyIndex, 1);
        isLiked = false;
      } else {
        comment.likes.push(currentUserId);
        isLiked = true;
      }
      likesArray = comment.likes;
    }

    res.status(200).json({
      success: true,
      message: isLiked ? 'Comment liked' : 'Like removed',
      likesCount: likesArray.length,
      isLiked
    });
  } catch (error) {
    console.error('toggleLikeComment error:', error);
    res.status(500).json({ success: false, message: 'Failed to update like status', error: error.message });
  }
};

/**
 * @desc    Report a comment for moderation review
 * @route   POST /api/comments/:commentId/report
 * @access  Private
 */
const reportComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reason, details } = req.body;
    const validReasons = ['Spam', 'Harassment', 'Inappropriate Content', 'Misinformation', 'Other'];

    if (!reason || !validReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: `Invalid reason. Must be one of: ${validReasons.join(', ')}`
      });
    }

    const currentUserId = req.user._id.toString();
    let reportCount = 0;
    let status = 'Active';

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ success: false, message: 'Invalid comment ID' });
      }

      const comment = await Comment.findById(commentId);
      if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

      const alreadyReported = comment.reports.some(
        (r) => r.reportedBy && r.reportedBy.toString() === currentUserId
      );
      if (alreadyReported) {
        return res.status(400).json({ success: false, message: 'You have already reported this comment' });
      }

      comment.reports.push({
        reportedBy: req.user._id,
        reason,
        details: details ? details.trim() : '',
        reportedAt: new Date()
      });
      comment.reportCount = (comment.reportCount || 0) + 1;
      if (comment.reportCount >= 3 && comment.status === 'Active') {
        comment.status = 'Flagged';
      }
      await comment.save();

      reportCount = comment.reportCount;
      status = comment.status;
    } else {
      // Memory store fallback
      const comment = memoryComments.find((c) => String(c._id) === String(commentId));
      if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

      if (!comment.reports) comment.reports = [];
      const already = comment.reports.some(
        (r) => r.reportedBy && r.reportedBy.toString() === currentUserId
      );
      if (already) {
        return res.status(400).json({ success: false, message: 'You have already reported this comment' });
      }

      comment.reports.push({
        reportedBy: currentUserId,
        reason,
        details: details ? details.trim() : '',
        reportedAt: new Date()
      });
      comment.reportCount = (comment.reportCount || 0) + 1;
      if (comment.reportCount >= 3 && comment.status === 'Active') {
        comment.status = 'Flagged';
      }
      reportCount = comment.reportCount;
      status = comment.status;
    }

    res.status(200).json({
      success: true,
      message: 'Comment has been reported for moderation review',
      reportCount,
      status
    });
  } catch (error) {
    console.error('reportComment error:', error);
    res.status(500).json({ success: false, message: 'Failed to report comment', error: error.message });
  }
};

/**
 * @desc    Get flagged/reported comments (Admin moderation queue)
 * @route   GET /api/comments/reported
 * @access  Private (Admin)
 */
const getReportedComments = async (req, res) => {
  try {
    if (isDbConnected()) {
      const comments = await Comment.find({
        $or: [{ reportCount: { $gt: 0 } }, { status: { $in: ['Flagged', 'Hidden'] } }]
      })
        .populate('userId', 'name email role profileImage bio')
        .populate('reports.reportedBy', 'name email role')
        .sort({ reportCount: -1, updatedAt: -1 });

      return res.status(200).json({ success: true, count: comments.length, data: comments });
    } else {
      const reported = memoryComments.filter(
        (c) => (c.reportCount && c.reportCount > 0) || c.status === 'Flagged' || c.status === 'Hidden'
      );
      return res.status(200).json({ success: true, count: reported.length, data: reported });
    }
  } catch (error) {
    console.error('getReportedComments error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve reported comments', error: error.message });
  }
};

module.exports = {
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
};
