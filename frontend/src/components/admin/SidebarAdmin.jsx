import React from "react";
import { NavLink } from "react-router-dom";
import { FiGrid, FiCalendar, FiScissors, FiUser, FiLogOut } from "react-icons/fi";
import logo from "../../assets/logo.png";

export default function SidebarAdmin({ isSidebarCollapsed, handleLogout }) {
  const navItems = [
    { path: "/admin", label: "Dashboard", icon: FiGrid, end: true },
    { path: "/admin/barber", label: "Barber", icon: FiUser, end: false },
    { path: "/admin/layanan", label: "Kelola Layanan", icon: FiScissors, end: false },
    { path: "/admin/reservasi", label: "History", icon: FiCalendar, end: false },
  ];

  return (
    <aside
      className={`bg-black flex flex-col justify-between transition-all duration-300 ${
        isSidebarCollapsed ? "w-[85px]" : "w-[260px]"
      }`}
    >
      <div>
        {/* LOGO */}
        <div className="p-6 flex items-center justify-center">
          {isSidebarCollapsed ? (
            <div className="w-10 h-10 bg-[#FFCC00] rounded-xl flex items-center justify-center text-black font-extrabold text-xl shadow-lg shadow-yellow-500/20">
              Z
            </div>
          ) : (
            <NavLink to="/admin">
              <img
                src={logo}
                alt="ZigZag Logo"
                className="h-14 object-contain transition-all duration-300"
              />
            </NavLink>
          )}
        </div>

        {/* MENU HEADER */}
        <div className={`px-6 mt-8 mb-4 ${isSidebarCollapsed ? "text-center" : ""}`}>
          <p className="text-[#6B7280] font-semibold tracking-wider text-xs uppercase">
            {isSidebarCollapsed ? "•" : "Menu"}
          </p>
        </div>

        {/* MENU ITEMS */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-[#FFCC00] text-black shadow-lg shadow-yellow-500/10"
                      : "text-gray-400 hover:text-white hover:bg-[#111]"
                  } ${isSidebarCollapsed ? "justify-center" : ""}`
                }
              >
                <Icon className="w-[20px] h-[20px] flex-shrink-0 transition-transform duration-200 group-hover:scale-105" />
                {!isSidebarCollapsed && (
                  <span className="text-[15px] font-medium leading-none">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* LOGOUT BUTTON */}
      <div className="p-3">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#FFCC00] font-semibold hover:bg-[#FFCC00]/10 hover:text-[#FFCC00] transition-all duration-200 cursor-pointer ${
            isSidebarCollapsed ? "justify-center" : ""
          }`}
        >
          <FiLogOut className="w-[20px] h-[20px] flex-shrink-0" />
          {!isSidebarCollapsed && <span className="text-[15px] leading-none">Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
