import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function ArticleReview() {
  const { articleId } = useParams();
  const navigate = useNavigate();

  const [action, setAction] = useState(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("Pending Review");

  const article = {
    id: articleId,
    title: "The Future of Artificial Intelligence",
    description:
      "Exploring how artificial intelligence is changing the way we work and live.",
    author: "John Doe",
    category: "Technology",
    readingTime: "5 min read",
    date: "August 27, 2026",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    content: `
Artificial Intelligence is becoming an important part of modern technology.

AI systems are being used in healthcare, education, finance, transportation, and many other industries.

As technology continues to develop, artificial intelligence has the potential to change the way people work and interact with technology.

However, responsible development and proper management are important to ensure that AI is used safely and effectively.
    `,
  };

  const handleAction = (selectedAction) => {
    setAction(selectedAction);
  };

  const submitAction = () => {
    if (!action) return;

    if (
      (action === "Request Changes" || action === "Reject") &&
      comment.trim() === ""
    ) {
      alert("Please provide a comment.");
      return;
    }

    if (action === "Approve") {
      setStatus("Published");
    }

    if (action === "Request Changes") {
      setStatus("Changes Requested");
    }

    if (action === "Reject") {
      setStatus("Rejected");
    }

    setAction(null);
    setComment("");
  };

  return (
    <div className="admin-page">

      <button
        className="back-button"
        onClick={() => navigate("/admin/review")}
      >
        ← Back to Review Queue
      </button>

      {/* Article Header */}

      <div className="article-review-header">

        <div>

          <div className="review-article-top">

            <span className="article-category">
              {article.category}
            </span>

            <span className="article-status">
              {status}
            </span>

          </div>

          <h1>{article.title}</h1>

          <p>{article.description}</p>

        </div>

      </div>

      {/* Article Metadata */}

      <div className="article-review-meta">

        <span>Author: {article.author}</span>

        <span>{article.readingTime}</span>

        <span>{article.date}</span>

      </div>

      {/* Article Image */}

      <div className="article-review-image">

        <img
          src={article.image}
          alt={article.title}
        />

      </div>

      {/* Article Content */}

      <div className="article-content">

        {article.content}

      </div>

      {/* Review Actions */}

      <div className="review-actions">

        <h2>Review Article</h2>

        <div className="review-action-buttons">

          <button
            className="approve-button"
            onClick={() => handleAction("Approve")}
          >
            Approve
          </button>

          <button
            className="changes-button"
            onClick={() => handleAction("Request Changes")}
          >
            Request Changes
          </button>

          <button
            className="reject-button"
            onClick={() => handleAction("Reject")}
          >
            Reject
          </button>

        </div>

      </div>

      {/* Action Form */}

      {action && (
        <div className="review-action-form">

          <h3>{action}</h3>

          {action === "Approve" ? (
            <p>
              Are you sure you want to approve this article?
              It will become published.
            </p>
          ) : (
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                action === "Reject"
                  ? "Enter rejection reason..."
                  : "Enter changes required..."
              }
              rows="5"
            />
          )}

          <div className="review-form-buttons">

            <button
              onClick={() => {
                setAction(null);
                setComment("");
              }}
              className="cancel-button"
            >
              Cancel
            </button>

            <button
              onClick={submitAction}
              className="confirm-button"
            >
              Confirm {action}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default ArticleReview;