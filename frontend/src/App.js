import React from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// CONTEXT
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// COMPONENTS
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Services from "./components/Services";
import OurBarber from "./components/OurBarber";
import BookingLayanan from "./components/Layanan";
import AdminRoute from "./components/AdminRoute";
import BarberRoute from "./components/BarberRoute";
import AdminLayout from "./components/AdminLayout";
import Reviews from "./components/Reviews";

// PAGES
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import GoogleCallback from "./pages/GoogleCallback";
import Riwayat from "./pages/Riwayat";
import Profile from "./pages/Profile";

// BOOKING
import Booking from "./pages/booking/Reservasi";
import Barber from "./pages/booking/Barber";
import Waktu from "./pages/booking/Waktu";
import Ulasan from "./pages/booking/Ulasan";

// ADMIN PAGES
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import ReservasiAdmin from "./pages/admin/ReservasiAdmin";
import LayananAdmin from "./pages/admin/LayananAdmin";
import BarberAdmin from "./pages/admin/BarberAdmin";
import ProfileAdmin from "./pages/admin/ProfileAdmin";

// CSS
import "./App.css";

// BARBER
import DashboardBarber from "./pages/barber/DashboardBarber";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      {!isAdminRoute && <Navbar />}

      <div style={isAdminRoute ? {} : { paddingTop: "80px" }}>

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route
            path="/"
            element={
              <>
                <Home />
                <Services />
                <OurBarber />
                <Reviews />
              </>
            }
          />

          <Route
            path="/layanan"
            element={<BookingLayanan />}
          />

          <Route
            path="/masuk"
            element={<SignIn />}
          />

          <Route
            path="/daftar"
            element={<SignUp />}
          />

          <Route
            path="/auth/callback"
            element={<GoogleCallback />}
          />

          {/* PROTECTED ROUTES */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/booking"
              element={<Booking />}
            />

            <Route
              path="/barber"
              element={<Barber />}
            />

            <Route
              path="/waktu"
              element={<Waktu />}
            />

            <Route
              path="/review"
              element={<Ulasan />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/history"
              element={<Riwayat />}
            />

            {/* ADMIN ROUTES */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<DashboardAdmin />} />
              <Route path="reservasi" element={<ReservasiAdmin />} />
              <Route path="layanan" element={<LayananAdmin />} />
              <Route path="barber" element={<BarberAdmin />} />
              <Route path="profile" element={<ProfileAdmin />} />
            </Route>

            {/* BARBER ROUTES */}
            <Route
              path="/barber-dashboard"
              element={
                <BarberRoute>
                  <DashboardBarber />
                </BarberRoute>
              }
            />
          </Route>

        </Routes>

      </div>

      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;