import { NavLink } from "react-router-dom";

function AdminNavbar() {
  return (
    <header className="admin-navbar">
      <div className="admin-navbar-inner">

        <NavLink
          to="/admin/dashboard"
          className="admin-brand"
        >
          Lumen
        </NavLink>

        <nav className="admin-nav">

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? "admin-nav-link active" : "admin-nav-link"
            }
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/review"
            className={({ isActive }) =>
              isActive || window.location.pathname.startsWith("/admin/review/")
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
          >
            <span className="nav-icon">◉</span>
            <span>Review Queue</span>
          </NavLink>

          <NavLink
            to="/admin/content"
            className={({ isActive }) =>
              isActive ? "admin-nav-link active" : "admin-nav-link"
            }
          >
            <span className="nav-icon">▤</span>
            <span>Content Management</span>
          </NavLink>

          <NavLink
            to="/admin/notifications"
            className={({ isActive }) =>
              isActive ? "admin-nav-link active" : "admin-nav-link"
            }
          >
            <span className="nav-icon">♧</span>
            <span>Notifications</span>
          </NavLink>

          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              isActive ? "admin-nav-link active" : "admin-nav-link"
            }
          >
            <span className="nav-icon">○</span>
            <span>Profile</span>
          </NavLink>

        </nav>

        <div className="admin-navbar-user">
          <div className="admin-user-avatar">
            A
          </div>

          <div className="admin-user-details">
            <span className="admin-user-name">
              Admin
            </span>

            <span className="admin-user-role">
              Administrator
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}

export default AdminNavbar;