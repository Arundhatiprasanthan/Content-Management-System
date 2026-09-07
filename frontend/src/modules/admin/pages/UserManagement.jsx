import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  MoreVertical,
  UserCheck,
  UserX,
  X,
  AlertCircle,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import "./UserManagement.css";
import AdminLayout from "../components/AdminLayout";

function UserManagement() {
  // DUMMY DATA
  // Later this will come from API

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Aarav Patel",
      email: "aarav.patel@example.com",
      role: "Reader",
      status: "Active",
      joined: "Aug 12, 2026",
      articles: 12,
      quizzes: 8,
    },
    {
      id: 2,
      name: "Priya Shah",
      email: "priya.shah@example.com",
      role: "Author",
      status: "Active",
      joined: "Aug 10, 2026",
      articles: 24,
      quizzes: 15,
    },
    {
      id: 3,
      name: "Rahul Mehta",
      email: "rahul.mehta@example.com",
      role: "Reader",
      status: "Blocked",
      joined: "Jul 28, 2026",
      articles: 5,
      quizzes: 3,
    },
    {
      id: 4,
      name: "Ananya Desai",
      email: "ananya.desai@example.com",
      role: "Admin",
      status: "Active",
      joined: "Jul 22, 2026",
      articles: 31,
      quizzes: 19,
    },
    {
      id: 5,
      name: "Rohan Joshi",
      email: "rohan.joshi@example.com",
      role: "Reader",
      status: "Active",
      joined: "Jul 15, 2026",
      articles: 9,
      quizzes: 6,
    },
    {
      id: 6,
      name: "Neha Verma",
      email: "neha.verma@example.com",
      role: "Author",
      status: "Blocked",
      joined: "Jul 08, 2026",
      articles: 18,
      quizzes: 11,
    },
  ]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionUser, setActionUser] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchMatch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const roleMatch = roleFilter === "All Roles" || user.role === roleFilter;
      const statusMatch =
        statusFilter === "All Status" || user.status === statusFilter;
      return searchMatch && roleMatch && statusMatch;
    });
  }, [users, search, roleFilter, statusFilter]);

  const confirmStatusChange = () => {
    if (!actionUser) return;
    const newStatus = actionUser.status === "Active" ? "Blocked" : "Active";
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === actionUser.id ? { ...user, status: newStatus } : user,
      ),
    );
    setActionUser(null);
    setShowActionMenu(null);
  };

  const handleRetry = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("All Roles");
    setStatusFilter("All Status");
  };

  if (loading) {
    return (
      <div className="user-management">
        <div className="user-loading">
          <RefreshCw className="loading-icon" size={28} />
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-management">
        <div className="user-error">
          <AlertCircle size={36} />
          <h3>Something went wrong</h3>
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
      <div className="user-management">
        <div className="user-page-header">
          <div>
            <h1>User Management</h1>
            <p>Manage Lumen users, account status and permissions.</p>
          </div>
          <div className="user-count">
            <span>{users.length}</span>
            <small>Total Users</small>
          </div>
        </div>
        <div className="user-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="clear-search" onClick={() => setSearch("")}>
                <X size={15} />
              </button>
            )}
          </div>
          <div className="filter-area">
            <div className="filter-label">
              <Filter size={16} />
              <span>Filter</span>
            </div>
            <div className="select-wrapper">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option>All Roles</option>
                <option>Reader</option>
                <option>Author</option>
                <option>Admin</option>
              </select>
              <ChevronDown size={15} />
            </div>
            <div className="select-wrapper">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Blocked</option>
              </select>
              <ChevronDown size={15} />
            </div>
            {(search ||
              roleFilter !== "All Roles" ||
              statusFilter !== "All Status") && (
              <button className="clear-filter-btn" onClick={clearFilters}>
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="results-info">
          Showing <strong>{filteredUsers.length}</strong> of{" "}
          <strong>{users.length}</strong> users
        </div>
        <div className="user-table-container">
          {filteredUsers.length === 0 ? (
            <div className="empty-users">
              <Search size={35} />
              <h3>No users found</h3>
              <p>Try changing your search or filter options.</p>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Activity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">{user.name.charAt(0)}</div>
                        <div>
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="role-badge">{user.role}</span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${user.status.toLowerCase()}`}
                      >
                        <span className="status-dot"></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="joined-date">{user.joined}</td>
                    <td>
                      <div className="activity-info">
                        <span>{user.articles} articles</span>
                        <span>{user.quizzes} quizzes</span>
                      </div>
                    </td>
                    <td>
                      <div className="action-wrapper">
                        <button
                          className="view-btn"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          className="more-btn"
                          onClick={() =>
                            setShowActionMenu(
                              showActionMenu === user.id ? null : user.id,
                            )
                          }
                        >
                          <MoreVertical size={18} />
                        </button>
                        {showActionMenu === user.id && (
                          <div className="action-menu">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowActionMenu(null);
                              }}
                            >
                              <Eye size={15} />
                              View Details
                            </button>
                            <button
                              className={
                                user.status === "Active"
                                  ? "danger-action"
                                  : "success-action"
                              }
                              onClick={() => {
                                setActionUser(user);
                                setShowActionMenu(null);
                              }}
                            >
                              {user.status === "Active" ? (
                                <>
                                  <UserX size={15} />
                                  Block User
                                </>
                              ) : (
                                <>
                                  <UserCheck size={15} />
                                  Unblock User
                                </>
                              )}
                            </button>
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
        {selectedUser && (
          <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
            <div className="user-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2>User Details</h2>
                  <p>Complete user information</p>
                </div>
                <button
                  className="modal-close"
                  onClick={() => setSelectedUser(null)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="modal-user-profile">
                <div className="large-avatar">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3>{selectedUser.name}</h3>
                  <p>{selectedUser.email}</p>
                  <span
                    className={`status-badge ${selectedUser.status.toLowerCase()}`}
                  >
                    <span className="status-dot"></span>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
              <div className="user-details-grid">
                <div className="detail-item">
                  <span>Role</span>
                  <strong>{selectedUser.role}</strong>
                </div>
                <div className="detail-item">
                  <span>Joined</span>
                  <strong>{selectedUser.joined}</strong>
                </div>
                <div className="detail-item">
                  <span>Articles</span>
                  <strong>{selectedUser.articles}</strong>
                </div>
                <div className="detail-item">
                  <span>Quizzes</span>
                  <strong>{selectedUser.quizzes}</strong>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="secondary-btn"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
                <button
                  className={
                    selectedUser.status === "Active"
                      ? "block-btn"
                      : "unblock-btn"
                  }
                  onClick={() => {
                    setActionUser(selectedUser);
                    setSelectedUser(null);
                  }}
                >
                  {selectedUser.status === "Active" ? (
                    <>
                      <UserX size={16} />
                      Block User
                    </>
                  ) : (
                    <>
                      <UserCheck size={16} />
                      Unblock User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {actionUser && (
          <div className="modal-overlay">
            <div className="confirmation-modal">
              <div
                className={`confirmation-icon ${
                  actionUser.status === "Active" ? "block-icon" : "unblock-icon"
                }`}
              >
                {actionUser.status === "Active" ? (
                  <UserX size={25} />
                ) : (
                  <UserCheck size={25} />
                )}
              </div>
              <h2>
                {actionUser.status === "Active"
                  ? "Block User?"
                  : "Unblock User?"}
              </h2>
              <p>
                Are you sure you want to{" "}
                {actionUser.status === "Active" ? "block" : "unblock"}{" "}
                <strong>{actionUser.name}</strong>?
              </p>
              <div className="confirmation-actions">
                <button
                  className="secondary-btn"
                  onClick={() => setActionUser(null)}
                >
                  Cancel
                </button>
                <button
                  className={
                    actionUser.status === "Active" ? "block-btn" : "unblock-btn"
                  }
                  onClick={confirmStatusChange}
                >
                  {actionUser.status === "Active"
                    ? "Yes, Block User"
                    : "Yes, Unblock User"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default UserManagement;
