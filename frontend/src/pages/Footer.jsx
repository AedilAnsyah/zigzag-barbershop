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
    <footer className="bg-black text-white px-10 py-12 font-poppins">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* LEFT */}
        <div>
          <img src={logo} alt="Zigzag Barbershop" className="w-40 mb-4" />

          <p className="text-gray-400 text-sm leading-relaxed">
            Premium grooming experience untuk pria modern.
          </p>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            Kami menghadirkan potongan terbaik dengan sentuhan profesional
            untuk meningkatkan rasa percaya diri kamu.
          </p>
        </div>

        {/* MIDDLE */}
        <div>
          <h3 className="text-[#FFB22C] font-semibold text-lg mb-6">
            Contact
          </h3>

          <div className="space-y-4 text-gray-400 text-sm">
            <div className="flex items-start gap-3">
              <img src={locationIcon} className="w-5 mt-1" />
              <p>
                Taman Kota Purbalingga Jl. A. Yani no. 57,
                <br /> Purbalingga, Jawa Tengah, Indonesia
              </p>
            </div>

            <div className="flex items-center gap-3">
              <img src={phoneIcon} className="w-5" />
              <p>(+62) 85722730000</p>
            </div>

            <div className="flex items-start gap-3">
              <img src={clockIcon} className="w-5 mt-1" />
              <p>
                Open Daily : 11am - 9pm
                <br /> Friday : 1.30pm - 9pm
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <h3 className="text-[#FFB22C] font-semibold text-lg mb-6">
            Follow us
          </h3>

          <div className="flex gap-4">
            <img src={igIcon} className="w-6 cursor-pointer hover:scale-110 transition" />
            <img src={fbIcon} className="w-6 cursor-pointer hover:scale-110 transition" />
          </div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-gray-500 text-sm mt-10">
        © 2026 Zigzag Barbershop. All rights reserved.
      </div>
    </footer>
  );
}