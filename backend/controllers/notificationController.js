const notificationService = require('../services/notificationService');

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = async (req, res) => {
  try {
    console.log('========== GET NOTIFICATIONS CALLED ==========');
    console.log('REQ USER:', req.user);

    const userId = req.user._id;

    console.log('NOTIFICATION USER ID:', userId);
    console.log('NOTIFICATION USER ID TYPE:', typeof userId);

    const { page, limit, unreadOnly } = req.query;

    const data = await notificationService.getUserNotifications(userId, {
      page: page || 1,
      limit: limit || 20,
      unreadOnly: unreadOnly === 'true'
    });

    console.log('NOTIFICATIONS FOUND:', data.notifications.length);
    console.log('UNREAD COUNT:', data.unreadCount);

    res.status(200).json({
      success: true,
      data: data.notifications,
      unreadCount: data.unreadCount,
      pagination: data.pagination
    });
  } catch (error) {
    console.error('getNotifications error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
      error: error.message
    });
  }
};

/**
 * @desc    Mark single notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationId = req.params.id;

    const notification = await notificationService.markAsRead(
      notificationId,
      userId
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('markNotificationRead error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update notification',
      error: error.message
    });
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await notificationService.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('markAllNotificationsRead error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationId = req.params.id;

    const notification = await notificationService.deleteNotification(
      notificationId,
      userId
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('deleteNotification error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
};

