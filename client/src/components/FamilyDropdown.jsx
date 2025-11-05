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
      } else {
        console.error('Failed to switch patient:', response.data.message);
        alert('Failed to switch patient: ' + response.data.message);
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
      self: 'bg-emerald-100 text-emerald-700',
      parent: 'bg-blue-100 text-blue-700',
      child: 'bg-purple-100 text-purple-700',
      spouse: 'bg-pink-100 text-pink-700',
      sibling: 'bg-amber-100 text-amber-700',
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
        <div className="w-48 h-10 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Current Patient Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className="flex items-center gap-3 px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-emerald-200 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 min-w-[220px]"
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {currentPatient.picture ? (
            <img
              src={`/uploads/${currentPatient.picture}`}
              alt={currentPatient.name}
              className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-emerald-100"
            />
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
              <UserCircle className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-sm font-semibold text-gray-900 truncate max-w-[130px]">
              {currentPatient.name}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRelationshipColor(currentPatient.relationship_type)}`}>
              {getRelationshipText(currentPatient.relationship_type)}
            </span>
          </div>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-emerald-100 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Current Patient Section */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-emerald-50 to-teal-50">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-3">Current Profile</p>
            <div className="flex items-center gap-3">
              {currentPatient.picture ? (
                <img
                  src={`/uploads/${currentPatient.picture}`}
                  alt={currentPatient.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {currentPatient.name}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {currentPatient.phone}
                </p>
                <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1.5 font-medium ${getRelationshipColor(currentPatient.relationship_type)}`}>
                  {getRelationshipText(currentPatient.relationship_type)}
                </span>
              </div>
            </div>
          </div>

          {/* Other Family Members */}
          <div className="p-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-2">
              Family Members
            </p>
            
            {otherFamilyMembers.length === 0 ? (
              <div className="text-center py-6 text-sm text-gray-500">
                No other family members yet
              </div>
            ) : (
              <div className="space-y-1">
                {otherFamilyMembers.map((member) => (
                  <button
                    key={member._id}
                    onClick={() => handleSwitch(member._id)}
                    disabled={isSwitching}
                    className="flex items-center gap-3 w-full p-3 text-left rounded-xl hover:bg-emerald-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {member.picture ? (
                      <img
                        src={`/uploads/${member.picture}`}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-transparent group-hover:ring-emerald-200 transition-all"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {member.phone}
                      </p>
                      <span className={`inline-block text-xs px-1.5 py-0.5 rounded-full mt-1 font-medium ${getRelationshipColor(member.relationship_type)}`}>
                        {getRelationshipText(member.relationship_type)}
                      </span>
                    </div>
                    {isSwitching && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Family Member Button */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('showFamilyModal'));
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors duration-150 border border-emerald-200"
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