import { Link, useLocation } from "react-router-dom";

function AdminSidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="admin-sidebar">

      <div className="admin-logo">
        <h2>Lumen</h2>
      </div>

      <nav className="admin-nav">

        <Link
          to="/admin/dashboard"
          className={isActive("/admin/dashboard") ? "active" : ""}
        >
          Dashboard
        </Link>

        <Link
          to="/admin/review"
          className={
            location.pathname.startsWith("/admin/review")
              ? "active"
              : ""
          }
        >
          Review Queue
        </Link>

        <Link
          to="/admin/content"
          className={isActive("/admin/content") ? "active" : ""}
        >
          Content Management
        </Link>

        <Link
          to="/admin/notifications"
          className={isActive("/admin/notifications") ? "active" : ""}
        >
          Notifications
        </Link>

        <Link
          to="/admin/profile"
          className={isActive("/admin/profile") ? "active" : ""}
        >
          Profile
        </Link>

      </nav>

    </aside>
  );
}

export default AdminSidebar;