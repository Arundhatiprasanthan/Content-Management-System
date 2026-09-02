import { useState, useEffect } from "react";
import { FiBell, FiBookOpen, FiSearch, FiUser, FiPenTool, FiLogOut, FiLogIn } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

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

  const isLoggedIn = !!user;
  const currentRole = user?.role || "Guest";
  const isAuthorOrAdmin = currentRole === "Author" || currentRole === "Admin";
  const userInitials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "G";

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

            <FiBell className="notification-bell" />

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
