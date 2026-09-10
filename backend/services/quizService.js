const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Article = require('../models/Article');
const User = require('../models/User');
const { createNotification } = require('./notificationService');
<<<<<<< Updated upstream
=======

/* =========================================================================
   IN-MEMORY STORE FALLBACK (Active when MongoDB is not connected)
   ========================================================================= */
const memoryStore = {
  users: [
    {
      _id: '66cc00000000000000000001',
      name: 'Lena Kaufmann',
      email: 'reader@lumen.test',
      role: 'Reader'
    },
    {
      _id: '66cc00000000000000000002',
      name: 'Priya Mehta',
      email: 'author@lumen.test',
      role: 'Author'
    },
    {
      _id: '66cc00000000000000000003',
      name: 'Thomas Okeke',
      email: 'thomas@lumen.test',
      role: 'Author'
    }
  ],
  articles: [
    {
      _id: '66cc00000000000000000101',
      id: 1,
      title: 'How CRISPR Is Rewriting the Story of Human Disease',
      description: 'A quiet revolution in molecular biology has produced a tool precise enough to correct a single letter in DNA.',
      category: 'Science',
      coverImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=600&fit=crop&auto=format',
      authorId: '66cc00000000000000000002',
      status: 'Published'
    },
    {
      _id: '66cc00000000000000000102',
      id: 2,
      title: 'The Night the Internet Was Born — and Almost Wasn’t',
      description: 'On October 29, 1969, a student typed two letters into a terminal at UCLA. The system crashed. The internet had arrived.',
      category: 'Technology',
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop&auto=format',
      authorId: '66cc00000000000000000003',
      status: 'Published'
    },
    {
      _id: '66cc00000000000000000103',
      id: 3,
      title: 'The Rise of Quantum Computing & Next-Gen Algorithms',
      description: 'How quantum supercomputers are rewriting cryptography, optimization, and molecular simulations.',
      category: 'Technology',
      coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=600&fit=crop&auto=format',
      authorId: '66cc00000000000000000002',
      status: 'Published'
    }
  ],
  quizzes: [
    {
      _id: '66cc00000000000000000201',
      articleId: '66cc00000000000000000101',
      authorId: '66cc00000000000000000002',
      title: 'CRISPR & Molecular Medicine Quiz',
      description: 'Test your understanding of gene editing, Cas9 mechanisms, and clinical breakthroughs.',
      status: 'Published',
      questions: [
        {
          _id: 'q201_1',
          question: 'What is the primary biological function of CRISPR in bacteria in nature?',
          options: [
            'Bacterial immune defense against viral DNA',
            'Energy production via cellular respiration',
            'Repairing cellular membrane walls',
            'Nutrient absorption from the environment'
          ],
          correctAnswer: 0,
          explanation: 'In nature, CRISPR serves as an adaptive immune system that allows bacteria to recognize and destroy invading viral DNA.'
        },
        {
          _id: 'q201_2',
          question: 'Which component directs the Cas9 enzyme to the precise target sequence in the genome?',
          options: [
            'Guide RNA (gRNA)',
            'Ribosomal RNA (rRNA)',
            'Transfer RNA (tRNA)',
            'Messenger RNA (mRNA)'
          ],
          correctAnswer: 0,
          explanation: 'Guide RNA (gRNA) matches the target DNA sequence and guides the Cas9 molecular scissors directly to the target location.'
        },
        {
          _id: 'q201_3',
          question: 'Which hereditary condition was the first FDA-approved CRISPR therapeutic target in late 2023?',
          options: [
            'Sickle cell disease',
            'Type 1 Diabetes',
            'Cystic Fibrosis',
            'Huntington’s disease'
          ],
          correctAnswer: 0,
          explanation: 'The FDA approved Casgevy in late 2023 as the first CRISPR-based therapy for sickle cell disease.'
        }
      ],
      createdAt: new Date('2026-08-01')
    },
    {
      _id: '66cc00000000000000000202',
      articleId: '66cc00000000000000000102',
      authorId: '66cc00000000000000000003',
      title: 'ARPANET & Early Internet Quiz',
      description: 'How well do you know early internet history, packet switching, and networking milestones?',
      status: 'Published',
      questions: [
        {
          _id: 'q202_1',
          question: 'ARPANET, the precursor to the internet, sent its first message in which year?',
          options: ['1965', '1969', '1973', '1979'],
          correctAnswer: 1,
          explanation: 'ARPANET sent its first message on October 29, 1969, between UCLA and the Stanford Research Institute.'
        },
        {
          _id: 'q202_2',
          question: 'What was the intended first word sent over ARPANET before the system crashed?',
          options: ['Hello', 'Login', 'Start', 'Connect'],
          correctAnswer: 1,
          explanation: 'The intended message was "LOGIN" — only "LO" was transmitted before the buffer crashed.'
        },
        {
          _id: 'q202_3',
          question: 'What does HTTP stand for?',
          options: [
            'HyperText Transfer Protocol',
            'HighText Transfer Protocol',
            'HyperText Transmission Program',
            'High Transfer Text Protocol'
          ],
          correctAnswer: 0,
          explanation: 'HTTP stands for HyperText Transfer Protocol, the protocol used for communication between web browsers and servers.'
        }
      ],
      createdAt: new Date('2026-08-02')
    },
    {
      _id: '66cc00000000000000000203',
      articleId: '66cc00000000000000000103',
      authorId: '66cc00000000000000000002',
      title: 'Quantum Computing Fundamentals',
      description: 'Explore superposition, quantum entanglement, and next-gen algorithm capabilities.',
      status: 'Published',
      questions: [
        {
          _id: 'q203_1',
          question: 'What fundamental quantum phenomenon allows qubits to exist in multiple states simultaneously?',
          options: ['Superposition', 'Refraction', 'Photosynthesis', 'Thermal Equilibrium'],
          correctAnswer: 0,
          explanation: 'Superposition allows a quantum system to be in a linear combination of states until measured.'
        },
        {
          _id: 'q203_2',
          question: 'What is quantum entanglement?',
          options: [
            'Particles moving at the speed of light',
            'A phenomenon where quantum states of two particles become interconnected regardless of distance',
            'Overheating of quantum processors',
            'Classical binary encryption'
          ],
          correctAnswer: 1,
          explanation: 'Quantum entanglement links particles such that the state of one instantly dictates the state of another.'
        }
      ],
      createdAt: new Date('2026-08-03')
    }
  ],
  attempts: [
    {
      _id: '66cc00000000000000000301',
      quizId: '66cc00000000000000000202',
      articleId: '66cc00000000000000000102',
      userId: '66cc00000000000000000001',
      score: 3,
      total: 3,
      percentage: 100,
      status: 'completed',
      answers: [
        { questionIndex: 0, question: 'ARPANET, the precursor to the internet, sent its first message in which year?', selectedOption: 1, isCorrect: true, explanation: 'ARPANET sent its first message on October 29, 1969.' },
        { questionIndex: 1, question: 'What was the intended first word sent over ARPANET before the system crashed?', selectedOption: 1, isCorrect: true, explanation: 'The intended message was "LOGIN".' },
        { questionIndex: 2, question: 'What does HTTP stand for?', selectedOption: 0, isCorrect: true, explanation: 'HTTP stands for HyperText Transfer Protocol.' }
      ],
      submittedAt: new Date(Date.now() - 3600000 * 24),
      createdAt: new Date(Date.now() - 3600000 * 24)
    }
  ]
};

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

