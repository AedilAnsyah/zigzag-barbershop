import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import OurBarber from './pages/OurBarber';
import Booking from './pages/Booking';   
import History from './pages/History';
import SignUp from './pages/SignUp';  
import SignIn from './pages/SignIn';
import Footer from './pages/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />

      <div style={{ paddingTop: "80px" }}>
        <Routes>

          {/* Halaman utama (gabungan semua section) */}
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

          {/* Halaman lain */}
          <Route path="/booking" element={<Booking />} />
          <Route path="/history" element={<History />} />
          <Route path="/daftar" element={<SignUp />} />
          <Route path="/masuk" element={<SignIn />} />

        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;