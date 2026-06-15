import React from "react";
import {
  FiClock,
  FiCalendar,
  FiScissors,
  FiDollarSign,
} from "react-icons/fi";
import StatCard from "../../components/admin/StatCard";
import BookingTable from "../../components/admin/BookingTable";

export default function DashboardAdmin() {
  const stats = [
    {
      title: "Menunggu Konfirmasi",
      value: "2",
      icon: FiClock,
      color: "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-md shadow-amber-500/5"
    },
    {
      title: "Reservasi hari ini",
      value: "6",
      icon: FiCalendar,
      color: "bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-md shadow-blue-500/5"
    },
    {
      title: "Barber Aktif",
      value: "3/4",
      icon: FiScissors,
      color: "bg-green-500/10 text-green-500 border border-green-500/20 shadow-md shadow-green-500/5"
    },
    {
      title: "Pendapatan",
      value: "Rp 500.000",
      icon: FiDollarSign,
      color: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-md shadow-emerald-500/5"
    }
  ];

  const reservations = [
    {
      id: 1,
      name: "Maaruf Sarifudin",
      service: "Premium Haircut",
      barber: "?",
      time: "11 Mei 2026 12.00",
      price: "Rp 50.000",
      status: "Menunggu",
      badgeColor: "bg-amber-500/10 text-amber-500 border border-amber-500/20"
    },
    {
      id: 2,
      name: "Marshendo Galang",
      service: "Premium Haircut",
      barber: "?",
      time: "11 Mei 2026 15.00",
      price: "Rp 50.000",
      status: "Dikonfirmasi",
      badgeColor: "bg-blue-500/10 text-blue-500 border border-blue-500/20"
    },
    {
      id: 3,
      name: "Aedil Rizki",
      service: "Premium Haircut",
      barber: "?",
      time: "11 Mei 2026 16.00",
      price: "Rp 50.000",
      status: "Dibatalkan",
      badgeColor: "bg-red-500/10 text-red-500 border border-red-500/20"
    }
  ];

  const transactions = [
    {
      initials: "MS",
      name: "Maaruf Sarifudin",
      service: "Premium Hair Cut",
      price: "Rp 50.000",
      time: "Baru saja"
    },
    {
      initials: "MS",
      name: "Marshendo Galang",
      service: "Premium Hair Cut",
      price: "Rp 50.000",
      time: "12 menit yang lalu"
    }
  ];

  return (
    <div className="p-8 md:p-10 bg-black min-h-full space-y-10 font-poppins">
      {/* TITLE & DESCRIPTION */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-[#A0A0A0] mt-2 text-sm md:text-base">
          Pantau aktivitas dan performa barbershop hari ini.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* RESERVASI TERBARU */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Reservasi Terbaru
        </h2>

        <BookingTable reservations={reservations} />
      </div>

      {/* TRANSAKSI TERBARU */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Transaksi Terbaru
        </h2>

        <div className="space-y-3">
          {transactions.map((tx, idx) => (
            <div
              key={idx}
              className="bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] transition-all duration-200 rounded-2xl p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center font-bold text-white text-base border border-neutral-700 shadow-md">
                  {tx.initials}
                </div>
                <div>
                  <h4 className="text-white font-bold text-base leading-tight">
                    {tx.name}
                  </h4>
                  <p className="text-gray-400 text-xs mt-1.5 font-medium">
                    {tx.service}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <h4 className="text-white font-bold text-base leading-tight">
                  {tx.price}
                </h4>
                <p className="text-gray-500 text-xs mt-1.5">
                  {tx.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}