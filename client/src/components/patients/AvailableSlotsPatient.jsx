import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Search, AlertCircle, Calendar, Sparkles } from "lucide-react";
import SlotCard from "../doctor/SlotCard";
import SlotModalPatient from "./SlotModalPatient";

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
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${api}/api/doctors`, { withCredentials: true });
      setDoctors(res.data.doctors || []);
    } catch (err) {
      console.error(err);
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
    if (selected < today) setModalType("view");
    else setModalType("book");
    setSelectedSlot(slot);
  };

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Find Available Slots
              </h1>
              <p className="text-emerald-100 text-sm mt-1">
                Select your preferences to view available appointments
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Doctor Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Doctor
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
              >
                <option value="">Choose Doctor</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} — {d.specialization}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
              >
                <option value="">Choose Branch</option>
                <option value="Horamavu">Horamavu</option>
                <option value="Hennur">Hennur</option>
                <option value="Kammanahalli">Kammanahalli</option>
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
              />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={fetchSlots}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    <span>Search Slots</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-xl flex items-center space-x-3 border ${
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
      </div>

      {/* Slots Display */}
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading available slots...</p>
          </div>
        ) : slots.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Available Time Slots</h3>
              <div className="flex items-center space-x-2 text-emerald-600">
                <Sparkles size={18} />
                <span className="text-sm font-semibold">{slots.length} slots available</span>
              </div>
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
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-gray-300" size={40} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Slots to Display</h3>
            <p className="text-gray-500 text-sm">
              Select doctor, branch & date to view available appointments
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
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