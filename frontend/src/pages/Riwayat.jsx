import React, { useState, useEffect } from "react";
import { FiCalendar, FiClock } from "react-icons/fi";
import api from "../services/api";

export default function Riwayat() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch bookings, services, and barbers in parallel
        const [bookingsRes, servicesRes, barbersRes] = await Promise.all([
          api.get("/booking"),
          api.get("/services"),
          api.get("/barbers"),
        ]);

        const bookingsData = bookingsRes.data.data || [];
        const servicesData = servicesRes.data.data || [];
        const barbersData = barbersRes.data.data || [];

        // Map data
        const formatted = bookingsData.map((b) => {
          const service = servicesData.find((s) => s.id === b.service_id);
          const barber = barbersData.find((br) => br.id === b.barber_id);
          
          let formattedDate = b.date;
          try {
            const d = new Date(b.date);
            formattedDate = d.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          } catch (e) {}

          let formattedTime = b.time;
          if (b.time) {
            formattedTime = b.time.substring(0, 5).replace(":", ".");
          }

          let displayStatus = b.status;
          if (b.status === "pending") displayStatus = "Menunggu";
          if (b.status === "confirmed") displayStatus = "Dikonfirmasi";
          if (b.status === "cancelled") displayStatus = "Dibatalkan";
          if (b.status === "completed") displayStatus = "Selesai";

          return {
            id: b.ID,
            layanan: service ? service.name : `Layanan ${b.service_id}`,
            tanggal: formattedDate,
            jam: formattedTime,
            barber: `dengan ${barber ? barber.name : `Barber ${b.barber_id}`}`,
            harga: service ? `Rp ${service.price.toLocaleString("id-ID")}` : "-",
            status: displayStatus,
          };
        });

        setRiwayat(formatted);
      } catch (err) {
        setError("Gagal memuat riwayat booking.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  const getStatusStyle = (status) => {
    switch (status) {
      case "Dikonfirmasi":
        return "bg-blue-100 text-blue-600";
      case "Dibatalkan":
        return "bg-red-100 text-red-500";
      case "Selesai":
        return "bg-green-100 text-green-600";
      case "Menunggu":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-black pt-14 pb-20 px-20">

      {/* TITLE */}
      <h1 className="text-white text-[48px] font-bold">
        Riwayat Reservasi
      </h1>

      <p className="text-[#9E9E9E] mt-3 mb-10">
        Lihat riwayat layanan dan booking kamu sebelumnya.
      </p>

      {/* LIST */}
      <div className="space-y-4">
        {loading && <p className="text-white">Memuat riwayat...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && riwayat.length === 0 && (
          <p className="text-[#9E9E9E]">Belum ada riwayat reservasi.</p>
        )}

        {riwayat.map((item) => (

          <div
            key={item.id}
            className="
              bg-[#242424]
              rounded-2xl
              px-8
              py-5
              flex
              justify-between
              items-center
            "
          >

            {/* LEFT */}
            <div>

              <h3 className="text-white text-[32px] font-bold">
                {item.layanan}
              </h3>

              <div className="flex items-center gap-8 mt-5">

                <div className="flex items-center gap-2 text-[#D4D4D4] text-sm">
                  <FiCalendar size={14} />
                  <span>{item.tanggal}</span>
                </div>

                <div className="flex items-center gap-2 text-[#D4D4D4] text-sm">
                  <FiClock size={14} />
                  <span>{item.jam}</span>
                </div>

                <div className="text-[#D4D4D4] text-sm">
                  {item.barber}
                </div>

              </div>

            </div>

            {/* RIGHT */}
            <div className="text-right">

              <h3 className="text-[#F7C600] text-[36px] font-bold">
                {item.harga}
              </h3>

              <div className="mt-4">

                <span
                  className={`
                    px-5
                    py-2
                    rounded-lg
                    text-sm
                    font-medium
                    ${getStatusStyle(item.status)}
                  `}
                >
                  {item.status}
                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}