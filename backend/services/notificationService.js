const Notification = require('../models/Notification');

/**
 * Dispatch / create a new in-app notification
 */
const createNotification = async ({ userId, type = 'system', title, message, link = '' }) => {
  if (!userId || !title || !message) {
    throw new Error('userId, title, and message are required to create a notification');
  }

  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    link,
    read: false
  });

  return notification;
};

/**
 * Retrieve notifications for a specific user
 */
const getUserNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false } = {}) => {
  const query = { userId };
  if (unreadOnly) {
    query.read = false;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Notification.countDocuments(query),
    Notification.countDocuments({ userId, read: false })
  ]);

  return {
    notifications,
    unreadCount,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit))
    }
  };
};

/**
 * Mark a single notification as read
 */
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({ _id: notificationId, userId });
  if (!notification) {
    return null;
  }

  notification.read = true;
  await notification.save();
  return notification;
};

/**
 * Mark all notifications as read for a user
 */
const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { userId, read: false },
    { $set: { read: true } }
  );
  return result;
};

/**
 * Delete a notification
 */
const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });
  return notification;
};

/**
 * Get count of unread notifications
 */
const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({ userId, read: false });
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
};
