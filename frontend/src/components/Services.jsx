import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import haircutIcon from "../assets/haircut.png";
import massageIcon from "../assets/massage.png";
import permIcon from "../assets/perm.png";

export default function Services() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data.data.slice(0, 3));
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
    if (lower.includes("massage") || lower.includes("colour")) return massageIcon;
    if (lower.includes("perm")) return permIcon;
    return haircutIcon;
  };

  return (
    <section className="bg-black py-32">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* TITLE */}
        <div className="text-center">
          <h2 className="text-white text-[56px] font-bold">
            Layanan Kami
          </h2>

          <p className="text-[#BDBDBD] text-[16px] mt-6 max-w-[700px] mx-auto">
            Tidak perlu antre! Gunakan sistem booking kami untuk memilih waktu
            yang kamu inginkan dan nikmati layanan tanpa ribet.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">

          {loading && (
            <div className="col-span-3 text-center text-white font-semibold">
              Memuat layanan...
            </div>
          )}

          {error && (
            <div className="col-span-3 text-center text-red-500 font-semibold">
              {error}
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="col-span-3 text-center text-white font-semibold">
              Tidak ada layanan tersedia saat ini.
            </div>
          )}

          {!loading && !error && services.map((item, index) => (
            <div
              key={item.id || index}
              className="
                bg-[#242424]
                rounded-[12px]
                p-8
                w-[359px]
                h-[300px]
              "
            >
              <img
                src={getIcon(item.name)}
                alt={item.name}
                className="w-10 h-10 mb-6"
              />

              <h3 className="text-white text-[24px] font-bold mb-2 truncate">
                {item.name}
              </h3>

              <p className="text-[#FFC400] text-[18px] font-bold mb-4">
                Rp {item.price.toLocaleString("id-ID")},-
              </p>

              <p className="text-[#A5A5A5] text-[15px] leading-7 line-clamp-3">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-20">
          <button
            onClick={() => navigate("/layanan")}
            className="
              w-[300px]
              h-[58px]
              border
              border-[#FFC400]
              text-white
              rounded-[10px]
              font-semibold
              transition-all
              duration-300
              hover:bg-[#FFC400]
              hover:text-black
            "
          >
            Lihat selengkapnya
          </button>
        </div>

      </div>
    </section>
  );
}