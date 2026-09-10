import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  MoreVertical,
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  ChevronDown,
  FileWarning,
} from "lucide-react";
import "./Reports.css";
import AdminLayout from "../components/AdminLayout";

function Reports() {
  // DUMMY REPORT DATA
  // Replace with API data later

  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Misleading information in article",
      type: "Article",
      reportedBy: "Aarav Patel",
      target: "How AI Is Changing Healthcare",
      reason: "Misleading Information",
      description:
        "The article contains information that appears to be inaccurate and could mislead readers.",
      status: "Pending",
      date: "Sep 5, 2026",
    },
    {
      id: 2,
      title: "Inappropriate content",
      type: "Article",
      reportedBy: "Priya Shah",
      target: "Future of Technology",
      reason: "Inappropriate Content",
      description:
        "Some sections of the article contain content that may not be appropriate for the platform.",
      status: "Under Review",
      date: "Sep 4, 2026",
    },
    {
      id: 3,
      title: "Copyright violation",
      type: "Article",
      reportedBy: "Rahul Mehta",
      target: "Understanding Modern Science",
      reason: "Copyright",
      description:
        "The reporter believes that parts of this article were copied from another source.",
      status: "Resolved",
      date: "Sep 2, 2026",
    },
    {
      id: 4,
      title: "Spam article",
      type: "Article",
      reportedBy: "Neha Verma",
      target: "Amazing Investment Opportunity",
      reason: "Spam",
      description:
        "The content appears to be promotional spam rather than educational content.",
      status: "Dismissed",
      date: "Aug 30, 2026",
    },
    {
      id: 5,
      title: "Incorrect author information",
      type: "Profile",
      reportedBy: "Rohan Joshi",
      target: "Ananya Desai",
      reason: "False Information",
      description:
        "The profile contains information that the reporter believes is incorrect.",
      status: "Pending",
      date: "Aug 29, 2026",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionReport, setActionReport] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchText = search.toLowerCase();
      const searchMatch =
        report.title.toLowerCase().includes(searchText) ||
        report.reportedBy.toLowerCase().includes(searchText) ||
        report.target.toLowerCase().includes(searchText) ||
        report.reason.toLowerCase().includes(searchText);
      const statusMatch =
        statusFilter === "All Status" || report.status === statusFilter;
      const typeMatch =
        typeFilter === "All Types" || report.type === typeFilter;
      return searchMatch && statusMatch && typeMatch;
    });
  }, [reports, search, statusFilter, typeFilter]);

  const openActionConfirmation = (report, type) => {
    setActionReport(report);
    setActionType(type);
    setShowMenu(null);
  };

  const confirmAction = () => {
    if (!actionReport || !actionType) return;
    let newStatus;
    if (actionType === "review") {
      newStatus = "Under Review";
    }
    if (actionType === "resolve") {
      newStatus = "Resolved";
    }
    if (actionType === "dismiss") {
      newStatus = "Dismissed";
    }
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === actionReport.id
          ? { ...report, status: newStatus }
          : report,
      ),
    );
    setActionReport(null);
    setActionType(null);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setTypeFilter("All Types");
  };

  const handleRetry = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="reports-page">
        <div className="reports-loading">
          <RefreshCw className="loading-icon" size={28} />
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-page">
        <div className="reports-error">
          <AlertTriangle size={38} />
          <h3>Unable to load reports</h3>
          <p>{error}</p>
          <button onClick={handleRetry}>
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="reports-page">
        <div className="reports-header">
          <div>
            <h1>Reports</h1>
            <p>Review and manage reports submitted by Lumen users.</p>
          </div>
          <div className="report-summary">
            <div>
              <strong>{reports.length}</strong>
              <span>Total Reports</span>
            </div>
            <div>
              <strong>
                {reports.filter((report) => report.status === "Pending").length}
              </strong>
              <span>Pending</span>
            </div>
          </div>
        </div>
        <div className="reports-toolbar">
          <div className="report-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="clear-search">
                <X size={15} />
              </button>
            )}
          </div>
          <div className="report-filters">
            <div className="filter-label">
              <Filter size={16} />
              <span>Filter</span>
            </div>
            <div className="report-select">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Under Review</option>
                <option>Resolved</option>
                <option>Dismissed</option>
              </select>
              <ChevronDown size={15} />
            </div>
            <div className="report-select">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option>All Types</option>
                <option>Article</option>
                <option>Profile</option>
              </select>
              <ChevronDown size={15} />
            </div>
            {(search ||
              statusFilter !== "All Status" ||
              typeFilter !== "All Types") && (
              <button className="clear-filters" onClick={clearFilters}>
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="reports-result">
          Showing <strong>{filteredReports.length}</strong> of{" "}
          <strong>{reports.length}</strong> reports
        </div>
        <div className="reports-table-container">
          {filteredReports.length === 0 ? (
            <div className="empty-reports">
              <FileWarning size={38} />
              <h3>No reports found</h3>
              <p>Try changing your search or filter options.</p>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Reported By</th>
                  <th>Target</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <div className="report-title">
                        <div className="report-icon">
                          <FileWarning size={18} />
                        </div>
                        <div>
                          <strong>{report.title}</strong>
                          <span>{report.type}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="reporter-name">{report.reportedBy}</span>
                    </td>
                    <td>
                      <span className="target-name">{report.target}</span>
                    </td>
                    <td>
                      <span className="reason-badge">{report.reason}</span>
                    </td>
                    <td>
                      <span
                        className={`report-status ${report.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        <span className="status-dot"></span>
                        {report.status}
                      </span>
                    </td>
                    <td className="report-date">{report.date}</td>
                    <td>
                      <div className="report-actions">
                        <button
                          className="view-report"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          className="more-report"
                          onClick={() =>
                            setShowMenu(
                              showMenu === report.id ? null : report.id,
                            )
                          }
                        >
                          <MoreVertical size={18} />
                        </button>
                        {showMenu === report.id && (
                          <div className="report-action-menu">
                            <button
                              onClick={() => {
                                setSelectedReport(report);
                                setShowMenu(null);
                              }}
                            >
                              <Eye size={15} />
                              View Details
                            </button>
                            {report.status !== "Under Review" &&
                              report.status !== "Resolved" &&
                              report.status !== "Dismissed" && (
                                <button
                                  onClick={() =>
                                    openActionConfirmation(report, "review")
                                  }
                                >
                                  <Clock size={15} />
                                  Start Review
                                </button>
                              )}
                            {report.status !== "Resolved" &&
                              report.status !== "Dismissed" && (
                                <button
                                  className="resolve-action"
                                  onClick={() =>
                                    openActionConfirmation(report, "resolve")
                                  }
                                >
                                  <CheckCircle size={15} />
                                  Resolve
                                </button>
                              )}
                            {report.status !== "Dismissed" &&
                              report.status !== "Resolved" && (
                                <button
                                  className="dismiss-action"
                                  onClick={() =>
                                    openActionConfirmation(report, "dismiss")
                                  }
                                >
                                  <XCircle size={15} />
                                  Dismiss
                                </button>
                              )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {selectedReport && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedReport(null)}
          >
            <div className="report-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2>Report Details</h2>
                  <p>Review submitted report</p>
                </div>
                <button
                  className="modal-close"
                  onClick={() => setSelectedReport(null)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="report-detail-content">
                <div className="detail-title-area">
                  <div className="large-report-icon">
                    <FileWarning size={25} />
                  </div>
                  <div>
                    <h3>{selectedReport.title}</h3>
                    <span
                      className={`report-status ${selectedReport.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      <span className="status-dot"></span>
                      {selectedReport.status}
                    </span>
                  </div>
                </div>
                <div className="detail-section">
                  <h4>Report Information</h4>
                  <div className="detail-grid">
                    <div>
                      <span>Reported By</span>
                      <strong>{selectedReport.reportedBy}</strong>
                    </div>
                    <div>
                      <span>Report Type</span>
                      <strong>{selectedReport.type}</strong>
                    </div>
                    <div>
                      <span>Target</span>
                      <strong>{selectedReport.target}</strong>
                    </div>
                    <div>
                      <span>Reason</span>
                      <strong>{selectedReport.reason}</strong>
                    </div>
                    <div>
                      <span>Date</span>
                      <strong>{selectedReport.date}</strong>
                    </div>
                  </div>
                </div>
                <div className="detail-section">
                  <h4>Description</h4>
                  <div className="report-description">
                    {selectedReport.description}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="secondary-btn"
                  onClick={() => setSelectedReport(null)}
                >
                  Close
                </button>
                {selectedReport.status !== "Resolved" &&
                  selectedReport.status !== "Dismissed" && (
                    <>
                      <button
                        className="dismiss-btn"
                        onClick={() => {
                          openActionConfirmation(selectedReport, "dismiss");
                          setSelectedReport(null);
                        }}
                      >
                        <XCircle size={16} />
                        Dismiss
                      </button>
                      <button
                        className="resolve-btn"
                        onClick={() => {
                          openActionConfirmation(selectedReport, "resolve");
                          setSelectedReport(null);
                        }}
                      >
                        <CheckCircle size={16} />
                        Resolve
                      </button>
                    </>
                  )}
              </div>
            </div>
          </div>
        )}
        {actionReport && (
          <div className="modal-overlay">
            <div className="confirmation-modal">
              <div className={`confirmation-icon ${actionType}`}>
                {actionType === "resolve" && <CheckCircle size={27} />}
                {actionType === "dismiss" && <XCircle size={27} />}
                {actionType === "review" && <Clock size={27} />}
              </div>
              <h2>
                {actionType === "resolve" && "Resolve Report?"}
                {actionType === "dismiss" && "Dismiss Report?"}
                {actionType === "review" && "Start Review?"}
              </h2>
              <p>
                {actionType === "resolve" &&
                  "Are you sure you want to mark this report as resolved?"}
                {actionType === "dismiss" &&
                  "Are you sure you want to dismiss this report?"}
                {actionType === "review" &&
                  "This report will be moved to the review state."}
              </p>
              <div className="confirmation-actions">
                <button
                  className="secondary-btn"
                  onClick={() => {
                    setActionReport(null);
                    setActionType(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className={
                    actionType === "dismiss" ? "dismiss-btn" : "resolve-btn"
                  }
                  onClick={confirmAction}
                >
                  {actionType === "resolve" && "Yes, Resolve"}
                  {actionType === "dismiss" && "Yes, Dismiss"}
                  {actionType === "review" && "Start Review"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default Reports;
