import React from "react";

const barbers = [
  { id: 1, nama: "Nama", deskripsi: "deskripsi" },
  { id: 2, nama: "Nama", deskripsi: "deskripsi" },
  { id: 3, nama: "Nama", deskripsi: "deskripsi" },
  { id: 4, nama: "Nama", deskripsi: "deskripsi" },
];

const Barbers = () => {
  return (
    <section className="bg-[#f5f5f5] py-16 font-poppins">
      <div className="max-w-6xl mx-auto px-4 text-center">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Our Barbers
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm max-w-3xl mx-auto mb-12">
          Di Zigzag Barbershop, setiap barber kami bekerja dengan standar yang sama:
          rapi, detail, dan profesional. Kamu tidak perlu bingung memilih siapapun
          yang melayani, hasilnya tetap maksimal.
        </p>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="bg-white rounded-xl shadow-md p-4 text-left hover:shadow-lg transition"
            >
              
              {/* Image Placeholder */}
              <div className="w-full h-40 bg-gray-300 rounded-md mb-4">
                {/* nanti ganti jadi <img src="..." /> */}
              </div>

              {/* Name */}
              <h3 className="font-bold text-gray-900">
                {barber.nama}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500">
                {barber.deskripsi}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Barbers;