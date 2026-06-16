import React, { useState, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import BookingTable from "../../components/admin/BookingTable";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function DashboardBarber() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pilih status");
  const [reservations, setReservations] = useState([]);
  const [hasAttended, setHasAttended] = useState(false);
  const [isAttending, setIsAttending] = useState(false);

  const handleAttendance = async () => {
    setIsAttending(true);
    try {
      await api.post('/attendance', { status: 'present' });
      toast.success("Absen berhasil dicatat!");
      setHasAttended(true);
    } catch (error) {
      toast.error("Gagal melakukan absensi");
    } finally {
      setIsAttending(false);
    }
  };

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const response = await api.get('/barber/bookings');
      const data = response.data.data || [];

      const statusMap = {
        "pending": "Menunggu",
        "confirmed": "Dikonfirmasi",
        "completed": "Selesai",
        "cancelled": "Dibatalkan"
      };

      const formattedReservations = data
        .filter(b => b.BarberID === user.id || b.barber_id === user.id)
        .map(b => {
        const mappedStatus = statusMap[b.status] || b.status;
        return {
          id: b.ID || b.id,
          name: b.User?.name || b.User?.email || "User",
          phone: "08xxxxxx",
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
    } catch (error) {
      console.error("Gagal mengambil data booking", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    
    const checkAttendance = async () => {
      if (!user) return;
      try {
        const response = await api.get('/attendance/status');
        setHasAttended(response.data.is_present_today);
      } catch (err) {
        console.error("Gagal cek absensi:", err);
      }
    };
    checkAttendance();
  }, [user]);

  const handleConfirm = async (id) => {
    try {
      await api.put(`/booking/${id}/status`, { status: "confirmed" });
      toast.success(`Reservasi #${id} dikonfirmasi!`);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal mengkonfirmasi reservasi");
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.put(`/booking/${id}/status`, { status: "cancelled" });
      toast.success(`Reservasi #${id} berhasil dibatalkan!`);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal membatalkan reservasi");
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.put(`/booking/${id}/status`, { status: "completed" });
      toast.success("Pelanggan selesai dilayani!");
      fetchBookings(); // Refresh data tabel
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Gagal update status");
    }
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Pilih status" ? true : res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 md:p-10 bg-black min-h-full space-y-8 font-poppins text-left">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Dashboard Barber
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Kelola jadwal booking harian Anda di sini.
        </p>
      </div>

      {/* ABSENSI PANEL */}
      <div className="bg-[#1C1C1E] border border-neutral-800 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Status Kehadiran</h2>
          <p className="text-gray-400 text-sm mt-1">Jangan lupa absen sebelum memulai shift Anda hari ini.</p>
        </div>
        <button
          onClick={handleAttendance}
          disabled={hasAttended || isAttending}
          className={`px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
            hasAttended 
              ? "bg-green-500/20 text-green-500 border border-green-500/30 cursor-not-allowed" 
              : "bg-[#FFCC00] text-black hover:bg-yellow-400 active:bg-yellow-500 cursor-pointer"
          }`}
        >
          {isAttending ? "Memproses..." : hasAttended ? "Sudah Absen" : "Absen Hari Ini"}
        </button>
      </div>

      {/* FILTER PANEL */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#222] pb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Jadwal Hari Ini
        </h2>

        <div className="flex items-center gap-3">
          {/* SEARCH BAR */}
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama pelanggan"
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
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onComplete={handleComplete}
      />
    </div>
  );
}
