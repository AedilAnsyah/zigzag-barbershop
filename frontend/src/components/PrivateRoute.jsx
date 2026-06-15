import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/masuk" />;
};

export default PrivateRoute;
