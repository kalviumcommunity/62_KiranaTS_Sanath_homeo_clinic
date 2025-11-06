import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  User,
  Clock,
  CheckCircle,
  Pill,
} from "lucide-react";
import PatientSearch from "./PatientSearch";

export default function SlotModal({
  type, // "book" or "view"
  slot,
  date,
  doctorId,
  branch,
  onClose,
  onBooked,
}) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [reason, setReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [showPrescriptionView, setShowPrescriptionView] = useState(false);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  // Fetch latest appointment details
  useEffect(() => {
    if (type === "view" && slot && doctorId && date && branch) {
      fetchAppointmentDetails();
    }
  }, [type, slot, doctorId, date, branch]);

  const fetchAppointmentDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointments/doctor-appointments?date=${date}`,
        { withCredentials: true }
      );

      const sameSlotAppointments = res.data.appointments
        .filter(
          (a) =>
            a.doctorId._id === doctorId &&
            a.appointmentTime === slot.from &&
            a.branch === branch &&
            ["Pending", "Confirmed", "Completed"].includes(a.status)
        )
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      const match = sameSlotAppointments[0];
      if (match) {
        setAppointment(match);
        if (match.prescription) fetchPrescriptionDetails(match.prescription);
      }
    } catch (err) {
      console.error("Error fetching appointment details:", err);
    }
  };

  const fetchPrescriptionDetails = async (prescriptionId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/prescriptions/id/${prescriptionId}`,
        { withCredentials: true }
      );
      setPrescription(res.data.prescription);
    } catch (err) {
      console.error("Error fetching prescription:", err);
      showMessage("Failed to load prescription details", "error");
    }
  };

  // Book a new appointment
  const handleBookAppointment = async () => {
    if (!selectedPatient)
      return showMessage("Please select a patient first", "error");
    if (!reason.trim()) return showMessage("Please enter a reason", "error");

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointments/book-for-patient`,
        {
          patientId: selectedPatient._id,
          doctorId,
          appointmentDate: date,
          appointmentTime: slot.from,
          reason,
          branch,
        },
        { withCredentials: true }
      );

      showMessage("Appointment booked successfully!", "success");
      onBooked();
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Booking failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Confirm a pending appointment
  const handleConfirmAppointment = async () => {
    if (!appointment) return;

    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointments/${appointment._id}`,
        { status: "Confirmed" },
        { withCredentials: true }
      );

      showMessage("Appointment confirmed ✅", "success");
      onBooked();
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error(err);
      showMessage("Failed to confirm appointment", "error");
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const handleCancelAppointment = async () => {
    if (!appointment) return;
    if (!cancelReason.trim())
      return showMessage("Please enter a cancel reason", "error");

    setLoading(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointments/${appointment._id}/cancel`,
        {},
        { withCredentials: true }
      );

      showMessage("Appointment cancelled ❌", "success");
      onBooked();
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error(err);
      showMessage("Failed to cancel appointment", "error");
    } finally {
      setLoading(false);
    }
  };

  // Mark as completed (with prescription)
  const handleCompleteAppointment = async () => {
    if (!prescriptionText.trim()) {
      showMessage("Please write a prescription before completing", "error");
      return;
    }

    try {
      setLoading(true);

      const prescriptionRes = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/prescriptions`,
        {
          appointmentId: appointment._id,
          medicines: [],
          instructions: prescriptionText,
        },
        { withCredentials: true }
      );

      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointments/${appointment._id}/prescription`,
        { prescriptionId: prescriptionRes.data.prescription._id },
        { withCredentials: true }
      );

      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointments/${appointment._id}/complete`,
        {},
        { withCredentials: true }
      );

      showMessage("Appointment completed successfully!", "success");
      setShowCompleteModal(false);
      setPrescriptionText("");
      onBooked();
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error(err);
      showMessage(
        err.response?.data?.message || "Failed to complete appointment",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {type === "book" ? "Book Appointment" : "Appointment Details"}
        </h2>

        {/* Slot Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
          <div className="flex items-center space-x-3 text-gray-700">
            <Clock size={18} />
            <div>
              <p className="text-sm">
                <strong>Time:</strong> {slot.from} - {slot.to}
              </p>
              <p className="text-sm">
                <strong>Date:</strong> {date}
              </p>
              <p className="text-sm">
                <strong>Branch:</strong> {branch}
              </p>
            </div>
          </div>
        </div>

        {/* BOOK MODE */}
        {type === "book" && (
          <>
            <PatientSearch onSelect={setSelectedPatient} />
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Appointment
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. General check-up, cold, allergy..."
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {selectedPatient && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg mt-3">
                <p className="text-sm text-emerald-800 font-medium">
                  Selected: {selectedPatient.name} ({selectedPatient.phone})
                </p>
              </div>
            )}

            <button
              onClick={handleBookAppointment}
              disabled={!selectedPatient || loading}
              className="mt-5 w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </>
        )}

        {/* VIEW MODE */}
        {type === "view" && appointment && (
          <>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-3">
              <div className="flex items-center space-x-3 mb-2">
                <User size={18} className="text-emerald-600" />
                <span className="font-semibold text-gray-700">
                  {appointment.patientId.name}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Phone: {appointment.patientId.phone}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    appointment.status === "Pending"
                      ? "text-orange-600"
                      : appointment.status === "Cancelled"
                      ? "text-red-600"
                      : appointment.status === "Completed"
                      ? "text-green-600"
                      : "text-emerald-600"
                  }`}
                >
                  {appointment.status}
                </span>
              </p>

              {appointment.status === "Completed" && appointment.prescription && (
                <button
                  onClick={() => setShowPrescriptionView(true)}
                  className="w-full mt-2 bg-blue-100 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-200 flex items-center justify-center space-x-2"
                >
                  <Pill size={16} />
                  <span>View Prescription</span>
                </button>
              )}
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              {appointment.status === "Pending" && (
                <button
                  onClick={handleConfirmAppointment}
                  disabled={loading}
                  className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
                >
                  {loading ? "Confirming..." : "Confirm Appointment"}
                </button>
              )}

              {appointment.status === "Confirmed" && (
                <button
                  onClick={() => setShowCompleteModal(true)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <CheckCircle size={18} />
                  <span>Mark as Completed</span>
                </button>
              )}

              {!showCancelInput ? (
                <button
                  onClick={() => setShowCancelInput(true)}
                  className="w-full bg-red-100 text-red-700 py-2 rounded-lg font-medium hover:bg-red-200"
                >
                  Cancel Appointment
                </button>
              ) : (
                <div className="mt-3">
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Enter cancel reason..."
                    className="w-full border border-gray-300 rounded-lg p-2 mb-2 focus:ring-red-400 focus:border-red-400"
                  />
                  <button
                    onClick={handleCancelAppointment}
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? "Cancelling..." : "Confirm Cancel"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Message */}
        {message && (
          <div
            className={`mt-4 p-2 text-sm rounded-md ${
              messageType === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Complete Appointment Modal */}
      {showCompleteModal && appointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowCompleteModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
              <CheckCircle className="text-green-600" size={24} />
              <span>Complete Appointment</span>
            </h2>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3 mb-2">
                <User size={18} className="text-emerald-600" />
                <span className="font-semibold text-gray-700">
                  {appointment.patientId.name}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {new Date(appointment.appointmentDate).toLocaleDateString(
                  "en-GB"
                )}{" "}
                at {appointment.appointmentTime}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write Prescription *
              </label>
              <textarea
                value={prescriptionText}
                onChange={(e) => setPrescriptionText(e.target.value)}
                placeholder="Enter prescription details, medicines, dosage, instructions..."
                rows="6"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Please provide complete prescription details before marking as
                completed.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteAppointment}
                disabled={loading || !prescriptionText.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Completing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Complete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Prescription Modal */}
      {showPrescriptionView && prescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowPrescriptionView(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
              <Pill className="text-blue-600" size={24} />
              <span>Prescription</span>
            </h2>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3 mb-2">
                <User size={18} className="text-emerald-600" />
                <span className="font-semibold text-gray-700">
                  {appointment.patientId.name}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {new Date(appointment.appointmentDate).toLocaleDateString(
                  "en-GB"
                )}{" "}
                at {appointment.appointmentTime}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Doctor’s Instructions:
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {prescription.instructions}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPrescriptionView(false)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
