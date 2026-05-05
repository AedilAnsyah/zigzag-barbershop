import React from "react";
import Navbar from "../components/Navbar";
import heroImage from "../assets/hero.jpg";
import logo from "../assets/logo.png";

const Home = () => {
  return (
    <div>
      <Navbar />

      <div
        className="hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="overlay">
          <img src={logo} alt="Zigzag Logo" className="logo-image" />

          <p className="desc">
            Potongan rapi, pelayanan terbaik, hasil maksimal.
            Kami hadir untuk memberikan pengalaman grooming yang nyaman
            dengan hasil yang memuaskan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;