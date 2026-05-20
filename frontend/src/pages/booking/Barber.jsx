import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import StepBooking from "../../components/StepBooking";

const barbers = [
  {
    id: 1,
    name: "Rizky Barber",
    description: "Fade & Korean Style Specialist",
  },

  {
    id: 2,
    name: "Andi Barber",
    description: "Pompadour & Classic Cut",
  },

  {
    id: 3,
    name: "Fajar Barber",
    description: "Modern Style & Beard Styling",
  },

  {
    id: 4,
    name: "Wildan Barber",
    description: "Texture Crop & Perm Specialist",
  },
];

export default function Barber() {

  const navigate = useNavigate();

  const location = useLocation();

  const selectedService = location.state?.service;

  const [selectedBarber, setSelectedBarber] = useState(null);

  return (

    <div className="min-h-screen bg-[#F5F5F5] px-10 py-10">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold text-black">
          Reservasi
        </h1>

        <p className="mt-3 text-lg text-gray-500">
          Pesan Tempat Sekarang
        </p>

      </div>

      {/* STEPPER */}
      <StepBooking currentStep={2} />

      {/* CONTENT */}
      <div className="grid grid-cols-12 gap-10">

        {/* LEFT */}
        <div className="col-span-9">

          <div className="mb-10">

            <h2 className="text-4xl font-bold text-black">
              Pilih Barber
            </h2>

            <p className="mt-3 text-gray-400">
              Barber profesional kami siap memberikan hasil terbaik.
            </p>

          </div>

          {/* GRID */}
          <div className="grid grid-cols-3 gap-8">

            {barbers.map((barber) => (

              <div
                key={barber.id}
                onClick={() => setSelectedBarber(barber)}
                className={`rounded-2xl overflow-hidden border-2 cursor-pointer transition duration-300 ${
                  selectedBarber?.id === barber.id
                    ? "border-yellow-500 bg-yellow-50 shadow-lg"
                    : "border-gray-200 bg-white shadow-md"
                }`}
              >

                <div className="h-72 bg-gray-300"></div>

                <div className="p-5">

                  <h3 className="text-xl font-bold">
                    {barber.name}
                  </h3>

                  <p className="mt-1 text-sm text-yellow-500">
                    {barber.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

          {/* ACTION */}
          <div className="mt-14 flex justify-between">

            <button
              onClick={() =>
                navigate("/booking", {
                  state: {
                    service: selectedService,
                  },
                })
              }
              className="border border-yellow-400 px-6 py-3 rounded-xl bg-white hover:bg-yellow-50 transition"
            >
              ← Kembali
            </button>

            {/* NEXT */}
{/* NEXT */}
<button
  disabled={!selectedBarber}
  onClick={() =>
    navigate("/waktu", {
      state: {

        // SERVICE
        service: selectedService,

        // BARBER
        barber: selectedBarber,

      },
    })
  }
  className={`
    rounded-xl
    px-8
    py-3
    font-semibold
    transition-all
    duration-300
    ${
      selectedBarber
        ? "bg-yellow-400 hover:bg-yellow-500 text-black"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
>

  Berikutnya →

</button>

          </div>

        </div>

        {/* RIGHT */}
        <div className="col-span-3">

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              Detail Reservasi
            </h3>

            <div className="space-y-4">

              <div className="flex justify-between text-gray-500">

                <span>Layanan</span>

                <span>
                  {selectedService
                    ? selectedService.name
                    : "-"}
                </span>

              </div>

              <div className="flex justify-between text-gray-500">

                <span>Barber</span>

                <span>
                  {selectedBarber
                    ? selectedBarber.name
                    : "-"}
                </span>

              </div>

              <div className="flex justify-between text-gray-500">

                <span>Tanggal</span>

                <span>-</span>

              </div>

              <div className="flex justify-between text-gray-500">

                <span>Waktu</span>

                <span>-</span>

              </div>

            </div>

            <div className="border-t my-6"></div>

            <div className="flex justify-between items-center">

              <span className="font-semibold">
                TOTAL
              </span>

              <span className="text-2xl font-bold">

                {selectedService
                  ? selectedService.price
                  : "Rp. 0"}

              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}