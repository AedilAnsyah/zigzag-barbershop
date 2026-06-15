import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Default loading to true until token is verified

  useEffect(() => {
    // Check if token exists in localStorage on mount
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        // Cek expiry
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // Token expired
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser({
            id: decoded.user_id,
            email: decoded.email,
            role: decoded.role,
          });
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token } = response.data;

      // Save token
      localStorage.setItem("token", token);

      // Decode and set user
      const decoded = jwtDecode(token);
      setUser({
        id: decoded.user_id,
        email: decoded.email,
        role: decoded.role,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Gagal masuk. Silakan coba lagi.",
      };
    }
  };

  const loginWithGoogle = async (code) => {
    try {
      // Kirim authorization code ke backend
      const response = await api.post("/auth/google/callback", { code });
      const { token } = response.data;

      // Simpan token ke localStorage
      localStorage.setItem("token", token);

      // Decode JWT token untuk mendapatkan data user
      const decoded = jwtDecode(token);
      const userData = {
        id: decoded.user_id,
        email: decoded.email,
        role: decoded.role,
      };

      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error("Google OAuth Error:", error);
      return {
        success: false,
        message: error.response?.data?.error || "Google login gagal dilakukan",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
