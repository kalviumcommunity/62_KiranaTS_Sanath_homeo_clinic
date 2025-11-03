import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, Plus, Trash2, Save, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

const DoctorSchedule = () => {
  const [doctorId, setDoctorId] = useState("");
  const [weeklyAvailability, setWeeklyAvailability] = useState([
    { day: "Monday", timeSlots: [] },
    { day: "Tuesday", timeSlots: [] },
    { day: "Wednesday", timeSlots: [] },
    { day: "Thursday", timeSlots: [] },
    { day: "Friday", timeSlots: [] },
    { day: "Saturday", timeSlots: [] },
    { day: "Sunday", timeSlots: [] } // Added Sunday
  ]);
  const [slotDuration, setSlotDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const daysPerPage = 3; // Show 3 days per page for better visibility

  useEffect(() => {
    const storedDoctor = JSON.parse(localStorage.getItem("doctor"));
    if (storedDoctor && storedDoctor._id) {
      setDoctorId(storedDoctor._id);
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchSchedule();
    }
  }, [doctorId]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/schedule/${doctorId}`, {
        withCredentials: true,
      });
      
      if (res.data.weeklyAvailability) {
        // Ensure all 7 days are present
        const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const updatedAvailability = allDays.map(day => {
          const existingDay = res.data.weeklyAvailability.find(d => d.day === day);
          return existingDay || { day, timeSlots: [] };
        });
        setWeeklyAvailability(updatedAvailability);
      }
      
      setSlotDuration(res.data.slotDuration || 30);
      showMessage("Schedule loaded successfully", "success");
    } catch (err) {
      console.log(err);
      showMessage("No existing schedule found. You can create one.", "info");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleTimeChange = (dayIndex, slotIndex, field, value) => {
    const updated = [...weeklyAvailability];
    updated[dayIndex].timeSlots[slotIndex][field] = value;
    setWeeklyAvailability(updated);
  };

  const addTimeSlot = (dayIndex) => {
    const updated = [...weeklyAvailability];
    updated[dayIndex].timeSlots.push({ from: "", to: "", branch: "Hennur" });
    setWeeklyAvailability(updated);
  };

  const removeTimeSlot = (dayIndex, slotIndex) => {
    const updated = [...weeklyAvailability];
    updated[dayIndex].timeSlots.splice(slotIndex, 1);
    setWeeklyAvailability(updated);
  };

  const handleSubmit = async () => {
    if (!doctorId) {
      showMessage("Doctor ID not found. Please log in again.", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/schedule`,
        { doctorId, weeklyAvailability, slotDuration },
        { withCredentials: true }
      );
      showMessage(res.data.message, "success");
    } catch (err) {
      console.error(err);
      showMessage("Error saving schedule.", "error");
    } finally {
      setLoading(false);
    }
  };

  const branches = ["Hennur", "Horamavu", "Kammanahalli"];

  // Pagination logic
  const totalPages = Math.ceil(weeklyAvailability.length / daysPerPage);
  const currentDays = weeklyAvailability.slice(
    currentPage * daysPerPage,
    (currentPage + 1) * daysPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Calendar className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Schedule Management
                </h1>
                <p className="text-gray-500 text-sm mt-1">Configure your weekly availability by branch</p>
              </div>
            </div>

            {/* Slot Duration */}
            <div className="flex items-center space-x-3 bg-gray-50 px-5 py-3 rounded-lg border border-gray-200">
              <Clock className="text-gray-600" size={20} />
              <div>
                <label className="text-xs text-gray-500 block">Slot Duration</label>
                <div className="flex items-baseline">
                  <input
                    type="number"
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(e.target.value)}
                    className="w-16 text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none"
                    min="15"
                    step="15"
                  />
                  <span className="text-sm text-gray-600 ml-1">mins</span>
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`mt-4 p-3 rounded-lg flex items-center space-x-3 border ${
                messageType === "success"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : messageType === "error"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              {messageType === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-medium">Previous</span>
          </button>
          
          <div className="text-gray-600 text-sm font-medium">
            Page {currentPage + 1} of {totalPages}
          </div>
          
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium">Next</span>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Days Grid - Show 3 days per page */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {currentDays.map((day, dayIndex) => {
            const globalDayIndex = currentPage * daysPerPage + dayIndex;
            return (
              <div key={day.day} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-emerald-600 p-4">
                  <h3 className="text-lg font-semibold text-white">{day.day}</h3>
                  <p className="text-emerald-100 text-sm">
                    {day.timeSlots.length} slot{day.timeSlots.length !== 1 ? "s" : ""} configured
                  </p>
                </div>

                <div className="p-4 space-y-3">
                  {day.timeSlots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className="relative grid grid-cols-3 gap-2 items-center bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <input
                        type="time"
                        value={slot.from}
                        onChange={(e) =>
                          handleTimeChange(globalDayIndex, slotIndex, "from", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm"
                      />
                      <input
                        type="time"
                        value={slot.to}
                        onChange={(e) => 
                          handleTimeChange(globalDayIndex, slotIndex, "to", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm"
                      />
                      <select
                        value={slot.branch}
                        onChange={(e) =>
                          handleTimeChange(globalDayIndex, slotIndex, "branch", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm"
                      >
                        {branches.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeTimeSlot(globalDayIndex, slotIndex)}
                        className="absolute -right-2 -top-2 bg-white text-red-600 hover:bg-red-50 p-1.5 rounded-full border border-gray-200 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addTimeSlot(globalDayIndex)}
                    className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center space-x-2 text-sm font-medium"
                  >
                    <Plus size={18} />
                    <span>Add Time Slot</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Save size={20} />
            <span>{loading ? "Saving..." : "Save Schedule"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;