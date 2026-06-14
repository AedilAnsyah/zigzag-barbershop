import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// COMPONENTS
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Services from "./components/Services";
import OurBarber from "./components/OurBarber";
import BookingLayanan from "./components/Layanan";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import Reviews from "./components/Reviews";

// PAGES
import Home from "./pages/Home";
import History from "./pages/Riwayat";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
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

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <div style={isAdminRoute ? {} : { paddingTop: "80px" }}>

        <Routes>

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
            path="/booking"
            element={<Booking />}
          />

          <Route
            path="/layanan"
            element={<BookingLayanan />}
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
            path="/history"
            element={<History />}
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

        </Routes>

      </div>

      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;