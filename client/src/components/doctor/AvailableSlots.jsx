import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Calendar, Search, AlertCircle } from "lucide-react";
import SlotCard from "./SlotCard";
import SlotModal from "./SlotModal";

export default function AvailableSlots({ doctorId }) {
  const [date, setDate] = useState("");
  const [branch, setBranch] = useState("");
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDoctorId, setCurrentDoctorId] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    if (doctorId) {
      setCurrentDoctorId(doctorId);
    } else {
      const storedDoctor = JSON.parse(localStorage.getItem("doctor"));
      if (storedDoctor && storedDoctor._id) {
        setCurrentDoctorId(storedDoctor._id);
      }
    }
  }, [doctorId]);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const fetchSlots = async () => {
  if (!currentDoctorId) {
    showMessage("Please select a doctor first", "error");
    return;
  }
  if (!date) {
    showMessage("Please select a date", "error");
    return;
  }
  if (!branch) {
    showMessage("Please select a branch", "error");
    return;
  }

  setLoading(true);
  setMessage("");

  try {
    // Fetch raw available slots (from schedule)
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/schedule/available/${currentDoctorId}/${date}?branch=${branch}`,
      { withCredentials: true }
    );

    // Fetch all appointments for that doctor on the same date
    const appRes = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/appointments/doctor-appointments?date=${date}`,
      { withCredentials: true }
    );

    const bookedAppointments = appRes.data.appointments.filter(
      (a) =>
        a.branch === branch &&
        ["Pending", "Confirmed", "Completed"].includes(a.status)
    );

    // Map the slots to show booked info for completed ones too
    const mergedSlots = res.data.slots.map((slot) => {
      const match = bookedAppointments.find(
        (a) => a.appointmentTime === slot.from
      );
      if (match) {
        return {
          ...slot,
          booked: true,
          status: match.status,
          patientName: match.patientId?.name,
          patientPhone: match.patientId?.phone,
        };
      }
      return { ...slot, booked: false };
    });

    setSlots(mergedSlots);
    showMessage(`Found ${mergedSlots.length} slots`, "success");
  } catch (err) {
    console.error(err);
    showMessage(err.response?.data?.message || "Error fetching slots", "error");
    setSlots([]);
  } finally {
    setLoading(false);
  }
};


  const handleSlotClick = (slot) => {
    const today = new Date().toISOString().split("T")[0];
    const selected = new Date(date).toISOString().split("T")[0];

    // If selected date is in the past
    if (selected < today) {
      setModalType("view"); // only allow viewing
    } else if (slot.booked) {
      setModalType("view");
    } else {
      setModalType("book");
    }

    setSelectedSlot(slot);
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Available Slots
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Book or view appointments by date and branch
              </p>
            </div>
          </div>

          {/* Search Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* Branch Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">-- Choose Branch --</option>
                <option value="Horamavu">Horamavu</option>
                <option value="Hennur">Hennur</option>
                <option value="Kammanahalli">Kammanahalli</option>
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={fetchSlots}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Message */}
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
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}
        </div>

        {/* Slots Display */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading slots...</div>
          ) : slots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {slots.map((slot, idx) => (
                <SlotCard key={idx} slot={slot} onClick={() => handleSlotClick(slot)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="mx-auto mb-3 text-gray-300" size={48} />
              Select branch & date to view slots
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedSlot && (
          <SlotModal
            type={modalType}
            slot={selectedSlot}
            date={date}
            doctorId={currentDoctorId}
            branch={branch}
            onClose={() => setSelectedSlot(null)}
            onBooked={fetchSlots}
          />
        )}
      </div>
    </div>
  );
}
