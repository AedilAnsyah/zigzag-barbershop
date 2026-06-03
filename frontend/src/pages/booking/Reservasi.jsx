import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import StepBooking from "../../components/StepBooking";

import haircut from "../../assets/haircut.png";
import massage from "../../assets/massage.png";
import perm from "../../assets/perm.png";

const services = [
  {
    id: 1,
    name: "Premium Hair Cut",
    price: "Rp 50.000,-",
    image: haircut,
    desc: "Termasuk Potong Rambut, Cuci Rambut, Handuk Hangat, Styling dan Pijat Kepala Ringan.",
  },

];

export default function Reservasi() {
  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState(null);

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

            {services.map((service) => (

              <div
                key={service.id}
                className="
                  bg-[#242424]
                  rounded-[16px]
                  p-6
                  transition-all
                  duration-300
                "
              >

                <img
                  src={service.image}
                  alt={service.name}
                  className="w-8 h-8 mb-5"
                />

                <h3 className="text-[18px] font-bold text-white">
                  {service.name}
                </h3>

                <p className="text-[#FFC400] font-bold text-[18px] mt-2">
                  {service.price}
                </p>

                <p className="text-[#9A9A9A] text-[14px] leading-7 mt-3 min-h-[90px]">
                  {service.desc}
                </p>

                <button
                  onClick={() => setSelectedService(service)}
                  className="
                    w-full
                    mt-5
                    h-[44px]
                    bg-[#FFC400]
                    text-black
                    font-semibold
                    rounded-[8px]
                    hover:brightness-95
                  "
                >
                  Reservasi
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
                  ? selectedService.price
                  : "Rp 0"}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}