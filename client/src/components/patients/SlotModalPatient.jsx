import React, { useState } from "react";
import axios from "axios";
import { X, CheckCircle2, CalendarClock } from "lucide-react";

export default function SlotModalPatient({
  type,
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
      showMessage(err.response?.data?.message || "Failed to cancel appointment", "error");
    } finally {
      setLoading(false);
    }
  };

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
      showMessage(err.response?.data?.message || "Failed to reschedule appointment", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative border border-gray-200">
        <div className="bg-blue-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarClock className="text-white" size={20} />
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {mode === "book"
                    ? "Book Appointment"
                    : mode === "cancel"
                    ? "Cancel Appointment"
                    : mode === "reschedule"
                    ? "Reschedule Appointment"
                    : "Appointment Details"}
                </h2>
                <p className="text-blue-100 text-sm">
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
              className="text-white hover:text-blue-100 transition-colors"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-2">
            <h3 className="font-medium text-gray-900 text-sm">Appointment Details</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(date).toLocaleDateString("en-GB", {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{slot.from} - {slot.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Branch:</span>
                <span className="font-medium">{branch}</span>
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded flex items-center gap-3 border ${
                messageType === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              <span className="text-sm">{message}</span>
            </div>
          )}

          {mode === "book" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Appointment
                </label>
                <textarea
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe the reason for your visit..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <button
                onClick={handleBook}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          )}

          {mode === "cancel" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Cancellation
                </label>
                <textarea
                  rows="3"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please let us know why you need to cancel..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none resize-none"
                />
              </div>

              <button
                onClick={handleCancel}
                disabled={loading}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Confirm Cancellation</span>
                  </>
                )}
              </button>
            </div>
          )}

          {mode === "reschedule" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rescheduling
                </label>
                <textarea
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please let us know why you need to reschedule..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <button
                onClick={handleReschedule}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Rescheduling...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Confirm Reschedule</span>
                  </>
                )}
              </button>
            </div>
          )}

          {mode === "view" && (
            <div className="text-center py-4">
              <CalendarClock className="text-gray-400 mx-auto mb-3" size={32} />
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