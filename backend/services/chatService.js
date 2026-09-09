const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

// ==========================================
// CREATE OR GET ONE-TO-ONE CONVERSATION
// ==========================================
const createOrGetConversation = async (currentUserId, otherUserId) => {
  if (!otherUserId) {
    throw new Error("Other user ID is required");
  }

  if (currentUserId.toString() === otherUserId.toString()) {
    throw new Error("You cannot start a conversation with yourself");
  }

  // Check whether the other user exists
  const otherUser = await User.findById(otherUserId);

  if (!otherUser) {
    throw new Error("User not found");
  }

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    participants: {
      $all: [currentUserId, otherUserId],
    },
  }).populate(
    "participants",
    "name email role profileImage"
  );

  // Create a new conversation if it doesn't exist
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [currentUserId, otherUserId],
    });

    conversation = await conversation.populate(
      "participants",
      "name email role profileImage"
    );
  }

  return conversation;
};

// ==========================================
// GET ALL CONVERSATIONS FOR CURRENT USER
// ==========================================
const getUserConversations = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate(
      "participants",
      "name email role profileImage"
    )
    .sort({ updatedAt: -1 })
    .lean();

  // Add latest message and unread count
  const conversationsWithDetails = await Promise.all(
    conversations.map(async (conversation) => {
      const latestMessage = await Message.findOne({
        conversation: conversation._id,
      })
        .sort({ createdAt: -1 })
        .lean();

      const unreadCount = await Message.countDocuments({
        conversation: conversation._id,
        sender: { $ne: userId },
        isRead: false,
      });

      return {
        ...conversation,
        latestMessage,
        unreadCount,
      };
    })
  );

  return conversationsWithDetails;
};

// ==========================================
// GET MESSAGES OF A CONVERSATION
// ==========================================
const getConversationMessages = async (
  conversationId,
  userId
) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    throw new Error(
      "Conversation not found or you are not a participant"
    );
  }

  const messages = await Message.find({
    conversation: conversationId,
  })
    .populate("sender", "name email profileImage")
    .sort({ createdAt: 1 });

  return messages;
};

// ==========================================
// SEND MESSAGE
// ==========================================
const sendMessage = async (
  conversationId,
  senderId,
  content
) => {
  if (!content || !content.trim()) {
    throw new Error("Message content is required");
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: senderId,
  });

  if (!conversation) {
    throw new Error(
      "Conversation not found or you are not a participant"
    );
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    content: content.trim(),
  });

  // Update conversation's updatedAt
  conversation.updatedAt = new Date();
  await conversation.save();

  return await Message.findById(message._id).populate(
    "sender",
    "name email profileImage"
  );
};

// ==========================================
// MARK CONVERSATION MESSAGES AS READ
// ==========================================
const markConversationAsRead = async (
  conversationId,
  userId
) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    throw new Error(
      "Conversation not found or you are not a participant"
    );
  }

  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
      isRead: false,
    },
    {
      $set: { isRead: true },
    }
  );

  return true;
};

// ==========================================
// GET TOTAL UNREAD MESSAGE COUNT
// ==========================================
const getUnreadMessageCount = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId,
  }).select("_id");

  const conversationIds = conversations.map(
    (conversation) => conversation._id
  );

  return await Message.countDocuments({
    conversation: { $in: conversationIds },
    sender: { $ne: userId },
    isRead: false,
  });
};

// ==========================================
// SEARCH USERS FOR CHAT
// ==========================================
const searchUsers = async (currentUserId, search) => {
  const query = {
    _id: { $ne: currentUserId },
  };

  if (search && search.trim()) {
    const searchRegex = new RegExp(
      search.trim(),
      "i"
    );

    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
    ];
  }

  return await User.find(query)
    .select("name email role profileImage bio")
    .sort({ name: 1 })
    .limit(20);
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