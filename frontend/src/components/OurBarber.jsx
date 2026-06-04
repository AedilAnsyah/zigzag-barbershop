import React, { useState, useEffect } from "react";
import heroImage from "../assets/barber.jpeg";
import api from "../services/api";

const OurBarber = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const response = await api.get("/barbers");
        setBarbers(response.data.data.slice(0, 4)); // Tampilkan maksimal 4 barber di beranda
      } catch (err) {
        setError("Gagal memuat barber");
      } finally {
        setLoading(false);
      }
    };
    fetchBarbers();
  }, []);
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
                src={heroImage}
                alt={barber.name}
                className="
                  w-full
                  h-[300px]
                  object-cover
                "
              />

              {/* INFO */}
              <div className="px-4 py-4">

                <h3 className="text-white text-[18px] font-bold mb-1">
                  {barber.name}
                </h3>

                <p className="text-[#FFC400] text-[14px]">
                  Barber Profesional
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