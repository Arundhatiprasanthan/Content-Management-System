import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBookOpen, FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import FormField from "../../../components/FormField/FormField";
import RolePicker from "../../../components/RolePicker/RolePicker";
import SuccessBanner from "../../../components/SuccessBanner/SuccessBanner";
import "./Register.css";

/**
 * Registration page — /register
 *
 * NOTE: replace the mock submit logic with a real call to your auth API,
 * e.g. POST /api/auth/register, then redirect on success.
 */
function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [role, setRole] = useState("reader");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Tell us your name.";
    if (!form.email.trim()) next.email = "Enter a valid email.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Choose a password.";
    else if (form.password.length < 8) next.password = "Use at least 8 characters.";
    if (form.confirm !== form.password) next.confirm = "Passwords don't match.";
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
      // const res = await fetch("/api/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ ...form, role }),
      // });
      // if (!res.ok) throw new Error("Could not create account.");
      // Handle duplicate email: if (res.status === 409) throw new Error("An account with this email already exists.");

      setSuccessMsg("Account created! Redirecting…");
      setTimeout(() => navigate("/profile"), 700);
    } catch (err) {
      setSubmitting(false);
      setErrors({ email: err.message || "Something went wrong. Try again." });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-badge">
          <FiBookOpen size={18} color="#f8f4ee" />
        </div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join Lumen to read, write, or review great content.</p>

        <div style={{ marginTop: 20 }}>
          <SuccessBanner message={successMsg} />
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: successMsg ? 0 : 28 }}>
          <FormField
            label="Full name"
            icon={<FiUser />}
            value={form.name}
            onChange={set("name")}
            placeholder="Nisha Gupta"
            error={errors.name}
          />
          <FormField
            label="Email"
            icon={<FiMail />}
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            error={errors.email}
          />
          <FormField
            label="Password"
            icon={<FiLock />}
            type={showPw ? "text" : "password"}
            value={form.password}
            onChange={set("password")}
            placeholder="At least 8 characters"
            error={errors.password}
            rightSlot={
              <button type="button" onClick={() => setShowPw((s) => !s)} className="eye-btn">
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            }
          />
          <FormField
            label="Confirm password"
            icon={<FiLock />}
            type={showPw ? "text" : "password"}
            value={form.confirm}
            onChange={set("confirm")}
            placeholder="Re-enter your password"
            error={errors.confirm}
          />
          <RolePicker role={role} setRole={setRole} />

          <button type="submit" className="auth-primary-btn" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link-strong">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
