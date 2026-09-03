import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";
import "./ArticleReview.css";

function ArticleReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showChangesBox, setShowChangesBox] = useState(false);
  const [changeMessage, setChangeMessage] = useState("");

  // ==========================================
  // FETCH ARTICLE
  // ==========================================

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!id) {
        console.error("Article ID is missing");
        setArticle(null);
        return;
      }

      console.log("Fetching article:", id);

      const response = await fetch(
        `http://localhost:5000/api/admin/articles/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Article response status:",
        response.status
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      if (response.status === 403) {
        navigate("/home");
        return;
      }

      const data = await response.json();

      console.log("Article response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch article"
        );
      }

      if (data.success) {
        setArticle(data.article || data.data);
      } else {
        setArticle(null);
      }
    } catch (error) {
      console.error(
        "Failed to fetch article:",
        error
      );

      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // APPROVE / REJECT
  // ==========================================

  const handleAction = async (action) => {
    if (action === "request-changes") {
      setShowChangesBox(true);
      return;
    }

    const actionMessage =
      action === "approve"
        ? "Are you sure you want to approve and publish this article?"
        : "Are you sure you want to reject this article?";

    const confirmed = window.confirm(actionMessage);

    if (!confirmed) {
      return;
    }

    try {
      setProcessing(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/articles/${id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Action response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Action failed"
        );
      }

      alert(
        data.message ||
          "Action completed successfully."
      );

      navigate("/admin/review");
    } catch (error) {
      console.error(
        "Admin action error:",
        error
      );

      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  // ==========================================
  // REQUEST CHANGES
  // ==========================================

  const requestChanges = async () => {
    if (!changeMessage.trim()) {
      alert("Please enter the changes required.");
      return;
    }

    try {
      setProcessing(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/articles/${id}/request-changes`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: changeMessage.trim(),
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Request changes response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to request changes"
        );
      }

      alert(
        data.message ||
          "Changes requested successfully."
      );

      navigate("/admin/review");
    } catch (error) {
      console.error(
        "Request changes error:",
        error
      );

      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page">
          <div className="dashboard-empty">
            <h3>Loading article...</h3>

            <p>
              Please wait while the article is loaded.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ==========================================
  // ARTICLE NOT FOUND
  // ==========================================

  if (!article) {
    return (
      <AdminLayout>
        <div className="admin-page">
          <div className="dashboard-empty">
            <h3>Article not found</h3>

            <p>
              The article could not be loaded.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/review")
              }
            >
              Back to Review Queue
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ==========================================
  // ARTICLE REVIEW PAGE
  // ==========================================

  return (
    <AdminLayout>
      <div className="admin-page">

        {/* PAGE HEADING */}

        <section className="page-heading">
          <div>

            <button
              type="button"
              className="back-button"
              onClick={() =>
                navigate("/admin/review")
              }
            >
              ← Back to Review Queue
            </button>

            <h1>{article.title}</h1>

            <p>
              Review the article before publishing it.
            </p>

          </div>
        </section>

        {/* REVIEW CONTENT */}

        <section className="article-review-container">

          {/* ARTICLE */}

          <div className="article-review-main">

            {/* COVER IMAGE */}

            {article.coverImage && (
              <img
                src={article.coverImage}
                alt={article.title}
                className="article-review-image"
              />
            )}

            <div className="article-review-body">

              {/* ARTICLE META */}

              <div className="article-review-meta">

                <span>
                  Category:{" "}
                  {article.category ||
                    "Uncategorized"}
                </span>

                <span>
                  Author:{" "}
                  {article.author?.name ||
                    article.authorId?.name ||
                    article.authorName ||
                    "Unknown"}
                </span>

                {article.submittedAt && (
                  <span>
                    Submitted:{" "}
                    {new Date(
                      article.submittedAt
                    ).toLocaleDateString()}
                  </span>
                )}

              </div>

              {/* TITLE */}

              <h2>{article.title}</h2>

              {/* DESCRIPTION */}

              {article.description && (
                <p className="article-excerpt">
                  {article.description}
                </p>
              )}

              {/* CONTENT */}

              <div className="article-content">
                {article.content}
              </div>

            </div>
          </div>

          {/* ADMIN ACTIONS */}

          <aside className="article-review-actions">

            <h2>Review Article</h2>

            <p>
              Choose an action for this submission.
            </p>

            {/* APPROVE */}

            <button
              type="button"
              className="approve-button"
              disabled={processing}
              onClick={() =>
                handleAction("approve")
              }
            >
              {processing
                ? "Processing..."
                : "✓ Approve & Publish"}
            </button>

            {/* REQUEST CHANGES */}

            <button
              type="button"
              className="changes-button"
              disabled={processing}
              onClick={() =>
                handleAction("request-changes")
              }
            >
              ↻ Request Changes
            </button>

            {/* REJECT */}

            <button
              type="button"
              className="reject-button"
              disabled={processing}
              onClick={() =>
                handleAction("reject")
              }
            >
              × Reject
            </button>

            {/* CHANGES BOX */}

            {showChangesBox && (
              <div className="changes-box">

                <label>
                  Changes required
                </label>

                <textarea
                  value={changeMessage}
                  onChange={(e) =>
                    setChangeMessage(
                      e.target.value
                    )
                  }
                  placeholder="Explain what the author needs to change..."
                  rows={5}
                  disabled={processing}
                />

                <div className="changes-box-actions">

                  <button
                    type="button"
                    onClick={() => {
                      setShowChangesBox(false);
                      setChangeMessage("");
                    }}
                    disabled={processing}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={requestChanges}
                    disabled={processing}
                  >
                    {processing
                      ? "Sending..."
                      : "Send Request"}
                  </button>

                </div>

              </div>
            )}

          </aside>

        </section>

      </div>
    </AdminLayout>
  );
}

export default ArticleReview;