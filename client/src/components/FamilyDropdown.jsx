import React, { useState } from 'react';
import axios from 'axios';
import { ChevronDown, UserCircle, Plus } from 'lucide-react';

const FamilyDropdown = ({ currentPatient, familyMembers, onSwitchPatient }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const otherFamilyMembers = familyMembers?.filter(
    member => member._id !== currentPatient?._id
  ) || [];

  const handleSwitch = async (patientId) => {
    if (isSwitching) return;
    setIsSwitching(true);

    try {
      const response = await axios.post(
        `${API_BASE}/api/patients/switch-patient`,
        { patientId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        onSwitchPatient(response.data.currentPatient);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error switching patient:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  const getRelationshipColor = (relationship) => {
    const colors = {
      self: 'bg-green-100 text-green-700',
      parent: 'bg-blue-100 text-blue-700',
      child: 'bg-purple-100 text-purple-700',
      spouse: 'bg-pink-100 text-pink-700',
      sibling: 'bg-yellow-100 text-yellow-700',
      grandparent: 'bg-orange-100 text-orange-700',
      grandchild: 'bg-indigo-100 text-indigo-700',
      other: 'bg-gray-100 text-gray-700'
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
      other: 'Family'
    };
    return texts[relationship] || texts.other;
  };

  if (!currentPatient || !familyMembers) {
    return (
      <div className="animate-pulse">
        <div className="w-48 h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Current Patient Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded shadow-sm hover:shadow-md transition-all min-w-[200px]"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {currentPatient.picture ? (
            <img
              src={`/uploads/${currentPatient.picture}`}
              alt={currentPatient.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <UserCircle className="w-4 h-4 text-white" />
            </div>
          )}
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
              {currentPatient.name}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getRelationshipColor(currentPatient.relationship_type)}`}>
              {getRelationshipText(currentPatient.relationship_type)}
            </span>
          </div>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {/* Current Patient Section */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <p className="text-xs font-medium text-gray-600 mb-2">Current Profile</p>
            <div className="flex items-center gap-2">
              {currentPatient.picture ? (
                <img
                  src={`/uploads/${currentPatient.picture}`}
                  alt={currentPatient.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {currentPatient.name}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {currentPatient.phone}
                </p>
                <span className={`inline-block text-xs px-1.5 py-0.5 rounded-full mt-1 font-medium ${getRelationshipColor(currentPatient.relationship_type)}`}>
                  {getRelationshipText(currentPatient.relationship_type)}
                </span>
              </div>
            </div>
          </div>

          {/* Other Family Members */}
          <div className="p-2">
            <p className="text-xs font-medium text-gray-600 px-2 py-1">
              Family Members
            </p>
            
            {otherFamilyMembers.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500">
                No other family members
              </div>
            ) : (
              <div className="space-y-1">
                {otherFamilyMembers.map((member) => (
                  <button
                    key={member._id}
                    onClick={() => handleSwitch(member._id)}
                    disabled={isSwitching}
                    className="flex items-center gap-2 w-full p-2 text-left rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {member.picture ? (
                      <img
                        src={`/uploads/${member.picture}`}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <UserCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.name}
                      </p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getRelationshipColor(member.relationship_type)}`}>
                        {getRelationshipText(member.relationship_type)}
                      </span>
                    </div>
                    {isSwitching && (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Family Member Button */}
          <div className="p-2 border-t border-gray-200">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('showFamilyModal'));
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
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