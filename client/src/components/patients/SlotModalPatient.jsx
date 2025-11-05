import React, { useState } from "react";
import axios from "axios";
import { X, CheckCircle2, CalendarClock, Loader2, AlertCircle } from "lucide-react";

export default function SlotModalPatient({
  type, // "book" or "view"
  slot,
  date,
  doctorId,
  branch,
  onClose,
  onBooked,
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [mode, setMode] = useState(type);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const api = import.meta.env.VITE_API_BASE_URL;

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  // ✅ Book appointment (for logged-in patient)
  const handleBook = async () => {
    if (!reason.trim()) {
      showMessage("Please enter a reason for appointment", "error");
      return;
    }
    
    try {
      setLoading(true);
      const res = await axios.post(
        `${api}/api/appointments`,
        {
          doctorId,
          appointmentDate: date,
          appointmentTime: slot.from,
          reason,
          branch,
        },
        { withCredentials: true }
      );
      
      showMessage(res.data.message, "success");
      setTimeout(() => {
        onClose();
        onBooked();
      }, 1500);
      
    } catch (err) {
      console.error('Booking error:', err);
      
      if (err.response?.status === 409) {
        showMessage('This time slot was just booked by someone else. Please choose another slot.', "error");
        onBooked();
        setTimeout(() => onClose(), 2000);
      } else {
        showMessage(err.response?.data?.message || "Failed to book appointment", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cancel appointment
  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      showMessage("Please enter a cancel reason", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.patch(
        `${api}/api/appointments/${slot._id}/cancel`,
        { cancelReason },
        { withCredentials: true }
      );
      showMessage(res.data.message, "success");
      setTimeout(() => {
        onClose();
        onBooked();
      }, 1500);
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Failed to cancel appointment", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reschedule appointment (update date/time)
  const handleReschedule = async () => {
    if (!reason.trim()) {
      showMessage("Please enter a reason for rescheduling", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.put(
        `${api}/api/appointments/${slot._id}`,
        {
          appointmentDate: date,
          appointmentTime: slot.from,
          reason,
        },
        { withCredentials: true }
      );
      showMessage(res.data.message, "success");
      setTimeout(() => {
        onClose();
        onBooked();
      }, 1500);
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Failed to reschedule appointment", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative border border-emerald-100 overflow-hidden">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <CalendarClock className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {mode === "book"
                    ? "Book Appointment"
                    : mode === "cancel"
                    ? "Cancel Appointment"
                    : mode === "reschedule"
                    ? "Reschedule Appointment"
                    : "Appointment Details"}
                </h2>
                <p className="text-emerald-100 text-sm">
                  {mode === "book" 
                    ? "Confirm your appointment details"
                    : mode === "cancel"
                    ? "Cancel your existing appointment"
                    : mode === "reschedule"
                    ? "Choose a new time for your appointment"
                    : "View appointment information"}
                </p>
              </div>
            </div>
            <button
              className="text-white hover:text-emerald-100 transition-colors p-1 rounded-lg hover:bg-white/10"
              onClick={onClose}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Slot Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Appointment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Date:</span>
                <span className="text-gray-900 font-semibold">
                  {new Date(date).toLocaleDateString("en-GB", {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Time:</span>
                <span className="text-gray-900 font-semibold">{slot.from} - {slot.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Branch:</span>
                <span className="text-gray-900 font-semibold">{branch}</span>
              </div>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 rounded-xl flex items-center space-x-3 border ${
                messageType === "success"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}

          {/* Book Mode */}
          {mode === "book" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Appointment
                </label>
                <textarea
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe the reason for your visit..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all outline-none resize-none"
                ></textarea>
              </div>

              <button
                onClick={handleBook}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Cancel Mode */}
          {mode === "cancel" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Cancellation
                </label>
                <textarea
                  rows="3"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please let us know why you need to cancel..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all outline-none resize-none"
                ></textarea>
              </div>

              <button
                onClick={handleCancel}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    <span>Confirm Cancellation</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Reschedule Mode */}
          {mode === "reschedule" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Rescheduling
                </label>
                <textarea
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please let us know why you need to reschedule..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                ></textarea>
              </div>

              <button
                onClick={handleReschedule}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Rescheduling...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    <span>Confirm Reschedule</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* View Mode */}
          {mode === "view" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarClock className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Only</h3>
              <p className="text-gray-500 text-sm">
                No actions available for this appointment slot
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}