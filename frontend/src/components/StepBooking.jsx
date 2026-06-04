import React from "react";
import {
  FiScissors,
  FiUser,
  FiCalendar,
  FiCheck,
} from "react-icons/fi";

const StepBooking = ({ currentStep }) => {
  const steps = [
    {
      id: 1,
      label: "Layanan",
      icon: <FiScissors />,
    },
    {
      id: 2,
      label: "Barber",
      icon: <FiUser />,
    },
    {
      id: 3,
      label: "Waktu",
      icon: <FiCalendar />,
    },
    {
      id: 4,
      label: "Ulasan",
      icon: <FiCheck />,
    },
  ];

  return (
    <div className="flex items-center gap-4">

      {steps.map((step, index) => (
        <React.Fragment key={step.id}>

          {/* STEP */}
          <div className="flex flex-col items-center">

            <div
              className={`
                w-[56px]
                h-[56px]
                rounded-full
                flex
                items-center
                justify-center
                text-[22px]
                border
                transition-all
                duration-300

                ${
                  currentStep === step.id
                    ? "bg-white border-[#F7C600] text-[#F7C600]"
                    : "bg-white border-[#D9D9D9] text-[#A0A0A0]"
                }
              `}
            >
              {step.icon}
            </div>

            <span
              className={`
                mt-3
                text-[15px]

                ${
                  currentStep === step.id
                    ? "text-[#F7C600] font-medium"
                    : "text-[#9E9E9E]"
                }
              `}
            >
              {step.label}
            </span>

          </div>

          {/* GARIS */}
          {index !== steps.length - 1 && (
            <div className="w-[48px] h-[1px] bg-[#8F8F8F] mb-7"></div>
          )}

        </React.Fragment>
      ))}

    </div>
  );
};

export default StepBooking;