import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import StepBooking from "../../components/StepBooking";

const availableTimes = [
  "11.00",
  "12.00",
  "13.00",
  "14.00",
  "15.00",
  "16.00",
  "17.00",
  "18.00",
  "19.00",
  "20.00",
];

export default function Waktu() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedService = location.state?.service;
  const selectedBarber = location.state?.barber;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  return (
    <div className="min-h-screen bg-black px-[70px] pt-[60px] pb-[80px] text-white">

      {/* HEADER */}
      <div className="mb-12">

        <h1 className="text-[52px] font-bold">
          Reservasi
        </h1>

        <p className="text-[20px] font-semibold text-[#8A8A8A] mt-2">
          Pesan Tempat Sekarang
        </p>

      </div>

      {/* STEP */}
      <div className="mb-20">
        <StepBooking currentStep={3} />
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-12 gap-10">

        {/* LEFT */}
        <div className="col-span-8">

          <div className="mb-8">

            <h2 className="text-[48px] font-bold text-white">
              Pilih Waktu
            </h2>

            <p className="mt-3 text-[#8A8A8A] text-[16px]">
              Tentukan waktu yang paling nyaman untukmu.
              Datang sesuai jadwal tanpa perlu menunggu.
            </p>

          </div>

          {/* DATE PICKER */}
          <div className="mb-10">

            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd MMMM yyyy"
              placeholderText="Pilih tanggal"
              minDate={new Date()}
              className="
                w-full
                h-[60px]
                px-5
                rounded-[12px]
                bg-[#242424]
                border
                border-[#444444]
                text-white
                outline-none
                focus:border-[#FFC400]
              "
            />

          </div>

          {/* TIME */}
          <div className="grid grid-cols-5 gap-5">

            {availableTimes.map((time) => (

              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`
                  h-[60px]
                  rounded-[12px]
                  font-semibold
                  transition-all
                  ${selectedTime === time
                    ? "bg-[#FFC400] text-black"
                    : "bg-[#242424] text-white hover:border-[#FFC400] border border-transparent"
                  }
                `}
              >
                {time}
              </button>

            ))}

          </div>

          {/* BUTTON */}
          <div className="flex justify-between mt-16">

            <button
              onClick={() =>
                navigate("/barber", {
                  state: {
                    service: selectedService,
                    barber: selectedBarber,
                  },
                })
              }
              className="
                border
                border-[#FFC400]
                bg-black
                text-white
                px-8
                py-3
                rounded-[8px]
                hover:bg-[#FFC400]
                hover:text-black
                transition
              "
            >
              ← Kembali
            </button>

            <button
              disabled={!selectedDate || !selectedTime}
              onClick={() =>
                navigate("/review", {
                  state: {
                    service: selectedService,
                    barber: selectedBarber,
                    date: selectedDate
                      ? selectedDate.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                      : "",
                    dateRaw: selectedDate ? selectedDate.toISOString() : null,
                    time: selectedTime,
                  },
                })
              }
            className={`
                w-[160px]
                h-[50px]
                rounded-[8px]
                font-semibold
                transition
                ${selectedDate && selectedTime
                ? "bg-[#FFC400] text-black"
                : "bg-[#555555] text-[#999999]"
              }
              `}
            >
            Berikutnya →
          </button>

        </div>

      </div>

      {/* RIGHT */}
      <div className="col-span-4">

        <div className="bg-[#242424] rounded-[12px] p-8">

          <h3 className="text-[22px] text-[#BDBDBD] mb-6">
            Detail Reservasi
          </h3>

          <div className="space-y-4 text-[#9A9A9A]">

            <div className="flex justify-between">
              <span>Layanan</span>
              <span>
                {selectedService
                  ? selectedService.name
                  : "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Barber</span>
              <span>
                {selectedBarber
                  ? selectedBarber.name
                  : "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tanggal</span>
              <span>
                {selectedDate
                  ? selectedDate.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                  : "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Waktu</span>
              <span>
                {selectedTime || "-"}
              </span>
            </div>

          </div>

          <div className="border-t border-[#666666] my-6"></div>

          <div className="flex justify-between items-center">

            <span className="text-[#BDBDBD] font-semibold">
              TOTAL
            </span>

            <span className="text-[28px] font-bold text-[#FFC400]">
              {selectedService
                ? selectedService.price
                : "Rp 0"}
            </span>

          </div>

        </div>

      </div>

    </div>

    </div >
  );
}