import { Navigate } from "react-router-dom";

/**
 * Route protection guard for authenticated users and specific roles
 */
export function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token || !savedUser) {
    // Security: Unauthenticated user -> Redirect to /login
    return <Navigate to="/login" replace />;
  }

  let user = null;
  try {
    user = JSON.parse(savedUser);
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Security: Role mismatch (e.g., Reader trying to access Author Editor) -> Redirect to /home
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;
