import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiEdit2 } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function ProfileAdmin() {
  const { user, setUser } = useAuth();
  
  const getInitialName = () => {
    const localUserStr = localStorage.getItem('admin_profile');
    if (localUserStr) {
      try { return JSON.parse(localUserStr).name; } catch(e) {}
    }
    return user?.name || "Admin";
  };

  const getInitialPhone = () => {
    const localUserStr = localStorage.getItem('admin_profile');
    if (localUserStr) {
      try { return JSON.parse(localUserStr).phone || "(+62) 85722730000"; } catch(e) {}
    }
    return "(+62) 85722730000";
  };

  const [profile, setProfile] = useState({
    name: getInitialName(),
    email: user?.email || "admin@gmail.com",
    phone: getInitialPhone(),
    address: "Taman Kota Purbalingga Jl. A. Yani no. 57, Purbalingga, Jawa Tengah, Indonesia",
    role: user?.role === "admin" ? "Admin" : "User",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfile({
      ...profile,
      name: tempProfile.name,
      email: tempProfile.email,
      phone: tempProfile.phone,
      address: tempProfile.address,
    });
    
    if (user && setUser) {
      const updatedUser = { ...user, name: tempProfile.name, phone: tempProfile.phone };
      localStorage.setItem('admin_profile', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
    
    setIsEditing(false);
    alert("Profil berhasil diperbarui!");
  };

  return (
    <div className="p-8 md:p-10 bg-black min-h-full space-y-8 font-poppins">
      {/* HEADER */}
      <div>
        <h1 className="text-[34px] font-bold text-white tracking-tight">
          Profil Admin
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Kelola informasi profil dan data toko Anda.
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* SUMMARY CARD */}
        <div className="bg-[#1c1c1e] rounded-2xl p-8 flex items-center justify-between shadow-md text-left">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-[#111] text-white text-3xl font-bold flex items-center justify-center border border-[#333]">
              AE
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{profile.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{profile.role}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setTempProfile({
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
                address: profile.address,
              });
              setIsEditing(true);
            }}
            className="flex items-center gap-2 bg-[#7E7E82]/30 hover:bg-[#7E7E82]/45 active:bg-[#7E7E82]/60 text-white font-semibold px-5 py-3 rounded-xl transition-all cursor-pointer text-sm shadow-md"
          >
            <FiEdit2 size={16} />
            Edit Profil
          </button>
        </div>

        {/* PROFILE INFORMATION DETAILS CARD */}
        <div className="bg-[#1c1c1e] rounded-2xl p-8 shadow-md text-left">
          <h3 className="text-2xl font-bold text-white mb-6">Informasi Profil</h3>

          <div className="space-y-6">
            <div>
              <p className="text-white font-bold text-sm">Nama Lengkap</p>
              <p className="text-gray-400 text-sm mt-2">{profile.name}</p>
            </div>

            <div>
              <p className="text-white font-bold text-sm">Email</p>
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                <FiMail size={16} className="text-gray-500" />
                <span>{profile.email}</span>
              </div>
            </div>

            <div>
              <p className="text-white font-bold text-sm">Nomor Telepon</p>
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                <FiPhone size={16} className="text-gray-500" />
                <span>{profile.phone}</span>
              </div>
            </div>

            <div>
              <p className="text-white font-bold text-sm">Alamat</p>
              <div className="flex items-start gap-2 text-gray-400 text-sm mt-2">
                <FiMapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <span>{profile.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL OVERLAY */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-200">
          <div className="bg-[#1C1C1E] w-full max-w-[500px] rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-left">
            <h3 className="text-2xl font-bold text-white mb-1">Edit Profil</h3>
            <p className="text-gray-400 text-xs mb-6">Perbarui informasi profil Anda.</p>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-white font-semibold block mb-2 text-sm">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  placeholder="Nama Lengkap"
                  className="w-full rounded-xl bg-[#2C2C2E] border-0 px-4 py-3 text-white outline-none focus:bg-[#3A3A3C] transition-all text-sm"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-2 text-sm">Email</label>
                <input
                  type="email"
                  required
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                  placeholder="Email"
                  className="w-full rounded-xl bg-[#2C2C2E] border-0 px-4 py-3 text-white outline-none focus:bg-[#3A3A3C] transition-all text-sm"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-2 text-sm">Nomor Telepon</label>
                <input
                  type="text"
                  required
                  value={tempProfile.phone}
                  onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                  placeholder="Nomor Telepon"
                  className="w-full rounded-xl bg-[#2C2C2E] border-0 px-4 py-3 text-white outline-none focus:bg-[#3A3A3C] transition-all text-sm"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-2 text-sm">Alamat</label>
                <input
                  type="text"
                  required
                  value={tempProfile.address}
                  onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                  placeholder="Alamat"
                  className="w-full rounded-xl bg-[#2C2C2E] border-0 px-4 py-3 text-white outline-none focus:bg-[#3A3A3C] transition-all text-sm"
                />
              </div>

              <div className="flex gap-4 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="border border-[#FFCC00] text-white hover:bg-white/5 px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer text-sm"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  className="bg-[#FFCC00] hover:bg-yellow-400 active:bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl transition-all cursor-pointer text-sm shadow-md"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
