import React, { useState, useEffect } from "react";
import {
  FiClock,
  FiCalendar,
  FiScissors,
  FiDollarSign,
} from "react-icons/fi";
import StatCard from "../../components/admin/StatCard";
import BookingTable from "../../components/admin/BookingTable";
import api from "../../services/api";

export default function DashboardAdmin() {
  const [reservations, setReservations] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [barberCount, setBarberCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Update stats dynamically inside the component so it uses state
  const stats = [
    {
      title: "Menunggu Konfirmasi",
      value: reservations.filter(r => r.status === "Menunggu").length.toString(),
      icon: FiClock,
      color: "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-md shadow-amber-500/5"
    },
    {
      title: "Reservasi hari ini",
      value: reservations.length.toString(),
      icon: FiCalendar,
      color: "bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-md shadow-blue-500/5"
    },
    {
      title: "Barber Aktif",
      value: barberCount.toString(),
      icon: FiScissors,
      color: "bg-green-500/10 text-green-500 border border-green-500/20 shadow-md shadow-green-500/5"
    },
    {
      title: "Pendapatan",
      value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
      icon: FiDollarSign,
      color: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-md shadow-emerald-500/5"
    }
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        try {
          const resBarbers = await api.get('/barbers');
          const dataBarbers = resBarbers.data.data || [];
          const activeBarbersCount = dataBarbers.filter(b => b.is_active === true || b.provider !== 'inactive').length;
          setBarberCount(activeBarbersCount);
        } catch (e) {}
        
        const response = await api.get('/admin/bookings');
        const data = response.data.data || [];
        
        const statusMap = {
          "pending": "Menunggu",
          "confirmed": "Dikonfirmasi",
          "completed": "Selesai",
          "cancelled": "Dibatalkan"
        };

        const revenue = data
          .filter(b => b.status === "completed")
          .reduce((sum, b) => sum + (b.Service?.price || 0), 0);
        setTotalRevenue(revenue);

        const formattedReservations = data.map(b => {
          console.log("Raw booking:", b);
          const mappedStatus = statusMap[b.status] || b.status;
          return {
            id: b.ID || b.id,
            name: b.User?.name || b.User?.email || "User",
            service: b.Service?.name || "Service",
            barber: b.Barber?.name || "?",
            time: `${new Date(b.date).toLocaleDateString('id-ID')} ${b.time}`,
            price: b.Service?.price ? `Rp ${b.Service.price.toLocaleString('id-ID')}` : "Rp 0",
            status: mappedStatus,
            badgeColor: mappedStatus === "Selesai" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                        mappedStatus === "Dibatalkan" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                        mappedStatus === "Dikonfirmasi" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                        "bg-amber-500/10 text-amber-500 border border-amber-500/20"
          };
        });
        
        setReservations(formattedReservations);

        const recentTxs = formattedReservations
          .filter(b => b.status === "Selesai")
          .slice(0, 5)
          .map(b => ({
            initials: (b.name[0] || "U").toUpperCase(),
            name: b.name,
            service: b.service,
            price: b.price,
            time: b.time
          }));
        
        setTransactions(recentTxs);
      } catch (error) {
        console.error("Gagal mengambil data booking", error);
      }
    };
    
    fetchBookings();
  }, []);

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