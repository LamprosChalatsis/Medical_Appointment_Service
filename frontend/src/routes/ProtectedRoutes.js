import { Navigate } from "react-router-dom";
import { getPrimaryRole, isLoggedIn } from "../utils/auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const role = getPrimaryRole();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is defined and the user's role is not in the list, redirect to home
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}