import React from "react";
import { useNavigate } from "react-router-dom";

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
    image: massage,
    desc: "Pewarnaan rambut dengan warna natural untuk tampilan yang lebih rapi.",
  },

  {
    id: 6,
    name: "Highlight",
    price: "Mulai 100.000,-",
    image: haircut,
    desc: "Tambahan warna untuk memberi dimensi pada rambut.",
  },

  {
    id: 7,
    name: "Fashion Colouring",
    price: "Mulai 250.000,-",
    image: massage,
    desc: "Ekspresikan gaya unikmu dengan warna rambut yang bold dan berbeda.",
  },
];

export default function Layanan() {

  const navigate = useNavigate();

  return (
    <div className="layanan-page">

      <div className="layanan-container">

        {/* TITLE */}
        <h1 className="layanan-title">
          Layanan Kami
        </h1>

        <p className="layanan-subtitle">
          Temukan berbagai layanan terbaik untuk menunjang penampilanmu.
        </p>

        {/* GRID */}
        <div className="layanan-grid">

          {services.map((service) => (

            <div
              key={service.id}
              className="layanan-card"
            >

              <img
                src={service.image}
                alt={service.name}
                className="layanan-icon"
              />

              <h3>{service.name}</h3>

              <h4>{service.price}</h4>

              <p>{service.desc}</p>

            </div>

          ))}

        </div>

        {/* NOTE */}
        <p className="layanan-note">
          Layanan yang dapat direservasi secara online hanya untuk Haircut.
          Untuk layanan lainnya silahkan melakukan konsultasi melalui WhatsApp
          atau datang langsung ke tempat.
        </p>

        {/* BUTTON */}
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

      </div>

    </div>
  );
}