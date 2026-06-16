import React from "react";
import { FiCheck, FiX } from "react-icons/fi";

export default function BookingTable({ reservations, showActions = false, onConfirm, onCancel, onComplete }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Menunggu":
        return "bg-[#FEF3C7] text-[#D97706] border border-[#FEF3C7]/60";
      case "Dikonfirmasi":
        return "bg-[#DBEAFE] text-[#2563EB] border border-[#DBEAFE]/60";
      case "Dibatalkan":
        return "bg-[#FEE2E2] text-[#DC2626] border border-[#FEE2E2]/60";
      case "Selesai":
        return "bg-[#DCFCE7] text-[#16A34A] border border-[#DCFCE7]/60";
      default:
        return "bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]";
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] overflow-hidden shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border border-[#E5E7EB]">
          <thead>
            <tr className="bg-[#EBEBEB]">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-black border border-[#E5E7EB] w-[60px] text-center">
                ID
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-black border border-[#E5E7EB]">
                Pelanggan
              </th>
              {showActions && (
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-black border border-[#E5E7EB]">
                  Kontak
                </th>
              )}
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-black border border-[#E5E7EB]">
                Layanan
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-black border border-[#E5E7EB] text-center w-[80px]">
                Barber
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-black border border-[#E5E7EB]">
                Tanggal & Waktu
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-black border border-[#E5E7EB]">
                Harga
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-black border border-[#E5E7EB]">
                Status
              </th>
              {showActions && (
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-black border border-[#E5E7EB] text-center w-[120px]">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {reservations.length > 0 ? (
              reservations.map((row) => (
                <tr
                  key={row.id}
                  className="bg-white hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-neutral-800 font-semibold text-center border border-[#E5E7EB]">
                    {row.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-black border border-[#E5E7EB]">
                    {row.name}
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 text-sm text-neutral-700 font-mono border border-[#E5E7EB]">
                      {row.phone || "-"}
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-neutral-700 border border-[#E5E7EB]">
                    {row.service}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-700 text-center font-medium border border-[#E5E7EB]">
                    {row.barber}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600 border border-[#E5E7EB]">
                    {row.time}
                  </td>
                  <td className="px-6 py-4 text-sm text-black font-semibold border border-[#E5E7EB]">
                    {row.price}
                  </td>
                  <td className="px-6 py-4 text-sm border border-[#E5E7EB]">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full tracking-wide ${getStatusBadge(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 text-sm text-center border border-[#E5E7EB]">
                      <div className="flex items-center justify-center gap-2">
                        {row.status === "Menunggu" && (
                          <>
                            {onConfirm && (
                              <button
                                onClick={() => onConfirm(row.id)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
                              >
                                Konfirmasi
                              </button>
                            )}
                            {onCancel && (
                              <button
                                onClick={() => onCancel(row.id)}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
                              >
                                Batalkan
                              </button>
                            )}
                          </>
                        )}

                        {row.status === "Dikonfirmasi" && onComplete && (
                          <button
                            onClick={() => onComplete(row.id)}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
                          >
                            Selesai
                          </button>
                        )}

                        {(row.status === "Selesai" || row.status === "Dibatalkan") && (
                          <span className="text-gray-400 font-medium">-</span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={showActions ? 9 : 7}
                  className="px-6 py-12 text-center text-gray-500 font-medium text-sm bg-white"
                >
                  Tidak ada reservasi ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

