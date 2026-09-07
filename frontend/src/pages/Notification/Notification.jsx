import { useEffect, useState } from "react";
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiHeart,
  FiAlertCircle,
  FiFileText,
  FiClock,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import "./Notification.css";
import Navbar from "../../components/Navbar/Navbar";

function Notification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view notifications.");
        return;
      }
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data || []);
        setUnreadCount(data.unreadCount || 0);
      } else {
        throw new Error(data.message || "Failed to load notifications");
      }
    } catch (error) {
      console.error("Notification error:", error);
      setError(
        error.message || "Something went wrong while loading notifications.",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  // MARK ONE AS READ
  const markAsRead = async (notificationId) => {
    try {
      setActionLoading(notificationId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification,
        ),
      );
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error(error);
      setError("Failed to mark notification as read.");
    } finally {
      setActionLoading(null);
    }
  };

  // MARK ALL AS READ
  const markAllAsRead = async () => {
    try {
      setActionLoading("all");
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/notifications/read-all",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        })),
      );
      setUnreadCount(0);
    } catch (error) {
      console.error(error);
      setError("Failed to mark all notifications as read.");
    } finally {
      setActionLoading(null);
    }
  };

  // DELETE NOTIFICATION
  const deleteNotification = async (notificationId) => {
    try {
      setActionLoading(notificationId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }
      const deletedNotification = notifications.find(
        (notification) => notification._id === notificationId,
      );
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId),
      );
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
      }
    } catch (error) {
      console.error(error);
      setError("Failed to delete notification.");
    } finally {
      setActionLoading(null);
    }
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "";
    const notificationDate = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - notificationDate) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) {
      const weeks = Math.floor(diff / 7);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }
    return notificationDate.toLocaleDateString();
  };

  // NOTIFICATION ICON
  const getNotificationIcon = (notification) => {
    const type = notification.type?.toLowerCase();
    switch (type) {
      case "approved":
      case "success":
        return <FiCheckCircle />;
      case "rejected":
      case "error":
        return <FiXCircle />;
      case "liked":
      case "like":
        return <FiHeart />;
      case "revision":
      case "changes":
      case "review":
        return <FiRefreshCw />;
      case "article":
      case "published":
        return <FiFileText />;
      case "warning":
        return <FiAlertCircle />;
      default:
        return <FiBell />;
    }
  };

  // NOTIFICATION TYPE CLASS
  const getNotificationType = (notification) => {
    const type = notification.type?.toLowerCase();
    if (type === "approved" || type === "success" || type === "published") {
      return "success";
    }
    if (type === "rejected" || type === "error") {
      return "error";
    }
    if (type === "liked" || type === "like") {
      return "like";
    }
    if (type === "revision" || type === "changes" || type === "review") {
      return "revision";
    }
    return "default";
  };

  // NOTIFICATION CLICK

  const handleNotificationClick = async (notification) => {
    // Mark unread notification as read
    if (!notification.read) {
      await markAsRead(notification._id);
    }

    // If backend provides navigation URL
    if (notification.link) {
      navigate(notification.link);
      return;
    }

    if (notification.articleId) {
      navigate(`/article/${notification.articleId}`);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="notification-page">
          <div className="notification-container">
            <div className="notification-page-header">
              <div>
                <h1>Notifications</h1>
                <p>Loading notifications...</p>
              </div>
            </div>
            <div className="notification-loading">
              <div className="loading-spinner">
                <FiRefreshCw />
              </div>
              <p>Loading notifications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="notification-page">
        <div className="notification-container">
          <div className="notification-page-header">
            <div>
              <h1>Notifications</h1>
              <p>
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You're all caught up"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={markAllAsRead}
                disabled={actionLoading === "all"}
              >
                <FiCheck />
                {actionLoading === "all" ? "Marking..." : "Mark all read"}
              </button>
            )}
          </div>
          {error && (
            <div className="notification-error">
              <FiAlertCircle />
              <span>{error}</span>
              <button onClick={fetchNotifications}>Try Again</button>
            </div>
          )}
          {!error && notifications.length === 0 && (
            <div className="notification-empty">
              <div className="empty-icon">
                <FiBell />
              </div>
              <h2>No notifications</h2>
              <p>
                You're all caught up!
                <br />
                New notifications will appear here.
              </p>
            </div>
          )}
          {notifications.length > 0 && (
            <div className="notification-page-list">
              {notifications.map((notification) => {
                const type = getNotificationType(notification);
                const isActionLoading = actionLoading === notification._id;
                return (
                  <div
                    key={notification._id}
                    className={`notification-card ${
                      !notification.read ? "notification-unread" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className={`notification-icon ${type}`}>
                      {getNotificationIcon(notification)}
                    </div>
                    <div className="notification-card-content">
                      <div className="notification-card-title">
                        <h3>{notification.title}</h3>
                        {!notification.read && (
                          <span className="notification-unread-dot"></span>
                        )}
                      </div>
                      <p>{notification.message}</p>
                      <span className="notification-card-date">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    <div
                      className="notification-card-actions"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {!notification.read && (
                        <button
                          title="Mark as read"
                          disabled={isActionLoading}
                          onClick={() => markAsRead(notification._id)}
                        >
                          <FiCheck />
                        </button>
                      )}
                      <button
                        title="Delete"
                        disabled={isActionLoading}
                        onClick={() => deleteNotification(notification._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notification;
