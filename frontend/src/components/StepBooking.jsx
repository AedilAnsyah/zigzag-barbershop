import React from "react";

const StepBooking = ({ currentStep }) => {

  return (

    <div className="flex items-center gap-6 mb-16">

      {/* STEP 1 */}
      <div className="flex flex-col items-center">

        <div
          className={`w-[62px] h-[62px] rounded-full flex items-center justify-center text-[26px] border-2 transition ${
            currentStep === 1
              ? "border-[#FFB800] text-[#FFB800] bg-white"
              : "border-[#D9D9D9] text-[#A0A0A0] bg-white"
          }`}
        >
          ✂
        </div>

        <span
          className={`mt-3 text-[15px] ${
            currentStep === 1
              ? "text-black font-semibold"
              : "text-[#A0A0A0]"
          }`}
        >
          Layanan
        </span>

      </div>

      {/* LINE */}
      <div className="w-[70px] h-[2px] bg-[#CFCFCF] mb-6"></div>

      {/* STEP 2 */}
      <div className="flex flex-col items-center">

        <div
          className={`w-[62px] h-[62px] rounded-full flex items-center justify-center text-[24px] border-2 transition ${
            currentStep === 2
              ? "border-[#FFB800] text-[#FFB800] bg-white"
              : "border-[#D9D9D9] text-[#A0A0A0] bg-white"
          }`}
        >
          👤
        </div>

        <span
          className={`mt-3 text-[15px] ${
            currentStep === 2
              ? "text-black font-semibold"
              : "text-[#A0A0A0]"
          }`}
        >
          Barber
        </span>

      </div>

      {/* LINE */}
      <div className="w-[70px] h-[2px] bg-[#CFCFCF] mb-6"></div>

      {/* STEP 3 */}
      <div className="flex flex-col items-center">

        <div
          className={`w-[62px] h-[62px] rounded-full flex items-center justify-center text-[24px] border-2 transition ${
            currentStep === 3
              ? "border-[#FFB800] text-[#FFB800] bg-white"
              : "border-[#D9D9D9] text-[#A0A0A0] bg-white"
          }`}
        >
          📅
        </div>

        <span
          className={`mt-3 text-[15px] ${
            currentStep === 3
              ? "text-black font-semibold"
              : "text-[#A0A0A0]"
          }`}
        >
          Waktu
        </span>

      </div>

      {/* LINE */}
      <div className="w-[70px] h-[2px] bg-[#CFCFCF] mb-6"></div>

      {/* STEP 4 */}
      <div className="flex flex-col items-center">

        <div
          className={`w-[62px] h-[62px] rounded-full flex items-center justify-center text-[24px] border-2 transition ${
            currentStep === 4
              ? "border-[#FFB800] text-[#FFB800] bg-white"
              : "border-[#D9D9D9] text-[#A0A0A0] bg-white"
          }`}
        >
          ✔
        </div>

        <span
          className={`mt-3 text-[15px] ${
            currentStep === 4
              ? "text-black font-semibold"
              : "text-[#A0A0A0]"
          }`}
        >
          Ulasan
        </span>

      </div>

    </div>
  );
};

export default StepBooking;