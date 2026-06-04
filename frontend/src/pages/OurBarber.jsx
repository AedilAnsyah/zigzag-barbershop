import React, { useState, useEffect } from "react";
import heroImage from "../assets/barber.jpeg";
import api from "../services/api";

const Barbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          {loading && (
            <div className="col-span-1 sm:col-span-2 md:col-span-4 text-center text-gray-500 font-semibold py-10">
              Memuat barber...
            </div>
          )}

          {error && (
            <div className="col-span-1 sm:col-span-2 md:col-span-4 text-center text-red-500 font-semibold py-10">
              {error}
            </div>
          )}

          {!loading && !error && barbers.length === 0 && (
            <div className="col-span-1 sm:col-span-2 md:col-span-4 text-center text-gray-500 font-semibold py-10">
              Tidak ada barber tersedia saat ini.
            </div>
          )}

          {!loading && !error && barbers.map((barber) => (
            <div
              key={barber.id}
              className="bg-white rounded-xl shadow-md p-4 text-left hover:shadow-lg transition"
            >
              {/* Image Placeholder */}
              <img
                src={heroImage}
                alt={barber.name}
                className="w-full h-70 object-cover rounded-lg mb-3"
              />

              {/* Name */}
              <h3 className="font-bold text-gray-900">
                {barber.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500">
                Barber Profesional
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Barbers;