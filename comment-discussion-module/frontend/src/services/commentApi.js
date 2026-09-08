import axios from "axios";

const API_BASE_URL = typeof window !== "undefined" && window.location.port === "3000"
  ? "/api"
  : "http://localhost:5001/api";

export const PRESET_USERS = {
  reader: {
    _id: "66cc00000000000000000003",
    name: "Lena Kaufmann",
    email: "reader@lumen.test",
    role: "Reader",
    profileImage: ""
  },
  author: {
    _id: "66cc00000000000000000002",
    name: "Syed Zaid (Author)",
    email: "author@lumen.test",
    role: "Author",
    profileImage: ""
  },
  admin: {
    _id: "66cc00000000000000000001",
    name: "Nikhitha Admin",
    email: "admin@lumen.test",
    role: "Admin",
    profileImage: ""
  }
};

/**
 * Get active user from localStorage or default to Reader
 */
export const getActiveUser = () => {
  try {
    const stored = localStorage.getItem("lumen_active_user");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Failed to load user from localStorage:", e);
  }
  return PRESET_USERS.reader;
};

/**
 * Persist active user to localStorage
 */
export const setActiveUser = (user) => {
  try {
    localStorage.setItem("lumen_active_user", JSON.stringify(user));
  } catch (e) {
    console.warn("Failed to persist user to localStorage:", e);
  }
  return user;
};

/**
 * Axios instance with custom header injection for multi-role simulation & auth
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000
});

api.interceptors.request.use((config) => {
  const user = getActiveUser();
  if (user) {
    config.headers["x-user-id"] = user._id;
    config.headers["x-user-role"] = user.role;
    config.headers["x-user-name"] = user.name;
    config.headers["x-user-email"] = user.email;
  }
  const token = localStorage.getItem("lumen_jwt_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

/* ==========================================================================
   OFFLINE RESILIENT STORAGE FALLBACK
   Ensures the comment UI works smoothly in local demos even if MongoDB/Backend
   is currently offline or unreachable.
   ========================================================================== */

const STORAGE_KEY = "lumen_mock_comments_store";

const getInitialSeedComments = (articleId) => [
  {
    _id: "mock_c1_" + articleId,
    articleId: String(articleId),
    userId: PRESET_USERS.author,
    parentCommentId: null,
    content: "Welcome to the discussion! Feel free to ask questions about the methodology, concepts, and key takeaways in this article.",
    likes: [PRESET_USERS.reader._id],
    likesCount: 1,
    isLiked: false,
    isEdited: false,
    isDeleted: false,
    reports: [],
    reportCount: 0,
    status: "Active",
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    replies: [
      {
        _id: "mock_c2_" + articleId,
        articleId: String(articleId),
        userId: PRESET_USERS.reader,
        parentCommentId: "mock_c1_" + articleId,
        content: "Thank you for the thorough breakdown! The section on real-world applications was especially eye-opening.",
        likes: [],
        likesCount: 0,
        isLiked: false,
        isEdited: false,
        isDeleted: false,
        reports: [],
        reportCount: 0,
        status: "Active",
        createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
        replies: []
      }
    ]
  }
];

const getStoredMockTree = (articleId) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY + "_" + articleId);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Failed reading mock storage:", e);
  }
  const initial = getInitialSeedComments(articleId);
  saveStoredMockTree(articleId, initial);
  return initial;
};

const saveStoredMockTree = (articleId, tree) => {
  try {
    localStorage.setItem(STORAGE_KEY + "_" + articleId, JSON.stringify(tree));
  } catch (e) {
    console.warn("Failed saving mock storage:", e);
  }
};

/* ==========================================================================
   COMMENT API METHODS (Try Backend First -> Resilient Mock Fallback)
   ========================================================================== */

export const fetchComments = async (articleId, sort = "newest") => {
  try {
    const res = await api.get(`/articles/${articleId}/comments?sort=${sort}`);
    if (res.data && res.data.success) {
      // Sync to local fallback for seamless experience
      saveStoredMockTree(articleId, res.data.data);
      return res.data;
    }
  } catch {
    console.info("Using local resilient comments storage for offline mode");
  }

  // Fallback offline handler
  const tree = getStoredMockTree(articleId);
  const currentUser = getActiveUser();

  // Recursively update canEdit and canDelete flags based on current simulated user
  const normalizeTree = (list) =>
    list.map((c) => {
      const authorId = c.userId?._id || c.userId?.id;
      const isOwner = authorId === currentUser._id;
      const isAdmin = currentUser.role === "Admin";
      return {
        ...c,
        canEdit: !c.isDeleted && isOwner,
        canDelete: isOwner || isAdmin,
        isLiked: (c.likes || []).includes(currentUser._id),
        likesCount: (c.likes || []).length,
        replies: normalizeTree(c.replies || [])
      };
    });

  let normalized = normalizeTree(tree);

  if (sort === "newest") {
    normalized.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === "oldest") {
    normalized.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === "most_liked") {
    normalized.sort((a, b) => b.likesCount - a.likesCount);
  }

  const countAll = (items) =>
    items.reduce((sum, item) => sum + 1 + countAll(item.replies || []), 0);

  return {
    success: true,
    totalComments: countAll(normalized),
    topLevelCount: normalized.length,
    data: normalized
  };
};

