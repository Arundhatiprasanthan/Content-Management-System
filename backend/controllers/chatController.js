const chatService = require("../services/chatService");

// ==========================================
// CREATE OR GET CONVERSATION
// POST /api/chat/conversations
// ==========================================
const createOrGetConversation = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const conversation =
      await chatService.createOrGetConversation(
        currentUserId,
        userId
      );

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error(
      "createOrGetConversation error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET USER CONVERSATIONS
// GET /api/chat/conversations
// ==========================================
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations =
      await chatService.getUserConversations(userId);

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error(
      "getUserConversations error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to retrieve conversations",
      error: error.message,
    });
  }
};

// ==========================================
// GET CONVERSATION MESSAGES
// GET /api/chat/conversations/:conversationId/messages
// ==========================================
const getConversationMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    const messages =
      await chatService.getConversationMessages(
        conversationId,
        userId
      );

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error(
      "getConversationMessages error:",
      error
    );

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// SEND MESSAGE
// POST /api/chat/conversations/:conversationId/messages
// ==========================================
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    const message = await chatService.sendMessage(
      conversationId,
      senderId,
      content
    );

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("sendMessage error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// MARK CONVERSATION AS READ
// PATCH /api/chat/conversations/:conversationId/read
// ==========================================
const markConversationAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    await chatService.markConversationAsRead(
      conversationId,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error(
      "markConversationAsRead error:",
      error
    );

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET UNREAD MESSAGE COUNT
// GET /api/chat/unread-count
// ==========================================
const getUnreadMessageCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadCount =
      await chatService.getUnreadMessageCount(userId);

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error(
      "getUnreadMessageCount error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get unread message count",
      error: error.message,
    });
  }
};

// ==========================================
// SEARCH USERS
// GET /api/chat/users/search?search=...
// ==========================================
const searchUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { search = "" } = req.query;

    const users = await chatService.searchUsers(
      currentUserId,
      search
    );

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("searchUsers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search users",
      error: error.message,
    });
  }
};

module.exports = {
  createOrGetConversation,
  getUserConversations,
  getConversationMessages,
  sendMessage,
  markConversationAsRead,
  getUnreadMessageCount,
  searchUsers,
};