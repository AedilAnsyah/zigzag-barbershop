import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import google from "../assets/google.png";

export default function SignIn() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate("/");
    } else {
      setErrorMsg(result.message);
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-5 py-20">

      <div className="w-full max-w-[450px]">

        {/* TITLE */}
        <div className="text-center mb-10">

          <h1 className="text-white text-5xl font-bold">
            Masuk ke akun kamu
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Masuk untuk melanjutkan reservasi dan atur jadwalmu dengan mudah.
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

          {/* ERROR MESSAGE */}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl mb-5 text-sm">
              {errorMsg}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit}>

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
              disabled={loading}
              className={`w-full transition rounded-xl py-4 font-bold text-black ${
                loading ? "bg-yellow-600 cursor-not-allowed" : "bg-[#FFCC00] hover:bg-yellow-400"
              }`}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

          </form>

          {/* FOOTER */}
          <p className="text-center text-gray-400 mt-6">

            Belum punya akun?{" "}

            <Link
              to="/daftar"
              className="text-yellow-400 font-semibold hover:underline"
            >
              Daftar
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}