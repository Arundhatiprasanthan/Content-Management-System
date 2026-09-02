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
  FiTrash2
} from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowMenu(false);
    navigate("/login");
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setNotifications(response.data.data || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

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

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {}
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "http://localhost:5000/api/notifications/read-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {}
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/notifications/${notificationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const deleted = notifications.find((n) => n._id === notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      if (deleted && !deleted.read) {
        setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
      }
    } catch (error) {}
  };

  const formatDate = (date) => {
    if (!date) return "";
    const nDate = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - nDate) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    return nDate.toLocaleDateString();
  };

  const isLoggedIn = !!user;
  const currentRole = user?.role || "Guest";
  const isAuthorOrAdmin = currentRole === "Author" || currentRole === "Admin";
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "G";

  return (
    <div className="navbar-container">
      <div className="logo" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
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

        {isAuthorOrAdmin && (
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
        {isLoggedIn ? (
          <>
            <div className="user-identity" onClick={() => setShowMenu(!showMenu)}>
              <span className="user-display-name">{user?.name}</span>
              <span className="user-role-tag">({currentRole})</span>
            </div>

            {/* Notification Bell */}
            <div className="notification-wrapper" ref={notificationRef}>
              <button
                className="notification-button"
                onClick={() => setShowNotifications((prev) => !prev)}
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
                      <button className="mark-all-button" onClick={markAllAsRead}>
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
                      notifications.map((n) => (
                        <div
                          className={`notification-item ${!n.read ? "unread" : ""}`}
                          key={n._id}
                        >
                          <div className="notification-content">
                            <div className="notification-title-row">
                              {!n.read && <span className="unread-dot"></span>}
                              <h4>{n.title}</h4>
                            </div>
                            <p>{n.message}</p>
                            <span className="notification-date">
                              {formatDate(n.createdAt)}
                            </span>
                          </div>

                          <div className="notification-actions">
                            {!n.read && (
                              <button
                                onClick={() => markAsRead(n._id)}
                                title="Mark as read"
                              >
                                <FiCheck />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(n._id)}
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

            <div
              className="user-avatar"
              onClick={() => setShowMenu(!showMenu)}
              title="Account Menu"
            >
              {userInitials}
            </div>

            {showMenu && (
              <div className="navbar-dropdown-menu">
                <div className="dropdown-user-header">
                  <strong>{user?.name}</strong>
                  <small>{user?.email || `${currentRole} Account`}</small>
                </div>
                <hr />
                <button onClick={() => { navigate("/profile"); setShowMenu(false); }}>
                  <FiUser /> View Profile
                </button>
                {isAuthorOrAdmin && (
                  <button onClick={() => { navigate("/author/article"); setShowMenu(false); }}>
                    <FiPenTool /> Article Editor
                  </button>
                )}
                <button onClick={() => { navigate("/login"); setShowMenu(false); }}>
                  <FiLogIn /> Switch Account
                </button>
                <hr />
                <button className="dropdown-logout-btn" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <button className="navbar-login-btn" onClick={() => navigate("/login")}>
            <FiLogIn /> Login / Register
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
