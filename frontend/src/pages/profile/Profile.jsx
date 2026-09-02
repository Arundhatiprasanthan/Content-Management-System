import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setName(parsed.name || "");
        setBio(parsed.bio || "");
      } catch (e) {}
    } else {
      // Default mock user if not logged in
      setUser({
        name: "Lena Kaufmann",
        email: "reader@lumen.test",
        role: "Reader",
        bio: "Curious reader and tech learner on Lumen CMS."
      });
      setName("Lena Kaufmann");
      setBio("Curious reader and tech learner on Lumen CMS.");
    }
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, bio })
      });
      const data = await res.json();

      if (data.success) {
        setMessage("🎉 Profile updated successfully!");
        const updated = { ...user, name, bio };
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
      } else {
        setMessage("Profile updated locally!");
        const updated = { ...user, name, bio };
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
      }
    } catch (err) {
      setMessage("Profile updated in session!");
      const updated = { ...user, name, bio };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!currentPassword || !newPassword) {
      setError("Please fill in current and new password.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();

      if (data.success) {
        setMessage("🔑 Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setError(data.message || "Failed to change password");
      }
    } catch (err) {
      setError("Server connection error while changing password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("👋 Logged out successfully!");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}
            </div>
            <div className="profile-identity">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <span className={`role-badge role-${(user.role || "reader").toLowerCase()}`}>
                {user.role || "Reader"}
              </span>
            </div>
          </div>

          {message && <div className="profile-alert success">{message}</div>}
          {error && <div className="profile-alert danger">{error}</div>}

          <div className="profile-sections">
            {/* Section 1: Edit Profile */}
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <h3>Edit Profile</h3>

              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Add a bio..."
                />
              </div>

              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? "Saving..." : "Save Profile Changes"}
              </button>
            </form>

            <hr />

            {/* Section 2: Change Password */}
            <form onSubmit={handleChangePassword} className="profile-form">
              <h3>Security & Password</h3>

              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn-secondary">
                Update Password
              </button>
            </form>

            <hr />

            {/* Section 3: Logout Action */}
            <div className="profile-logout-box">
              <button type="button" className="btn-logout" onClick={handleLogout}>
                🚪 Logout from Account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
