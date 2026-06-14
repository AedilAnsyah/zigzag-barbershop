import React from "react";
import { FiEdit2, FiTrash2, FiScissors } from "react-icons/fi";

export default function ServiceCard({ service, onEdit, onDelete }) {
  const formatRupiah = (number) => {
    const formatted = new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
    return `Rp. ${formatted},-`;
  };

  return (
    <div className="w-[320px] h-[400px] bg-[#1c1c1e] rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-md">
      <div className="space-y-4">
        {/* Scissors Icon */}
        <div>
          <FiScissors className="text-[#FFB22C] text-2xl" />
        </div>

        {/* Title and Price */}
        <div className="space-y-1">
          <h3 className="text-white font-bold text-[18px] leading-snug">
            {service.name}
          </h3>
          <p className="text-white font-bold text-[14px]">
            {formatRupiah(service.price)}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-[12px] leading-relaxed">
          {service.desc}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-6 space-y-3">
        {/* Reservasi Button */}
        <button className="w-full bg-[#FFCC00] hover:bg-yellow-400 active:bg-yellow-500 text-black font-bold py-2.5 rounded-xl transition-colors text-sm shadow-md cursor-pointer">
          Reservasi
        </button>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(service)}
            className="flex-1 flex items-center justify-center gap-1.5 border border-green-500 text-green-500 bg-transparent hover:bg-green-500/10 py-2.5 rounded-xl transition-all cursor-pointer text-sm font-semibold"
          >
            <FiEdit2 size={15} />
            Edit
          </button>
          <button
            onClick={() => onDelete(service.id)}
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

