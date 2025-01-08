import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  // Check if the user is authenticated and has the correct role
  if (!token) {
    console.error("Access denied: No token found.");
    return <Navigate to="/auth/sign-in" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(role?.toLowerCase())) {
    console.error("Access denied: Insufficient permissions.");
    return <Navigate to="/auth/sign-in" />;
  }
  

  return children;
};

export default ProtectedRoute;
