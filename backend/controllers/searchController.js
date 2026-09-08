const Article = require("../models/Article");
let User;
try {
  User = require("../models/User");
} catch (e) {
  User = null;
}

/**
 * @desc    Global Unified Search for Articles, Authors, and Users
 * @route   GET /api/search
 * @access  Public
 */
const searchAll = async (req, res) => {
  try {
    const q = req.query.q || req.query.query || "";
    const type = (req.query.type || "all").toLowerCase();
    const category = req.query.category || "";
    const tag = req.query.tag || "";
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const regex = q.trim() ? new RegExp(q.trim(), "i") : null;

    let articlesResult = [];
    let authorsResult = [];
    let usersResult = [];
    let totalArticles = 0;
    let totalAuthors = 0;
    let totalUsers = 0;

    // 1. SEARCH ARTICLES
    if (type === "all" || type === "articles") {
      const articleFilter = { status: "Published" };

      if (category && category !== "All") {
        articleFilter.category = new RegExp(`^${category.trim()}$`, "i");
      }

      if (tag) {
        articleFilter.tags = new RegExp(tag.trim(), "i");
      }

      if (regex) {
        articleFilter.$or = [
          { title: regex },
          { description: regex },
          { content: regex },
          { category: regex },
          { tags: regex },
        ];
      }

      totalArticles = await Article.countDocuments(articleFilter);

      articlesResult = await Article.find(articleFilter)
        .populate("authorId", "name email bio profileImage role")
        .sort({ createdAt: -1 })
        .skip(type === "articles" ? skip : 0)
        .limit(type === "articles" ? limit : 6);
    }

    // 2. SEARCH USERS / AUTHORS
    if (User && (type === "all" || type === "authors" || type === "users")) {
      const userFilter = {};

      if (regex) {
        userFilter.$or = [
          { name: regex },
          { email: regex },
          { bio: regex },
          { role: regex },
        ];
      }

      if (type === "authors") {
        userFilter.role = "Author";
      }

      const allMatchingUsers = await User.find(userFilter)
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(20);

      authorsResult = allMatchingUsers.filter(
        (u) => u.role === "Author" || u.role === "Admin"
      );
      usersResult = allMatchingUsers;

      totalAuthors = authorsResult.length;
      totalUsers = usersResult.length;
    }

    const totalCount =
      type === "articles"
        ? totalArticles
        : type === "authors"
        ? totalAuthors
        : totalArticles + totalAuthors;

    res.status(200).json({
      success: true,
      query: q,
      type,
      category,
      tag,
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit) || 1,
      data: {
        articles: articlesResult,
        authors: authorsResult,
        users: usersResult,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search operation failed",
      error: error.message,
    });
  }
};

module.exports = {
  searchAll,
};
