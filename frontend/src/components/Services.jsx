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
      desc: "Termasuk Potong Rambut, Cuci Rambut, Handuk Hangat, Styling, dan Pijat Kepala Ringan.",
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

          {services.map((item, index) => (
            <div
  key={index}
  className="
    bg-[#242424]
    rounded-[12px]
    p-8
    w-[359px]
    h-[300px]
  "
>
              <img
                src={item.icon}
                alt={item.title}
                className="w-10 h-10 mb-6"
              />

              <h3 className="text-white text-[24px] font-bold mb-2">
                {item.title}
              </h3>

              <p className="text-[#FFC400] text-[18px] font-bold mb-4">
                {item.price}
              </p>

              <p className="text-[#A5A5A5] text-[15px] leading-7">
                {item.desc}
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