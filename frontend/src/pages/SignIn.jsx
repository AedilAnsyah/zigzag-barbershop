import React from "react";
import { NavLink } from "react-router-dom";

const SignIn = () => {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4 text-white">
      
      <div className="w-full max-w-md bg-[#111] border border-gray-700 rounded-xl p-6 shadow-lg">
        
        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Masuk ke akun kamu
        </h1>
        <p className="text-gray-400 text-center text-sm mb-6">
          Masuk untuk melanjutkan booking dan atur jadwalmu dengan mudah.
        </p>

        {/* GOOGLE */}
        <button className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 transition py-2 rounded-md mb-4">
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
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              placeholder="masukkan email"
              className="w-full mt-1 px-3 py-2 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              placeholder="masukkan password"
              className="w-full mt-1 px-3 py-2 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md transition"
          >
            Masuk
          </button>
        </form>

        {/* LINK KE SIGN UP */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Belum punya akun?{" "}
          <NavLink to="/daftar" className="text-yellow-400 hover:underline">
            Daftar
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default SignIn;