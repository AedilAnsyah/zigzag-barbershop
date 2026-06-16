import React from "react";
import { FiUser, FiTrash2, FiEdit2 } from "react-icons/fi";

export default function BarberCard({ barber, onToggleActive, onEdit, onDelete }) {
  return (
    <div className="w-[280px] bg-[#1c1c1e] rounded-2xl overflow-hidden flex flex-col justify-between shadow-md transition-all duration-300 relative">
      {/* TOP PLACEHOLDER IMAGE */}
      <div className="w-full aspect-square bg-neutral-800 flex items-center justify-center text-gray-600">
        <FiUser size={48} className="opacity-40" />
      </div>

      {/* BOTTOM CONTENT AREA */}
      <div className="p-6 flex flex-col gap-4">
        {/* Name & Active Toggle Status */}
        <div className="flex items-center justify-between">
          <div className="text-left flex flex-col items-start">
            <h3 className="text-white font-bold text-lg leading-tight">
              {barber.name}
            </h3>
            <p className="text-[#FFCC00] text-xs font-semibold mt-1">
              {barber.description || barber.desc || "deskripsi"}
            </p>
            {barber.isPresentToday !== undefined && (
              <div className="mt-2">
                {barber.isPresentToday ? (
                  <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20 font-medium">
                    ✅ Hadir Hari Ini
                  </span>
                ) : (
                  <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20 font-medium">
                    ❌ Belum Absen
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => onToggleActive(barber.id)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none flex items-center ${
              barber.isActive ? "bg-[#FFCC00]" : "bg-neutral-600"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                barber.isActive ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => onEdit(barber)}
            className="flex-1 flex items-center justify-center gap-1.5 border border-green-500 text-green-500 bg-transparent hover:bg-green-500/10 py-2.5 rounded-xl transition-all cursor-pointer text-sm font-semibold"
          >
            <FiEdit2 size={15} />
            Edit
          </button>
          <button
            onClick={() => onDelete(barber.id)}
            className="flex-1 flex items-center justify-center gap-1.5 border border-red-500 text-red-500 bg-transparent hover:bg-red-500/10 py-2.5 rounded-xl transition-all cursor-pointer text-sm font-semibold"
          >
            <FiTrash2 size={15} />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
