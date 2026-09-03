import { useEffect, useState } from "react";

import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiEdit3,
  FiArrowRight,
} from "react-icons/fi";

import AdminLayout from "../components/AdminLayout";

import "../AdminDashboard.css";

function AdminDashboard() {
  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    pendingArticles: 0,
    pendingQuizzes: 0,
    approved: 0,
    rejected: 0,
  });

  const [recentArticles, setRecentArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD USER + DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }

    fetchDashboardData();
  }, []);

  // ==========================================
  // FETCH ADMIN DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();

      if (data.success) {
        setStats({
          pendingArticles: data.pendingArticles || 0,
          pendingQuizzes: data.pendingQuizzes || 0,
          approved: data.approved || 0,
          rejected: data.rejected || 0,
        });

        setRecentArticles(data.recentArticles || []);
      }
    } catch (error) {
      console.error("Dashboard error:", error);

      // Keep dashboard usable if Admin API
      // is not implemented yet.
      setStats({
        pendingArticles: 0,
        pendingQuizzes: 0,
        approved: 0,
        rejected: 0,
      });

      setRecentArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REVIEW ARTICLE
  // ==========================================

const handleReview = (articleId) => {
  window.location.href = `/admin/review/article/${articleId}`;
};

  // ==========================================
  // DASHBOARD UI
  // ==========================================

  return (
    <AdminLayout>
      <div className="admin-dashboard">

        {/* ================================
            HEADER
        ================================= */}

        <div className="admin-dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>

            <p>
              Welcome back, {user?.name || "Admin"}. Here's what's
              happening with your content.
            </p>
          </div>
        </div>

        {/* ================================
            STATISTICS
        ================================= */}

        <div className="admin-stats-grid">

          {/* Pending Articles */}

          <div className="admin-stat-card">
            <div className="admin-stat-icon pending">
              <FiClock />
            </div>

            <div className="admin-stat-content">
              <span>Pending Articles</span>

              <h2>
                {loading ? "—" : stats.pendingArticles}
              </h2>

              <small>Waiting for review</small>
            </div>
          </div>

          {/* Pending Quizzes */}

          <div className="admin-stat-card">
            <div className="admin-stat-icon quiz">
              <FiFileText />
            </div>

            <div className="admin-stat-content">
              <span>Pending Quizzes</span>

              <h2>
                {loading ? "—" : stats.pendingQuizzes}
              </h2>

              <small>Waiting for review</small>
            </div>
          </div>

          {/* Approved */}

          <div className="admin-stat-card">
            <div className="admin-stat-icon approved">
              <FiCheckCircle />
            </div>

            <div className="admin-stat-content">
              <span>Approved</span>

              <h2>
                {loading ? "—" : stats.approved}
              </h2>

              <small>Published content</small>
            </div>
          </div>

          {/* Rejected */}

          <div className="admin-stat-card">
            <div className="admin-stat-icon rejected">
              <FiXCircle />
            </div>

            <div className="admin-stat-content">
              <span>Rejected</span>

              <h2>
                {loading ? "—" : stats.rejected}
              </h2>

              <small>Rejected content</small>
            </div>
          </div>

        </div>

        {/* ================================
            MAIN CONTENT
        ================================= */}

        <div className="admin-dashboard-content">

          {/* ================================
              REVIEW QUEUE
          ================================= */}

          <div className="admin-panel">

            <div className="admin-panel-header">

              <div>
                <h2>Content Pending Review</h2>

                <p>
                  Review submitted articles and quizzes.
                </p>
              </div>

              <button
                className="view-all-button"
                onClick={() =>
                  (window.location.href = "/admin/review")
                }
              >
                View All

                <FiArrowRight />
              </button>

            </div>

            <div className="admin-review-list">

              {loading ? (

                <div className="admin-empty-state">
                  <p>Loading content...</p>
                </div>

              ) : recentArticles.length === 0 ? (

                <div className="admin-empty-state">

                  <FiCheckCircle />

                  <h3>
                    No content waiting for review
                  </h3>

                  <p>
                    You're all caught up! New submissions will
                    appear here.
                  </p>

                </div>

              ) : (

                recentArticles.map((article) => (

                  <div
                    className="admin-review-item"
                    key={article._id}
                  >

                    <div className="review-item-icon">
                      <FiFileText />
                    </div>

                    <div className="review-item-info">

                      <h3>
                        {article.title || "Untitled Article"}
                      </h3>

                      <p>
                        Submitted by{" "}
                        <strong>
                          {article.author?.name ||
                            article.authorName ||
                            "Unknown Author"}
                        </strong>
                      </p>

                      <span>
                        {article.createdAt
                          ? new Date(
                              article.createdAt
                            ).toLocaleDateString()
                          : "Recently submitted"}
                      </span>

                    </div>

                    <div className="review-item-status">
                      <span className="pending-status">
                        Pending Review
                      </span>
                    </div>

                    <button
                      className="review-button"
                      onClick={() =>
                        handleReview(article._id)
                      }
                    >
                      <FiEdit3 />
                      Review
                    </button>

                  </div>

                ))

              )}

            </div>

          </div>

          {/* ================================
              QUICK ACTIONS
          ================================= */}

          <div className="admin-panel quick-actions-panel">

            <div className="admin-panel-header">

              <div>
                <h2>Quick Actions</h2>

                <p>
                  Manage content from here.
                </p>
              </div>

            </div>

            <div className="quick-actions">

              {/* Review Articles */}

              <button
                className="quick-action"
                onClick={() =>
                  (window.location.href = "/admin/review")
                }
              >

                <div className="quick-action-icon">
                  <FiFileText />
                </div>

                <div>
                  <strong>Review Articles</strong>

                  <span>
                    Review submitted articles
                  </span>
                </div>

                <FiArrowRight />

              </button>

              {/* Review Quizzes */}

              <button
                className="quick-action"
                onClick={() =>
                  (window.location.href = "/admin/review")
                }
              >

                <div className="quick-action-icon">
                  <FiCheckCircle />
                </div>

                <div>
                  <strong>Review Quizzes</strong>

                  <span>
                    Review submitted quizzes
                  </span>
                </div>

                <FiArrowRight />

              </button>

            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;

