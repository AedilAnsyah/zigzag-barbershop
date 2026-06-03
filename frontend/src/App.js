import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// COMPONENTS
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Services from "./components/Services";
import OurBarber from "./components/OurBarber";
import BookingLayanan from "./components/Layanan";

// PAGES
import Home from "./pages/Home";
import History from "./pages/Riwayat";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Riwayat from "./pages/Riwayat";

// BOOKING
import Booking from "./pages/booking/Reservasi";
import Barber from "./pages/booking/Barber";
import Waktu from "./pages/booking/Waktu";
import Ulasan from "./pages/booking/Ulasan";
import Payment from "./pages/booking/Payment";

// CSS
import "./App.css";

function App() {
  return (
    <Router>

      <Navbar />

      <div style={{ paddingTop: "80px" }}>

        <Routes>

          <Route
            path="/"
            element={
              <>
                <Home />
                <Services />
                <OurBarber />
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
            path="/payment"
            element={<Payment />}
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
            path="/history"
            element={<Riwayat />}
          />

        </Routes>

      </div>

      <Footer />

    </Router>
  );
}

export default App;