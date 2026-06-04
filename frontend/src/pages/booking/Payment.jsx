import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import qrisImage from "../../assets/QRIS.png";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedService = location.state?.service;
  const selectedBarber = location.state?.barber;
  const selectedDate = location.state?.date;
  const dateRaw = location.state?.dateRaw;
  const selectedTime = location.state?.time;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleBooking = async () => {
    if (!selectedService || !selectedBarber || !dateRaw || !selectedTime) {
      setError("Data reservasi tidak lengkap");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format YYYY-MM-DD
      const d = new Date(dateRaw);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const formattedDate = `${yyyy}-${mm}-${dd}`;

      // Format HH:MM
      const formattedTime = selectedTime.replace(".", ":");

      const payload = {
        service_id: selectedService.id,
        barber_id: selectedBarber.id,
        date: formattedDate,
        time: formattedTime,
      };

      await api.post("/booking", payload);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Gagal membuat reservasi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-[48px] font-bold text-[#FFC400] mb-4">Booking Berhasil!</h1>
        <p className="text-[#9E9E9E] mb-8 text-center max-w-md leading-relaxed">
          Reservasi Anda telah berhasil dibuat. Kami menunggu kedatangan Anda di Zigzag Barbershop sesuai dengan jadwal yang telah ditentukan.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#FFC400] text-black font-semibold px-8 py-3 rounded-[8px] hover:brightness-95 transition"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-[55px] py-[40px]">

      {/* TOP */}
      <div className="flex justify-between items-center mb-8">

        <button
          onClick={() => navigate("/review")}
          className="text-[#9E9E9E] text-sm hover:text-white transition"
        >
          ← Kembali ke Reservasi
        </button>

        <div
          className="
            bg-[#FFC400]
            text-black
            px-5
            py-2
            rounded-[10px]
            font-medium
            text-sm
          "
        >
          Menunggu Pembayaran
        </div>

      </div>

      {/* TITLE */}
      <h1 className="text-[48px] font-bold mb-8">
        Selesaikan Pembayaran
      </h1>

      {/* CONTENT */}
      <div className="grid grid-cols-12 gap-10">

        {/* LEFT CARD */}
        <div className="col-span-6">

          <div className="bg-[#242424] rounded-[14px] p-5">

            {/* BARBER */}
            <div className="flex gap-4 items-center">

              <div className="w-[46px] h-[46px] bg-[#D9D9D9]"></div>

              <div>

                <p className="text-[#9E9E9E] text-sm">
                  Barber
                </p>

                <h3 className="text-[28px] font-bold">
                  {selectedBarber?.name || "Nama"}
                </h3>

              </div>

            </div>

            <div className="border-t border-[#666666] my-6"></div>

            {/* DATE & TIME */}
            <div className="flex justify-between mb-10">

              <div>

                <p className="text-[#9E9E9E] mb-2">
                  Tanggal
                </p>

                <p>
                  {selectedDate || "-"}
                </p>

              </div>

              <div>

                <p className="text-[#9E9E9E] mb-2">
                  Waktu
                </p>

                <p>
                  {selectedTime || "-"}
                </p>

              </div>

            </div>

            {/* SERVICE */}
            <div className="mb-10">

              <p className="text-[#9E9E9E] mb-3">
                Layanan
              </p>

              <div className="flex justify-between">

                <p>
                  {selectedService?.name || "-"}
                </p>

                <p className="text-[#FFC400] font-medium">
                  {selectedService ? `Rp ${selectedService.price.toLocaleString("id-ID")},-` : "Rp 0"}
                </p>

              </div>

            </div>

            <div className="border-t border-[#666666] my-6"></div>

            {/* TOTAL */}
            <div className="flex justify-between items-center">

              <h2 className="text-[32px] text-[#BDBDBD]">
                Total
              </h2>

              <h2 className="text-[42px] font-bold text-[#FFC400]">
                {selectedService ? `Rp ${selectedService.price.toLocaleString("id-ID")},-` : "Rp 0"}
              </h2>

            </div>

          </div>

          {/* BUTTON */}
          <div className="flex flex-col items-end mt-12 gap-3">

            {error && (
              <p className="text-red-500 font-semibold">{error}</p>
            )}

            <button
              onClick={handleBooking}
              disabled={loading}
              className="
                bg-[#FFC400]
                text-black
                font-semibold
                px-12
                py-4
                rounded-[10px]
                hover:brightness-95
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Memproses..." : "Konfirmasi"}
            </button>

          </div>

        </div>

        {/* RIGHT QRIS */}
        <div className="col-span-6 flex justify-center">

          <img
            src={qrisImage}
            alt="QRIS"
            className="
              w-[380px]
              h-auto
              bg-white
              object-contain
            "
          />

        </div>

      </div>

    </div>
  );
}