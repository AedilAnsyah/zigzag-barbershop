import React from "react";
import heroImage from "../assets/barber.jpeg";

const barbers = [
  {
    id: 1,
    nama: "Nama",
    deskripsi: "deskripsi",
    foto: heroImage,
  },
  {
    id: 2,
    nama: "Nama",
    deskripsi: "deskripsi",
    foto: heroImage,
  },
  {
    id: 3,
    nama: "Nama",
    deskripsi: "deskripsi",
    foto: heroImage,
  },
  {
    id: 4,
    nama: "Nama",
    deskripsi: "deskripsi",
    foto: heroImage,
  },
];

const OurBarber = () => {
  return (
    <section className="bg-black py-24 border-t border-neutral-900/60">
      <div className="max-w-7xl mx-auto px-6">
        {/* TITLE */}
        <div className="text-center mb-16">
          <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Barber Kami
          </h2>

          <p className="text-gray-400 text-sm md:text-base max-w-[800px] mx-auto leading-relaxed">
            Di setiap layanan kami, setiap barber kami bekerja dengan standar yang sama: rapi, detail, dan profesional. Kamu tidak perlu bingung memilih siapapun yang melayani, hasilnya tetap maksimal.
          </p>
        </div>

        {/* CARD GRID */}
        <div className="flex flex-wrap justify-center gap-8">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="w-full max-w-[260px] rounded-2xl overflow-hidden bg-[#1C1C1E] border border-neutral-800/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl"
            >
              {/* FOTO */}
              <div className="h-[280px] bg-neutral-800 overflow-hidden">
                <img
                  src={barber.foto}
                  alt={barber.nama}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* INFO */}
              <div className="px-5 py-4 text-left">
                <h3 className="text-white text-lg font-bold">
                  {barber.nama}
                </h3>
                <p className="text-[#FFCC00] text-sm mt-1">
                  {barber.deskripsi}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurBarber;