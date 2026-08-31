import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

function AdminNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Article Submitted",
      message:
        "John Doe submitted 'The Future of Artificial Intelligence' for review.",
      time: "10 minutes ago",
      read: false,
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 2,
      title: "Article Approved",
      message:
        "The article 'Climate Change and Our Future' has been published.",
      time: "2 hours ago",
      read: false,
      image:
        "https://images.unsplash.com/photo-1569511166187-97eb6e387e19?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 3,
      title: "Article Rejected",
      message:
        "The article 'Understanding Modern History' was rejected.",
      time: "Yesterday",
      read: true,
      image:
        "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 4,
      title: "Changes Requested",
      message:
        "Changes were requested for 'The Future of Healthcare'.",
      time: "Yesterday",
      read: true,
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=300&q=80",
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  return (
    <AdminLayout>
      <div className="admin-page">

        <section className="page-heading notification-heading">

          <div>
            <h1>Notifications</h1>

            <p>
              Stay updated with important content activities.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              className="secondary-button"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          )}

        </section>

        <div className="notification-summary">
          {unreadCount} unread notification
          {unreadCount !== 1 ? "s" : ""}
        </div>

        <section className="notifications-list">

          {notifications.length === 0 ? (
            <div className="dashboard-empty">

              <div className="empty-icon">
                ◇
              </div>

              <h3>
                No notifications
              </h3>

              <p>
                You don't have any notifications at the moment.
              </p>

            </div>
          ) : (
            notifications.map((notification) => (
              <article
                key={notification.id}
                className={`notification-card ${
                  notification.read ? "read" : "unread"
                }`}
              >

                {/* Notification Image */}
                <img
                  src={notification.image}
                  alt={notification.title}
                  className="notification-image"
                />

                <div className="notification-icon">
                  {notification.read ? "✓" : "!"}
                </div>

                <div className="notification-content">

                  <div className="notification-title-row">

                    <h3>
                      {notification.title}
                    </h3>

                    {!notification.read && (
                      <span className="new-badge">
                        New
                      </span>
                    )}

                  </div>

                  <p>
                    {notification.message}
                  </p>

                  <span className="notification-time">
                    {notification.time}
                  </span>

                </div>

                {!notification.read && (
                  <button
                    className="text-button"
                    onClick={() =>
                      markAsRead(notification.id)
                    }
                  >
                    Mark as read
                  </button>
                )}

              </article>
            ))
          )}

        </section>

      </div>
    </AdminLayout>
  );
}

export default AdminNotifications;