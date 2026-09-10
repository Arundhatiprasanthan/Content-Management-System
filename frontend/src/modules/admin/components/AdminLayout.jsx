import Navbar from "../../../components/Navbar/Navbar";
import AdminNavbar from "./AdminNavbar";

function AdminLayout({ children }) {
  return (
    <div>
      <Navbar />
      <AdminNavbar />
      <div>{children}</div>
    </div>
  );
}

export default AdminLayout;