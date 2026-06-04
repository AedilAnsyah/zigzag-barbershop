import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import haircut from "../assets/haircut.png";
import massage from "../assets/massage.png";
import perm from "../assets/perm.png";

export default function Layanan() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data.data);
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
    if (lower.includes("massage") || lower.includes("colour")) return massage;
    if (lower.includes("perm")) return perm;
    return haircut;
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">

      <div className="max-w-7xl mx-auto px-8">

        {/* TITLE */}
        <h1 className="
        text-[56px]
        font-bold
        text-center
        mb-4
      ">
          Layanan Kami
        </h1>

        <p className="
        text-[#9E9E9E]
        text-center
        text-[18px]
        mb-16
      ">
          Temukan berbagai layanan terbaik untuk menunjang penampilanmu.
        </p>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {loading && (
            <div className="col-span-3 text-center text-white font-semibold py-10">
              Memuat layanan...
            </div>
          )}

          {error && (
            <div className="col-span-3 text-center text-red-500 font-semibold py-10">
              {error}
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="col-span-3 text-center text-white font-semibold py-10">
              Tidak ada layanan tersedia saat ini.
            </div>
          )}

          {!loading && !error && services.map((service) => (
            <div
              key={service.id}
              className="
              bg-[#242424]
              rounded-xl
              p-8
              transition-all
              duration-300
              hover:scale-[1.02]
              hover:shadow-xl
            "
            >
              <img
                src={getIcon(service.name)}
                alt={service.name}
                className="w-12 h-12 mb-6"
              />

              <h3 className="
              text-white
              text-[28px]
              font-bold
              mb-2
            ">
                {service.name}
              </h3>

              <h4 className="
              text-[#FFC400]
              text-[20px]
              font-bold
              mb-4
            ">
                Rp {service.price.toLocaleString("id-ID")},-
              </h4>

              <p className="
              text-[#A0A0A0]
              leading-8
            ">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* NOTE */}
        <div className="mt-20 ml-8">
          <p
            className="
      text-left
      text-[#8F8F8F]
      max-w-4xl
      leading-8
    "
          >
            Layanan yang dapat direservasi secara online hanya untuk Haircut.
            Untuk layanan lainnya silahkan melakukan konsultasi melalui WhatsApp
            atau datang langsung ke tempat.
          </p>
        </div>

        {/* BUTTON */}
        <div className="flex justify-left mt-12">

          <button
            onClick={() => navigate("/")}
            className="
            px-10
            py-4
            border
            border-[#FFC400]
            rounded-lg
            text-white
            font-semibold
            transition-all
            duration-300
            hover:bg-[#FFC400]
            hover:text-black
          "
          >
            ← Kembali
          </button>

        </div>

      </div>

    </div>
  );
}