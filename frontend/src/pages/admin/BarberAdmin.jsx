import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import BarberCard from "../../components/admin/BarberCard";
import api from "../../services/api";

export default function BarberAdmin() {
  const [barbers, setBarbers] = useState([]);

  const fetchBarbers = async () => {
    try {
      const response = await api.get('/barbers');
      const data = response.data.data || [];
      const formatted = data.map(b => ({
        id: b.ID || b.id,
        name: b.name || "Barber",
        specialty: b.specialty ? b.specialty.split(',') : [],
        desc: b.specialty || "Barber profesional",
        description: b.specialty || "Barber profesional",
        rating: b.rating || 5.0,
        reviews: 0,
        isActive: b.is_active !== undefined ? b.is_active : (b.provider !== 'inactive'),
        isPresentToday: b.is_present_today || false
      }));
      setBarbers(formatted);
    } catch (err) {
      console.error("Gagal fetch barbers:", err);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBarber, setCurrentBarber] = useState({
    id: null,
    name: "",
    desc: ""
  });

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus barber ini?")) {
      setBarbers(barbers.filter((b) => b.id !== id));
      alert("Barber berhasil dihapus!");
    }
  };

  const handleToggleActive = async (id) => {
    if (!id) {
      console.error("ID Barber tidak ditemukan pada toggle");
      return;
    }
    
    const barberToToggle = barbers.find(b => b.id === id);
    if (!barberToToggle) return;
    
    const currentStatus = barberToToggle.isActive;
    const newStatus = !currentStatus;

    // 1. Ubah UI duluan (Optimistic Update)
    setBarbers(prev => prev.map(b => (b.id === id) ? { ...b, isActive: newStatus } : b));

    try {
      // 2. Tembak API
      await api.put(`/admin/barbers/${id}/status`, { is_active: newStatus });
    } catch (error) {
      // 3. Jika gagal, kembalikan posisi sakelar dan tampilkan error asli
      console.error("Gagal update barber:", error.response?.data || error.message);
      setBarbers(prev => prev.map(b => (b.id === id) ? { ...b, isActive: currentStatus } : b));
      alert(`Gagal: ${error.response?.data?.error || "Terjadi kesalahan server"}`);
    }
  };

  const handleEditClick = (barber) => {
    setCurrentBarber({
      id: barber.id,
      name: barber.name,
      desc: barber.description || barber.desc || ""
    });
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setCurrentBarber({
      id: null,
      name: "",
      desc: ""
    });
    setIsAdding(true);
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isAdding) {
      const added = {
        id: Date.now(),
        name: currentBarber.name,
        desc: currentBarber.desc,
        description: currentBarber.desc,
        specialty: currentBarber.desc.split(",").map(s => s.trim()).filter(s => s.length > 0),
        rating: 5.0,
        reviews: 0,
        isActive: true
      };

      setBarbers([...barbers, added]);
      alert("Barber baru berhasil ditambahkan!");
      setIsAdding(false);
    } else if (isEditing) {
      setBarbers(
        barbers.map((b) =>
          b.id === currentBarber.id
            ? {
                ...b,
                name: currentBarber.name,
                desc: currentBarber.desc,
                description: currentBarber.desc,
                specialty: currentBarber.desc.split(",").map(s => s.trim()).filter(s => s.length > 0)
              }
            : b
        )
      );
      alert("Barber berhasil diperbarui!");
      setIsEditing(false);
    }
  };

  return (
    <div className="p-8 md:p-10 bg-black min-h-full space-y-8 font-poppins">
      {/* HEADER */}
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-[34px] font-bold text-white tracking-tight">
            Kelola Barber
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Tambah, edit, atau hapus data barber
          </p>
        </div>

        <div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-[#FFCC00] text-black font-bold px-5 py-3 rounded-xl hover:bg-yellow-400 active:bg-yellow-500 transition-colors shadow-lg shadow-yellow-500/10 cursor-pointer text-sm"
          >
            <FiPlus size={18} />
            Tambah Barber
          </button>
        </div>
      </div>

      {/* FORM (ADD / EDIT) MODAL OVERLAY */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-200">
          <div className="bg-[#1C1C1E] w-full max-w-[500px] rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-left">
            <h3 className="text-2xl font-bold text-white mb-1">
              {isAdding ? "Tambah Barber" : "Edit Barber"}
            </h3>
            <p className="text-gray-400 text-xs mb-6">
              {isAdding ? "Isi data barber baru di bawah ini." : "Ubah data barber di bawah ini."}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-white font-semibold block mb-2 text-sm">Nama</label>
                <input
                  type="text"
                  required
                  value={currentBarber.name}
                  onChange={(e) => setCurrentBarber({ ...currentBarber, name: e.target.value })}
                  placeholder="Nama Barber"
                  className="w-full rounded-xl bg-[#2C2C2E] border-0 px-4 py-3 text-white outline-none focus:bg-[#3A3A3C] transition-all text-sm"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-2 text-sm">Deskripsi</label>
                <input
                  type="text"
                  required
                  value={currentBarber.desc}
                  onChange={(e) => setCurrentBarber({ ...currentBarber, desc: e.target.value })}
                  placeholder="Deskripsi"
                  className="w-full rounded-xl bg-[#2C2C2E] border-0 px-4 py-3 text-white outline-none focus:bg-[#3A3A3C] transition-all text-sm"
                />
              </div>

              <div className="flex gap-4 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(false);
                  }}
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

      {/* BARBERS GRID */}
      <div className="flex flex-wrap gap-6">
        {barbers.map((barber) => (
          <BarberCard
            key={barber.id}
            barber={barber}
            onToggleActive={handleToggleActive}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