export const postComment = async (articleId, content) => {
  try {
    const res = await api.post(`/articles/${articleId}/comments`, { content });
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch {
    console.info("Backend post offline, writing to mock storage");
  }

  const currentUser = getActiveUser();
  const newComment = {
    _id: "local_" + Date.now(),
    articleId: String(articleId),
    userId: currentUser,
    parentCommentId: null,
    content,
    likes: [],
    likesCount: 0,
    isLiked: false,
    isEdited: false,
    isDeleted: false,
    reports: [],
    reportCount: 0,
    status: "Active",
    canEdit: true,
    canDelete: true,
    createdAt: new Date().toISOString(),
    replies: []
  };

  const tree = getStoredMockTree(articleId);
  tree.unshift(newComment);
  saveStoredMockTree(articleId, tree);
  return newComment;
};

export const postReply = async (commentId, content, articleId) => {
  try {
    const res = await api.post(`/comments/${commentId}/replies`, { content });
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch {
    console.info("Backend reply offline, writing to mock storage");
  }

  const currentUser = getActiveUser();
  const newReply = {
    _id: "local_reply_" + Date.now(),
    articleId: String(articleId),
    userId: currentUser,
    parentCommentId: commentId,
    content,
    likes: [],
    likesCount: 0,
    isLiked: false,
    isEdited: false,
    isDeleted: false,
    reports: [],
    reportCount: 0,
    status: "Active",
    canEdit: true,
    canDelete: true,
    createdAt: new Date().toISOString(),
    replies: []
  };

  const tree = getStoredMockTree(articleId);
  const insertReply = (list) => {
    for (let item of list) {
      if (item._id === commentId) {
        if (!item.replies) item.replies = [];
        item.replies.push(newReply);
        return true;
      }
      if (item.replies && insertReply(item.replies)) {
        return true;
      }
    }
    return false;
  };

  insertReply(tree);
  saveStoredMockTree(articleId, tree);
  return newReply;
};

export const updateComment = async (commentId, content, articleId) => {
  try {
    const res = await api.put(`/comments/${commentId}`, { content });
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch {
    console.info("Backend update offline, updating mock storage");
  }

  const tree = getStoredMockTree(articleId);
  const editRecursive = (list) => {
    for (let item of list) {
      if (item._id === commentId) {
        item.content = content;
        item.isEdited = true;
        item.editedAt = new Date().toISOString();
        return true;
      }
      if (item.replies && editRecursive(item.replies)) {
        return true;
      }
    }
    return false;
  };

  editRecursive(tree);
  saveStoredMockTree(articleId, tree);
  return { _id: commentId, content, isEdited: true };
};

export const deleteComment = async (commentId, articleId) => {
  try {
    const res = await api.delete(`/comments/${commentId}`);
    if (res.data && res.data.success) {
      return res.data;
    }
  } catch {
    console.info("Backend delete offline, updating mock storage");
  }

  const tree = getStoredMockTree(articleId);

  const deleteRecursive = (list) => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item._id === commentId) {
        if (item.replies && item.replies.length > 0) {
          // Soft delete to preserve thread
          item.isDeleted = true;
          item.content = "[This comment has been deleted]";
        } else {
          list.splice(i, 1);
        }
        return true;
      }
      if (item.replies && deleteRecursive(item.replies)) {
        return true;
      }
    }
    return false;
  };

  deleteRecursive(tree);
  saveStoredMockTree(articleId, tree);
  return { success: true };
};

export const toggleLikeComment = async (commentId, articleId) => {
  try {
    const res = await api.post(`/comments/${commentId}/like`);
    if (res.data && res.data.success) {
      return res.data;
    }
  } catch {
    console.info("Backend like offline, updating mock storage");
  }

  const currentUser = getActiveUser();
  const tree = getStoredMockTree(articleId);
  let result = { likesCount: 0, isLiked: false };

  const likeRecursive = (list) => {
    for (let item of list) {
      if (item._id === commentId) {
        if (!item.likes) item.likes = [];
        const idx = item.likes.indexOf(currentUser._id);
        if (idx > -1) {
          item.likes.splice(idx, 1);
          result.isLiked = false;
        } else {
          item.likes.push(currentUser._id);
          result.isLiked = true;
        }
        result.likesCount = item.likes.length;
        item.likesCount = result.likesCount;
        item.isLiked = result.isLiked;
        return true;
      }
      if (item.replies && likeRecursive(item.replies)) {
        return true;
      }
    }
    return false;
  };

  likeRecursive(tree);
  saveStoredMockTree(articleId, tree);
  return result;
};

export const reportComment = async (commentId, reason, details = "", articleId) => {
  try {
    const res = await api.post(`/comments/${commentId}/report`, { reason, details });
    if (res.data && res.data.success) {
      return res.data;
    }
  } catch {
    console.info("Backend report offline, updating mock storage");
  }

  const currentUser = getActiveUser();
  const tree = getStoredMockTree(articleId);

  const reportRecursive = (list) => {
    for (let item of list) {
      if (item._id === commentId) {
        if (!item.reports) item.reports = [];
        const already = item.reports.some((r) => r.reportedBy === currentUser._id);
        if (already) {
          throw new Error("You have already reported this comment");
        }
        item.reports.push({
          reportedBy: currentUser._id,
          reason,
          details,
          reportedAt: new Date().toISOString()
        });
        item.reportCount = (item.reportCount || 0) + 1;
        if (item.reportCount >= 3) {
          item.status = "Flagged";
        }
        return true;
      }
      if (item.replies && reportRecursive(item.replies)) {
        return true;
      }
    }
    return false;
  };

  reportRecursive(tree);
  saveStoredMockTree(articleId, tree);
  return { success: true, message: "Comment has been reported for review" };
};
