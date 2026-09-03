import Navbar from "../../../components/Navbar/Navbar";

function AdminLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
    </div>
  );
}

export default AdminLayout;