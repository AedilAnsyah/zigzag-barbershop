import React from "react";
import { NavLink } from "react-router-dom";

const Register = () => {
  return (
    <div className="bg-black min-h-screen text-white flex flex-col">

      {/* CONTENT */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#111] border border-gray-700 rounded-xl p-6 shadow-lg">
          
          <h1 className="text-3xl font-bold text-center mb-2">
            Buat Akun
          </h1>
          <p className="text-gray-400 text-center text-sm mb-6">
            Daftar sekarang untuk mulai booking dengan cepat dan praktis.
          </p>

          {/* GOOGLE BUTTON */}
          <button className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 transition py-2 rounded-md mb-4">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Lanjutkan dengan Google
          </button>

          {/* OR */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-gray-400 text-sm">atau</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          {/* FORM */}
          <form className="space-y-4">
            <div>
              <label className="text-sm text-gray-300">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama"
                className="w-full mt-1 px-3 py-2 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                placeholder="Masukkan email"
                className="w-full mt-1 px-3 py-2 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                className="w-full mt-1 px-3 py-2 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md transition"
            >
              Buat akun
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Sudah punya akun?{" "}
            <span className="text-yellow-400 cursor-pointer hover:underline">
              Masuk
            </span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;