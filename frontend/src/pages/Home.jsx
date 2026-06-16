import React, { useEffect } from "react";
import heroImage from "../assets/hero.jpg";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "barber") {
      navigate("/barber-dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div>
      <div
        className="hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="overlay">
          <img src={logo} alt="Zigzag Logo" className="logo-image" />

          <p className="desc">
            Potongan rapi, pelayanan terbaik, hasil maksimal.
            <br />
            Kami hadir untuk memberikan pengalaman grooming yang nyaman
            dengan hasil yang memuaskan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;