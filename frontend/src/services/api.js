import axios from "axios";

// ─── Axios Instance ───────────────────────────────────────────────────
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────
// Attach JWT token ke setiap request secara otomatis.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────
// Jika server mengembalikan 401, bersihkan auth data dan redirect ke halaman login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/masuk";
    }
    return Promise.reject(error);
  }
);

export default api;
