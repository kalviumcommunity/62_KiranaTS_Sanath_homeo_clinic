import React, { useEffect, useState } from "react";
import axios from "axios";
import FamilyDropdown from "../components/FamilyDropdown";
import FamilyLinkingModal from "../components/FamilyLinkingModal";
import AvailableSlotsPatient from "../components/patients/AvailableSlotsPatient";
import MyAppointments from "../components/patients/MyAppointments";
import { CalendarDays, Clock, User } from "lucide-react";

const PatientDashboard = () => {
  const [currentPatient, setCurrentPatient] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/patients/current`, {
          withCredentials: true,
        });
        if (res.data.patient) {
          setCurrentPatient(res.data.patient);
          setFamilyMembers(res.data.familyMembers || []);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();

    const handleShowModal = () => setShowFamilyModal(true);
    window.addEventListener("showFamilyModal", handleShowModal);
    return () => window.removeEventListener("showFamilyModal", handleShowModal);
  }, [API_BASE]);

  const handleSwitchPatient = (newPatient) => {
    setCurrentPatient(newPatient);
  };

  const handleFamilyUpdate = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/patients/current`, {
        withCredentials: true,
      });
      if (res.data.patient) {
        setCurrentPatient(res.data.patient);
        setFamilyMembers(res.data.familyMembers || []);
      }
    } catch (error) {
      console.error("Error refreshing family data:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-emerald-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Patient Portal
              </h1>
            </div>
            <FamilyDropdown
              currentPatient={currentPatient}
              familyMembers={familyMembers}
              onSwitchPatient={handleSwitchPatient}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {currentPatient?.name}!
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage your appointments and healthcare journey
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
              <span className="text-xs font-medium text-emerald-700">Family Code:</span>
              <code className="text-sm font-mono font-semibold text-emerald-800">
                {currentPatient?.family_code}
              </code>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200"
                : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200"
            }`}
          >
            <User size={18} />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("book")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === "book"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200"
                : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200"
            }`}
          >
            <Clock size={18} />
            <span>Book Appointment</span>
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === "appointments"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200"
                : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200"
            }`}
          >
            <CalendarDays size={18} />
            <span>My Appointments</span>
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Profile
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-600 w-32">Relationship:</span>
                    <span className="text-sm text-gray-900 capitalize">{currentPatient?.relationship_type}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-600 w-32">Phone:</span>
                    <span className="text-sm text-gray-900">{currentPatient?.phone}</span>
                  </div>
                  {currentPatient?.email && (
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-600 w-32">Email:</span>
                      <span className="text-sm text-gray-900">{currentPatient?.email}</span>
                    </div>
                  )}
                </div>
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-sm text-emerald-800">
                    💡 <strong>Quick tip:</strong> Use the tabs above to book new appointments or manage existing ones.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "book" && (
            <div>
              <AvailableSlotsPatient />
            </div>
          )}

          {activeTab === "appointments" && (
            <div>
              <MyAppointments />
            </div>
          )}
        </div>
      </main>

      {/* Family Modal */}
      <FamilyLinkingModal
        isOpen={showFamilyModal}
        onClose={() => setShowFamilyModal(false)}
        currentPatient={currentPatient}
        onFamilyUpdate={handleFamilyUpdate}
      />
    </div>
  );
};

export default PatientDashboard;