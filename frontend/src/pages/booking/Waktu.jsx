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

  // DATA DARI HALAMAN SEBELUMNYA
  const selectedService = location.state?.service;
  const selectedBarber = location.state?.barber;

  // STATE
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  return (

    <div className="min-h-screen bg-[#F5F5F5] px-6 md:px-12 py-10">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold text-black">
          Reservasi
        </h1>

        <p className="mt-3 text-xl text-gray-500 font-medium">
          Pesan Tempat Sekarang
        </p>

      </div>

      {/* STEP */}
      <StepBooking currentStep={3} />

      {/* CONTENT */}
      <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* LEFT */}
        <div className="lg:col-span-8">

          {/* TITLE */}
          <div className="mb-8">

            <h2 className="text-4xl font-bold text-black">
              Pilih Waktu
            </h2>

            <p className="mt-3 text-gray-400 text-lg">
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
                rounded-2xl
                border
                border-gray-200
                bg-white
                px-5
                text-gray-500
                shadow-md
                outline-none
                focus:border-yellow-400
              "
            />

          </div>

          {/* TIME GRID */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">

            {availableTimes.map((time, index) => (

              <button
                key={index}
                onClick={() => setSelectedTime(time)}
                className={`
                  h-[60px]
                  rounded-2xl
                  font-semibold
                  shadow-md
                  transition-all
                  duration-300
                  ${
                    selectedTime === time
                      ? "bg-yellow-400 text-black scale-105"
                      : "bg-white text-gray-500 hover:bg-yellow-50"
                  }
                `}
              >

                {time}

              </button>

            ))}

          </div>

          {/* BUTTON */}
          <div className="mt-16 flex items-center justify-between">

            {/* BACK */}
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
                border-2
                border-yellow-400
                bg-white
                px-8
                py-3
                rounded-xl
                font-semibold
                text-black
                transition-all
                duration-300
                hover:bg-yellow-400
              "
            >

              ← Kembali

            </button>

            {/* NEXT */}
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
                    time: selectedTime,
                  },
                })
              }
              className={`
                px-10
                py-3
                rounded-xl
                font-bold
                transition-all
                duration-300
                ${
                  selectedDate && selectedTime
                    ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >

              Berikutnya →

            </button>

          </div>

        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4">

          <div className="bg-white rounded-3xl shadow-md p-8">

            <h3 className="text-2xl font-bold text-gray-700 mb-8">
              Detail Reservasi
            </h3>

            <div className="space-y-5">

              {/* LAYANAN */}
              <div className="flex justify-between text-gray-500">

                <span>
                  Layanan
                </span>

                <span className="font-medium text-right">
                  {selectedService
                    ? selectedService.name
                    : "-"}
                </span>

              </div>

              {/* BARBER */}
              <div className="flex justify-between text-gray-500">

                <span>
                  Barber
                </span>

                <span className="font-medium text-right">
                  {selectedBarber
                    ? selectedBarber.name
                    : "-"}
                </span>

              </div>

              {/* TANGGAL */}
              <div className="flex justify-between text-gray-500">

                <span>
                  Tanggal
                </span>

                <span className="font-medium text-right">

                  {selectedDate
                    ? selectedDate.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}

                </span>

              </div>

              {/* WAKTU */}
              <div className="flex justify-between text-gray-500">

                <span>
                  Waktu
                </span>

                <span className="font-medium">
                  {selectedTime || "-"}
                </span>

              </div>

            </div>

            <div className="my-8 border-t border-gray-200"></div>

            {/* TOTAL */}
            <div className="flex items-center justify-between">

              <span className="text-xl font-bold text-gray-700">
                TOTAL
              </span>

              <span className="text-3xl font-bold text-black">

                {selectedService
                  ? selectedService.price
                  : "Rp. 0"}

              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}