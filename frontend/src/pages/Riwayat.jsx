import React from "react";
import {
  FiCalendar,
  FiClock,
} from "react-icons/fi";

export default function Riwayat() {

  const dataRiwayat = [
    {
      id: 1,
      layanan: "Premium Hair Cut",
      tanggal: "Senin, 1 Juni 2026",
      jam: "12.00",
      barber: "dengan",
      harga: "Rp 50.000",
      status: "Dikonfirmasi",
    },

    {
      id: 2,
      layanan: "Premium Hair Cut",
      tanggal: "Kamis, 8 April 2026",
      jam: "15.00",
      barber: "dengan",
      harga: "Rp 50.000",
      status: "Dibatalkan",
    },

    {
      id: 3,
      layanan: "Premium Hair Cut",
      tanggal: "Jum'at, 16 Januari 2026",
      jam: "17.00",
      barber: "dengan",
      harga: "Rp 50.000",
      status: "Selesai",
    },
  ];

  const getStatusStyle = (status) => {

    switch (status) {

      case "Dikonfirmasi":
        return "bg-blue-100 text-blue-600";

      case "Dibatalkan":
        return "bg-red-100 text-red-500";

      case "Selesai":
        return "bg-green-100 text-green-600";

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

        {dataRiwayat.map((item) => (

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