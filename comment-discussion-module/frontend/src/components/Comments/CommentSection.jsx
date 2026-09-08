import { useState, useEffect, useCallback } from "react";
import {
  FiMessageSquare,
  FiAlertCircle,
  FiCheckCircle,
  FiUserCheck
} from "react-icons/fi";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import ReportModal from "./ReportModal";
import {
  fetchComments,
  postComment,
  postReply,
  updateComment,
  deleteComment,
  toggleLikeComment,
  reportComment,
  getActiveUser,
  setActiveUser,
  PRESET_USERS
} from "../../services/commentApi";
import "./Comments.css";

export default function CommentSection({ articleId = "1" }) {
  const [comments, setComments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Active user simulation for local evaluation and permission testing
  const [currentUser, setCurrentUserState] = useState(getActiveUser());

  // Report modal state
  const [reportModalState, setReportModalState] = useState({
    isOpen: false,
    comment: null,
    isSubmitting: false
  });

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Switch simulated role/user
  const handleUserSwitch = (userKey) => {
    const user = PRESET_USERS[userKey];
    if (user) {
      setActiveUser(user);
      setCurrentUserState(user);
      showToast(`Switched active user to ${user.name} (${user.role})`);
    }
  };

  // Reload comments helper after actions
  const reloadComments = useCallback(async () => {
    try {
      const response = await fetchComments(articleId, sortBy);
      if (response && response.success) {
        setComments(response.data || []);
        setTotalCount(response.totalComments || 0);
      }
    } catch (err) {
      console.error("Failed reloading comments:", err);
    }
  }, [articleId, sortBy]);

  // Initial load effect
  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const response = await fetchComments(articleId, sortBy);
        if (!ignore && response && response.success) {
          setComments(response.data || []);
          setTotalCount(response.totalComments || 0);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed loading comments:", err);
          setError("Unable to load discussion. Please check your connection and try again.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, [articleId, sortBy, currentUser]);

  // Handle new top-level comment
  const handleNewComment = async (content) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await postComment(articleId, content);
      showToast("Comment published successfully!");
      await reloadComments();
    } catch (err) {
      console.error("Error posting comment:", err);
      setError(err.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reply
  const handleReply = async (parentCommentId, content) => {
    try {
      await postReply(parentCommentId, content, articleId);
      showToast("Reply published successfully!");
      await reloadComments();
    } catch (err) {
      console.error("Error posting reply:", err);
      showToast(err.message || "Failed to post reply");
    }
  };

  // Handle edit
  const handleEdit = async (commentId, content) => {
    try {
      await updateComment(commentId, content, articleId);
      showToast("Comment updated successfully!");
      await reloadComments();
    } catch (err) {
      console.error("Error updating comment:", err);
      showToast(err.message || "Failed to update comment");
    }
  };

  // Handle delete
  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId, articleId);
      showToast("Comment deleted successfully");
      await reloadComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
      showToast(err.message || "Failed to delete comment");
    }
  };

  // Handle like toggle
  const handleToggleLike = async (commentId) => {
    try {
      await toggleLikeComment(commentId, articleId);
      await reloadComments();
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  // Open report modal
  const handleOpenReport = (comment) => {
    setReportModalState({
      isOpen: true,
      comment,
      isSubmitting: false
    });
  };

  // Submit report
  const handleSubmitReport = async (reason, details) => {
    if (!reportModalState.comment) return;
    setReportModalState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await reportComment(
        reportModalState.comment._id,
        reason,
        details,
        articleId
      );
      setReportModalState({ isOpen: false, comment: null, isSubmitting: false });
      showToast("Thank you. This comment has been reported for moderation.");
      await reloadComments();
    } catch (err) {
      console.error("Error reporting comment:", err);
      showToast(err.message || "Failed to report comment");
      setReportModalState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <section className="discussion-wrapper" aria-labelledby="discussion-heading">
      {/* Discussion Header */}
      <div className="discussion-header">
        <div className="discussion-title-group">
          <h2 id="discussion-heading" className="discussion-title">
            <FiMessageSquare />
            <span>Discussion</span>
          </h2>
          <span className="discussion-count-badge" aria-label={`${totalCount} comments`}>
            {totalCount}
          </span>
        </div>

        {/* Sort Controls */}
        <div className="discussion-controls">
          <span className="sort-select-label">Sort by:</span>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            disabled={isLoading}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most_liked">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Role & User Switcher for local evaluation and permission testing */}
      <div className="user-simulator-bar">
        <span className="simulator-label">
          <FiUserCheck style={{ verticalAlign: "middle", marginRight: "4px" }} />
          Active Account:
        </span>
        <div className="simulator-pills">
          <button
            type="button"
            className={`simulator-pill ${
              currentUser._id === PRESET_USERS.reader._id ? "active" : ""
            }`}
            onClick={() => handleUserSwitch("reader")}
          >
            <span>{PRESET_USERS.reader.name}</span>
            <span className="pill-role-badge">Reader</span>
          </button>

          <button
            type="button"
            className={`simulator-pill ${
              currentUser._id === PRESET_USERS.author._id ? "active" : ""
            }`}
            onClick={() => handleUserSwitch("author")}
          >
            <span>{PRESET_USERS.author.name}</span>
            <span className="pill-role-badge">Author</span>
          </button>

          <button
            type="button"
            className={`simulator-pill ${
              currentUser._id === PRESET_USERS.admin._id ? "active" : ""
            }`}
            onClick={() => handleUserSwitch("admin")}
          >
            <span>{PRESET_USERS.admin.name}</span>
            <span className="pill-role-badge">Admin</span>
          </button>
        </div>
      </div>

      {/* Error Banner with Retry */}
      {error && (
        <div className="discussion-error-banner" role="alert">
          <div className="error-banner-content">
            <FiAlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button className="error-retry-btn" onClick={reloadComments}>
            Retry
          </button>
        </div>
      )}

      {/* Primary Comment Input Box */}
      <CommentForm
        currentUser={currentUser}
        buttonText="Post Comment"
        onSubmit={handleNewComment}
        isSubmitting={isSubmitting}
      />

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="discussion-skeleton-list">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton-comment-card">
              <div className="skeleton-header">
                <div className="skeleton-avatar" />
                <div className="skeleton-name" />
              </div>
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        /* Empty State */
        <div className="discussion-empty-state">
          <div className="empty-state-icon">
            <FiMessageSquare />
          </div>
          <h3>No comments yet</h3>
          <p>Be the first to share your thoughts, insights, or questions about this article!</p>
        </div>
      ) : (
        /* Threaded Comments List */
        <div className="comment-list">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUser={currentUser}
              depth={0}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleLike={handleToggleLike}
              onOpenReport={handleOpenReport}
            />
          ))}
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalState.isOpen}
        comment={reportModalState.comment}
        onClose={() =>
          setReportModalState({ isOpen: false, comment: null, isSubmitting: false })
        }
        onSubmitReport={handleSubmitReport}
        isReporting={reportModalState.isSubmitting}
      />

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div className="discussion-toast" role="status">
          <FiCheckCircle size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
