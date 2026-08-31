import AdminLayout from "../components/AdminLayout";

function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="admin-page">

        <section className="page-heading">
          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Review and manage submitted content.
            </p>
          </div>
        </section>

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">
            <div className="stat-icon pending-icon">
              ◉
            </div>

            <div className="stat-content">
              <span className="stat-number">0</span>
              <span className="stat-label">
                Pending Review
              </span>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon changes-icon">
              ↻
            </div>

            <div className="stat-content">
              <span className="stat-number">0</span>
              <span className="stat-label">
                Changes Requested
              </span>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon published-icon">
              ✓
            </div>

            <div className="stat-content">
              <span className="stat-number">0</span>
              <span className="stat-label">
                Published
              </span>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon rejected-icon">
              ×
            </div>

            <div className="stat-content">
              <span className="stat-number">0</span>
              <span className="stat-label">
                Rejected
              </span>
            </div>
          </div>

        </section>

        <section className="dashboard-section">

          <div className="section-header">
            <div>
              <h2>Review Queue</h2>
              <p>
                Articles waiting for administrator review.
              </p>
            </div>

            <span className="section-count">
              0
            </span>
          </div>

          <div className="dashboard-empty">

            <div className="empty-icon">
              ◇
            </div>

            <h3>
              No articles pending review
            </h3>

            <p>
              Submitted articles will appear here for review.
            </p>

          </div>

        </section>

      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;