>>>>>>> Stashed changes
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
 * Hides correct answers and explanations from readers to prevent cheating
 */
const sanitizeQuizForViewer = (quiz, user) => {
  if (!quiz) return null;

  const quizObj = quiz.toObject ? quiz.toObject() : JSON.parse(JSON.stringify(quiz));
  const userRole = (user && user.role) ? user.role.toLowerCase() : 'reader';
  const authorIdStr = quiz.authorId ? (quiz.authorId._id || quiz.authorId).toString() : '';
  const userIdStr = user && user._id ? user._id.toString() : '';
  const isAuthor = userIdStr && authorIdStr === userIdStr;
  const isAdmin = userRole === 'admin';

  if (!isAuthor && !isAdmin) {
    quizObj.questions = (quizObj.questions || []).map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options
    }));
  }

  return quizObj;
};

/**
 * Get all approved quizzes for readers / users
 */
const getApprovedQuizzes = async (user) => {
  if (isDbConnected()) {
    const quizzes = await Quiz.find({
      status: { $in: ['Published', 'Approved'] }
    })
      .populate('articleId', 'title description category coverImage status')
      .populate('authorId', 'name')
      .sort({ createdAt: -1 });

    // Filter out any quizzes whose attached article is not Published (unless author/admin)
    const filtered = quizzes.filter((q) => {
      if (!q.articleId) return true;
      const articleStatus = q.articleId.status || 'Published';
      if (articleStatus === 'Published') return true;
      const userRole = (user && user.role) ? user.role.toLowerCase() : 'reader';
      return userRole === 'admin' || (user && q.authorId && q.authorId._id.toString() === user._id.toString());
    });

    return filtered.map((q) => sanitizeQuizForViewer(q, user));
  }

  // Memory fallback
  const approved = memoryStore.quizzes
    .filter((q) => ['Published', 'Approved'].includes(q.status))
    .map((q) => {
      const article = memoryStore.articles.find(
        (a) => a._id === q.articleId || a.id?.toString() === q.articleId?.toString()
      );
      const author = memoryStore.users.find(
        (u) => u._id === q.authorId
      );
      const enriched = {
        ...q,
        articleId: article ? { _id: article._id, title: article.title, category: article.category, coverImage: article.coverImage, status: article.status } : null,
        authorId: author ? { _id: author._id, name: author.name } : null
      };
      return sanitizeQuizForViewer(enriched, user);
    });

  return approved;
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

  if (isDbConnected()) {
    const article = await Article.findById(articleId);
    if (!article) {
      throw new Error('Associated article not found');
    }

    let quiz = await Quiz.findOne({ articleId });

    if (quiz) {
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
        status: status || 'Published'
      });
    }

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
  }

  // Memory fallback
  let quiz = memoryStore.quizzes.find((q) => q.articleId.toString() === articleId.toString());
  if (quiz) {
    quiz.title = title || quiz.title;
    quiz.description = description !== undefined ? description : quiz.description;
    quiz.questions = questions;
    quiz.status = status || quiz.status;
  } else {
    quiz = {
      _id: new mongoose.Types.ObjectId().toString(),
      articleId,
      authorId: user._id,
      title: title || 'Article Quiz',
      description: description || '',
      questions,
<<<<<<< Updated upstream
     status: status || 'Pending Review'
    });
  }

  // Trigger in-app notification to author
