import React, { useState } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import BookingTable from "../../components/admin/BookingTable";

export default function ReservasiAdmin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pilih status");
  const [reservations, setReservations] = useState([
    {
      id: 1,
      name: "Maaruf Sarifudin",
      phone: "081234567890",
      service: "Premium Haircut",
      barber: "?",
      time: "11 Mei 2026 12.00",
      price: "Rp 50.000",
      status: "Menunggu",
    },
    {
      id: 2,
      name: "Marshendo Galang",
      phone: "081298765432",
      service: "Premium Haircut",
      barber: "?",
      time: "11 Mei 2026 15.00",
      price: "Rp 50.000",
      status: "Dikonfirmasi",
    },
    {
      id: 3,
      name: "Aedil Rizki",
      phone: "085678901234",
      service: "Premium Haircut",
      barber: "?",
      time: "11 Mei 2026 16.00",
      price: "Rp 50.000",
      status: "Dibatalkan",
    },
    {
      id: 4,
      name: "Pradya",
      phone: "082133445566",
      service: "Premium Haircut",
      barber: "?",
      time: "10 Mei 2026 12.00",
      price: "Rp 50.000",
      status: "Selesai",
    }
  ]);

  const handleCancel = (id) => {
    setReservations(
      reservations.map((res) =>
        res.id === id ? { ...res, status: "Dibatalkan" } : res
      )
    );
    alert(`Reservasi #${id} berhasil dibatalkan!`);
  };

  const handleComplete = (id) => {
    setReservations(
      reservations.map((res) =>
        res.id === id ? { ...res, status: "Selesai" } : res
      )
    );
    alert(`Reservasi #${id} ditandai sebagai Selesai!`);
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Pilih status" ? true : res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 md:p-10 bg-black min-h-full space-y-8 font-poppins">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Manajemen Booking
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Kelola dan pantau semua jadwal booking pelanggan dengan mudah.
        </p>
      </div>

      {/* FILTER PANEL */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#222] pb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Daftar reservasi
        </h2>

        <div className="flex items-center gap-3">
          {/* SEARCH BAR */}
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-[#333] bg-[#161616] text-white placeholder-gray-500 outline-none focus:border-yellow-400 text-sm w-[240px] transition-all"
            />
          </div>

          {/* STATUS SELECT */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pr-10 pl-4 py-2.5 rounded-xl border border-[#333] bg-[#161616] text-white outline-none focus:border-yellow-400 text-sm cursor-pointer min-w-[150px] transition-all"
            >
              <option value="Pilih status">Pilih status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Dikonfirmasi">Dikonfirmasi</option>
              <option value="Dibatalkan">Dibatalkan</option>
              <option value="Selesai">Selesai</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <FiChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* RESERVATIONS TABLE */}
      <BookingTable
        reservations={filteredReservations}
        showActions={true}
        onCancel={handleCancel}
        onComplete={handleComplete}
      />
    </div>
  );
}

