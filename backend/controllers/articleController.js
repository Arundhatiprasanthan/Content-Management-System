const Article = require('../models/Article');
const { calculateReadingTime, buildArticleQuery } = require('../services/articleService');

/**
 * @desc    Get all articles with search, filtering, and pagination
 * @route   GET /api/articles
 * @access  Public / Auth
 */
const getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const queryParams = { ...req.query };

    // Default to 'Published' status for public requests if status is not explicitly set
    if (!queryParams.status && (!req.user || req.user.role === 'Reader')) {
      queryParams.status = 'Published';
    }

    const filter = buildArticleQuery(queryParams);

    const total = await Article.countDocuments(filter);
    const articles = await Article.find(filter)
      .populate('authorId', 'name email profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      data: articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve articles',
      error: error.message
    });
  }
};

/**
 * @desc    Get single article by ID
 * @route   GET /api/articles/:id
 * @access  Public / Auth
 */
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('authorId', 'name email profileImage');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Access control: Non-published articles can only be viewed by the author or admin
    if (article.status !== 'Published') {
      const currentUserId = req.user ? (req.user.id || req.user._id)?.toString() : null;
      const authorId = article.authorId._id ? article.authorId._id.toString() : article.authorId.toString();
      const isAdmin = req.user && req.user.role === 'Admin';

      if (!currentUserId || (currentUserId !== authorId && !isAdmin)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You are not authorized to view this article.'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error retrieving article',
      error: error.message
    });
  }
};

/**
 * @desc    Create a new article draft
 * @route   POST /api/articles
 * @access  Private (Author)
 */
const createArticle = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { title, description, content, coverImage, category, tags } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and content for the article'
      });
    }

    const readingTime = calculateReadingTime(content);
    const authorId = req.user.id || req.user._id;

    const article = await Article.create({
      title,
      description,
      content,
      coverImage: coverImage || '',
      authorId,
      category: category || 'Other',
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []),
      status: 'Draft',
      readingTime
    });

    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create article',
      error: error.message
    });
  }
};

/**
 * @desc    Update article (Draft or Changes Requested)
 * @route   PUT /api/articles/:id
 * @access  Private (Author)
 */
const updateArticle = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    let article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Ownership check
    const currentUserId = (req.user.id || req.user._id).toString();
    if (article.authorId.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this article'
      });
    }

    // Status check: Only allow updates if status is 'Draft' or 'Changes Requested'
    if (!['Draft', 'Changes Requested'].includes(article.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot edit article with status '${article.status}'. Updates are only allowed for 'Draft' or 'Changes Requested' articles.`
      });
    }

    const { title, description, content, coverImage, category, tags } = req.body;

    if (title) article.title = title;
    if (description) article.description = description;
    if (coverImage !== undefined) article.coverImage = coverImage;
    if (category) article.category = category;
    if (tags !== undefined) {
      article.tags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []);
    }

    if (content) {
      article.content = content;
      article.readingTime = calculateReadingTime(content);
    }

    await article.save();

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update article',
      error: error.message
    });
  }
};

/**
 * @desc    Delete article (Draft status only)
 * @route   DELETE /api/articles/:id
 * @access  Private (Author)
 */
const deleteArticle = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Ownership check
    const currentUserId = (req.user.id || req.user._id).toString();
    if (article.authorId.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this article'
      });
    }

    // Status check: Only allow deletion if status is 'Draft'
    if (article.status !== 'Draft') {
      return res.status(400).json({
        success: false,
        message: `Cannot delete article with status '${article.status}'. Only 'Draft' articles can be deleted.`
      });
    }

    await article.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to delete article',
      error: error.message
    });
  }
};

/**
 * @desc    Submit article for admin review
 * @route   PATCH /api/articles/:id/submit
 * @access  Private (Author)
 */
const submitArticle = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Ownership check
    const currentUserId = (req.user.id || req.user._id).toString();
    if (article.authorId.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this article'
      });
    }

    // Status check: Allowed only from 'Draft' or 'Changes Requested'
    if (!['Draft', 'Changes Requested'].includes(article.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot submit article with status '${article.status}'. Submissions are allowed only from 'Draft' or 'Changes Requested' status.`
      });
    }

    article.status = 'Pending Review';
    article.submittedAt = new Date();

    await article.save();

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to submit article for review',
      error: error.message
    });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  submitArticle
};
