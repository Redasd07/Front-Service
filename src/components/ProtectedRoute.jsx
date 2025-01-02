import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  // Check if token exists and if the role is allowed to access
  if (!token || !allowedRoles.includes(role?.toLowerCase())) {
    return <Navigate to="/auth/sign-in" />;
  }

  return children;
};

export default ProtectedRoute;
