import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, AlertCircle, Pill, X } from "lucide-react";
import SlotModalPatient from "./SlotModalPatient";
import { socket } from "../../socket";

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

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/api/appointments/my-appointments`, {
        withCredentials: true,
      });
      setAppointments(res.data.appointments || []);
      if (!res.data.appointments?.length) {
        showMessage("No appointments found", "info");
      }
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Failed to load appointments",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptionDetails = async (prescriptionId) => {
    try {
      const res = await axios.get(
        `${api}/api/prescriptions/id/${prescriptionId}`,
        { withCredentials: true }
      );
      setPrescription(res.data.prescription);
      setShowPrescriptionModal(true);
    } catch (err) {
      showMessage("Failed to load prescription details", "error");
    }
  };

  useEffect(() => {
    fetchAppointments();
    
    socket.on("appointmentStatusUpdated", () => {
      fetchAppointments();
    });

    return () => socket.off("appointmentStatusUpdated");
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
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="bg-blue-600 p-4">
          <div className="flex items-center gap-3">
            <Calendar className="text-white" size={24} />
            <div>
              <h1 className="text-xl font-semibold text-white">
                My Appointments
              </h1>
              <p className="text-blue-100 text-sm">
                View, cancel, or reschedule your appointments
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          {message && (
            <div
              className={`p-3 rounded-lg flex items-center gap-3 border ${
                messageType === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : messageType === "error"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              <AlertCircle size={16} />
              <span className="text-sm">{message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-600">Loading your appointments...</p>
          </div>
        ) : appointments.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Appointment History</h3>
              <span className="text-sm text-gray-600">{appointments.length} appointments</span>
            </div>
            
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Dr. {appointment.doctorId?.name || "Doctor"}
                        </h2>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : appointment.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : appointment.status === "Completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={14} className="text-blue-500" />
                          <span className="text-sm">
                            {new Date(appointment.appointmentDate).toLocaleDateString("en-GB", {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock size={14} className="text-blue-500" />
                          <span className="text-sm">{appointment.appointmentTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">{appointment.branch}</span>
                        </div>
                        {appointment.status === "Completed" && appointment.prescription && (
                          <div className="flex items-center gap-2 text-blue-600">
                            <Pill size={14} />
                            <span className="text-sm">Prescription Available</span>
                          </div>
                        )}
                      </div>
                      
                      {appointment.reason && (
                        <div className="mt-3 p-2 bg-gray-50 rounded border border-gray-200">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Reason:</span> {appointment.reason}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 min-w-[200px]">
                      {appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
                        <>
                          <button
                            onClick={() => openModal(appointment, "reschedule")}
                            className="px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => openModal(appointment, "cancel")}
                            className="px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {appointment.status === "Completed" && appointment.prescription && (
                        <button
                          onClick={() => handleViewPrescription(appointment)}
                          className="px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Pill size={14} />
                          <span>View Prescription</span>
                        </button>
                      )}
                      <button
                        onClick={() => openModal(appointment, "view")}
                        className="px-3 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors"
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
          <div className="text-center py-8">
            <Calendar className="text-gray-300 mx-auto mb-3" size={40} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Found</h3>
            <p className="text-gray-500 text-sm">
              You haven't booked any appointments yet
            </p>
          </div>
        )}
      </div>

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

      {showPrescriptionModal && prescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Pill className="text-white" size={20} />
                  <div>
                    <h2 className="text-lg font-semibold text-white">
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
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <h3 className="font-medium text-blue-800 mb-2 text-sm">Patient Details</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Name:</span> {prescription.patientId?.name || "N/A"}
                    </p>
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Phone:</span> {prescription.patientId?.phone || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <h3 className="font-medium text-green-800 mb-2 text-sm">Doctor Details</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Dr.</span> {prescription.doctorId?.name || "N/A"}
                    </p>
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Specialization:</span> {prescription.doctorId?.specialization || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {prescription.medicines && prescription.medicines.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Prescribed Medicines</h3>
                  <div className="space-y-2">
                    {prescription.medicines.map((medicine, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-blue-800">
                            {medicine.name}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                          <p><span className="font-medium">Dosage:</span> {medicine.dosage}</p>
                          <p><span className="font-medium">Timing:</span> {medicine.timing}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-yellow-800 text-sm text-center">
                    No specific medicines prescribed.
                  </p>
                </div>
              )}

              {prescription.instructions && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Doctor's Instructions</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded p-3">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {prescription.instructions}
                    </p>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3">
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
                className="w-full px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
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