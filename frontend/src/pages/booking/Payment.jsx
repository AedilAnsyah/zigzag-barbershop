import { useLocation, useNavigate } from "react-router-dom";
import qrisImage from "../../assets/QRIS.png";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedService = location.state?.service;
  const selectedBarber = location.state?.barber;
  const selectedDate = location.state?.date;
  const selectedTime = location.state?.time;

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
                  {selectedService?.price || "Rp 0"}
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
                {selectedService?.price || "Rp 0"}
              </h2>

            </div>

          </div>

          {/* BUTTON */}
          <div className="flex justify-end mt-12">

            <button
              className="
                bg-[#FFC400]
                text-black
                font-semibold
                px-12
                py-4
                rounded-[10px]
                hover:brightness-95
                transition
              "
            >
              Konfirmasi
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