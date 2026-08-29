import { useState } from "react";

function AdminNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Article Submitted",
      message:
        "John Doe submitted 'The Future of Artificial Intelligence' for review.",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Article Approved",
      message:
        "The article 'Climate Change and Our Future' has been published.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "Article Rejected",
      message:
        "The article 'Understanding Modern History' was rejected.",
      time: "Yesterday",
      read: true,
    },
    {
      id: 4,
      title: "Changes Requested",
      message:
        "Changes were requested for 'The Future of Healthcare'.",
      time: "Yesterday",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  return (
    <div className="admin-page">

      {/* Page Header */}

      <div className="admin-page-header notification-header">

        <div>
          <h1>Notifications</h1>

          <p>
            Stay updated with important content activities.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            className="mark-all-button"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}

      </div>

      {/* Notification Summary */}

      <div className="notification-summary">

        <span>
          {unreadCount} unread notification
          {unreadCount !== 1 ? "s" : ""}
        </span>

      </div>

      {/* Notifications */}

      <div className="notifications-list">

        {notifications.length === 0 ? (
          <div className="notifications-empty">
            <h3>No notifications</h3>
            <p>
              You don't have any notifications at the moment.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (

            <div
              key={notification.id}
              className={`notification-card ${
                notification.read ? "read" : "unread"
              }`}
            >

              <div className="notification-icon">
                {notification.read ? "✓" : "!"}
              </div>

              <div className="notification-content">

                <div className="notification-title-row">

                  <h3>{notification.title}</h3>

                  {!notification.read && (
                    <span className="unread-badge">
                      New
                    </span>
                  )}

                </div>

                <p>{notification.message}</p>

                <span className="notification-time">
                  {notification.time}
                </span>

              </div>

              {!notification.read && (
                <button
                  className="mark-read-button"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as read
                </button>
              )}

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default AdminNotifications;