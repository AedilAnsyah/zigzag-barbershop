import React from "react";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="logo">
        <img src={logo} alt="Logo" style={{ height: "40px" }} />
      </div>

      {/* MENU */}
      <ul className="nav-links">
  <li>
    <NavLink to="/" end className={({ isActive }) => isActive ? "active-link" : ""}>
      Home
    </NavLink>
  </li>

  <li>
    <NavLink to="/booking" className={({ isActive }) => isActive ? "active-link" : ""}>
      Booking
    </NavLink>
  </li>

  <li>
    <NavLink to="/history" className={({ isActive }) => isActive ? "active-link" : ""}>
      History
    </NavLink>
  </li>
</ul>

      {/* BUTTON */}
      <div className="auth-buttons">
        <button className="btn-outline">Sign in</button>
        <button className="btn-primary">Sign up</button>
      </div>
    </nav>
  );
};

export default Navbar;