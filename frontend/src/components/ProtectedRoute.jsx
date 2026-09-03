import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // READ USER
  // ==========================================

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // CHECK USER ROLE
  // ==========================================

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    console.log(
      "Access denied. User role:",
      user.role,
      "Allowed roles:",
      allowedRoles
    );

    // Admin
    if (user.role === "Admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    // Author
    if (user.role === "Author") {
      return (
        <Navigate
          to="/home"
          replace
        />
      );
    }

    // Reader
    return (
      <Navigate
        to="/home"
        replace
      />
    );
  }

  // ==========================================
  // AUTHORIZED
  // ==========================================

  return children;
}

export default ProtectedRoute;