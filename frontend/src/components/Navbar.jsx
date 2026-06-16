import React, { useState } from "react";
import logo from "../assets/logo.png";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, logout } = useAuth();
  
  const isAuthPage = location.pathname === "/masuk" || location.pathname === "/daftar";
  const isLoggedIn = !!user;
  const role = user?.role;

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="logo">
        <Link to={role === "barber" ? "/barber-dashboard" : "/"}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: "40px" }}
          />
        </Link>
      </div>

      {/* MENU */}
      {!isAuthPage && (
        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Beranda
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/booking"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Reservasi
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Riwayat
            </NavLink>
          </li>
        </ul>
      )}

      {/* AUTH CONTROLS */}
      <div className="flex items-center gap-6">
        {isLoggedIn ? (
          <div className="flex items-center gap-5">
            {/* BELL ICON */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white transition"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>

            {/* USER PROFILE BADGE */}
            <div className="relative">
              <img
                src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=FFB22C&color=000`}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-neutral-700 cursor-pointer hover:border-neutral-500 transition-all shadow-md object-cover select-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {/* DROPDOWN */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-48 bg-[#1C1C1E] border border-neutral-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in duration-200">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-neutral-800 transition font-medium"
                  >
                    Profil Saya
                  </button>
                  {role === "admin" && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/admin");
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-neutral-800 transition"
                    >
                      Dashboard Admin
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#FFB22C] hover:bg-neutral-800 transition font-medium border-t border-neutral-800/60 mt-1 pt-2"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* MASUK */}
            <NavLink to="/masuk">
              {({ isActive }) => (
                <button
                  className={`
                    px-7 py-2.5
                    rounded-xl
                    border-2 border-[#FFB22C]
                    font-semibold
                    transition-all duration-300
                    ${
                      isAuthPage
                        ? "bg-transparent text-white hover:bg-[#FFB22C] hover:text-black"
                        : isActive
                        ? "bg-[#FFB22C] text-black"
                        : "bg-black text-white hover:bg-[#FFB22C] hover:text-black"
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
                    px-7 py-2.5
                    rounded-xl
                    border-2 border-[#FFB22C]
                    font-semibold
                    transition-all duration-300
                    ${
                      isAuthPage
                        ? "bg-[#FFB22C] text-black hover:bg-yellow-400"
                        : isActive
                        ? "bg-[#FFB22C] text-black"
                        : "bg-black text-white hover:bg-[#FFB22C] hover:text-black"
                    }
                  `}
                >
                  Daftar
                </button>
              )}
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;