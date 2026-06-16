import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FFB22C] border-t-transparent mx-auto" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}