import { NavLink } from "react-router-dom";
import { UserRound } from "lucide-react";
import "./AdminNavbar.css";
function AdminNavbar() {
  return (
    <header className="admin-navbar">
      <div className="admin-navbar-inner">
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
            to="/admin/users"
            className={({ isActive }) =>
              isActive ? "admin-nav-link active" : "admin-nav-link"
            }
          >
            <span className="nav-icon">
              <UserRound size={18} strokeWidth={2} />
            </span>
            <span>User Management</span>
          </NavLink>
          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              isActive ? "admin-nav-link active" : "admin-nav-link"
            }
          >
            <span className="nav-icon">⚑</span>
            <span>Reports</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default AdminNavbar;