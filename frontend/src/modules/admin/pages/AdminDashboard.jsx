import AdminLayout from "../components/AdminLayout";
import StatusBadge from "../components/StatusBadge";

function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="dashboard-page">

        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Review and manage submitted content.</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="dashboard-stats">

          <div className="dashboard-stat-card pending">
            <div className="stat-icon">◷</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Pending Review</div>
          </div>

          <div className="dashboard-stat-card changes">
            <div className="stat-icon">↻</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Changes Requested</div>
          </div>

          <div className="dashboard-stat-card published">
            <div className="stat-icon">✓</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Published</div>
          </div>

          <div className="dashboard-stat-card rejected">
            <div className="stat-icon">×</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Rejected</div>
          </div>

        </div>

        {/* Review Queue */}
        <section className="dashboard-review-section">

          <div className="section-heading">
            <h2>Review Queue</h2>
            <span className="queue-count">0</span>
          </div>

          <div className="review-queue-box">

            <div className="empty-review">

              <div className="empty-icon">
                ▧
              </div>

              <h3>No articles pending review</h3>

              <p>
                Submitted articles will appear here for review.
              </p>

            </div>

          </div>

        </section>

      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;