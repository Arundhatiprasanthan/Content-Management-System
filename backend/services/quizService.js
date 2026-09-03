const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Article = require('../models/Article');
const { createNotification } = require('./notificationService');

/**
 * Validate questions structure
 */
const validateQuestions = (questions) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('Quiz must contain at least one question');
  }

  questions.forEach((q, idx) => {
    if (!q.question || typeof q.question !== 'string' || !q.question.trim()) {
      throw new Error(`Question ${idx + 1} text cannot be empty`);
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new Error(`Question ${idx + 1} must have at least 2 options`);
    }
    q.options.forEach((opt, optIdx) => {
      if (typeof opt !== 'string' || !opt.trim()) {
        throw new Error(`Option ${optIdx + 1} in question ${idx + 1} cannot be empty`);
      }
    });
    if (
      typeof q.correctAnswer !== 'number' ||
      q.correctAnswer < 0 ||
      q.correctAnswer >= q.options.length
    ) {
      throw new Error(
        `Question ${idx + 1} has an invalid correct answer index (must be between 0 and ${q.options.length - 1})`
      );
    }
  });
};

/**
 * Format quiz response based on viewer role
 * Hides correct answers from readers/unauthenticated users to prevent cheating
 */
const sanitizeQuizForViewer = (quiz, user) => {
  if (!quiz) return null;

  const quizObj = quiz.toObject ? quiz.toObject() : { ...quiz };
  const userRole = (user && user.role) ? user.role.toLowerCase() : 'reader';
  const isAuthor = user && quiz.authorId && quiz.authorId.toString() === user._id.toString();
  const isAdmin = userRole === 'admin';

  if (!isAuthor && !isAdmin) {
    quizObj.questions = quizObj.questions.map((q) => {
      const sanitized = {
        _id: q._id,
        question: q.question,
        options: q.options
      };
      return sanitized;
    });
  }

  return quizObj;
};

/**
 * Create or replace Quiz for an Article
 */
const createQuiz = async (quizData, user) => {
  const { articleId, title, description, questions, status } = quizData;

  if (!articleId) {
    throw new Error('articleId is required');
  }

  validateQuestions(questions);

  // Check if article exists
  const article = await Article.findById(articleId);
  if (!article) {
    throw new Error('Associated article not found');
  }

  // Check existing quiz for article
  let quiz = await Quiz.findOne({ articleId });

  if (quiz) {
    // Check permission to update
    const isOwner = quiz.authorId.toString() === user._id.toString();
    const isAdmin = (user.role || '').toLowerCase() === 'admin';
    if (!isOwner && !isAdmin) {
      throw new Error('Not authorized to update the quiz for this article');
    }

    quiz.title = title || quiz.title;
    quiz.description = description !== undefined ? description : quiz.description;
    quiz.questions = questions;
    quiz.status = status || quiz.status;
    await quiz.save();
  } else {
    quiz = await Quiz.create({
      articleId,
      authorId: user._id,
      title: title || `${article.title} Quiz`,
      description: description || '',
      questions,
     status: status || 'Pending Review'
    });
  }

  // Trigger in-app notification to author
  try {
    await createNotification({
      userId: user._id,
      type: 'quiz_created',
      title: 'Quiz Created Successfully',
      message: `Your quiz for "${article.title}" has been saved with ${questions.length} questions.`,
      link: `/articles/${articleId}`
    });
  } catch (err) {
    console.warn('Could not dispatch quiz creation notification:', err.message);
  }

  return quiz;
};

/**
 * Get Quiz by Article ID
 */
const getQuizByArticle = async (articleId, user) => {
  const quiz = await Quiz.findOne({ articleId, status: { $ne: 'Archived' } });
  if (!quiz) return null;
  return sanitizeQuizForViewer(quiz, user);
};

/**
 * Get Quiz by ID
 */
const getQuizById = async (quizId, user) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) return null;
  return sanitizeQuizForViewer(quiz, user);
};

/**
 * Update Quiz
 */
