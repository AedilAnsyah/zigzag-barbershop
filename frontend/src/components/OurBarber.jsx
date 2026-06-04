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
    <section className="bg-black py-28">
      <div className="max-w-[1440px] mx-auto px-6">

        {/* TITLE */}
        <div className="text-center mb-24">
          <h2 className="text-white text-[56px] font-bold mb-8">
            Barber Kami
          </h2>

          <p className="text-[#8F8F8F] text-[18px] leading-9 max-w-[1000px] mx-auto">
            Di Zigzag Barbershop, setiap barber kami bekerja dengan standar yang sama:
            rapi, detail, dan profesional.
            <br />
            Kamu tidak perlu bingung memilih siapapun yang melayani,
            hasilnya tetap maksimal.
          </p>
        </div>

        {/* CARD GRID */}
        <div className="flex flex-wrap justify-center gap-12">

          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="
                w-[280px]
                rounded-xl
                overflow-hidden
                bg-[#242424]
                transition-all
                duration-300
                hover:-translate-y-2
              "
            >

              {/* FOTO */}
              <img
                src={barber.foto}
                alt={barber.nama}
                className="
                  w-full
                  h-[300px]
                  object-cover
                "
              />

              {/* INFO */}
              <div className="px-4 py-4">

                <h3 className="text-white text-[18px] font-bold mb-1">
                  {barber.nama}
                </h3>

                <p className="text-[#FFC400] text-[14px]">
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