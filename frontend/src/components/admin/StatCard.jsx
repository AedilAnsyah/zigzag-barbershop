import React from "react";

export default function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 transition-all duration-300">
      <div className="flex justify-between items-start">
        <h3 className="text-[#A0A0A0] font-medium text-[15px] leading-tight">
          {title}
        </h3>
        <div className="w-10 h-10 rounded-full bg-[#FFB22C] text-black flex items-center justify-center flex-shrink-0">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <h2 className="text-3xl font-bold text-white mt-4 tracking-tight">
        {value}
      </h2>
    </div>
  );
}