const updateQuiz = async (quizId, updateData, user) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new Error('Quiz not found');
  }

  const isOwner = quiz.authorId.toString() === user._id.toString();
  const isAdmin = (user.role || '').toLowerCase() === 'admin';
  if (!isOwner && !isAdmin) {
    throw new Error('Not authorized to update this quiz');
  }

  if (updateData.questions) {
    validateQuestions(updateData.questions);
    quiz.questions = updateData.questions;
  }

  if (updateData.title) quiz.title = updateData.title;
  if (updateData.description !== undefined) quiz.description = updateData.description;
  if (updateData.status) quiz.status = updateData.status;

  await quiz.save();
  return quiz;
};

/**
 * Delete Quiz
 */
const deleteQuiz = async (quizId, user) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new Error('Quiz not found');
  }

  const isOwner = quiz.authorId.toString() === user._id.toString();
  const isAdmin = (user.role || '').toLowerCase() === 'admin';
  if (!isOwner && !isAdmin) {
    throw new Error('Not authorized to delete this quiz');
  }

  await Quiz.findByIdAndDelete(quizId);
  return { message: 'Quiz deleted successfully' };
};

/**
 * Submit Quiz Attempt & Calculate Score
 */
const submitAttempt = async (quizId, answers, user) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new Error('Quiz not found');
  }

  if (!Array.isArray(answers)) {
    throw new Error('Answers must be provided as an array');
  }

  const total = quiz.questions.length;
  let correctCount = 0;

  const evaluatedQuestions = quiz.questions.map((question, index) => {
    const selectedOption = answers[index] !== undefined && answers[index] !== null ? answers[index] : null;
    const isCorrect = selectedOption === question.correctAnswer;

    if (isCorrect) {
      correctCount += 1;
    }

    return {
      questionIndex: index,
      question: question.question,
      options: question.options,
      selectedOption,
      correctAnswer: question.correctAnswer,
      isCorrect,
      explanation: question.explanation || ''
    };
  });

  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // Save QuizAttempt in DB
  const attempt = await QuizAttempt.create({
    quizId: quiz._id,
    articleId: quiz.articleId,
    userId: user ? user._id : null,
    answers: evaluatedQuestions.map((q) => ({
      questionIndex: q.questionIndex,
      question: q.question,
      selectedOption: q.selectedOption,
      isCorrect: q.isCorrect,
      explanation: q.explanation
    })),
    score: correctCount,
    total,
    percentage
  });

  // Notify quiz author that a reader attempted their quiz (if reader is distinct)
  if (user && quiz.authorId && quiz.authorId.toString() !== user._id.toString()) {
    try {
      await createNotification({
        userId: quiz.authorId,
        type: 'quiz_attempted',
        title: 'New Quiz Attempt',
        message: `${user.name || 'A reader'} attempted your quiz "${quiz.title}" and scored ${correctCount}/${total} (${percentage}%).`,
        link: `/articles/${quiz.articleId}`
      });
    } catch (err) {
      console.warn('Could not dispatch attempt notification to author:', err.message);
    }
  }

  // Return frontend-friendly result structure (matches QuizResult.jsx)
  return {
    attemptId: attempt._id,
    quizId: quiz._id,
    articleId: quiz.articleId,
    score: correctCount,
    total,
    percentage,
    questions: evaluatedQuestions.map((eq) => ({
      question: eq.question,
      correct: eq.isCorrect,
      selectedOption: eq.selectedOption,
      correctAnswer: eq.correctAnswer,
      explanation: eq.explanation
    }))
  };
};

/**
 * Get Quiz Results History for a Quiz / User
 */
const getQuizResults = async (quizId, userId) => {
  const attempts = await QuizAttempt.find({ quizId, userId })
    .sort({ createdAt: -1 })
    .limit(10);
  return attempts;
};

/**
 * Get all attempts for a user
 */
const getUserAttempts = async (userId) => {
  const attempts = await QuizAttempt.find({ userId })
    .populate('quizId', 'title')
    .populate('articleId', 'title category coverImage')
    .sort({ createdAt: -1 });
  return attempts;
};

module.exports = {
  createQuiz,
  getQuizByArticle,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitAttempt,
  getQuizResults,
  getUserAttempts,
  validateQuestions
};
