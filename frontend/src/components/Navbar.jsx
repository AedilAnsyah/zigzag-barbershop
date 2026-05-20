import React from "react";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";

const Navbar = () => {

  return (

    <nav className="navbar">

      {/* LOGO */}
      <div className="logo">

        <img
          src={logo}
          alt="Logo"
          style={{ height: "40px" }}
        />

      </div>

      {/* MENU */}
      <ul className="nav-links">

        <li>

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "active-link"
                : ""
            }
          >
            Beranda
          </NavLink>

        </li>

        <li>

          <NavLink
            to="/booking"
            className={({ isActive }) =>
              isActive
                ? "active-link"
                : ""
            }
          >
            Reservasi
          </NavLink>

        </li>

        <li>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive
                ? "active-link"
                : ""
            }
          >
            Riwayat
          </NavLink>

        </li>

      </ul>

      {/* AUTH BUTTON */}
      <div className="flex items-center gap-4">

        {/* MASUK */}
        <NavLink to="/masuk">

          {({ isActive }) => (

            <button
              className={`
                px-7 py-3
                rounded-xl
                border-2 border-[#FFB800]
                font-semibold
                transition-all duration-300
                ${
                  isActive
                    ? "bg-[#FFB800] text-black"
                    : "bg-black text-white hover:bg-[#FFB800] hover:text-black"
                }
              `}
            >
              Masuk
            </button>

          )}

        </NavLink>

        {/* DAFTAR */}
        <NavLink to="/daftar">

          {({ isActive }) => (

            <button
              className={`
                px-7 py-3
                rounded-xl
                border-2 border-[#FFB800]
                font-semibold
                transition-all duration-300
                ${
                  isActive
                    ? "bg-[#FFB800] text-black"
                    : "bg-black text-white hover:bg-[#FFB800] hover:text-black"
                }
              `}
            >
              Daftar
            </button>

          )}

        </NavLink>

      </div>

    </nav>

  );
};

export default Navbar;