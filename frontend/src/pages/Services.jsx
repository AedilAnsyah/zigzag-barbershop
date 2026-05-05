import { useEffect } from "react";
import haircutIcon from "../assets/haircut.png";
import massageIcon from "../assets/massage.png";
import permIcon from "../assets/perm.png";

export default function ServiceSection() {
  // Inject font Poppins tanpa edit HTML
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

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
    <section className="bg-[#F5F5F5] py-20 font-[Poppins]">
      <div className="max-w-6xl mx-auto px-4 text-center">

        {/* Title */}
        <h2 className="text-3xl font-bold mb-3">Service</h2>
        <p className="text-gray-400 text-sm mb-14">
          Tidak perlu antre! Gunakan sistem booking kami untuk memilih waktu yang kamu inginkan dan nikmati layanan tanpa ribet.
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md p-6 text-left hover:shadow-xl transition duration-300"
            >
              {/* Icon */}
              <img
                src={item.icon}
                alt={item.title}
                className="w-10 h-10 mb-4"
              />

              {/* Title */}
              <h3 className="text-lg font-bold">{item.title}</h3>

              {/* Price */}
              <p className="font-bold mt-1 mb-2">{item.price}</p>

              {/* Desc */}
              <p className="text-gray-400 text-sm mb-6">{item.desc}</p>

              {/* Button */}
              <button className="w-full bg-[#FFB22C] py-2 rounded-md font-semibold hover:opacity-90 transition">
                Booking
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Button */}
        <div className="mt-14">
          <button className="border border-[#FFB22C] px-6 py-2 rounded-md font-semibold hover:bg-[#FFB22C] transition">
            Lihat Selengkapnya
          </button>
        </div>
      </div>
    </section>
  );
}