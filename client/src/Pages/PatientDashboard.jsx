import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FamilyDropdown from '../components/FamilyDropdown';
import FamilyLinkingModal from '../components/FamilyLinkingModal';

const PatientDashboard = () => {
  const [currentPatient, setCurrentPatient] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFamilyModal, setShowFamilyModal] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Directly fetch patient data
    axios
      .get(`${API_BASE}/api/patients/current`, { withCredentials: true })
      .then((response) => {
        if (response.data.patient) {
          setCurrentPatient(response.data.patient);
          setFamilyMembers(response.data.familyMembers || []);
        }
      })
      .catch((error) => {
        console.error('Error fetching patient data:', error);
      })
      .finally(() => {
        setLoading(false);
      });

    // Listen for showFamilyModal event
    const handleShowModal = () => setShowFamilyModal(true);
    window.addEventListener('showFamilyModal', handleShowModal);
    return () => {
      window.removeEventListener('showFamilyModal', handleShowModal);
    };
  }, [API_BASE]);

  const handleSwitchPatient = (newPatient) => {
    setCurrentPatient(newPatient);
  };

  const handleFamilyUpdate = () => {
    axios
      .get(`${API_BASE}/api/patients/current`, { withCredentials: true })
      .then((response) => {
        if (response.data.patient) {
          setCurrentPatient(response.data.patient);
          setFamilyMembers(response.data.familyMembers || []);
        }
      })
      .catch((error) => {
        console.error('Error refreshing family data:', error);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Patient Dashboard
              </h1>
            </div>
            
            {/* Family Dropdown */}
            <div className="flex items-center gap-4">
              <FamilyDropdown
                currentPatient={currentPatient}
                familyMembers={familyMembers}
                onSwitchPatient={handleSwitchPatient}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">
                Welcome, {currentPatient?.name}!
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Relationship: {currentPatient?.relationship_type}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Family Code: {currentPatient?.family_code}
              </p>
              {/* Rest of your dashboard content */}
            </div>
          </div>
        </div>
      </main>

      {/* Add the Family Linking Modal */}
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