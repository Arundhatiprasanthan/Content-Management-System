import { useEffect, useRef, useState } from "react";

import {
  FiBell,
  FiBookOpen,
  FiSearch,
  FiUser,
  FiPenTool,
  FiLogOut,
  FiLogIn,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";

import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);

  // Get logged-in user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setShowMenu(false);
    setShowNotifications(false);

    navigate("/login");
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setNotifications(data.data || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Fetch notifications when user logs in
  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Close notification dropdown when clicking outside
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

      await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        "http://localhost:5000/api/notifications/read-all",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `http://localhost:5000/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const deleted = notifications.find(
        (notification) => notification._id === notificationId
      );

      setNotifications((prev) =>
        prev.filter(
          (notification) => notification._id !== notificationId
        )
      );

      if (deleted && !deleted.read) {
        setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  // Format notification date
  const formatDate = (date) => {
    if (!date) return "";

    const notificationDate = new Date(date);
    const now = new Date();

    const diff = Math.floor(
      (now - notificationDate) / (1000 * 60 * 60 * 24)
    );

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;

    return notificationDate.toLocaleDateString();
  };

  const isLoggedIn = !!user;

  const currentRole = user?.role || "Guest";

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : "G";

  return (
    <div className="navbar-container">

      {/* Logo */}
      <div
        className="logo"
        onClick={() => navigate("/home")}
        style={{ cursor: "pointer" }}
      >
        <div className="logo-icon-box">
          <FiBookOpen />
        </div>

        <h2>Lumen</h2>
      </div>

      {/* Navigation */}
      <div className="navigation-link">

        {/* Home */}
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `navigation-button ${isActive ? "active" : ""}`
          }
        >
          <LuLayoutDashboard />
          <span>Home</span>
        </NavLink>

        {/* Browse */}
        <NavLink
          to="/browse"
          className={({ isActive }) =>
            `navigation-button ${isActive ? "active" : ""}`
          }
        >
          <FiSearch />
          <span>Browse</span>
        </NavLink>

        {/* AUTHOR → WRITE */}
        {currentRole === "Author" && (
          <NavLink
            to="/author/article"
            className={({ isActive }) =>
              `navigation-button ${isActive ? "active" : ""}`
            }
          >
            <FiPenTool />
            <span>Write</span>
          </NavLink>
        )}

        {/* ADMIN → ADMIN */}
        {currentRole === "Admin" && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `navigation-button ${isActive ? "active" : ""}`
            }
          >
            <LuLayoutDashboard />
            <span>Admin</span>
          </NavLink>
        )}

        {/* Profile */}
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

      {/* User section */}
      <div className="user-info">

        {isLoggedIn ? (
          <>
            {/* User name and role */}
            <div
              className="user-identity"
              onClick={() => setShowMenu(!showMenu)}
            >
              <span className="user-display-name">
                {user?.name}
              </span>

              <span className="user-role-tag">
                ({currentRole})
              </span>
            </div>

            {/* Notifications */}
            <div
              className="notification-wrapper"
              ref={notificationRef}
            >
              <button
                className="notification-button"
                onClick={() =>
                  setShowNotifications((prev) => !prev)
                }
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

                  {/* Notification header */}
                  <div className="notification-header">
                    <div>
                      <h3>Notifications</h3>

                      {unreadCount > 0 && (
                        <span>
                          {unreadCount} unread{" "}
                          {unreadCount === 1
                            ? "notification"
                            : "notifications"}
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

                  {/* Notification list */}
                  <div className="notification-list">

                    {notifications.length === 0 ? (
                      <div className="no-notifications">
                        <FiBell />

                        <p>No notifications</p>

                        <span>
                          You're all caught up!
                        </span>
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
                              {formatDate(
                                notification.createdAt
                              )}
                            </span>
                          </div>

                          <div className="notification-actions">

                            {/* Mark as read */}
                            {!notification.read && (
                              <button
                                onClick={() =>
                                  markAsRead(
                                    notification._id
                                  )
                                }
                                title="Mark as read"
                              >
                                <FiCheck />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() =>
                                deleteNotification(
                                  notification._id
                                )
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

            {/* User avatar */}
            <div
              className="user-avatar"
              onClick={() => setShowMenu(!showMenu)}
              title="Account Menu"
            >
              {userInitials}
            </div>

            {/* User dropdown */}
            {showMenu && (
              <div className="navbar-dropdown-menu">

                <div className="dropdown-user-header">
                  <strong>{user?.name}</strong>

                  <small>
                    {user?.email || `${currentRole} Account`}
                  </small>
                </div>

                <hr />

                {/* View Profile */}
                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowMenu(false);
                  }}
                >
                  <FiUser />
                  View Profile
                </button>

                {/* AUTHOR → Article Editor */}
                {currentRole === "Author" && (
                  <button
                    onClick={() => {
                      navigate("/author/article");
                      setShowMenu(false);
                    }}
                  >
                    <FiPenTool />
                    Article Editor
                  </button>
                )}

                {/* ADMIN → Admin Dashboard */}
                {currentRole === "Admin" && (
                  <button
                    onClick={() => {
                      navigate("/admin/dashboard");
                      setShowMenu(false);
                    }}
                  >
                    <LuLayoutDashboard />
                    Admin Dashboard
                  </button>
                )}

                <hr />

                {/* Logout */}
                <button
                  className="dropdown-logout-btn"
                  onClick={handleLogout}
                >
                  <FiLogOut />
                  Logout
                </button>

              </div>
            )}
          </>
        ) : (
          /* Login / Register */
          <button
            className="navbar-login-btn"
            onClick={() => navigate("/login")}
          >
            <FiLogIn />
            Login / Register
          </button>
        )}

      </div>
    </div>
  );
}

export default Navbar;

