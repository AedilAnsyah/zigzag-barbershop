import React from "react";
import { useNavigate } from "react-router-dom";

import haircut from "../assets/haircut.png";
import massage from "../assets/massage.png";
import perm from "../assets/perm.png";

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
        <div className="
        grid
        md:grid-cols-3
        gap-8
      ">

          {services.map((service) => (

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
                src={service.image}
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
                {service.price}
              </h4>

              <p className="
              text-[#A0A0A0]
              leading-8
            ">
                {service.desc}
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