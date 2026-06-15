import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import google from "../assets/google.png";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleLogin = async () => {
    try {
      // Ambil consent URL dari backend
      const response = await api.get('/auth/google/url');
      // Redirect browser ke halaman login Google
      window.location.href = response.data.url;
    } catch (error) {
      alert('Gagal menginisialisasi Google Login. Silakan coba lagi.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("REGISTER :", formData);
    alert("Akun berhasil dibuat!");
    navigate("/masuk");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-[460px]">
        {/* TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-white text-[42px] font-bold tracking-tight">
            Buat Akun
          </h1>
          <p className="text-gray-400 mt-3 text-sm leading-relaxed max-w-[360px] mx-auto">
            Daftar sekarang untuk mulai reservasi dengan cepat dan praktis.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-[#1C1C1E] rounded-2xl p-8 shadow-2xl border border-neutral-800/50">
          {/* GOOGLE */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-[#767680] hover:bg-[#636366] active:bg-[#48484a] transition-colors rounded-xl py-3.5 flex items-center justify-center gap-3 font-semibold text-white text-sm"
          >
            <img
              src={google}
              alt="google"
              className="w-5 h-5"
            />
            Lanjutkan dengan Google
          </button>

          {/* LINE */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-grow h-[1px] bg-neutral-700"></div>
            <span className="text-neutral-400 text-xs font-medium">
              atau
            </span>
            <div className="flex-grow h-[1px] bg-neutral-700"></div>
          </div>

          {/* ERROR MESSAGE */}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl mb-5 text-sm">
              {errorMsg}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* FULLNAME */}
            <div>
              <label className="text-white text-xs font-medium block mb-2 text-left">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="fullname"
                placeholder="Masukkan nama lengkap"
                value={formData.fullname}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-neutral-700 bg-transparent px-4 py-3 text-white text-sm outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] placeholder-neutral-500 transition-all"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-white text-xs font-medium block mb-2 text-left">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-neutral-700 bg-transparent px-4 py-3 text-white text-sm outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] placeholder-neutral-500 transition-all"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-white text-xs font-medium block mb-2 text-left">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-neutral-700 bg-transparent px-4 py-3 text-white text-sm outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] placeholder-neutral-500 transition-all"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#FFCC00] hover:bg-yellow-400 active:bg-yellow-500 transition-colors rounded-xl py-3.5 font-bold text-black text-sm mt-2"
            >
              {loading ? "Memproses..." : "Buat akun"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-neutral-400 text-xs mt-6">
            Sudah punya akun?{" "}
            <Link
              to="/masuk"
              className="text-[#FFCC00] font-semibold hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}