import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../services/api";

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getInitialName = () => {
    const localUserStr = localStorage.getItem('user');
    if (localUserStr) {
      try { return JSON.parse(localUserStr).name; } catch(e) {}
    }
    return user?.name || "User";
  };

  const getInitialPhone = () => {
    const localUserStr = localStorage.getItem('user');
    if (localUserStr) {
      try { return JSON.parse(localUserStr).phone || "-"; } catch(e) {}
    }
    return "-";
  };

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: getInitialName(),
    email: user?.email || "",
    phone: getInitialPhone(),
    password: "",
  });

  useEffect(() => {
    if (user?.id) {
      const localUserStr = localStorage.getItem('user');
      let localName = null;
      let localPhone = null;
      if (localUserStr) {
        try { 
          const parsed = JSON.parse(localUserStr);
          localName = parsed.name; 
          localPhone = parsed.phone;
        } catch(e) {}
      }
      setProfileData((prev) => ({
        ...prev,
        name: localName || user.name || "User",
        email: user.email || "",
        phone: localPhone || "-",
      }));

      // Fetch latest profile from backend
      api.get("/profile")
        .then((res) => {
          setProfileData((prev) => ({
            ...prev,
            name: res.data.name || prev.name,
            email: res.data.email || prev.email,
            phone: res.data.phone || prev.phone,
          }));
          
          if (setUser) {
             // We must safely update user without causing an infinite loop
             setUser((prevUser) => {
               if (!prevUser) return prevUser;
               const updated = { ...prevUser, name: res.data.name, phone: res.data.phone, avatar_url: res.data.avatar_url || prevUser.avatar_url };
               localStorage.setItem('user', JSON.stringify(updated));
               return updated;
             });
          }
        })
        .catch((err) => console.error("Failed to fetch profile", err));
    }
  }, [user?.id]); // Only re-run if the user ID changes, not the whole object reference!

  // Form input state (for edit mode)
  const [formData, setFormData] = useState({ ...profileData, confirmPassword: profileData.password });

  // Only reset formData from profileData when entering edit mode, not continuously!
  useEffect(() => {
    if (!isEditing) {
      setFormData({ ...profileData, confirmPassword: profileData.password });
    }
  }, [profileData, isEditing]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = () => {
    setFormData({ ...profileData, confirmPassword: profileData.password });
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Password konfirmasi tidak cocok!");
        return;
      }
    }

    try {
      await api.put("/profile", {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
      });

      setProfileData({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (user && setUser) {
        const updatedUser = { ...user, name: formData.name, phone: formData.phone };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      toast.success("Profil berhasil diperbarui!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui profil.");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Format foto harus JPG, JPEG, atau PNG.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 2MB.");
      return;
    }

    setIsUploading(true);
    const form = new FormData();
    form.append("photo", file);

    try {
      const res = await api.post("/profile/photo", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (setUser && user) {
        // Update user safely
        setUser((prevUser) => {
          if (!prevUser) return prevUser;
          const updated = { ...prevUser, avatar_url: res.data.avatar_url };
          localStorage.setItem('user', JSON.stringify(updated));
          return updated;
        });
      }
      toast.success("Foto profil berhasil diunggah!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Gagal mengunggah foto.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Helper to extract initials
  const getInitials = (fullName) => {
    const parts = fullName.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white px-6 py-12 md:px-12 md:py-16">
      <div className="max-w-[800px] mx-auto text-left">
        {/* BACK LINK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition mb-6 text-sm bg-transparent border-none cursor-pointer focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Kembali
        </button>

        {/* HEADINGS */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Profil Pengguna
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Kelola informasi akun dan lihat detail profil kamu.
          </p>
        </div>

        {/* CARD CONTAINER */}
        <div className="bg-[#1C1C1E] border border-neutral-800/60 rounded-2xl p-8 md:p-10 shadow-2xl">
          {/* CARD HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b border-neutral-800">
            <div className="flex items-center gap-5">
              {/* AVATAR */}
              <div className="w-24 h-24 rounded-full border border-neutral-700 bg-[#2C2C2E] shadow-lg flex items-center justify-center overflow-hidden select-none relative group">
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#FFB22C] border-t-transparent" />
                  </div>
                )}
                <img
                  src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=FFB22C&color=000&size=128`}
                  alt="Profile"
                  className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : 'opacity-100'} transition-opacity`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  {profileData.name}
                </h2>
                {isEditing && (
                  <div>
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handlePhotoUpload} 
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg font-medium transition cursor-pointer border border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? 'Mengunggah...' : 'Ganti Foto'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* EDIT BUTTON (Only in view mode) */}
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 bg-[#767680] hover:bg-[#636366] transition rounded-xl px-5 py-2.5 text-sm font-semibold text-white cursor-pointer select-none"
              >
                {/* EDIT ICON */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                Edit Profil
              </button>
            )}
          </div>

          {/* CARD BODY */}
          <div className="pt-8">
            {!isEditing ? (
              /* ================== VIEW PROFILE MODE ================== */
              <div className="space-y-6">
                <div>
                  <label className="text-neutral-500 text-xs font-bold uppercase tracking-wider block mb-1">
                    Nama Lengkap
                  </label>
                  <p className="text-white text-base font-medium">
                    {profileData.name}
                  </p>
                </div>

                <div>
                  <label className="text-neutral-500 text-xs font-bold uppercase tracking-wider block mb-1">
                    Email
                  </label>
                  <p className="text-white text-base font-medium">
                    {profileData.email}
                  </p>
                </div>

                <div>
                  <label className="text-neutral-500 text-xs font-bold uppercase tracking-wider block mb-1">
                    Nomor Telepon
                  </label>
                  <p className="text-white text-base font-medium">
                    {profileData.phone}
                  </p>
                </div>

                {/* KELUAR BUTTON */}
                <div className="pt-6">
                  <button
                    onClick={handleLogout}
                    className="w-full bg-transparent hover:bg-[#FFCC00] text-white hover:text-black border border-[#FFCC00] rounded-xl py-3.5 font-bold transition-all duration-300 text-sm"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            ) : (
              /* ================== EDIT PROFILE MODE ================== */
              <form onSubmit={handleSave} className="space-y-6">
                {/* NAMA LENGKAP */}
                <div>
                  <label className="text-white text-xs font-semibold block mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan nama lengkap"
                    className="w-full rounded-xl border border-neutral-700 bg-transparent px-4 py-3 text-white text-sm outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-all"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-white text-xs font-semibold block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan email"
                    className="w-full rounded-xl border border-neutral-700 bg-transparent px-4 py-3 text-white text-sm outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-all"
                  />
                </div>

                {/* NOMOR TELEPON */}
                <div>
                  <label className="text-white text-xs font-semibold block mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan nomor telepon"
                    className="w-full rounded-xl border border-neutral-700 bg-transparent px-4 py-3 text-white text-sm outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-all"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-white text-xs font-semibold block mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Masukkan password baru"
                    className="w-full rounded-xl border border-neutral-700 bg-transparent px-4 py-3 text-white text-sm outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-all"
                  />
                </div>

                {/* KONFIRMASI PASSWORD */}
                <div>
                  <label className="text-white text-xs font-semibold block mb-2">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Konfirmasi password baru"
                    className="w-full rounded-xl border border-neutral-700 bg-transparent px-4 py-3 text-white text-sm outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-all"
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="bg-[#FFCC00] hover:bg-yellow-400 text-black py-3 px-8 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="bg-transparent hover:bg-neutral-800 text-white border border-neutral-700 py-3 px-8 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Batalkan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
