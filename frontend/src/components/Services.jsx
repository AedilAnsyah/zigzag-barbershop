import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import haircutIcon from "../assets/haircut.png";
import massageIcon from "../assets/massage.png";
import permIcon from "../assets/perm.png";

export default function ServiceSection() {

  const navigate = useNavigate();

  // IMPORT FONT POPPINS
  useEffect(() => {

    const link = document.createElement("link");

    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";

    link.rel = "stylesheet";

    document.head.appendChild(link);

  }, []);

  // DATA SERVICES
  const services = [
    {
      title: "Hair cut",
      price: "Rp. 50.000,-",
      desc: "Include Haircut, Hairwash, Hot Towel, Styling, Simple Head Massage.",
      icon: haircutIcon,
    },

    {
      title: "Massage",
      price: "Rp. 25.000,-",
      desc: "Hilangkan penat dan stres dengan layanan massage terbaik kami.",
      icon: massageIcon,
    },

    {
      title: "Down Perm",
      price: "Rp. 50.000,-",
      desc: "Cocok untuk tampilan rambut lebih halus, rapi, dan tidak mengembang.",
      icon: permIcon,
    },
  ];

  return (

    <section className="bg-[#F5F5F5] py-24 font-[Poppins]">

      <div className="max-w-6xl mx-auto px-4 text-center">

        {/* TITLE */}
        <h2 className="text-[42px] font-bold text-black mb-4">
          Layanan Kami
        </h2>

        {/* SUBTITLE */}
        <p className="text-[#A0A0A0] text-[15px] leading-7 max-w-3xl mx-auto mb-16">
          Tidak perlu antre! Gunakan sistem booking kami untuk memilih waktu yang kamu inginkan dan nikmati layanan tanpa ribet.
        </p>

        {/* CARD GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {services.map((item, i) => (

            <div
              key={i}
              className="bg-white rounded-[24px] shadow-md p-8 text-left hover:shadow-xl transition duration-300"
            >

              {/* ICON */}
              <img
                src={item.icon}
                alt={item.title}
                className="w-11 h-11 mb-5"
              />

              {/* TITLE */}
              <h3 className="text-[30px] font-bold text-black leading-tight mb-2">
                {item.title}
              </h3>

              {/* PRICE */}
              <p className="text-[18px] font-bold text-black mb-4">
                {item.price}
              </p>

              {/* DESCRIPTION */}
              <p className="text-[#9A9A9A] text-[15px] leading-7">
                {item.desc}
              </p>

            </div>

          ))}

        </div>

        {/* BOTTOM BUTTON */}
        <div className="mt-16">

          <button
            onClick={() => navigate("/layanan")}
            className="border-2 border-[#FFB22C] px-8 py-3 rounded-xl font-semibold text-black hover:bg-[#FFB22C] transition"
          >
            Lihat Selengkapnya
          </button>

        </div>

      </div>

    </section>
  );
}