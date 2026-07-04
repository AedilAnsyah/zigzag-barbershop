import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarAdmin from "./admin/SidebarAdmin";
import NavbarAdmin from "./admin/NavbarAdmin";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    alert("Berhasil keluar dari admin!");
    navigate("/masuk");
  };

  return (
    <div className="min-h-screen bg-black text-white flex transition-all duration-300 font-poppins">
      {/* SIDEBAR */}
      <SidebarAdmin
        isSidebarCollapsed={isSidebarCollapsed}
        handleLogout={handleLogout}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <NavbarAdmin
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />

        {/* DYNAMIC SUB-PAGES OUTLET */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
