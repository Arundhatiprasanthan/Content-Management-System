import { FiBell, FiBookOpen, FiSearch, FiUser, FiPenTool, FiLogOut, FiLogIn, FiCheck, FiTrash2, FiMessageCircle, FiEdit3, FiHelpCircle } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [chatUnreadCount, setChatUnreadCount] = useState(0);

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
    setUnreadCount(0);

    navigate("/login");
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) { setUnreadCount(0); return;}

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
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Fetch unread chat messages
const fetchChatUnreadCount = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setChatUnreadCount(0);
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/chat/unread-count",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      setChatUnreadCount(data.unreadCount || 0);
    }
  } catch (error) {
    console.error(
      "Failed to fetch chat unread count:",
      error
    );
  }
};

  // Fetch notifications when user logs in
  useEffect(() => {
  if (user) {
    fetchNotifications();
    fetchChatUnreadCount();
  } else {
    setNotifications([]);
    setUnreadCount(0);
    setChatUnreadCount(0);
  }
}, [user]);

  // LISTEN FOR NOTIFICATION UPDATES
  useEffect(() => {
    const handleNotificationUpdate = () => {
      if (user) {
        fetchNotifications();
      }
    };

    window.addEventListener(
      "notificationsUpdated",
      handleNotificationUpdate
    );

    return () => {
      window.removeEventListener(
        "notificationsUpdated",
        handleNotificationUpdate
      );
    };
  }, [user]);

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

      <Link to="/home" className="logo" style={{ textDecoration: "none", color: "inherit" }}>
        <div className="logo-icon-box">
          <FiBookOpen />
        </div>

        <h2>Lumen</h2>
</Link>

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
          <FiBookOpen />
          <span>Browse</span>
        </NavLink>

        {/* Search */}
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `navigation-button ${isActive ? "active" : ""}`
          }
        >
          <FiSearch />
          <span>Search</span>
        </NavLink>

        {/* Chat */}
        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `navigation-button ${isActive ? "active" : ""}`
          }
        >
          <FiMessageCircle />
          <span>Chat</span>
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
=======
        <NavLink
          to="/quiz"
          className={({ isActive }) =>
            `navigation-button ${isActive ? "active" : ""}`
          }
        >
          <FiHelpCircle />
          <span>Quizzes</span>
        </NavLink>

        <NavLink
          to="/author/article"
          className={({ isActive }) =>
            `navigation-button ${isActive ? "active" : ""}`
          }
        >
          <FiEdit3 />
          <span>Write</span>
        </NavLink>
>>>>>>> Stashed changes

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
          to="/author/article"
          className={({ isActive }) =>
            `navigation-button ${isActive ? "active" : ""}`
          }
        >
          <FiEdit3 />
          <span>Write</span>
        </NavLink>

        <NavLink
          to="/home"
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
            >
              <button
                className="notification-button"
                onClick={() =>
                  navigate("/notifications")
                }
                aria-label="Notifications"
                title="Notifications"
              >
                <FiBell />

                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
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

