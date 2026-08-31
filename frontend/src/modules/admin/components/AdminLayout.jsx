import AdminNavbar from "./AdminNavbar";
import "../admin.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminNavbar />

      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;