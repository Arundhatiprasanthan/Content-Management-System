const quizService = require('../services/quizService');

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
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve quiz',
      error: error.message
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
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve quiz',
      error: error.message
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
 * @desc    Submit a quiz attempt and calculate score
 * @route   POST /api/quizzes/:id/attempt
 * @access  Public / Private (Readers, Users)
 */
const submitQuizAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const user = req.user;

    const result = await quizService.submitAttempt(id, answers, user);

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: result
    });
  } catch (error) {
    console.error('submitQuizAttempt error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to process quiz submission'
    });
  }
};

/**
 * @desc    Get user's previous results for a quiz
 * @route   GET /api/quizzes/:id/results
 * @access  Private
 */
const getQuizResults = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user._id : null;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to view results history'
      });
    }

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
 * @access  Private
 */
const getMyAttempts = async (req, res) => {
  try {
    const userId = req.user._id;
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
  createQuiz,
  getQuizByArticle,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitQuizAttempt,
  getQuizResults,
  getMyAttempts
};
