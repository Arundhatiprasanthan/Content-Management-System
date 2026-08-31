import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

function AdminProfile() {
  const [name, setName] = useState("Admin User");
  const [email] = useState("admin@lumen.com");
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    alert("Profile updated successfully.");
  };

  return (
    <AdminLayout>
      <div className="admin-page">

        <section className="page-heading">
          <h1>Admin Profile</h1>

          <p>
            View and manage your administrator profile.
          </p>
        </section>

        <section className="profile-card">

          <div className="profile-avatar">
            {name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{name}</h2>

            <span className="role-badge">
              Administrator
            </span>
          </div>

        </section>

        <section className="profile-form">

          <div className="section-header">
            <div>
              <h2>Profile Information</h2>
            </div>
          </div>

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
                className="primary-button"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="secondary-button"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>

                <button
                  className="primary-button"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </>
            )}

          </div>

        </section>

      </div>
    </AdminLayout>
  );
}

export default AdminProfile;