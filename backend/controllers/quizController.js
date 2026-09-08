const quizService = require('../services/quizService');

/**
 * @desc    Get all approved quizzes
 * @route   GET /api/quizzes
 * @access  Public / Authenticated Readers
 */
const getApprovedQuizzes = async (req, res) => {
  try {
    const user = req.user;
    const quizzes = await quizService.getApprovedQuizzes(user);

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    console.error('getApprovedQuizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve approved quizzes',
      error: error.message
    });
  }
};

/**
 * @desc    Create or update a quiz for an article
 * @route   POST /api/quizzes
 * @access  Private (Author, Admin)
 */
const createQuiz = async (req, res) => {
  try {
    const { articleId, title, description, questions, status } = req.body;
    const user = req.user;

    const quiz = await quizService.createQuiz(
      { articleId, title, description, questions, status },
      user
    );

    res.status(201).json({
      success: true,
      message: 'Quiz created/updated successfully',
      data: quiz
    });
  } catch (error) {
    console.error('createQuiz error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create quiz'
    });
  }
};

/**
 * @desc    Get quiz associated with an article
 * @route   GET /api/quizzes/article/:articleId
 * @access  Public / Authenticated
 */
const getQuizByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const user = req.user;

    const quiz = await quizService.getQuizByArticle(articleId, user);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'No quiz found for this article'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('getQuizByArticle error:', error);
    res.status(error.message.includes('not approved') ? 403 : 500).json({
      success: false,
      message: error.message || 'Failed to retrieve quiz'
    });
  }
};

/**
 * @desc    Get quiz by ID
 * @route   GET /api/quizzes/:id
 * @access  Public / Authenticated
 */
const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const quiz = await quizService.getQuizById(id, user);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('getQuizById error:', error);
    res.status(error.message.includes('not approved') ? 403 : 500).json({
      success: false,
      message: error.message || 'Failed to retrieve quiz'
    });
  }
};

/**
 * @desc    Update quiz
 * @route   PUT /api/quizzes/:id
 * @access  Private (Author, Admin)
 */
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const updateData = req.body;

    const quiz = await quizService.updateQuiz(id, updateData, user);

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    console.error('updateQuiz error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update quiz'
    });
  }
};

/**
 * @desc    Delete quiz
 * @route   DELETE /api/quizzes/:id
 * @access  Private (Author, Admin)
 */
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const result = await quizService.deleteQuiz(id, user);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('deleteQuiz error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete quiz'
    });
  }
};

/**
 * @desc    Create / initialize an in-progress quiz attempt
 * @route   POST /api/quizzes/:id/attempts
 * @access  Public / Private (Readers, Users)
 */
const createQuizAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // If request contains answers directly, submit attempt directly
    if (req.body && Array.isArray(req.body.answers)) {
      const result = await quizService.submitAttempt(id, req.body.answers, user, req.body.attemptId);
      return res.status(200).json({
        success: true,
        message: 'Quiz submitted successfully',
        data: result
      });
    }

    const session = await quizService.createAttempt(id, user);

    res.status(201).json({
      success: true,
      message: 'Quiz attempt started successfully',
      data: session
    });
  } catch (error) {
    console.error('createQuizAttempt error:', error);
    res.status(error.message.includes('unapproved') ? 403 : 400).json({
      success: false,
      message: error.message || 'Failed to initialize quiz attempt'
    });
  }
};

/**
 * @desc    Submit a quiz attempt and calculate score
 * @route   POST /api/quizzes/:id/attempt
 * @access  Public / Private (Readers, Users)
 */
const submitQuizAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, attemptId } = req.body;
    const user = req.user;

    const result = await quizService.submitAttempt(id, answers, user, attemptId);

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: result
    });
  } catch (error) {
    console.error('submitQuizAttempt error:', error);
    res.status(error.message.includes('unapproved') ? 403 : 400).json({
      success: false,
      message: error.message || 'Failed to process quiz submission'
    });
  }
};

/**
 * @desc    Get single quiz attempt details
 * @route   GET /api/quizzes/attempts/:attemptId
 * @access  Private / Public
 */
const getAttemptById = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const user = req.user;

    const attempt = await quizService.getAttemptById(attemptId, user);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found'
      });
    }

    res.status(200).json({
      success: true,
      data: attempt
    });
  } catch (error) {
    console.error('getAttemptById error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve attempt details',
      error: error.message
    });
  }
};

/**
 * @desc    Get user's previous results for a quiz
 * @route   GET /api/quizzes/:id/results
 * @access  Private / Public
 */
const getQuizResults = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user._id : null;

    const results = await quizService.getQuizResults(id, userId);

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('getQuizResults error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve quiz results',
      error: error.message
    });
  }
};

/**
 * @desc    Get all quiz attempts for logged-in user
 * @route   GET /api/quizzes/user/attempts
 * @access  Private / Public
 */
const getMyAttempts = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const attempts = await quizService.getUserAttempts(userId);

    res.status(200).json({
      success: true,
      data: attempts
    });
  } catch (error) {
    console.error('getMyAttempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve attempts',
      error: error.message
    });
  }
};

module.exports = {
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
  getMyAttempts
};
