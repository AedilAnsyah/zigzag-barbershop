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

// PAGES
import Home from "./pages/Home";
import History from "./pages/History";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

// BOOKING PAGES
import Booking from "./pages/booking/Reservasi";
import BookingLayanan from "./pages/booking/Layanan";
import Barber from "./pages/booking/Barber";
import Waktu from "./pages/booking/Waktu";

// CSS
import "./App.css";

function App() {
  return (
    <Router>

      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div style={{ paddingTop: "80px" }}>

        <Routes>

          {/* HOME */}
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

          {/* BOOKING */}
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

          {/* LAYANAN */}
          <Route
            path="/layanan"
            element={<BookingLayanan />}
          />

          {/* HISTORY */}
          <Route
            path="/history"
            element={<History />}
          />

          {/* AUTH */}
          <Route
            path="/masuk"
            element={<SignIn />}
          />

          <Route
            path="/daftar"
            element={<SignUp />}
          />

        </Routes>

      </div>

      {/* FOOTER */}
      <Footer />

    </Router>
  );
}

export default App;