import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Upload, Users } from 'lucide-react';

const FamilyLinkingModal = ({ isOpen, onClose, currentPatient, onFamilyUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: '',
    email: '',
    relationship_type: 'other'
  });
  const [picture, setPicture] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchDoctorsAndBranches();
      resetForm();
    }
  }, [isOpen]);

  const fetchDoctorsAndBranches = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors`);
      const doctorsData = response.data.doctors || [];
      setDoctors(doctorsData);
      
      const uniqueBranches = [...new Set(
        doctorsData.flatMap(doc => doc.branches || [])
      )];
      setBranches(uniqueBranches);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const resetForm = () => {
    setNewMember({
      name: '',
      phone: '',
      dob: '',
      gender: '',
      email: '',
      relationship_type: 'other'
    });
    setSelectedBranch('');
    setSelectedDoctorId('');
    setPicture(null);
    setMessage('');
  };

  const filteredDoctors = selectedBranch 
    ? doctors.filter(doc => doc.branches?.includes(selectedBranch))
    : doctors;

  const handleAddNewMember = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!picture) {
      setMessage('Profile picture is required');
      setIsLoading(false);
      return;
    }

    if (!selectedBranch || !selectedDoctorId) {
      setMessage('Please select both branch and doctor');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newMember.name);
      formData.append("phone", newMember.phone);
      formData.append("dob", newMember.dob);
      formData.append("gender", newMember.gender);
      formData.append("email", newMember.email || "");
      formData.append("relationship_type", newMember.relationship_type);
      formData.append("existing_patient_id", currentPatient._id);
      formData.append("doctorId", selectedDoctorId);
      formData.append("picture", picture);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/patients/add-family-member`,
        formData,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.message === 'Family member added successfully') {
        setMessage('Family member added successfully!');
        onFamilyUpdate?.();
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1500);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add family member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setPicture(e.target.files[0]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="text-white" size={24} />
              <div>
                <h2 className="text-lg font-semibold text-white">Add Family Member</h2>
                <p className="text-blue-100 text-sm">Expand your family healthcare</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {message && (
            <div className={`mb-4 p-3 rounded text-sm ${
              message.includes('success') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleAddNewMember} className="space-y-4">
            {/* Personal Information */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Personal Information</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship *
                    </label>
                    <select
                      value={newMember.relationship_type}
                      onChange={(e) => setNewMember({...newMember, relationship_type: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      required
                    >
                      <option value="parent">Parent</option>
                      <option value="child">Child</option>
                      <option value="spouse">Spouse</option>
                      <option value="sibling">Sibling</option>
                      <option value="grandparent">Grandparent</option>
                      <option value="grandchild">Grandchild</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={newMember.dob}
                      onChange={(e) => setNewMember({...newMember, dob: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender *
                    </label>
                    <select
                      value={newMember.gender}
                      onChange={(e) => setNewMember({...newMember, gender: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Medical Preferences */}
            <div className="pt-3 border-t border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Medical Preferences</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Branch *
                  </label>
                  <select 
                    value={selectedBranch} 
                    onChange={(e) => {
                      setSelectedBranch(e.target.value);
                      setSelectedDoctorId('');
                    }}
                    className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Select branch</option>
                    {branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>

                {selectedBranch && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Doctor *
                    </label>
                    <select 
                      value={selectedDoctorId} 
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      required
                    >
                      <option value="">Select doctor</option>
                      {filteredDoctors.map(doc => (
                        <option key={doc._id} value={doc._id}>
                          {doc.name} - {doc.specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Picture */}
            <div className="pt-3 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden" 
                  id="family-picture-upload"
                  required
                />
                <label htmlFor="family-picture-upload" className="cursor-pointer block">
                  <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    {picture ? picture.name : "Click to upload photo"}
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG or GIF (Max 5MB)
                  </p>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !picture || !selectedBranch || !selectedDoctorId}
              className="w-full p-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Adding Family Member...
                </span>
              ) : (
                'Add Family Member'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FamilyLinkingModal;