// Notify Admins when a quiz is submitted for review
if (quiz.status === 'Pending Review') {
  try {
    const admins = await User.find({
      role: 'Admin'
    }).select('_id');

    await Promise.all(
      admins.map((admin) =>
        createNotification({
          userId: admin._id,
          type: 'quiz_submitted',
          title: 'New Quiz Submitted',
          message: `${user.name || 'An author'} submitted "${quiz.title}" for review.`,
          link: `/admin/review/quiz/${quiz._id}`
        })
      )
    );
  } catch (notificationError) {
    console.warn(
      'Could not dispatch quiz submission notification:',
      notificationError.message
    );
=======
      status: status || 'Published',
      createdAt: new Date()
    };
    memoryStore.quizzes.push(quiz);
>>>>>>> Stashed changes
  }
}

  return quiz;
};

/**
 * Get Quiz by Article ID with Approved quiz validation
 */
const getQuizByArticle = async (articleId, user) => {
  if (isDbConnected()) {
    const query = {
      articleId,
      status: { $ne: 'Archived' }
    };
    const quiz = await Quiz.findOne(query)
      .populate('articleId', 'title category coverImage status')
      .populate('authorId', 'name');

    if (!quiz) return null;

    // Check approved quiz validation for readers
    const userRole = (user && user.role) ? user.role.toLowerCase() : 'reader';
    const isOwner = user && quiz.authorId && quiz.authorId._id.toString() === user._id.toString();
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin && !['Published', 'Approved'].includes(quiz.status)) {
      throw new Error('This quiz is not approved or published yet');
    }

    return sanitizeQuizForViewer(quiz, user);
  }

  // Memory fallback
  const quiz = memoryStore.quizzes.find(
    (q) => (q.articleId.toString() === articleId.toString() ||
      q.articleId.toString() === '66cc0000000000000000010' + articleId) &&
      q.status !== 'Archived'
  );

  if (!quiz) return null;

  const article = memoryStore.articles.find(
    (a) => a._id === quiz.articleId || a.id?.toString() === articleId.toString()
  );
  const author = memoryStore.users.find((u) => u._id === quiz.authorId);

  const enriched = {
    ...quiz,
    articleId: article ? { _id: article._id, title: article.title, category: article.category, coverImage: article.coverImage } : null,
    authorId: author ? { _id: author._id, name: author.name } : null
  };

  return sanitizeQuizForViewer(enriched, user);
};

