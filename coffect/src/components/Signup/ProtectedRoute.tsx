import { Navigate } from "react-router-dom";
import React from "react";
const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/signup" replace />;
  }

  return children;
};

export default ProtectedRoute;
