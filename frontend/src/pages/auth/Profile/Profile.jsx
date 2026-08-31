import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiEdit2, FiFileText, FiAward, FiBarChart2, FiLogOut } from "react-icons/fi";
import Navbar from "../../../components/Navbar/Navbar";
import FormField from "../../../components/FormField/FormField";
import SuccessBanner from "../../../components/SuccessBanner/SuccessBanner";
import "./Profile.css";

// TODO: replace this mock with the logged-in user once an AuthContext exists.
// role can be "reader" or "author" — stats and badge below react to it.
const MOCK_USER = {
  name: "Lena Kaufmann",
  role: "reader",
  email: "lena.kaufmann@lumen.io",
  bio: "Curious reader, always chasing the next good article.",
  stats: { articlesRead: 24, quizzesTaken: 9, avgScore: "82%" },
};

const readerStats = (s) => [
  { icon: <FiFileText />, label: "Articles read", value: s.articlesRead ?? "24" },
  { icon: <FiAward />, label: "Quizzes taken", value: s.quizzesTaken ?? "9" },
  { icon: <FiBarChart2 />, label: "Avg. score", value: s.avgScore ?? "82%" },
];

const authorStats = (s) => [
  { icon: <FiFileText />, label: "Published", value: s.published ?? "6" },
  { icon: <FiEdit2 />, label: "Drafts", value: s.drafts ?? "3" },
  { icon: <FiAward />, label: "Quizzes created", value: s.quizzesCreated ?? "4" },
];

/**
 * Profile page — /profile
 *
 * NOTE: wire `save()` to PATCH /api/users/me before merging into state,
 * and replace MOCK_USER with the real logged-in user (AuthContext / props).
 */
function Profile() {
  const navigate = useNavigate();
  const [user] = useState(MOCK_USER);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio,
  });
  const [successMsg, setSuccessMsg] = useState("");

  // Auto-clear the success banner after a few seconds
  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(""), 2500);
    return () => clearTimeout(t);
  }, [successMsg]);

  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const stats = user.role === "author" ? authorStats(user.stats || {}) : readerStats(user.stats || {});

  const save = async () => {
    // TODO: replace with real API call
    // await fetch("/api/users/me", {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(form),
    // });
    setEditing(false);
    setSuccessMsg("Profile updated successfully.");
  };

  const signOut = () => {
    // TODO: clear auth token / session here once auth exists
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div className="profile-wrap">
        <SuccessBanner message={successMsg} />

        <div className="profile-card">
          <div className="profile-header-row">
            <div className="profile-avatar-big">{initials}</div>
            <div style={{ flex: 1, minWidth: 160 }}>
              {editing ? (
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="inline-name-input"
                />
              ) : (
                <h1 className="profile-name">{form.name}</h1>
              )}
              <span className="role-badge">{user.role}</span>
            </div>

            <div className="profile-actions">
              {!editing ? (
                <button className="secondary-btn" onClick={() => setEditing(true)}>
                  <FiEdit2 size={14} />
                  Edit profile
                </button>
              ) : (
                <>
                  <button className="ghost-btn" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                  <button className="primary-btn-small" onClick={save}>
                    Save changes
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="stats-row">
            {stats.map((s) => (
              <div key={s.label} className="stat-box">
                {s.icon}
                <div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="profile-divider" />

          <FormField
            label="Email"
            icon={<FiMail />}
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            readOnly={!editing}
          />

          <label className="field-wrap">
            <span className="field-label">Bio</span>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              readOnly={!editing}
              rows={3}
              className="profile-textarea"
              style={{ background: editing ? "#ffffff" : "#faf7f1", cursor: editing ? "text" : "default" }}
            />
          </label>
        </div>

        <button className="sign-out-btn" onClick={signOut}>
          <FiLogOut size={15} />
          Sign out
        </button>
      </div>
    </>
  );
}

export default Profile;
