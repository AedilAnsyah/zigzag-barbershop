import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import google from "../assets/google.png";

export default function SignUp() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    console.log("REGISTER :", formData);

    alert("Akun berhasil dibuat!");

    navigate("/masuk");

  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-5 py-20">

      <div className="w-full max-w-[450px]">

        {/* TITLE */}
        <div className="text-center mb-10">

          <h1 className="text-white text-5xl font-bold">
            Buat Akun
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Daftar sekarang untuk mulai reservasi dengan cepat dan praktis.
          </p>

        </div>

        {/* CARD */}
        <div className="bg-[#242424] border border-gray-600 rounded-2xl p-6 shadow-xl">

          {/* GOOGLE */}
          <button
            className="w-full bg-[#BDBDBD] hover:bg-[#d1d1d1] transition rounded-xl py-4 flex items-center justify-center gap-3 font-semibold text-white"
          >

            <img
              src={google}
              alt="google"
              className="w-6 h-6"
            />

            Lanjutkan dengan Google

          </button>

          {/* LINE */}
          <div className="flex items-center gap-4 my-8">

            <div className="flex-1 h-[1px] bg-gray-500"></div>

            <span className="text-gray-300">
              atau
            </span>

            <div className="flex-1 h-[1px] bg-gray-500"></div>

          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>

            {/* FULLNAME */}
            <div className="mb-5">

              <label className="text-white block mb-2">
                Nama Lengkap
              </label>

              <input
                type="text"
                name="fullname"
                placeholder="masukkan nama lengkap"
                value={formData.fullname}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-500 bg-transparent px-4 py-3 text-white outline-none focus:border-yellow-400"
              />

            </div>

            {/* EMAIL */}
            <div className="mb-5">

              <label className="text-white block mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="masukkan email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-500 bg-transparent px-4 py-3 text-white outline-none focus:border-yellow-400"
              />

            </div>

            {/* PASSWORD */}
            <div className="mb-7">

              <label className="text-white block mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="masukkan password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-500 bg-transparent px-4 py-3 text-white outline-none focus:border-yellow-400"
              />

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#FFCC00] hover:bg-yellow-400 transition rounded-xl py-4 font-bold text-black"
            >
              Buat akun
            </button>

          </form>

          {/* FOOTER */}
          <p className="text-center text-gray-400 mt-6">

            Sudah punya akun?{" "}

            <Link
              to="/masuk"
              className="text-yellow-400 font-semibold hover:underline"
            >
              Masuk
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}