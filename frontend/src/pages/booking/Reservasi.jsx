import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import StepBooking from "../../components/StepBooking";

import haircut from "../../assets/haircut.png";
import massage from "../../assets/massage.png";
import perm from "../../assets/perm.png";

export default function Reservasi() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data.data);
      } catch (err) {
        setError("Gagal memuat layanan");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const getIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("massage") || lower.includes("colour")) return massage;
    if (lower.includes("perm")) return perm;
    return haircut;
  };

  return (
    <div className="min-h-screen bg-black px-[90px] py-[60px] text-white">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-[52px] font-bold">
          Reservasi
        </h1>

        <p className="text-[20px] font-semibold text-[#8A8A8A] mt-2">
          Pesan Tempat Sekarang
        </p>

      </div>

      {/* STEPPER */}
      <div className="mb-20">
        <StepBooking currentStep={1} />
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-12 gap-20">

        {/* LEFT */}
        <div className="col-span-8">

          <p className="text-[#8A8A8A] mb-8 text-[16px]">
            Pilih layanan yang tersedia untuk booking.
          </p>

          <div className="grid grid-cols-3 gap-8">
            {loading && (
              <div className="col-span-3 text-center text-white font-semibold py-10">
                Memuat layanan...
              </div>
            )}

            {error && (
              <div className="col-span-3 text-center text-red-500 font-semibold py-10">
                {error}
              </div>
            )}

            {!loading && !error && services.length === 0 && (
              <div className="col-span-3 text-center text-white font-semibold py-10">
                Tidak ada layanan tersedia saat ini.
              </div>
            )}

            {!loading && !error && services.map((service) => (
              <div
                key={service.id}
                className={`
                  bg-[#242424]
                  rounded-[16px]
                  p-6
                  transition-all
                  duration-300
                  ${selectedService?.id === service.id ? "ring-2 ring-[#FFC400]" : ""}
                `}
              >
                <img
                  src={getIcon(service.name)}
                  alt={service.name}
                  className="w-8 h-8 mb-5"
                />

                <h3 className="text-[18px] font-bold text-white">
                  {service.name}
                </h3>

                <p className="text-[#FFC400] font-bold text-[18px] mt-2">
                  Rp {service.price.toLocaleString("id-ID")},-
                </p>

                <p className="text-[#9A9A9A] text-[14px] leading-7 mt-3 min-h-[90px]">
                  {service.description}
                </p>

                <button
                  onClick={() => setSelectedService(service)}
                  className={`
                    w-full
                    mt-5
                    h-[44px]
                    font-semibold
                    rounded-[8px]
                    transition-all
                    ${selectedService?.id === service.id 
                      ? "bg-white text-black hover:bg-gray-200" 
                      : "bg-[#FFC400] text-black hover:brightness-95"}
                  `}
                >
                  {selectedService?.id === service.id ? "Terpilih" : "Pilih Layanan"}
                </button>
              </div>
            ))}
          </div>

          {/* BUTTON */}
          <div className="flex justify-between mt-20">

            <button
              onClick={() => navigate("/")}
              className="
                border
                border-[#FFC400]
                text-white
                px-8
                py-3
                rounded-[10px]
                hover:bg-[#FFC400]
                hover:text-black
                transition
              "
            >
              ← Kembali
            </button>

            <button
              disabled={!selectedService}
              onClick={() =>
                navigate("/barber", {
                  state: {
                    service: selectedService,
                  },
                })
              }
              className={`
                px-10
                py-3
                rounded-[10px]
                font-semibold
                transition

                ${
                  selectedService
                    ? "bg-[#FFC400] text-black"
                    : "bg-[#555] text-[#999]"
                }
              `}
            >
              Berikutnya →
            </button>

          </div>

        </div>

        {/* RIGHT */}
        <div className="col-span-4 flex justify-end">

          <div
            className="
              w-[320px]
              h-fit
              bg-[#242424]
              rounded-[16px]
              p-6
            "
          >

            <h3 className="text-[24px] text-[#BDBDBD] mb-8">
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
                <span>-</span>
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

            <div className="border-t border-[#707070] my-8"></div>

            <div className="flex justify-between items-center">

              <span className="text-[#A0A0A0] font-semibold">
                TOTAL
              </span>

              <span className="text-[#FFC400] text-[28px] font-bold">
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