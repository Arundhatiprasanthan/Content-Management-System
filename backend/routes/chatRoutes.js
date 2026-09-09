const express = require("express");
const router = express.Router();

const {
  createOrGetConversation,
  getUserConversations,
  getConversationMessages,
  sendMessage,
  markConversationAsRead,
  getUnreadMessageCount,
  searchUsers,
} = require("../controllers/chatController");

const { protect } = require("../middleware/authMiddleware");

// All chat routes require authentication
router.use(protect);

// Search users
router.get("/users/search", searchUsers);

// Unread message count
router.get("/unread-count", getUnreadMessageCount);

// Conversations
router.post("/conversations", createOrGetConversation);
router.get("/conversations", getUserConversations);

// Messages
router.get(
  "/conversations/:conversationId/messages",
  getConversationMessages
);

router.post(
  "/conversations/:conversationId/messages",
  sendMessage
);

// Mark messages as read
router.patch(
  "/conversations/:conversationId/read",
  markConversationAsRead
);

module.exports = router;