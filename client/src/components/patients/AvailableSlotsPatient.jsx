import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Search, AlertCircle, Calendar } from "lucide-react";
import SlotCard from "../doctor/SlotCard";
import SlotModalPatient from "./SlotModalPatient";
import { socket } from "../../socket";

export default function AvailableSlotsPatient() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [branch, setBranch] = useState("");
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalType, setModalType] = useState("");

  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchDoctors();

    socket.on("appointmentStatusUpdated", (data) => {
      if (data.doctorId === selectedDoctorId && data.branch === branch) {
        fetchSlots();
      }
    });

    return () => socket.off("appointmentStatusUpdated");
  }, [selectedDoctorId, branch, date]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${api}/api/doctors`, { withCredentials: true });
      setDoctors(res.data.doctors || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const fetchSlots = async () => {
    if (!selectedDoctorId) {
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
      const res = await axios.get(
        `${api}/api/schedule/available/${selectedDoctorId}/${date}?branch=${branch}`,
        { withCredentials: true }
      );
      setSlots(res.data.slots || []);
      showMessage(`Found ${res.data.slots?.length || 0} available slots`, "success");
    } catch (err) {
      showMessage(err.response?.data?.message || "Error fetching slots", "error");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot) => {
    const today = new Date().toISOString().split("T")[0];
    const selected = new Date(date).toISOString().split("T")[0];
    setModalType(selected < today ? "view" : "book");
    setSelectedSlot(slot);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="bg-blue-600 p-4">
          <div className="flex items-center gap-3">
            <Clock className="text-white" size={24} />
            <div>
              <h1 className="text-xl font-semibold text-white">
                Find Available Slots
              </h1>
              <p className="text-blue-100 text-sm">
                Select your preferences to view available appointments
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Doctor
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="">Choose Doctor</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} — {d.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="">Choose Branch</option>
                <option value="Horamavu">Horamavu</option>
                <option value="Hennur">Hennur</option>
                <option value="Kammanahalli">Kammanahalli</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchSlots}
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    <span>Search Slots</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`mt-4 p-3 rounded-lg flex items-center gap-3 border ${
                messageType === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              <AlertCircle size={16} />
              <span className="text-sm">{message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Slots Display */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-600">Loading available slots...</p>
          </div>
        ) : slots.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Available Time Slots</h3>
              <span className="text-sm text-gray-600">{slots.length} slots available</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {slots.map((slot, idx) => (
                <SlotCard
                  key={idx}
                  slot={slot}
                  onClick={() => handleSlotClick(slot)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Calendar className="text-gray-300 mx-auto mb-3" size={40} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Slots to Display</h3>
            <p className="text-gray-500 text-sm">
              Select doctor, branch & date to view available appointments
            </p>
          </div>
        )}
      </div>

      {selectedSlot && (
        <SlotModalPatient
          type={modalType}
          slot={selectedSlot}
          date={date}
          doctorId={selectedDoctorId}
          branch={branch}
          onClose={() => setSelectedSlot(null)}
          onBooked={fetchSlots}
        />
      )}
    </div>
  );
}