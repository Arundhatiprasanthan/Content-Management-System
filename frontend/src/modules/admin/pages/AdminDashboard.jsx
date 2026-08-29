import AdminLayout from "../components/AdminLayout";
import StatusBadge from "../components/StatusBadge";

function AdminDashboard() {
  return (
    <AdminLayout>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Review and manage submitted content.</p>

        <div>
          <div>
            <h2>Pending Review</h2>
            <p>0</p>
          </div>

          <div>
            <h2>Changes Requested</h2>
            <p>0</p>
          </div>

          <div>
            <h2>Published</h2>
            <p>0</p>
          </div>

          <div>
            <h2>Rejected</h2>
            <p>0</p>
          </div>
        </div>

        <section>
          <h2>Review Queue</h2>

          <div>
            <p>No articles pending review.</p>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;