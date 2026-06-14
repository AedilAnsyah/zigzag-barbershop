import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import ServiceCard from "../../components/admin/ServiceCard";

export default function LayananAdmin() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Premium Hair cut",
      price: 50000,
      duration: "45 Menit",
      desc: "Termasuk Potong Rambut, Cuci Rambut, Handuk Hangat, Styling, dan Pijat Kepala Ringan.",
    },
    {
      id: 2,
      name: "Hairwash & Massage",
      price: 35000,
      duration: "30 Menit",
      desc: "Pembersihan rambut menyeluruh dengan sampo premium dan pijatan relaksasi pada kepala dan leher.",
    },
    {
      id: 3,
      name: "Beard Trim & Shave",
      price: 25000,
      duration: "25 Menit",
      desc: "Perapihan jenggot dan kumis presisi tinggi menggunakan pisau cukur steril dan handuk hangat.",
    },
    {
      id: 4,
      name: "Hair Coloring",
      price: 120000,
      duration: "90 Menit",
      desc: "Pewarnaan rambut profesional menggunakan cat rambut premium yang aman dan awet.",
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentService, setCurrentService] = useState({
    id: null,
    name: "",
    price: "",
    duration: "",
    desc: ""
  });

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus layanan ini?")) {
      setServices(services.filter((s) => s.id !== id));
      alert("Layanan berhasil dihapus!");
    }
  };

  const handleEditClick = (service) => {
    setCurrentService(service);
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setCurrentService({
      id: null,
      name: "",
      price: "",
      duration: "45 Menit",
      desc: ""
    });
    setIsAdding(true);
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isAdding) {
      const newService = {
        ...currentService,
        id: Date.now(),
        price: Number(currentService.price) || 0,
        duration: currentService.duration || "45 Menit"
      };
      setServices([...services, newService]);
      alert("Layanan baru berhasil ditambahkan!");
      setIsAdding(false);
    } else if (isEditing) {
      setServices(
        services.map((s) =>
          s.id === currentService.id
            ? { ...currentService, price: Number(currentService.price) || 0 }
            : s
        )
      );
      alert("Layanan berhasil diperbarui!");
      setIsEditing(false);
    }
  };

  return (
    <div className="p-8 md:p-10 bg-black min-h-full space-y-8 font-poppins">
      {/* HEADER */}
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-[34px] font-bold text-white tracking-tight">
            Kelola Layanan
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Kelola data layanan barbershop
          </p>
        </div>

        <div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-[#FFCC00] text-black font-bold px-5 py-3 rounded-xl hover:bg-yellow-400 active:bg-yellow-500 transition-colors shadow-lg shadow-yellow-500/10 cursor-pointer text-sm"
          >
            <FiPlus size={18} />
            Tambah Layanan
          </button>
        </div>
      </div>

      {/* FORM (ADD / EDIT) MODAL OVERLAY */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-200">
          <div className="bg-[#1C1C1E] w-full max-w-[500px] rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-left">
            <h3 className="text-2xl font-bold text-white mb-1">
              {isAdding ? "Tambah Layanan" : "Edit Layanan"}
            </h3>
            <p className="text-gray-400 text-xs mb-6">
              {isAdding ? "Isi data layanan baru di bawah ini." : "Ubah data layanan di bawah ini."}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-white font-semibold block mb-2 text-sm">Nama Layanan</label>
                <input
                  type="text"
                  required
                  value={currentService.name}
                  onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
                  placeholder="Nama Layanan"
                  className="w-full rounded-xl bg-[#2C2C2E] border-0 px-4 py-3 text-white outline-none focus:bg-[#3A3A3C] transition-all text-sm"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-2 text-sm">Deskripsi</label>
                <input
                  type="text"
                  required
                  value={currentService.desc}
                  onChange={(e) => setCurrentService({ ...currentService, desc: e.target.value })}
                  placeholder="Deskripsi"
                  className="w-full rounded-xl bg-[#2C2C2E] border-0 px-4 py-3 text-white outline-none focus:bg-[#3A3A3C] transition-all text-sm"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-2 text-sm">Harga</label>
                <input
                  type="text"
                  required
                  value={currentService.price}
                  onChange={(e) => setCurrentService({ ...currentService, price: e.target.value })}
                  placeholder="Harga"
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

      {/* SERVICES GRID */}
      <div className="flex flex-wrap gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
