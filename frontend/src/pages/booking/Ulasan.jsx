import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import StepBooking from "../../components/StepBooking";

export default function Ulasan() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedService = location.state?.service;
  const selectedBarber = location.state?.barber;
  const selectedDate = location.state?.date;
  const selectedTime = location.state?.time;

  const [showConfirm, setShowConfirm] = useState(false);

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

            <div className="bg-[#242424] rounded-[12px] p-6">

              {/* BARBER */}
              <div className="flex items-center gap-4">

                <div className="w-[44px] h-[44px] bg-[#D9D9D9]"></div>

                <div>
                  <p className="text-[#A0A0A0] text-[14px]">
                    Barber
                  </p>

                  <h3 className="text-[24px] font-bold">
                    {selectedBarber?.name || "Nama"}
                  </h3>
                </div>

              </div>

              <div className="border-t border-[#666666] my-6"></div>

              {/* TANGGAL DAN WAKTU */}
              <div className="flex justify-between">

                <div>
                  <p className="text-[#A0A0A0] mb-2">
                    Tanggal
                  </p>

                  <p>
                    {selectedDate || "-"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[#A0A0A0] mb-2">
                    Waktu
                  </p>

                  <p>
                    {selectedTime || "-"}
                  </p>
                </div>

              </div>

              <div className="mt-12">

                <p className="text-[#A0A0A0] mb-2">
                  Layanan
                </p>

                <div className="flex justify-between">

                  <p>
                    {selectedService?.name || "-"}
                  </p>

                  <p className="text-[#FFC400]">
                    {selectedService?.price || "Rp 0"}
                  </p>

                </div>

              </div>

              <div className="border-t border-[#666666] my-8"></div>

              {/* TOTAL */}
              <div className="flex justify-between items-center">

                <h3 className="text-[28px] text-[#BDBDBD]">
                  Total
                </h3>

                <h3 className="text-[36px] text-[#FFC400] font-bold">
                  {selectedService?.price || "Rp 0"}
                </h3>

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="col-span-5">

            <div className="bg-[#242424] rounded-[12px] p-6">

              <h3 className="text-[#BDBDBD] text-[22px] mb-6">
                Detail Reservasi
              </h3>

              <div className="space-y-3 text-[#9A9A9A]">

                <div className="flex justify-between">
                  <span>Layanan</span>
                  <span>{selectedService?.name || "-"}</span>
                </div>

                <div className="flex justify-between">
                  <span>Barber</span>
                  <span>{selectedBarber?.name || "-"}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tanggal</span>
                  <span>{selectedDate || "-"}</span>
                </div>

                <div className="flex justify-between">
                  <span>Waktu</span>
                  <span>{selectedTime || "-"}</span>
                </div>

              </div>

              <div className="border-t border-[#666666] my-6"></div>

              <div className="flex justify-between">

                <span className="text-[#BDBDBD] font-semibold">
                  TOTAL
                </span>

                <span className="text-[#FFC400] text-[24px] font-bold">
                  {selectedService?.price || "Rp 0"}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* BUTTON */}
        <div className="flex justify-between mt-14">

          <button
            onClick={() =>
              navigate("/waktu", {
                state: {
                  service: selectedService,
                  barber: selectedBarber,
                },
              })
            }
            className="
              border
              border-[#FFC400]
              px-8
              py-3
              rounded-[8px]
              text-white
              hover:bg-[#FFC400]
              hover:text-black
              transition
            "
          >
            ← Kembali
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="
              bg-[#FFC400]
              text-black
              px-10
              py-3
              rounded-[8px]
              font-semibold
              hover:brightness-95
              transition
            "
          >
            Konfirmasi
          </button>

        </div>

      </div>

      {/* MODAL KONFIRMASI */}
      {showConfirm && (
        <div className="
          fixed
          inset-0
          bg-black/80
          flex
          items-center
          justify-center
          z-50
        ">

          <div className="
            bg-[#242424]
            w-[500px]
            rounded-xl
            p-8
          ">

            <h2 className="text-3xl font-bold mb-6 text-center">
              Konfirmasi Reservasi
            </h2>

            <div className="space-y-4 text-[#D0D0D0]">

              <div className="flex justify-between">
                <span>Layanan</span>
                <span>{selectedService?.name || "-"}</span>
              </div>

              <div className="flex justify-between">
                <span>Barber</span>
                <span>{selectedBarber?.name || "-"}</span>
              </div>

              <div className="flex justify-between">
                <span>Tanggal</span>
                <span>{selectedDate || "-"}</span>
              </div>

              <div className="flex justify-between">
                <span>Waktu</span>
                <span>{selectedTime || "-"}</span>
              </div>

              <div className="border-t border-[#666] pt-4 flex justify-between">

                <span className="font-semibold">
                  Total
                </span>

                <span className="text-[#FFC400] font-bold">
                  {selectedService?.price || "Rp 0"}
                </span>

              </div>

            </div>

            <div className="flex gap-4 mt-8">

              <button
                onClick={() => setShowConfirm(false)}
                className="
                  flex-1
                  border
                  border-[#FFC400]
                  py-3
                  rounded-lg
                  hover:bg-[#FFC400]
                  hover:text-black
                  transition
                "
              >
                Batal
              </button>

              <button
                onClick={() =>
                  navigate("/payment", {
                    state: {
                      service: selectedService,
                      barber: selectedBarber,
                      date: selectedDate,
                      time: selectedTime,
                    },
                  })
                }
                className="
                  flex-1
                  bg-[#FFC400]
                  text-black
                  py-3
                  rounded-lg
                  font-semibold
                "
              >
                Lanjut Pembayaran
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}