/**
 * Get Quiz by ID with Approved quiz validation
 */
const getQuizById = async (quizId, user) => {
  if (isDbConnected()) {
    const quiz = await Quiz.findById(quizId)
      .populate('articleId', 'title category coverImage status')
      .populate('authorId', 'name');

    if (!quiz) return null;

    const userRole = (user && user.role) ? user.role.toLowerCase() : 'reader';
    const isOwner = user && quiz.authorId && quiz.authorId._id.toString() === user._id.toString();
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin && !['Published', 'Approved'].includes(quiz.status)) {
      throw new Error('This quiz is not approved or published yet');
    }

    return sanitizeQuizForViewer(quiz, user);
  }

  // Memory fallback
  const quiz = memoryStore.quizzes.find((q) => q._id.toString() === quizId.toString());
  if (!quiz) return null;

  const article = memoryStore.articles.find((a) => a._id === quiz.articleId);
  const author = memoryStore.users.find((u) => u._id === quiz.authorId);

  const enriched = {
    ...quiz,
    articleId: article ? { _id: article._id, title: article.title, category: article.category, coverImage: article.coverImage } : null,
    authorId: author ? { _id: author._id, name: author.name } : null
  };

  return sanitizeQuizForViewer(enriched, user);
};

/**
 * Update Quiz
 */
const updateQuiz = async (quizId, updateData, user) => {
  if (isDbConnected()) {
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
  }

  // Memory fallback
  const quiz = memoryStore.quizzes.find((q) => q._id.toString() === quizId.toString());
  if (!quiz) throw new Error('Quiz not found');

  if (updateData.questions) {
    validateQuestions(updateData.questions);
    quiz.questions = updateData.questions;
  }
  if (updateData.title) quiz.title = updateData.title;
  if (updateData.description !== undefined) quiz.description = updateData.description;
  if (updateData.status) quiz.status = updateData.status;

  return quiz;
};

/**
 * Delete Quiz
 */
const deleteQuiz = async (quizId, user) => {
  if (isDbConnected()) {
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
  }

  // Memory fallback
  const idx = memoryStore.quizzes.findIndex((q) => q._id.toString() === quizId.toString());
  if (idx === -1) throw new Error('Quiz not found');
  memoryStore.quizzes.splice(idx, 1);
  return { message: 'Quiz deleted successfully' };
};

/**
 * Create an in-progress Quiz Attempt session
 * API: POST /api/quizzes/:id/attempts
 */
