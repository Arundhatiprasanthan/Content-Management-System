import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";

const MAX_CHAR_COUNT = 1500;

export default function CommentForm({
  currentUser,
  initialValue = "",
  placeholder = "Join the discussion... Share your thoughts, questions, or perspectives.",
  buttonText = "Post Comment",
  onSubmit,
  onCancel,
  isSubmitting = false,
  autoFocus = false,
  isInline = false
}) {
  const [content, setContent] = useState(initialValue);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [autoFocus]);

  // Auto-resize textarea as user types
  const handleInput = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_CHAR_COUNT) {
      setContent(val);
    }
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 250)}px`;
  };

  const handleKeyDown = (e) => {
    // Ctrl+Enter or Cmd+Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;

    await onSubmit(trimmed);
    if (!initialValue) {
      setContent("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
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

  const charLeft = MAX_CHAR_COUNT - content.length;
  const isWarning = charLeft < 150;

  return (
    <form
      className={isInline ? "inline-comment-form" : "comment-form-card"}
      onSubmit={handleSubmit}
    >
      {!isInline && (
        <div className="comment-form-header">
          <div
            className={`comment-user-avatar ${currentUser?.role ? currentUser.role.toLowerCase() : "reader"}`}
          >
            {getInitials(currentUser?.name)}
          </div>
          <div className="comment-user-meta">
            <span className="comment-user-name">
              {currentUser?.name || "Anonymous Reader"}
            </span>
            <span
              className={`role-badge ${currentUser?.role ? currentUser.role.toLowerCase() : "reader"}`}
            >
              {currentUser?.role || "Reader"}
            </span>
          </div>
        </div>
      )}

      <textarea
        ref={textareaRef}
        className="comment-textarea"
        placeholder={placeholder}
        value={content}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
        rows={isInline ? 2 : 3}
      />

      <div className="comment-form-footer">
        <div className="form-hint">
          <span className={`char-counter ${isWarning ? "warning" : ""}`}>
            {content.length}/{MAX_CHAR_COUNT}
          </span>
          <span>• ⌘+Enter to send</span>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={!content.trim() || isSubmitting}
          >
            <FiSend size={14} />
            <span>{isSubmitting ? "Submitting..." : buttonText}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
