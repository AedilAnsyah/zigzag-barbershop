import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

import StepBooking from "../../components/StepBooking";

export default function Barber() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedService = location.state?.service;

  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const response = await api.get("/barbers");
        setBarbers(response.data.data);
      } catch (err) {
        setError("Gagal memuat barber");
      } finally {
        setLoading(false);
      }
    };
    fetchBarbers();
  }, []);

  return (
    <div className="min-h-screen bg-black px-[70px] pt-[60px] pb-[80px] text-white">

      {/* HEADER */}
      <div className="mb-12">

        <h1 className="text-[52px] font-bold">
          Reservasi
        </h1>

        <p className="text-[20px] font-semibold text-[#8A8A8A] mt-2">
          Pesan Tempat Sekarang
        </p>

      </div>

      {/* STEP BOOKING */}
      <div className="mb-20">
        <StepBooking currentStep={2} />
      </div>

      <div className="grid grid-cols-12 gap-10">

        {/* KIRI */}
        <div className="col-span-9">

          <p className="text-[#8A8A8A] text-[15px] mb-10">
            Barber profesional kami siap memberikan hasil terbaik.
            Pilih barber favoritmu atau biarkan kami merekomendasikan untukmu.
          </p>

          {/* CARD BARBER */}
          <div className="flex flex-wrap gap-[40px] max-w-[965px]">

            {loading && (
              <div className="w-full text-center text-white font-semibold py-10">
                Memuat barber...
              </div>
            )}

            {error && (
              <div className="w-full text-center text-red-500 font-semibold py-10">
                {error}
              </div>
            )}

            {!loading && !error && barbers.length === 0 && (
              <div className="w-full text-center text-white font-semibold py-10">
                Tidak ada barber tersedia saat ini.
              </div>
            )}

            {!loading && !error && barbers.map((barber) => (

              <div
                key={barber.id}
                onClick={() => {
                  if (barber.is_present_today) {
                    setSelectedBarber(barber);
                  }
                }}
                className={`
                  relative
                  w-[295px]
                  h-[420px]
                  rounded-[12px]
                  overflow-hidden
                  bg-[#242424]
                  ${barber.is_present_today ? "cursor-pointer hover:border-[#FFC400]/50" : "cursor-not-allowed opacity-60"}
                  transition-all
                  duration-300
                  ${
                    selectedBarber?.id === barber.id
                      ? "border-2 border-[#FFC400]"
                      : "border-2 border-transparent"
                  }
                `}
              >

                {!barber.is_present_today && (
                  <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                    <span className="bg-red-500/90 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                      Belum Hadir
                    </span>
                  </div>
                )}

                {/* FOTO */}
                <div className="h-[340px] bg-[#D9D9D9]"></div>

                {/* INFO */}
                <div className="h-[80px] bg-[#242424] px-5 pt-4">

                  <h3 className="text-[16px] font-bold text-white leading-none">
                    {barber.name}
                  </h3>

                  <p className="text-[13px] text-[#FFC400] mt-2">
                    Barber Profesional
                  </p>

                </div>

              </div>

            ))}

          </div>

          {/* BUTTON */}
          <div className="flex justify-between mt-16 max-w-[965px]">

            <button
              onClick={() =>
                navigate("/booking", {
                  state: {
                    service: selectedService,
                  },
                })
              }
              className="
                border
                border-[#FFC400]
                text-white
                bg-black
                px-8
                py-3
                rounded-[8px]
                transition-all
                hover:bg-[#FFC400]
                hover:text-black
              "
            >
              ← Kembali
            </button>

            <button
              disabled={!selectedBarber}
              onClick={() =>
                navigate("/waktu", {
                  state: {
                    service: selectedService,
                    barber: selectedBarber,
                  },
                })
              }
              className={`
                w-[160px]
                h-[50px]
                rounded-[8px]
                font-semibold
                transition-all
                ${
                  selectedBarber
                    ? "bg-[#FFC400] text-black"
                    : "bg-[#555555] text-[#999999]"
                }
              `}
            >
              Berikutnya →
            </button>

          </div>

        </div>

        {/* KANAN */}
        <div className="col-span-3">

          <div className="bg-[#242424] rounded-[12px] p-6">

            <h3 className="text-[#BDBDBD] text-[22px] mb-6">
              Detail Reservasi
            </h3>

            <div className="space-y-3 text-[#9A9A9A]">

              <div className="flex justify-between">
                <span>Layanan</span>
                <span>
                  {selectedService
                    ? selectedService.name
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Barber</span>
                <span>
                  {selectedBarber
                    ? selectedBarber.name
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tanggal</span>
                <span>-</span>
              </div>

              <div className="flex justify-between">
                <span>Waktu</span>
                <span>-</span>
              </div>

            </div>

            <div className="border-t border-[#666666] my-6"></div>

            <div className="flex justify-between items-center">

              <span className="text-[#BDBDBD] font-semibold">
                TOTAL
              </span>

              <span className="text-[#FFC400] text-[24px] font-bold">
                {selectedService
                  ? `Rp ${selectedService.price.toLocaleString("id-ID")},-`
                  : "Rp 0"}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}