const createAttempt = async (quizId, user) => {
  let quiz;
  if (isDbConnected()) {
    quiz = await Quiz.findById(quizId).populate('articleId', 'title category');
  } else {
    quiz = memoryStore.quizzes.find((q) => q._id.toString() === quizId.toString());
  }

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  // Approved quiz validation
  const userRole = (user && user.role) ? user.role.toLowerCase() : 'reader';
  const authorIdStr = quiz.authorId ? (quiz.authorId._id || quiz.authorId).toString() : '';
  const isAuthor = user && user._id && authorIdStr === user._id.toString();
  const isAdmin = userRole === 'admin';

  if (!isAuthor && !isAdmin && !['Published', 'Approved'].includes(quiz.status)) {
    throw new Error('Cannot attempt an unapproved quiz');
  }

  const attemptData = {
    quizId: quiz._id,
    articleId: quiz.articleId ? (quiz.articleId._id || quiz.articleId) : null,
    userId: user ? user._id : new mongoose.Types.ObjectId(),
    status: 'in-progress',
    score: 0,
    total: quiz.questions.length,
    percentage: 0,
    startedAt: new Date(),
    answers: []
  };

  if (isDbConnected()) {
    const attempt = await QuizAttempt.create(attemptData);
    return {
      attemptId: attempt._id,
      quiz: sanitizeQuizForViewer(quiz, user),
      startedAt: attempt.startedAt,
      status: 'in-progress'
    };
  }

  // Memory fallback
  const attempt = {
    _id: new mongoose.Types.ObjectId().toString(),
    ...attemptData,
    createdAt: new Date()
  };
  memoryStore.attempts.unshift(attempt);

  return {
    attemptId: attempt._id,
    quiz: sanitizeQuizForViewer(quiz, user),
    startedAt: attempt.startedAt,
    status: 'in-progress'
  };
};

/**
 * Submit Quiz Attempt, validate answers, calculate score, record attempt
 * API: POST /api/quizzes/:id/attempt or /api/quizzes/:id/attempts
 */
