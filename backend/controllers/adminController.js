const Article = require("../models/Article");
const Quiz = require("../models/Quiz");

// ==========================================
// ADMIN DASHBOARD
// ==========================================

const getAdminDashboard = async (req, res) => {
  try {
    const pendingArticles = await Article.countDocuments({
      status: "Pending Review",
    });

    const pendingQuizzes = await Quiz.countDocuments({
      status: "Pending Review",
    });

    const approvedArticles = await Article.countDocuments({
      status: "Published",
    });

    const rejectedArticles = await Article.countDocuments({
      status: "Rejected",
    });

    const recentArticles = await Article.find({
      status: "Pending Review",
    })
      .populate("authorId", "name email")
      .sort({ submittedAt: -1, createdAt: -1 })
      .limit(5)
      .lean();

    const formattedArticles = recentArticles.map((article) => ({
      ...article,
      author: article.authorId,
    }));

    res.status(200).json({
      success: true,
      pendingArticles,
      pendingQuizzes,
      approved: approvedArticles,
      rejected: rejectedArticles,
      recentArticles: formattedArticles,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard data",
      error: error.message,
    });
  }
};

// ==========================================
// GET PENDING ARTICLES
// ==========================================

const getPendingArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      status: "Pending Review",
    })
      .populate("authorId", "name email")
      .sort({ submittedAt: -1, createdAt: -1 })
      .lean();

    const formattedArticles = articles.map((article) => ({
      ...article,
      author: article.authorId,
    }));

    res.status(200).json({
      success: true,
      articles: formattedArticles,
    });
  } catch (error) {
    console.error("Get pending articles error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch pending articles",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE ARTICLE FOR REVIEW
// ==========================================

const getArticleForReview = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id)
      .populate("authorId", "name email")
      .lean();

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    const formattedArticle = {
      ...article,
      author: article.authorId,
    };

    res.status(200).json({
      success: true,
      article: formattedArticle,
    });
  } catch (error) {
    console.error(
      "Get article for review error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch article",
      error: error.message,
    });
  }
};

// ==========================================
// APPROVE ARTICLE
// ==========================================

const approveArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    if (article.status !== "Pending Review") {
      return res.status(400).json({
        success: false,
        message: "Only pending articles can be approved",
      });
    }

    article.status = "Published";

    await article.save();

    res.status(200).json({
      success: true,
      message: "Article approved and published successfully",
      article,
    });
  } catch (error) {
    console.error("Approve article error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to approve article",
      error: error.message,
    });
  }
};

// ==========================================
// REQUEST ARTICLE CHANGES
// ==========================================

const requestArticleChanges = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Change request message is required",
      });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    if (article.status !== "Pending Review") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending articles can have changes requested",
      });
    }

    article.status = "Changes Requested";

    await article.save();

    res.status(200).json({
      success: true,
      message: "Changes requested successfully",
      article,
      changeMessage: message.trim(),
    });
  } catch (error) {
    console.error(
      "Request article changes error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to request changes",
      error: error.message,
    });
  }
};

// ==========================================
// REJECT ARTICLE
// ==========================================

const rejectArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    if (article.status !== "Pending Review") {
      return res.status(400).json({
        success: false,
        message: "Only pending articles can be rejected",
      });
    }

    article.status = "Rejected";

    await article.save();

    res.status(200).json({
      success: true,
      message: "Article rejected successfully",
      article,
    });
  } catch (error) {
    console.error("Reject article error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reject article",
      error: error.message,
    });
  }
};

// ======================================================
//                    QUIZ REVIEW
// ======================================================

// ==========================================
// GET PENDING QUIZZES
// ==========================================

const getPendingQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      status: "Pending Review",
    })
      .populate("authorId", "name email")
      .populate("articleId", "title")
      .sort({ createdAt: -1 })
      .lean();

    const formattedQuizzes = quizzes.map((quiz) => ({
      ...quiz,
      author: quiz.authorId,
      article: quiz.articleId,
    }));

    res.status(200).json({
      success: true,
      quizzes: formattedQuizzes,
    });
  } catch (error) {
    console.error(
      "Get pending quizzes error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch pending quizzes",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE QUIZ FOR REVIEW
// ==========================================

const getQuizForReview = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id)
      .populate("authorId", "name email")
      .populate("articleId", "title")
      .lean();

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      quiz: {
        ...quiz,
        author: quiz.authorId,
        article: quiz.articleId,
      },
    });
  } catch (error) {
    console.error(
      "Get quiz for review error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
      error: error.message,
    });
  }
};

// ==========================================
// APPROVE QUIZ
// ==========================================

const approveQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.status !== "Pending Review") {
      return res.status(400).json({
        success: false,
        message: "Only pending quizzes can be approved",
      });
    }

    quiz.status = "Published";

    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Quiz approved and published successfully",
      quiz,
    });
  } catch (error) {
    console.error("Approve quiz error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to approve quiz",
      error: error.message,
    });
  }
};

// ==========================================
// REQUEST QUIZ CHANGES
// ==========================================

const requestQuizChanges = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Change request message is required",
      });
    }

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.status !== "Pending Review") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending quizzes can have changes requested",
      });
    }

    quiz.status = "Changes Requested";

    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Quiz changes requested successfully",
      quiz,
      changeMessage: message.trim(),
    });
  } catch (error) {
    console.error(
      "Request quiz changes error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to request quiz changes",
      error: error.message,
    });
  }
};

// ==========================================
// REJECT QUIZ
// ==========================================

const rejectQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.status !== "Pending Review") {
      return res.status(400).json({
        success: false,
        message: "Only pending quizzes can be rejected",
      });
    }

    quiz.status = "Rejected";

    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Quiz rejected successfully",
      quiz,
    });
  } catch (error) {
    console.error("Reject quiz error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reject quiz",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  // Article
  getAdminDashboard,
  getPendingArticles,
  getArticleForReview,
  approveArticle,
  requestArticleChanges,
  rejectArticle,

  // Quiz
  getPendingQuizzes,
  getQuizForReview,
  approveQuiz,
  requestQuizChanges,
  rejectQuiz,
};