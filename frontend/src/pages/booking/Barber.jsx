import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import StepBooking from "../../components/StepBooking";

const barbers = [
  {
    id: 1,
    name: "Nama",
    description: "deskripsi",
  },
  {
    id: 2,
    name: "Nama",
    description: "deskripsi",
  },
  {
    id: 3,
    name: "Nama",
    description: "deskripsi",
  },
  {
    id: 4,
    name: "Nama",
    description: "deskripsi",
  },
];

export default function Barber() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedService = location.state?.service;

  const [selectedBarber, setSelectedBarber] = useState(null);

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

            {barbers.map((barber) => (

              <div
                key={barber.id}
                onClick={() => setSelectedBarber(barber)}
                className={`
                  w-[295px]
                  h-[420px]
                  rounded-[12px]
                  overflow-hidden
                  bg-[#242424]
                  cursor-pointer
                  transition-all
                  duration-300
                  ${
                    selectedBarber?.id === barber.id
                      ? "border-2 border-[#FFC400]"
                      : "border-2 border-transparent"
                  }
                `}
              >

                {/* FOTO */}
                <div className="h-[340px] bg-[#D9D9D9]"></div>

                {/* INFO */}
                <div className="h-[80px] bg-[#242424] px-5 pt-4">

                  <h3 className="text-[16px] font-bold text-white leading-none">
                    {barber.name}
                  </h3>

                  <p className="text-[13px] text-[#FFC400] mt-2">
                    {barber.description}
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