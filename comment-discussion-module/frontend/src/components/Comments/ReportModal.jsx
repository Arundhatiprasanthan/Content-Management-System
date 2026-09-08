import { useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

const REPORT_REASONS = [
  {
    id: "Spam",
    title: "Spam or Commercial Promotion",
    desc: "Unsolicited advertising, repetitive promotional links, or bot activity."
  },
  {
    id: "Harassment",
    title: "Harassment or Hate Speech",
    desc: "Targeted attacks, discriminatory language, insults, or threats."
  },
  {
    id: "Inappropriate Content",
    title: "Inappropriate or Explicit Content",
    desc: "Graphic, violent, sexually explicit, or inappropriate material."
  },
  {
    id: "Misinformation",
    title: "Misinformation or False Facts",
    desc: "Verifiably false claims presented as authoritative truth."
  },
  {
    id: "Other",
    title: "Other Community Guideline Violation",
    desc: "Other issues that breach respectful discussion guidelines."
  }
];

export default function ReportModal({
  isOpen,
  comment,
  onClose,
  onSubmitReport,
  isReporting = false
}) {
  const [selectedReason, setSelectedReason] = useState("Spam");
  const [details, setDetails] = useState("");

  if (!isOpen || !comment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReason || isReporting) return;
    await onSubmitReport(selectedReason, details);
  };

  const truncatedQuote =
    comment.content?.length > 120
      ? `${comment.content.slice(0, 120)}...`
      : comment.content;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
      >
        <div className="modal-header">
          <h3 id="report-modal-title">
            <FiAlertTriangle color="#c17f3c" />
            <span>Report Comment</span>
          </h3>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isReporting}
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="report-preview-quote">"{truncatedQuote}"</div>

          <p
            style={{
              fontSize: "13px",
              color: "#7a6f62",
              margin: "0 0 12px 0",
              fontWeight: 500
            }}
          >
            Why are you reporting this comment?
          </p>

          <div className="report-options-group">
            {REPORT_REASONS.map((r) => (
              <label
                key={r.id}
                className={`report-radio-option ${
                  selectedReason === r.id ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={r.id}
                  checked={selectedReason === r.id}
                  onChange={() => setSelectedReason(r.id)}
                  disabled={isReporting}
                />
                <div>
                  <span className="radio-label-title">{r.title}</span>
                  <span className="radio-label-desc">{r.desc}</span>
                </div>
              </label>
            ))}
          </div>

          <label
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#1c1714",
              display: "block",
              marginBottom: "6px"
            }}
          >
            Additional context (optional):
          </label>
          <textarea
            className="report-details-textarea"
            placeholder="Help our moderation team understand the issue..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            disabled={isReporting}
            maxLength={500}
          />

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isReporting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isReporting}
              style={{ backgroundColor: "#c17f3c", borderColor: "#c17f3c" }}
            >
              <FiAlertTriangle size={14} />
              <span>{isReporting ? "Reporting..." : "Submit Report"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
