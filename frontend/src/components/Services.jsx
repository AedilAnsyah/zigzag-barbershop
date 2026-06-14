import { useNavigate } from "react-router-dom";

import haircutIcon from "../assets/haircut.png";
import massageIcon from "../assets/massage.png";
import permIcon from "../assets/perm.png";

export default function Services() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Premium Hair cut",
      price: "Rp. 50.000,-",
      desc: "termasuk potong rambut, cuci rambut, handuk hangat, pijat kepala, dan minyak rambut",
      icon: haircutIcon,
    },
    {
      title: "Massage",
      price: "Rp. 25.000,-",
      desc: "relaksasi pundak dan kepala setelah mencukur rambut atau saat sedang lelah",
      icon: massageIcon,
    },
    {
      title: "Down Perm",
      price: "Rp. 50.000,-",
      desc: "menyamarkan rambut tebal di samping supaya terlihat lebih rapi dan rapi",
      icon: permIcon,
    },
  ];

  return (
    <section className="bg-black py-24 border-t border-neutral-900/60">
      <div className="max-w-7xl mx-auto px-6">
        {/* TITLE */}
        <div className="text-center mb-16">
          <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight">
            Layanan Kami
          </h2>

          <p className="text-gray-400 text-sm md:text-base mt-4 max-w-[650px] mx-auto leading-relaxed">
            klik salah satu layanan di bawah ini untuk memesan jadwal yang Anda inginkan dan nikmati layanan terpopuler kami.
          </p>
        </div>

        {/* CARDS */}
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          {services.map((item, index) => (
            <div
              key={index}
              className="bg-[#1C1C1E] border border-neutral-800/50 rounded-2xl p-8 w-full max-w-[360px] min-h-[280px] flex flex-col justify-start transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700/60 shadow-xl"
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-10 h-10 mb-6 object-contain"
              />

              <h3 className="text-white text-xl font-bold mb-2">
                {item.title}
              </h3>

              <p className="text-[#FFCC00] text-lg font-bold mb-4">
                {item.price}
              </p>

              <p className="text-gray-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-16">
          <button
            onClick={() => navigate("/layanan")}
            className="w-full max-w-[280px] py-3.5 border border-[#FFCC00] text-white rounded-xl font-semibold transition-all duration-300 hover:bg-[#FFCC00] hover:text-black"
          >
            Lihat selengkapnya
          </button>
        </div>
      </div>
    </section>
  );
}