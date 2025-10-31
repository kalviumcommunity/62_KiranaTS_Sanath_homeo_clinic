import React, { useState} from 'react';
import { ChevronDownIcon, UserIcon } from '@heroicons/react/24/outline';

const FamilyDropdown = ({ currentPatient, familyMembers, onSwitchPatient }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // Filter out current patient from family members list
  const otherFamilyMembers = familyMembers?.filter(
    member => member._id !== currentPatient?._id
  ) || [];

  const handleSwitch = async (patientId) => {
    if (isSwitching) return;
    
    setIsSwitching(true);
    try {
      // FIX: Changed from '/api/patient/switch-family-member' to '/api/patients/switch-patient'
      const response = await fetch('/api/patients/switch-patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientId }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        // Call the parent callback to update current patient
        onSwitchPatient(data.currentPatient);
        setIsOpen(false);
      } else {
        console.error('Failed to switch patient:', data.message);
        alert('Failed to switch patient: ' + data.message);
      }
    } catch (error) {
      console.error('Error switching patient:', error);
      alert('Error switching patient. Please try again.');
    } finally {
      setIsSwitching(false);
    }
  };

  const getRelationshipColor = (relationship) => {
    const colors = {
      self: 'bg-blue-100 text-blue-800',
      parent: 'bg-green-100 text-green-800',
      child: 'bg-purple-100 text-purple-800',
      spouse: 'bg-pink-100 text-pink-800',
      sibling: 'bg-yellow-100 text-yellow-800',
      grandparent: 'bg-orange-100 text-orange-800',
      grandchild: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[relationship] || colors.other;
  };

  const getRelationshipText = (relationship) => {
    const texts = {
      self: 'Self',
      parent: 'Parent',
      child: 'Child',
      spouse: 'Spouse',
      sibling: 'Sibling',
      grandparent: 'Grandparent',
      grandchild: 'Grandchild',
      other: 'Family Member'
    };
    return texts[relationship] || texts.other;
  };

  if (!currentPatient || !familyMembers) {
    return (
      <div className="animate-pulse">
        <div className="w-48 h-10 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Current Patient Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 min-w-[200px]"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {currentPatient.picture ? (
            <img
              src={`/uploads/${currentPatient.picture}`}
              alt={currentPatient.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-4 h-4 text-gray-500" />
            </div>
          )}
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
              {currentPatient.name}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${getRelationshipColor(currentPatient.relationship_type)}`}>
              {getRelationshipText(currentPatient.relationship_type)}
            </span>
          </div>
        </div>
        <ChevronDownIcon 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {/* Current Patient Section */}
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              {currentPatient.picture ? (
                <img
                  src={`/uploads/${currentPatient.picture}`}
                  alt={currentPatient.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-gray-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {currentPatient.name}
                </p>
                <p className="text-xs text-gray-600">
                  {currentPatient.phone}
                </p>
                <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${getRelationshipColor(currentPatient.relationship_type)}`}>
                  {getRelationshipText(currentPatient.relationship_type)} (Current)
                </span>
              </div>
            </div>
          </div>

          {/* Other Family Members */}
          <div className="p-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1">
              Switch to Family Member
            </p>
            
            {otherFamilyMembers.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500">
                No other family members
              </div>
            ) : (
              otherFamilyMembers.map((member) => (
                <button
                  key={member._id}
                  onClick={() => handleSwitch(member._id)}
                  disabled={isSwitching}
                  className="flex items-center gap-3 w-full p-3 text-left rounded-lg hover:bg-blue-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {member.picture ? (
                    <img
                      src={`/uploads/${member.picture}`}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {member.phone}
                    </p>
                    <span className={`inline-block text-xs px-1.5 py-0.5 rounded-full mt-1 ${getRelationshipColor(member.relationship_type)}`}>
                      {getRelationshipText(member.relationship_type)}
                    </span>
                  </div>
                  {isSwitching && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Add Family Member Button */}
          <div className="p-2 border-t border-gray-100">
            <button
              onClick={() => {
                // Dispatch event to show modal
                window.dispatchEvent(new CustomEvent('showFamilyModal'));
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Family Member
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FamilyDropdown;