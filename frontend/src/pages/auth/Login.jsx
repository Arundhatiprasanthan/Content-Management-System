import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBookOpen } from "react-icons/fi";
import Navbar from "../../components/Navbar/Navbar";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Reader");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect away from login page
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.role === "Author") {
          navigate("/author/article");
        } else {
          navigate("/home");
        }
      } catch (e) {}
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegistering
      ? { name, email, password, role, bio }
      : { email, password };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        alert(`🎉 Successfully ${isRegistering ? "Registered" : "Logged in"} as ${data.user.role}!`);
        
        if (data.user.role === "Author") {
          navigate("/author/article");
        } else {
          navigate("/home");
        }
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      setError("Failed to connect to backend server. Make sure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF8F5" }}>
      <Navbar />

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo-box">
              <FiBookOpen />
            </div>
            <h2>Lumen</h2>
            <p>{isRegistering ? "Create your account" : "Welcome back! Login to your account"}</p>
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${!isRegistering ? "active" : ""}`}
              onClick={() => { setIsRegistering(false); setError(""); }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${isRegistering ? "active" : ""}`}
              onClick={() => { setIsRegistering(true); setError(""); }}
            >
              Register
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegistering && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {isRegistering && (
              <>
                <div className="form-group">
                  <label>Select Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Reader">Reader (Browse & Attempt Quizzes)</option>
                    <option value="Author">Author (Create Articles & Quizzes)</option>
                    <option value="Admin">Admin (Review & Verify Content)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Short Bio (Optional)</label>
                  <textarea
                    placeholder="Tell us a little about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                  />
                </div>
              </>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Processing..." : isRegistering ? "Create Account" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
