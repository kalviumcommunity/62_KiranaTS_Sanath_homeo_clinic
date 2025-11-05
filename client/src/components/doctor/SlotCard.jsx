import React from "react";
import { Clock } from "lucide-react";

export default function SlotCard({ slot, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-4 rounded-lg border text-center transition-all duration-200 shadow-sm
        ${
          slot.booked
            ? "bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200"
            : "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
        }`}
    >
      {/* Time Display */}
      <div className="flex flex-col items-center space-y-1">
        <div className="flex items-center space-x-2">
          <Clock size={16} className={slot.booked ? "text-gray-400" : "text-emerald-600"} />
          <span className="font-semibold text-sm">{slot.from}</span>
        </div>

        <span className="text-xs text-gray-400">to</span>

        <span className="font-semibold text-sm">{slot.to}</span>
      </div>

      {/* Status Label */}
      <div
        className={`mt-3 px-2 py-1 rounded-full text-xs font-medium
          ${
            slot.booked
              ? "bg-gray-200 text-gray-600"
              : "bg-emerald-100 text-emerald-700"
          }`}
      >
        {slot.booked ? "Booked" : "Available"}
      </div>
    </div>
  );
}
