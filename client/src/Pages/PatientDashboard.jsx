import React, { useEffect, useState } from 'react';
import FamilyDropdown from '../components/FamilyDropdown';
import FamilyLinkingModal from '../components/FamilyLinkingModal';

const PatientDashboard = () => {
  const [currentPatient, setCurrentPatient] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFamilyModal, setShowFamilyModal] = useState(false); // Add this state

  // Fetch current patient and family members on component mount
  useEffect(() => {
    fetchPatientData();
    
    // Listen for the custom event from FamilyDropdown
    const handleShowModal = () => setShowFamilyModal(true);
    window.addEventListener('showFamilyModal', handleShowModal);
    
    return () => {
      window.removeEventListener('showFamilyModal', handleShowModal);
    };
  }, []);

  const fetchPatientData = async () => {
    try {
      // FIX: Changed from '/api/patient/current' to '/api/patients/current'
      const response = await fetch('/api/patients/current', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch patient data');
      }
      
      const data = await response.json();
      
      if (data.patient) {
        setCurrentPatient(data.patient);
        setFamilyMembers(data.familyMembers || []);
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchPatient = (newPatient) => {
    setCurrentPatient(newPatient);
    // You might want to refetch dashboard data here based on the new patient
    // fetchDashboardData(newPatient._id);
  };

  const handleFamilyUpdate = () => {
    // Refresh the family data when a new member is added
    fetchPatientData();
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