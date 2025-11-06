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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <User className="text-white" size={18} />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome back, {currentPatient?.name}!
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage your appointments and healthcare journey
              </p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded border border-blue-200">
              <span className="text-xs font-medium text-blue-700">Family Code:</span>
              <code className="text-sm font-mono font-semibold text-blue-800">
                {currentPatient?.family_code}
              </code>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            <User size={16} />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("book")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === "book"
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            <Clock size={16} />
            <span>Book Appointment</span>
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === "appointments"
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            <CalendarDays size={16} />
            <span>My Appointments</span>
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Profile
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600 w-24">Relationship:</span>
                    <span className="text-sm text-gray-900 capitalize">{currentPatient?.relationship_type}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600 w-24">Phone:</span>
                    <span className="text-sm text-gray-900">{currentPatient?.phone}</span>
                  </div>
                  {currentPatient?.email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-600 w-24">Email:</span>
                      <span className="text-sm text-gray-900">{currentPatient?.email}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm text-blue-800">
                    Use the tabs above to book new appointments or manage existing ones.
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