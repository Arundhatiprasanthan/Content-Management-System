import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";
import "./AdminNotifications.css";

function AdminNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/notifications",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Notifications response:", data);

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load notifications"
        );
      }

      if (data.success) {
        setNotifications(data.data || []);
        setUnreadCount(data.unreadCount || 0);
      } else {
        throw new Error(
          data.message || "Failed to load notifications"
        );
      }
    } catch (error) {
      console.error("Notification loading error:", error);

      setError(
        error.message || "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // MARK SINGLE NOTIFICATION AS READ
  // ==========================================

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Mark as read response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to mark notification as read"
        );
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      setUnreadCount((current) =>
        current > 0 ? current - 1 : 0
      );
    } catch (error) {
      console.error("Mark as read error:", error);

      alert(
        error.message ||
          "Failed to mark notification as read."
      );
    }
  };

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setActionLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/notifications/read-all",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(
        "Mark all as read response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to mark all notifications as read"
        );
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Mark all as read error:",
        error
      );

      alert(
        error.message ||
          "Failed to mark all notifications as read."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // DELETE NOTIFICATION
  // ==========================================

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(
        "Delete notification response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete notification"
        );
      }

      const deletedNotification =
        notifications.find(
          (notification) =>
            notification._id === notificationId
        );

      setNotifications((current) =>
        current.filter(
          (notification) =>
            notification._id !== notificationId
        )
      );

      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount((current) =>
          current > 0 ? current - 1 : 0
        );
      }
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete notification."
      );
    }
  };

  // ==========================================
  // CLICK NOTIFICATION
  // ==========================================

  const handleNotificationClick = async (
    notification
  ) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }

    if (notification.link) {
      navigate(notification.link);
    }
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (date) => {
    if (!date) {
      return "Recently";
    }

    const notificationDate = new Date(date);
    const now = new Date();

    const difference =
      now.getTime() -
      notificationDate.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} minute${
        minutes !== 1 ? "s" : ""
      } ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${
        hours !== 1 ? "s" : ""
      } ago`;
    }

    const days = Math.floor(hours / 24);

    if (days === 1) {
      return "Yesterday";
    }

    if (days < 7) {
      return `${days} days ago`;
    }

    return notificationDate.toLocaleDateString();
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page">
          <section className="page-heading">
            <div>
              <h1>Notifications</h1>
              <p>
                Stay updated with important
                content activities.
              </p>
            </div>
          </section>

          <section className="notifications-list">
            <div className="dashboard-empty">
              <h3>Loading notifications...</h3>
              <p>
                Please wait while we load your
                notifications.
              </p>
            </div>
          </section>
        </div>
      </AdminLayout>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-page">
          <section className="page-heading">
            <div>
              <h1>Notifications</h1>
              <p>
                Stay updated with important
                content activities.
              </p>
            </div>
          </section>

          <section className="notifications-list">
            <div className="dashboard-empty">
              <div className="empty-icon">!</div>

              <h3>
                Unable to load notifications
              </h3>

              <p>{error}</p>

              <button
                type="button"
                onClick={fetchNotifications}
              >
                Try Again
              </button>
            </div>
          </section>
        </div>
      </AdminLayout>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <AdminLayout>
      <div className="admin-page">
        <section className="page-heading notification-heading">
          <div>
            <h1>Notifications</h1>

            <p>
              Stay updated with important
              content activities.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              className="secondary-button"
              onClick={markAllAsRead}
              disabled={actionLoading}
            >
              {actionLoading
                ? "Updating..."
                : "Mark all as read"}
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
                ✓
              </div>

              <h3>No notifications</h3>

              <p>
                You don't have any notifications
                at the moment.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <article
                key={notification._id}
                className={`notification-card ${
                  notification.read
                    ? "read"
                    : "unread"
                }`}
                onClick={() =>
                  handleNotificationClick(
                    notification
                  )
                }
              >
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
                    {formatTime(
                      notification.createdAt
                    )}
                  </span>
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      type="button"
                      className="text-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        markAsRead(
                          notification._id
                        );
                      }}
                    >
                      Mark as read
                    </button>
                  )}

                  <button
                    type="button"
                    className="text-button delete-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteNotification(
                        notification._id
                      );
                    }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

export default AdminNotifications;