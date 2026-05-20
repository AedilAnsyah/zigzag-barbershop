import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import StepBooking from "../../components/StepBooking";

import haircut from "../../assets/haircut.png";
import massage from "../../assets/massage.png";
import perm from "../../assets/perm.png";

const services = [
  {
    id: 1,
    name: "Premium Hair cut",
    price: "Rp. 50.000,-",
    image: haircut,
    desc: "Termasuk Potong Rambut, Cuci Rambut, Handuk Hangat, Styling, dan Pijat Kepala Ringan.",
  },

  {
    id: 2,
    name: "Massage",
    price: "Rp. 25.000,-",
    image: massage,
    desc: "Hilangkan penat dan stres dengan layanan massage terbaik kami.",
  },

  {
    id: 3,
    name: "Down Perm",
    price: "Rp. 50.000,-",
    image: perm,
    desc: "Cocok untuk tampilan rambut lebih halus, rapi, dan tidak mengembang.",
  },

  {
    id: 4,
    name: "Curly / Cold Perm",
    price: "Rp. 200.000,-",
    image: perm,
    desc: "Gaya rambut bergelombang yang stylish dan tahan lama.",
  },

  {
    id: 5,
    name: "Basic Colouring",
    price: "Rp. 75.000,-",
    image: perm,
    desc: "Pewarnaan rambut dengan warna natural untuk tampilan yang lebih rapi.",
  },

  {
    id: 6,
    name: "Highlight",
    price: "Mulai Rp. 100.000,-",
    image: haircut,
    desc: "Tambahan warna untuk memberi dimensi pada rambut.",
  },

  {
    id: 7,
    name: "Fashion Colouring",
    price: "Mulai Rp. 250.000,-",
    image: massage,
    desc: "Ekspresikan gaya unikmu dengan warna rambut yang bold dan berbeda.",
  },
];

export default function Reservasi() {

  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState(null);

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
      <StepBooking currentStep={1} />

      {/* CONTENT */}
      <div className="grid grid-cols-12 gap-10">

        {/* LEFT */}
        <div className="col-span-9">

          {/* TITLE */}
          <div className="mb-10">

            <h2 className="text-4xl font-bold text-black">
              Pilih Layanan
            </h2>

            <p className="mt-3 text-gray-400 max-w-3xl leading-7">
              Pilih layanan yang sesuai dengan gaya kamu.
              Dari potongan klasik hingga grooming modern,
              semua tersedia untukmu.
            </p>

          </div>

          {/* GRID */}
          <div className="grid grid-cols-3 gap-8">

            {services.map((service) => (

              <div
                key={service.id}
                className={`rounded-[24px] border-2 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl ${
                  selectedService?.id === service.id
                    ? "border-[#FFB800] bg-yellow-50"
                    : "border-gray-200"
                }`}
              >

                {/* ICON */}
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-10 h-10 object-contain mb-5"
                />

                {/* TITLE */}
                <h3 className="text-[32px] font-bold text-black leading-tight">
                  {service.name}
                </h3>

                {/* PRICE */}
                <h4 className="mt-2 text-[18px] font-bold text-black">
                  {service.price}
                </h4>

                {/* DESC */}
                <p className="mt-4 text-[15px] leading-7 text-[#9A9A9A]">
                  {service.desc}
                </p>

                {/* BUTTON */}
                <button
                  onClick={() => setSelectedService(service)}
                  className={`mt-8 w-full rounded-xl py-3 font-semibold transition-all duration-300 ${
                    selectedService?.id === service.id
                      ? "bg-[#FFB800] text-black"
                      : "bg-gray-200 text-gray-700 hover:bg-[#FFB800]"
                  }`}
                >
                  {selectedService?.id === service.id
                    ? "Dipilih"
                    : "Booking"}
                </button>

              </div>

            ))}

          </div>

          {/* ACTION BUTTON */}
          <div className="mt-14 flex items-center justify-between">

            {/* BACK */}
            <button
            onClick={() => navigate("/")}
            className="
            px-8 py-3
            rounded-xl
            border-2 border-[#FFB800]
            bg-white
            text-black
            font-semibold
            transition-all duration-300
            hover:bg-[#FFB800]
            hover:text-black
            active:scale-95
            "
            >
              ← Kembali
                </button>

            {/* NEXT */}
            <button
              disabled={!selectedService}
              onClick={() =>
                navigate("/barber", {
                  state: {
                    service: selectedService,
                  },
                })
              }
              className={`rounded-xl px-8 py-3 font-semibold transition-all duration-300 ${
                selectedService
                  ? "bg-[#FFB800] text-black hover:bg-yellow-500"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
            >
              Berikutnya →
            </button>

          </div>

        </div>

        {/* RIGHT */}
        <div className="col-span-3">

          <div className="rounded-[24px] bg-white p-6 shadow-md">

            <h3 className="mb-6 text-lg font-semibold text-gray-700">
              Detail Reservasi
            </h3>

            <div className="space-y-4">

              {/* LAYANAN */}
              <div className="flex justify-between text-gray-500">

                <span>Layanan</span>

                <span>
                  {selectedService
                    ? selectedService.name
                    : "-"}
                </span>

              </div>

              {/* BARBER */}
              <div className="flex justify-between text-gray-500">

                <span>Barber</span>

                <span>-</span>

              </div>

              {/* TANGGAL */}
              <div className="flex justify-between text-gray-500">

                <span>Tanggal</span>

                <span>-</span>

              </div>

              {/* WAKTU */}
              <div className="flex justify-between text-gray-500">

                <span>Waktu</span>

                <span>-</span>

              </div>

            </div>

            <div className="my-6 border-t border-gray-200"></div>

            {/* TOTAL */}
            <div className="flex items-center justify-between">

              <span className="font-semibold text-gray-700">
                TOTAL
              </span>

              <span className="text-2xl font-bold text-black">

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