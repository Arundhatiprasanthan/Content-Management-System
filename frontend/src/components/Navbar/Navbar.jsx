import { useEffect, useRef, useState } from "react";
import {
  FiBell,
  FiBookOpen,
  FiSearch,
  FiUser,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

function Navbar() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);

  // Fetch Reader notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No authentication token found");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setNotifications(response.data.data || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mark one notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      setUnreadCount((previousCount) =>
        previousCount > 0 ? previousCount - 1 : 0
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error.response?.data || error.message
      );
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        "http://localhost:5000/api/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error.response?.data || error.message
      );
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const deletedNotification = notifications.find(
        (notification) => notification._id === notificationId
      );

      setNotifications((previousNotifications) =>
        previousNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );

      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount((previousCount) =>
          previousCount > 0 ? previousCount - 1 : 0
        );
      }
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error.response?.data || error.message
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const notificationDate = new Date(date);
    const now = new Date();

    const difference = Math.floor(
      (now - notificationDate) / (1000 * 60 * 60 * 24)
    );

    if (difference === 0) {
      return "Today";
    }

    if (difference === 1) {
      return "Yesterday";
    }

    if (difference < 7) {
      return `${difference} days ago`;
    }

    return notificationDate.toLocaleDateString();
  };

  return (
    <div className="navbar-container">
      <div className="logo">
        <div className="logo-icon-box">
          <FiBookOpen />
        </div>
        <h2>Lumen</h2>
      </div>

      <div className="navigation-link">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `navigation-button ${isActive ? "active" : ""}`
          }
        >
          <LuLayoutDashboard />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/browse"
          className={({ isActive }) =>
            `navigation-button ${isActive ? "active" : ""}`
          }
        >
          <FiSearch />
          <span>Browse</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `navigation-button ${isActive ? "active" : ""}`
          }
        >
          <FiUser />
          <span>Profile</span>
        </NavLink>
      </div>

      <div className="user-info">
        <span>Lena Kaufmann(Reader)</span>

        {/* Notification */}
        <div className="notification-wrapper" ref={notificationRef}>
          <button
            className="notification-button"
            onClick={() => setShowNotifications((previous) => !previous)}
            aria-label="Notifications"
          >
            <FiBell />

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <div>
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <span>
                      {unreadCount} unread{" "}
                      {unreadCount === 1 ? "notification" : "notifications"}
                    </span>
                  )}
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

              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="no-notifications">
                    <FiBell />
                    <p>No notifications</p>
                    <span>You're all caught up!</span>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      className={`notification-item ${
                        !notification.read ? "unread" : ""
                      }`}
                      key={notification._id}
                    >
                      <div className="notification-content">
                        <div className="notification-title-row">
                          {!notification.read && (
                            <span className="unread-dot"></span>
                          )}

                          <h4>{notification.title}</h4>
                        </div>

                        <p>{notification.message}</p>

                        <span className="notification-date">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>

                      <div className="notification-actions">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            title="Mark as read"
                          >
                            <FiCheck />
                          </button>
                        )}

                        <button
                          onClick={() =>
                            deleteNotification(notification._id)
                          }
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="user-avatar">LK</div>
      </div>
    </div>
  );
}

export default Navbar;
