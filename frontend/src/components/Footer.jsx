import React from "react";

// IMPORT ASSETS
import logo from "../assets/logo.png";
import locationIcon from "../assets/location.png";
import phoneIcon from "../assets/phone.png";
import clockIcon from "../assets/clock.png";
import igIcon from "../assets/instagram.png";
import fbIcon from "../assets/facebook.png";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 md:px-12 py-16 font-poppins border-t border-neutral-800/60">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* LEFT */}
        <div className="space-y-4">
          <img src={logo} alt="Zigzag Barbershop" className="w-44 mb-2" />
          <p className="text-gray-400 text-sm leading-relaxed max-w-[340px]">
            Premium grooming experience untuk pria modern. Kami menghadirkan potongan terbaik dengan sentuhan profesional untuk meningkatkan rasa percaya diri kamu.
          </p>
        </div>

        {/* MIDDLE */}
        <div className="space-y-6">
          <h3 className="text-[#FFB22C] font-bold text-lg uppercase tracking-wider">
            Kontak
          </h3>

          <div className="space-y-5 text-gray-400 text-sm">
            <div className="flex items-start gap-4">
              <img src={locationIcon} alt="Location" className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                Taman Kota Purbalingga Jl. A. Yani no. 57, Purbalingga, Jawa Tengah, Indonesia
              </p>
            </div>

            <div className="flex items-center gap-4">
              <img src={phoneIcon} alt="Phone" className="w-5 h-5 flex-shrink-0" />
              <p>(+62) 85722730000</p>
            </div>

            <div className="flex items-start gap-4">
              <img src={clockIcon} alt="Clock" className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p>Buka Setiap Hari: 11.00 – 21.00</p>
                <p>Jumat: 13.30 – 21.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <h3 className="text-[#FFB22C] font-bold text-lg uppercase tracking-wider">
            Ikuti Kami
          </h3>

          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-115 transition-transform duration-200">
              <img src={igIcon} alt="Instagram" className="w-6 h-6" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-115 transition-transform duration-200">
              <img src={fbIcon} alt="Facebook" className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-neutral-500 text-xs mt-16 pt-8 border-t border-neutral-900/60 max-w-7xl mx-auto">
        &copy; 2026 Zigzag Barbershop. All rights reserved.
      </div>
    </footer>
  );
}