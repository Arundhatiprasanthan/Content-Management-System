import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBookOpen, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import FormField from "../../../components/FormField/FormField";
import SuccessBanner from "../../../components/SuccessBanner/SuccessBanner";
import "./Login.css";

/**
 * Login page — /login
 *
 * NOTE: replace the mock submit logic with a real call to your auth API,
 * e.g. POST /api/auth/login, then redirect on success and store the
 * returned user (ideally in an AuthContext once one exists).
 */
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = "Enter your email to continue.";
    if (!password) next.password = "Enter your password to continue.";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    setSuccessMsg("");
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      // TODO: replace with real API call
      // const res = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // if (!res.ok) throw new Error("Invalid email or password.");
      // const user = await res.json();

      setSuccessMsg("Welcome back! Redirecting…");
      setTimeout(() => navigate("/profile"), 700);
    } catch (err) {
      setSubmitting(false);
      setErrors({ password: err.message || "Something went wrong. Try again." });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-badge">
          <FiBookOpen size={18} color="#f8f4ee" />
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to keep reading, writing, and reviewing.</p>

        <div style={{ marginTop: 20 }}>
          <SuccessBanner message={successMsg} />
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: successMsg ? 0 : 28 }}>
          <FormField
            label="Email"
            icon={<FiMail />}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            error={errors.email}
          />
          <FormField
            label="Password"
            icon={<FiLock />}
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="eye-btn"
                aria-label="Toggle password visibility"
              >
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            }
          />

          <div className="auth-row-between">
            <label className="auth-checkbox-row">
              <input type="checkbox" style={{ accentColor: "#1e3d2b" }} />
              Remember me
            </label>
            <button type="button" className="auth-link-btn">
              Forgot password?
            </button>
          </div>

          <button type="submit" className="auth-primary-btn" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          New to Lumen? <Link to="/register" className="auth-link-strong">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
