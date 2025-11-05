import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, AlertCircle, Pill, X, Sparkles } from "lucide-react";
import SlotModalPatient from "./SlotModalPatient";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalType, setModalType] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  const api = import.meta.env.VITE_API_BASE_URL;

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  // ✅ Fetch all patient appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/api/appointments/my-appointments`, {
        withCredentials: true,
      });
      setAppointments(res.data.appointments || []);
      if (!res.data.appointments?.length)
        showMessage("No appointments found", "info");
    } catch (err) {
      console.error(err);
      showMessage(
        err.response?.data?.message || "Failed to load appointments",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch prescription details
  const fetchPrescriptionDetails = async (prescriptionId) => {
    try {
      const res = await axios.get(
        `${api}/api/prescriptions/id/${prescriptionId}`,
        { withCredentials: true }
      );
      setPrescription(res.data.prescription);
      setShowPrescriptionModal(true);
    } catch (err) {
      console.error("Error fetching prescription:", err);
      showMessage("Failed to load prescription details", "error");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openModal = (appointment, type) => {
    setSelectedAppointment(appointment);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setModalType("");
  };

  const handleViewPrescription = async (appointment) => {
    if (appointment.prescription) {
      await fetchPrescriptionDetails(appointment.prescription);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                My Appointments
              </h1>
              <p className="text-emerald-100 text-sm mt-1">
                View, cancel, or reschedule your appointments
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-xl flex items-center space-x-3 border ${
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

      {/* Appointments Display */}
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading your appointments...</p>
          </div>
        ) : appointments.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Appointment History</h3>
              <div className="flex items-center space-x-2 text-emerald-600">
                <Sparkles size={18} />
                <span className="text-sm font-semibold">{appointments.length} appointments</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all bg-gradient-to-r from-gray-50 to-white hover:from-white hover:to-gray-50"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h2 className="text-xl font-bold text-gray-900">
                          Dr. {appointment.doctorId?.name || "Doctor"}
                        </h2>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            appointment.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : appointment.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : appointment.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar size={16} className="text-emerald-500" />
                          <span className="text-sm font-medium">
                            {new Date(appointment.appointmentDate).toLocaleDateString("en-GB", {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock size={16} className="text-emerald-500" />
                          <span className="text-sm font-medium">{appointment.appointmentTime}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <div className="w-4 h-4 flex items-center justify-center">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">{appointment.branch}</span>
                        </div>
                        {appointment.status === "Completed" && appointment.prescription && (
                          <div className="flex items-center space-x-2 text-blue-600">
                            <Pill size={16} />
                            <span className="text-sm font-medium">Prescription Available</span>
                          </div>
                        )}
                      </div>
                      
                      {appointment.reason && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Reason:</span> {appointment.reason}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 min-w-[200px]">
                      {appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
                        <>
                          <button
                            onClick={() => openModal(appointment, "reschedule")}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl text-sm"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => openModal(appointment, "cancel")}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {appointment.status === "Completed" && appointment.prescription && (
                        <button
                          onClick={() => handleViewPrescription(appointment)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl text-sm flex items-center justify-center space-x-2"
                        >
                          <Pill size={16} />
                          <span>View Prescription</span>
                        </button>
                      )}
                      <button
                        onClick={() => openModal(appointment, "view")}
                        className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg hover:shadow-xl text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-gray-300" size={40} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Found</h3>
            <p className="text-gray-500 text-sm">
              You haven't booked any appointments yet
            </p>
          </div>
        )}
      </div>

      {/* Slot Modal */}
      {selectedAppointment && (
        <SlotModalPatient
          type={modalType}
          slot={selectedAppointment}
          date={selectedAppointment.appointmentDate}
          doctorId={selectedAppointment.doctorId?._id}
          branch={selectedAppointment.branch}
          onClose={closeModal}
          onBooked={fetchAppointments}
        />
      )}

      {/* Prescription View Modal */}
      {showPrescriptionModal && prescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Pill className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Medical Prescription
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Prescribed medication and instructions
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPrescriptionModal(false)}
                  className="text-white hover:text-blue-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient & Doctor Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-800 mb-3 text-sm uppercase tracking-wide">
                    Patient Details
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Name:</span> {prescription.patientId?.name || "N/A"}
                    </p>
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Phone:</span> {prescription.patientId?.phone || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <h3 className="font-semibold text-emerald-800 mb-3 text-sm uppercase tracking-wide">
                    Doctor Details
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-emerald-700">
                      <span className="font-medium">Dr.</span> {prescription.doctorId?.name || "N/A"}
                    </p>
                    <p className="text-sm text-emerald-700">
                      <span className="font-medium">Specialization:</span> {prescription.doctorId?.specialization || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medicines List */}
              {prescription.medicines && prescription.medicines.length > 0 ? (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Prescribed Medicines</h3>
                  <div className="space-y-3">
                    {prescription.medicines.map((medicine, index) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-bold text-blue-800 text-lg">
                            {medicine.name}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
                          <p><span className="font-semibold">Dosage:</span> {medicine.dosage}</p>
                          <p><span className="font-semibold">Timing:</span> {medicine.timing}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-yellow-800 text-sm text-center font-medium">
                    No specific medicines prescribed.
                  </p>
                </div>
              )}

              {/* Instructions */}
              {prescription.instructions && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Doctor's Instructions</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {prescription.instructions}
                    </p>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 text-center">
                  Prescribed on: {new Date(prescription.createdAt).toLocaleDateString("en-GB", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Close Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}