const submitAttempt = async (quizId, answers, user, attemptId = null) => {
  let quiz;
  if (isDbConnected()) {
    quiz = await Quiz.findById(quizId).populate('articleId', 'title');
  } else {
    quiz = memoryStore.quizzes.find((q) => q._id.toString() === quizId.toString());
  }

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  // Approved quiz validation
  const userRole = (user && user.role) ? user.role.toLowerCase() : 'reader';
  const authorIdStr = quiz.authorId ? (quiz.authorId._id || quiz.authorId).toString() : '';
  const isAuthor = user && user._id && authorIdStr === user._id.toString();
  const isAdmin = userRole === 'admin';

  if (!isAuthor && !isAdmin && !['Published', 'Approved'].includes(quiz.status)) {
    throw new Error('Cannot attempt an unapproved quiz');
  }

  if (!Array.isArray(answers)) {
    throw new Error('Answers must be provided as an array');
  }

  const total = quiz.questions.length;
  let correctCount = 0;

  const evaluatedQuestions = quiz.questions.map((question, index) => {
    const selectedOption =
      answers[index] !== undefined && answers[index] !== null ? Number(answers[index]) : null;
    const isCorrect = selectedOption !== null && selectedOption === question.correctAnswer;

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
  const submittedAt = new Date();

  let finalAttemptId = attemptId;

  if (isDbConnected()) {
    let attempt;
    if (attemptId) {
      attempt = await QuizAttempt.findById(attemptId);
    }

    if (attempt) {
      attempt.answers = evaluatedQuestions.map((q) => ({
        questionIndex: q.questionIndex,
        question: q.question,
        selectedOption: q.selectedOption,
        isCorrect: q.isCorrect,
        explanation: q.explanation
      }));
      attempt.score = correctCount;
      attempt.total = total;
      attempt.percentage = percentage;
      attempt.status = 'completed';
      attempt.submittedAt = submittedAt;
      await attempt.save();
      finalAttemptId = attempt._id;
    } else {
      const newAttempt = await QuizAttempt.create({
        quizId: quiz._id,
        articleId: quiz.articleId ? (quiz.articleId._id || quiz.articleId) : null,
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
        percentage,
        status: 'completed',
        submittedAt
      });
      finalAttemptId = newAttempt._id;
    }

    // Trigger in-app notification to author
    if (user && quiz.authorId && quiz.authorId.toString() !== user._id.toString()) {
      try {
        await createNotification({
          userId: quiz.authorId,
          type: 'quiz_attempted',
          title: 'New Quiz Attempt',
          message: `${user.name || 'A reader'} attempted your quiz "${quiz.title}" and scored ${correctCount}/${total} (${percentage}%).`,
          link: `/articles/${quiz.articleId ? (quiz.articleId._id || quiz.articleId) : ''}`
        });
      } catch (err) {
        console.warn('Could not dispatch attempt notification to author:', err.message);
      }
    }
  } else {
    // Memory fallback
    let attempt;
    if (attemptId) {
      attempt = memoryStore.attempts.find((a) => a._id.toString() === attemptId.toString());
    }

    if (attempt) {
      attempt.answers = evaluatedQuestions;
      attempt.score = correctCount;
      attempt.total = total;
      attempt.percentage = percentage;
      attempt.status = 'completed';
      attempt.submittedAt = submittedAt;
      finalAttemptId = attempt._id;
    } else {
      const newAttempt = {
        _id: new mongoose.Types.ObjectId().toString(),
        quizId: quiz._id,
        articleId: quiz.articleId,
        userId: user ? user._id : '66cc00000000000000000001',
        answers: evaluatedQuestions,
        score: correctCount,
        total,
        percentage,
        status: 'completed',
        submittedAt,
        createdAt: submittedAt
      };
      memoryStore.attempts.unshift(newAttempt);
      finalAttemptId = newAttempt._id;
    }
  }

  return {
    attemptId: finalAttemptId,
    quizId: quiz._id,
    articleId: quiz.articleId ? (quiz.articleId._id || quiz.articleId) : null,
    score: correctCount,
    total,
    percentage,
    status: 'completed',
    submittedAt,
    questions: evaluatedQuestions.map((eq) => ({
      questionIndex: eq.questionIndex,
      question: eq.question,
      options: eq.options,
      correct: eq.isCorrect,
      isCorrect: eq.isCorrect,
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
  if (isDbConnected()) {
    const attempts = await QuizAttempt.find({ quizId, userId })
      .sort({ createdAt: -1 })
      .limit(10);
    return attempts;
  }

  return memoryStore.attempts
    .filter(
      (a) =>
        a.quizId.toString() === quizId.toString() &&
        (!userId || a.userId.toString() === userId.toString())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);
};

/**
 * Get single attempt details by ID
 */
const getAttemptById = async (attemptId, user) => {
  if (isDbConnected()) {
    const attempt = await QuizAttempt.findById(attemptId)
      .populate('quizId', 'title description')
      .populate('articleId', 'title category coverImage');
    return attempt;
  }

  const attempt = memoryStore.attempts.find(
    (a) => a._id.toString() === attemptId.toString()
  );
  if (!attempt) return null;

  const quiz = memoryStore.quizzes.find((q) => q._id === attempt.quizId);
  const article = memoryStore.articles.find((a) => a._id === attempt.articleId);

  return {
    ...attempt,
    quizId: quiz ? { _id: quiz._id, title: quiz.title, description: quiz.description } : null,
    articleId: article ? { _id: article._id, title: article.title, category: article.category, coverImage: article.coverImage } : null
  };
};

/**
 * Get all attempts for a logged-in user
 */
const getUserAttempts = async (userId) => {
  if (isDbConnected()) {
    const attempts = await QuizAttempt.find({ userId })
      .populate('quizId', 'title')
      .populate('articleId', 'title category coverImage')
      .sort({ createdAt: -1 });
    return attempts;
  }

  return memoryStore.attempts
    .filter((a) => !userId || a.userId.toString() === userId.toString())
    .map((a) => {
      const quiz = memoryStore.quizzes.find((q) => q._id === a.quizId);
      const article = memoryStore.articles.find((art) => art._id === a.articleId);
      return {
        ...a,
        quizId: quiz ? { _id: quiz._id, title: quiz.title } : null,
        articleId: article ? { _id: article._id, title: article.title, category: article.category, coverImage: article.coverImage } : null
      };
    })
    .sort((a, b) => new Date(b.createdAt || b.submittedAt) - new Date(a.createdAt || a.submittedAt));
};

module.exports = {
  createQuiz,
  getApprovedQuizzes,
  getQuizByArticle,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  createAttempt,
  submitAttempt,
  getQuizResults,
  getAttemptById,
  getUserAttempts,
  validateQuestions,
  sanitizeQuizForViewer
};
