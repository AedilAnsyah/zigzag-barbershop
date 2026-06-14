import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiSidebar } from "react-icons/fi";

export default function NavbarAdmin({ isSidebarCollapsed, setIsSidebarCollapsed }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-[90px] bg-black sticky top-0 z-40 flex items-center justify-between px-8">
      {/* Left Side: Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="p-2.5 rounded-xl bg-transparent hover:bg-[#111] text-gray-400 hover:text-white transition-colors cursor-pointer"
        aria-label="Toggle Sidebar"
      >
        <FiSidebar size={22} />
      </button>

      {/* Right Side: Bell & Avatar */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-transparent hover:bg-[#111] text-gray-400 hover:text-white transition-colors relative cursor-pointer"
          >
            <FiBell size={22} />
          </button>

          {/* Notifications Dropdown menu */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#161616] border border-[#222] rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#222]">
                <h4 className="font-bold text-sm">Notifikasi</h4>
                <span className="text-xs text-yellow-500 cursor-pointer hover:underline">Tandai dibaca</span>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                <div className="p-2 rounded-lg bg-[#222]/50 hover:bg-[#222] transition-colors text-xs border border-transparent hover:border-[#333]">
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Reservasi Baru</span>
                    <span className="text-gray-500">Baru saja</span>
                  </div>
                  <p className="text-gray-400">Maaruf Sarifudin melakukan pemesanan Premium Haircut.</p>
                </div>
                <div className="p-2 rounded-lg bg-[#222]/50 hover:bg-[#222] transition-colors text-xs border border-transparent hover:border-[#333]">
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Reservasi Baru</span>
                    <span className="text-gray-500">12 menit lalu</span>
                  </div>
                  <p className="text-gray-400">Marshendo Galang melakukan pemesanan Premium Haircut.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar link to Profile */}
        <Link
          to="/admin/profile"
          className="flex items-center gap-3 pl-2 hover:opacity-80 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] text-white font-bold flex items-center justify-center text-sm border border-[#333] shadow-md">
            AE
          </div>
        </Link>
      </div>
    </header>
  );
}

