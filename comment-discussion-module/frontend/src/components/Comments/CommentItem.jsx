import { useState } from "react";
import {
  FiThumbsUp,
  FiCornerDownRight,
  FiEdit2,
  FiTrash2,
  FiFlag,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import CommentForm from "./CommentForm";

// Format ISO date into relative readable time
const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "Just now";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
  });
};

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export default function CommentItem({
  comment,
  currentUser,
  depth = 0,
  onReply,
  onEdit,
  onDelete,
  onToggleLike,
  onOpenReport
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const authorName = comment.userId?.name || "Anonymous";
  const authorRole = comment.userId?.role || "Reader";
  const replies = comment.replies || [];
  const hasReplies = replies.length > 0;

  // Handle Edit Submission
  const handleEditSubmit = async (newContent) => {
    setIsActionLoading(true);
    try {
      await onEdit(comment._id, newContent);
      setIsEditing(false);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle Reply Submission
  const handleReplySubmit = async (replyContent) => {
    setIsActionLoading(true);
    try {
      await onReply(comment._id, replyContent);
      setIsReplying(false);
      setShowReplies(true);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteClick = async () => {
    const confirmMessage = hasReplies
      ? "This comment has replies. Deleting it will mark it as [Deleted] while preserving replies. Proceed?"
      : "Are you sure you want to delete this comment?";

    if (window.confirm(confirmMessage)) {
      setIsActionLoading(true);
      try {
        await onDelete(comment._id);
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  return (
    <div
      className={`comment-card ${comment.isDeleted ? "is-deleted" : ""}`}
      id={`comment-${comment._id}`}
    >
      {/* Header with commenter details and role */}
      <div className="comment-card-header">
        <div className="commenter-info">
          <div className={`comment-user-avatar ${authorRole.toLowerCase()}`}>
            {getInitials(authorName)}
          </div>
          <div className="commenter-details">
            <span className="commenter-name">{authorName}</span>
            <span className={`role-badge ${authorRole.toLowerCase()}`}>
              {authorRole}
            </span>
            <span className="comment-timestamp">
              {formatTimeAgo(comment.createdAt)}
            </span>
            {comment.isEdited && !comment.isDeleted && (
              <span className="edited-tag">(edited)</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Comment Body / Inline Edit Mode */}
      {isEditing ? (
        <div className="inline-edit-box">
          <CommentForm
            currentUser={currentUser}
            initialValue={comment.content}
            buttonText="Save Changes"
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditing(false)}
            isSubmitting={isActionLoading}
            autoFocus={true}
            isInline={true}
          />
        </div>
      ) : (
        <div
          className={`comment-content ${comment.isDeleted ? "deleted" : ""}`}
        >
          {comment.content}
        </div>
      )}

      {/* Action Toolbar (Like, Reply, Edit, Delete, Report) */}
      {!comment.isDeleted && (
        <div className="comment-actions-bar">
          <div className="action-buttons-group">
            {/* Like / Upvote Button */}
            <button
              className={`comment-action-btn ${comment.isLiked ? "liked" : ""}`}
              onClick={() => onToggleLike(comment._id)}
              title={comment.isLiked ? "Unlike comment" : "Like comment"}
            >
              <FiThumbsUp size={14} />
              <span>{comment.likesCount || 0}</span>
            </button>

            {/* Reply Button */}
            <button
              className="comment-action-btn"
              onClick={() => setIsReplying(!isReplying)}
              title="Reply to comment"
            >
              <FiCornerDownRight size={14} />
              <span>Reply</span>
            </button>

            {/* Edit Button (Only visible if authorized) */}
            {comment.canEdit && !isEditing && (
              <button
                className="comment-action-btn"
                onClick={() => setIsEditing(true)}
                title="Edit your comment"
              >
                <FiEdit2 size={14} />
                <span>Edit</span>
              </button>
            )}

            {/* Delete Button (Only visible if authorized) */}
            {comment.canDelete && (
              <button
                className="comment-action-btn danger"
                onClick={handleDeleteClick}
                disabled={isActionLoading}
                title="Delete comment"
              >
                <FiTrash2 size={14} />
                <span>Delete</span>
              </button>
            )}
          </div>

          <div className="action-buttons-group">
            {/* Report Button */}
            <button
              className="comment-action-btn"
              onClick={() => onOpenReport(comment)}
              title="Report inappropriate content"
            >
              <FiFlag size={13} />
              <span>Report</span>
            </button>
          </div>
        </div>
      )}

      {/* Inline Reply Input Box */}
      {isReplying && (
        <div className="inline-reply-container">
          <div className="reply-target-tag">
            <FiCornerDownRight size={12} />
            <span>Replying to {authorName}</span>
          </div>
          <CommentForm
            currentUser={currentUser}
            placeholder={`Write a reply to ${authorName}...`}
            buttonText="Post Reply"
            onSubmit={handleReplySubmit}
            onCancel={() => setIsReplying(false)}
            isSubmitting={isActionLoading}
            autoFocus={true}
            isInline={true}
          />
        </div>
      )}

      {/* Collapsible Nested Replies Thread */}
      {hasReplies && (
        <div>
          <button
            className="toggle-replies-btn"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? (
              <>
                <FiChevronUp size={14} />
                <span>
                  Hide {replies.length}{" "}
                  {replies.length === 1 ? "reply" : "replies"}
                </span>
              </>
            ) : (
              <>
                <FiChevronDown size={14} />
                <span>
                  Show {replies.length}{" "}
                  {replies.length === 1 ? "reply" : "replies"}
                </span>
              </>
            )}
          </button>

          {showReplies && (
            <div className="nested-replies-container">
              {replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  currentUser={currentUser}
                  depth={depth + 1}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleLike={onToggleLike}
                  onOpenReport={onOpenReport}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
