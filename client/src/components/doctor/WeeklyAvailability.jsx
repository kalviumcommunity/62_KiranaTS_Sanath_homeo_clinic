// components/doctor/WeeklyAvailability.jsx
import { useState } from "react";
import axios from "axios";

export default function WeeklyAvailability() {
  const [availability, setAvailability] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const [activeDays, setActiveDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  const handleAddSlot = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: [...prev[day], { start: "", end: "" }],
    }));
  };

  const handleSlotChange = (day, index, field, value) => {
    const updatedDaySlots = [...availability[day]];
    updatedDaySlots[index][field] = value;
    setAvailability((prev) => ({
      ...prev,
      [day]: updatedDaySlots,
    }));
  };

  const handleCheckboxChange = (day) => {
    setActiveDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleSubmit = async () => {
    const weeklyAvailability = {};

    for (const day in availability) {
      if (activeDays[day] && availability[day].length > 0) {
        weeklyAvailability[day] = availability[day];
      }
    }

    try {
      await axios.post("/api/doctors/availability", { weeklyAvailability });
      alert("Availability submitted!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  const days = Object.keys(availability);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Set Weekly Availability</h2>
      {days.map((day) => (
        <div key={day} className="mb-6 border-b pb-4">
          <label className="flex items-center gap-3 text-lg font-medium">
            <input
              type="checkbox"
              checked={activeDays[day]}
              onChange={() => handleCheckboxChange(day)}
              className="accent-blue-600"
            />
            {day}
          </label>

          {activeDays[day] && (
            <div className="mt-4 space-y-3">
              {availability[day].map((slot, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) =>
                      handleSlotChange(day, index, "start", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) =>
                      handleSlotChange(day, index, "end", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />
                </div>
              ))}
              <button
                onClick={() => handleAddSlot(day)}
                className="text-blue-600 font-medium hover:underline"
              >
                + Add Slot
              </button>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mt-4"
      >
        Save Availability
      </button>
    </div>
  );
}
