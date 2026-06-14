import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import StepBooking from "../../components/StepBooking";

export default function Ulasan() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedService = location.state?.service;
  const selectedBarber = location.state?.barber;
  const selectedDate = location.state?.date;
  const selectedTime = location.state?.time;

  // Modal states: null, 'confirm', 'qr', 'success'
  const [activeModal, setActiveModal] = useState(null);
  const [timeLeft, setTimeLeft] = useState(807); // 13:27 (807 seconds) from mockup
  const canvasRef = useRef(null);

  // Timer loop for QR modal
  useEffect(() => {
    if (activeModal !== "qr") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeModal]);

  // Canvas-based random dynamic QR code pattern generator
  useEffect(() => {
    if (activeModal !== "qr" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    
    const drawQRCode = () => {
      const ctx = canvas.getContext("2d");
      const size = canvas.width;
      ctx.clearRect(0, 0, size, size);

      // Background remains transparent, do not fill with white!

      const modules = 21; // QR code modules grid size
      const moduleSize = 9; // Set exact integer module size

      // Draw random binary grid modules in white (with transparent spacing)
      for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
          const isWhite = Math.random() < 0.45;
          if (isWhite) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(c * moduleSize, r * moduleSize, moduleSize, moduleSize);
          }
        }
      }

      // Draw 3 static finder patterns in the corners (white outlines, transparent interior, white center)
      const drawFinder = (startRow, startCol) => {
        const xOuter = startCol * moduleSize;
        const yOuter = startRow * moduleSize;
        const wOuter = 7 * moduleSize;
        
        const xInner = (startCol + 1) * moduleSize;
        const yInner = (startRow + 1) * moduleSize;
        const wInner = 5 * moduleSize;

        const xCenter = (startCol + 2) * moduleSize;
        const yCenter = (startRow + 2) * moduleSize;
        const wCenter = 3 * moduleSize;

        // Outer 7x7 white square
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(xOuter, yOuter, wOuter, wOuter);

        // Inner 5x5 transparent gap (cleared back to transparent, no anti-aliasing gaps)
        ctx.clearRect(xInner, yInner, wInner, wInner);

        // Center 3x3 white square
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(xCenter, yCenter, wCenter, wCenter);
      };

      drawFinder(0, 0); // Top-left
      drawFinder(0, modules - 7); // Top-right
      drawFinder(modules - 7, 0); // Bottom-left
    };

    // Draw immediately
    drawQRCode();

    // Re-draw random payload modules every 2.5 seconds to represent changing QRs
    const qrInterval = setInterval(drawQRCode, 2500);

    // Simulated scan & auto-success after 6 seconds of scanning QR
    const successTimeout = setTimeout(() => {
      setActiveModal("success");
    }, 6000);

    return () => {
      clearInterval(qrInterval);
      clearTimeout(successTimeout);
    };
  }, [activeModal]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `Sisa waktu ${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="min-h-screen bg-black px-[60px] py-[50px] text-white">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-[52px] font-bold">
            Reservasi
          </h1>

          <p className="text-[20px] font-semibold text-[#8A8A8A] mt-2">
            Pesan Tempat Sekarang
          </p>
        </div>

        {/* STEP */}
        <div className="mb-16">
          <StepBooking currentStep={4} />
        </div>

        {/* TITLE */}
        <div className="mb-8">
          <h2 className="text-[42px] font-bold">
            Periksa Reservasi
          </h2>

          <p className="text-[#8A8A8A] mt-2">
            Pastikan semua detail sudah sesuai sebelum melanjutkan.
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-12 gap-12">
          {/* LEFT */}
          <div className="col-span-7">
            <div className="bg-[#1C1C1E] rounded-2xl p-6">
              {/* BARBER */}
              <div className="flex items-center gap-4">
                <div className="w-[44px] h-[44px] bg-[#2C2C2E] border border-neutral-700 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>

                <div className="text-left">
                  <p className="text-[#A0A0A0] text-xs font-semibold uppercase tracking-wider">
                    Barber
                  </p>
                  <h3 className="text-xl font-bold">
                    {selectedBarber?.name || "Nama"}
                  </h3>
                </div>
              </div>

              <div className="border-t border-neutral-800/80 my-6"></div>

              {/* TANGGAL DAN WAKTU */}
              <div className="flex justify-between text-left">
                <div>
                  <p className="text-[#A0A0A0] text-xs font-semibold uppercase tracking-wider mb-2">
                    Tanggal
                  </p>
                  <p className="font-medium text-white">
                    {selectedDate || "-"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[#A0A0A0] text-xs font-semibold uppercase tracking-wider mb-2">
                    Waktu
                  </p>
                  <p className="font-medium text-white">
                    {selectedTime || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-10 text-left">
                <p className="text-[#A0A0A0] text-xs font-semibold uppercase tracking-wider mb-2">
                  Layanan
                </p>

                <div className="flex justify-between items-center">
                  <p className="font-medium text-white">
                    {selectedService?.name || "-"}
                  </p>
                  <p className="text-[#FFCC00] font-bold">
                    {selectedService?.price || "Rp 0"}
                  </p>
                </div>
              </div>

              <div className="border-t border-neutral-800/80 my-8"></div>

              {/* TOTAL */}
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-[#BDBDBD]">
                  Total
                </h3>
                <h3 className="text-3xl text-[#FFCC00] font-extrabold">
                  {selectedService?.price || "Rp 0"}
                </h3>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-5">
            <div className="bg-[#1C1C1E] rounded-2xl p-6 text-left">
              <h3 className="text-[#BDBDBD] text-lg font-bold uppercase tracking-wider mb-6">
                Detail Reservasi
              </h3>

              <div className="space-y-4 text-gray-400 text-sm">
                <div className="flex justify-between items-center">
                  <span>Layanan</span>
                  <span className="text-white font-medium">{selectedService?.name || "-"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Barber</span>
                  <span className="text-white font-medium">{selectedBarber?.name || "-"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Tanggal</span>
                  <span className="text-white font-medium">{selectedDate || "-"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Waktu</span>
                  <span className="text-white font-medium">{selectedTime || "-"}</span>
                </div>
              </div>

              <div className="border-t border-neutral-800/80 my-6"></div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold text-sm uppercase tracking-wider">
                  TOTAL
                </span>
                <span className="text-[#FFCC00] text-2xl font-extrabold">
                  {selectedService?.price || "Rp 0"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-between mt-12">
          <button
            onClick={() =>
              navigate("/waktu", {
                state: {
                  service: selectedService,
                  barber: selectedBarber,
                },
              })
            }
            className="border border-[#FFCC00] hover:bg-[#FFCC00] hover:text-black px-8 py-3 rounded-xl text-white font-semibold transition-colors cursor-pointer text-sm"
          >
            &larr; Kembali
          </button>

          <button
            onClick={() => setActiveModal("confirm")}
            className="bg-[#FFCC00] hover:bg-yellow-400 active:bg-yellow-500 text-black px-10 py-3 rounded-xl font-bold transition-colors cursor-pointer text-sm"
          >
            Konfirmasi
          </button>
        </div>
      </div>

      {/* MODAL OVERLAYS */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[1000] p-5">
          {activeModal === "confirm" && (
            <div className="bg-[#1C1C1E] w-full max-w-[440px] rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-white text-lg font-bold text-center mb-6">
                Konfirmasi Reservasi
              </h3>

              <div className="space-y-4 text-sm text-gray-400">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-800/40">
                  <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Layanan</span>
                  <div className="text-right">
                    <p className="text-white font-medium">{selectedService?.name || "-"}</p>
                    <p className="text-xs text-neutral-500">{selectedService?.price || "Rp 0"}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-neutral-800/40">
                  <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Barber</span>
                  <span className="text-white font-medium">{selectedBarber?.name || "-"}</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-neutral-800/40">
                  <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Tanggal</span>
                  <span className="text-white font-medium">{selectedDate || "-"}</span>
                </div>

                <div className="flex justify-between items-center pb-3">
                  <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Waktu</span>
                  <span className="text-white font-medium">{selectedTime || "-"}</span>
                </div>

                <div className="border-t border-neutral-800/60 pt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-white uppercase tracking-wider">Total</span>
                  <span className="text-xl font-bold text-[#FFCC00]">
                    {selectedService?.price || "Rp. ,-"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 bg-transparent hover:bg-neutral-800 text-white border border-neutral-700 py-3 rounded-xl font-semibold transition-colors cursor-pointer text-sm"
                >
                  Batalkan
                </button>
                <button
                  onClick={() => setActiveModal("qr")}
                  className="flex-1 bg-[#FFCC00] hover:bg-yellow-400 text-black py-3 rounded-xl font-bold transition-colors cursor-pointer text-sm"
                >
                  Lanjut Pembayaran
                </button>
              </div>
            </div>
          )}

          {activeModal === "qr" && (
            <div className="bg-[#1C1C1E] w-full max-w-[440px] rounded-2xl p-8 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
              <p className="text-white text-sm font-medium">
                Scan QR di bawah untuk menyelesaikan pembayaran.
              </p>

              {/* DYNAMIC QR CODE CANVAS */}
              <div className="my-6 flex justify-center">
                <div className="w-[189px] h-[189px] flex items-center justify-center bg-transparent">
                  <canvas
                    ref={canvasRef}
                    width={189}
                    height={189}
                    className="w-full h-full block"
                  />
                </div>
              </div>

              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                Selesaikan pembayaran sebelum waktu berakhir.
              </p>

              {/* COUNTDOWN TIMER */}
              <div className="flex items-center justify-center gap-2 text-[#FFCC00] font-semibold text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                {formatTime(timeLeft)}
              </div>
            </div>
          )}

          {activeModal === "success" && (
            <div className="bg-[#1C1C1E] w-full max-w-[440px] rounded-2xl p-8 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
              {/* SUCCESS ICON */}
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 animate-success-pop">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-checkmark-draw"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </div>

              <h3 className="text-white text-xl font-bold mb-2">
                Pembayaran Berhasil!
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Reservasi kamu sedang diproses.
              </p>

              <button
                onClick={() => {
                  setActiveModal(null);
                  navigate("/history");
                }}
                className="bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 text-white font-semibold py-2.5 px-8 rounded-xl transition-colors cursor-pointer text-sm min-w-[140px]"
              >
                Riwayat
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}