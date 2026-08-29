import { useState } from "react";

function AdminProfile() {
  const [name, setName] = useState("Admin User");
  const [email] = useState("admin@lumen.com");
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    alert("Profile updated successfully.");
  };

  return (
    <div className="admin-page">

      <div className="admin-page-header">
        <h1>Admin Profile</h1>
        <p>View and manage your administrator profile.</p>
      </div>

      <div className="admin-profile-card">

        <div className="admin-profile-avatar">
          {name.charAt(0).toUpperCase()}
        </div>

        <div className="admin-profile-info">

          <h2>{name}</h2>

          <span className="admin-role-badge">
            Administrator
          </span>

        </div>

      </div>

      <div className="admin-profile-form">

        <h2>Profile Information</h2>

        <div className="profile-field">
          <label>Name</label>

          <input
            type="text"
            value={name}
            disabled={!editing}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="profile-field">
          <label>Email</label>

          <input
            type="email"
            value={email}
            disabled
          />
        </div>

        <div className="profile-field">
          <label>Role</label>

          <input
            type="text"
            value="Administrator"
            disabled
          />
        </div>

        <div className="profile-actions">

          {!editing ? (
            <button
              className="edit-profile-button"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                className="cancel-profile-button"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>

              <button
                className="save-profile-button"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default AdminProfile;