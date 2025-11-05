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

  const filteredDoctors = selectedBranch 
    ? doctors.filter(doc => doc.branches?.includes(selectedBranch))
    : doctors;

  if (!isOpen) return null;

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
        setNewMember({ name: '', phone: '', dob: '', gender: '', email: '', relationship_type: 'other' });
        setSelectedBranch('');
        setSelectedDoctorId('');
        setPicture(null);
        onFamilyUpdate?.();
        setTimeout(() => onClose(), 1500);
      }
    } catch (error) {
      console.error('Add family member error:', error);
      console.error('Error response:', error.response?.data);
      setMessage(error.response?.data?.message || 'Failed to add family member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setPicture(e.target.files[0]);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Add Family Member</h2>
                <p className="text-emerald-100 text-sm">Expand your family healthcare</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors bg-white/20 hover:bg-white/30 rounded-xl p-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {message && (
            <div className={`mb-4 p-4 rounded-xl text-sm font-medium ${
              message.includes('success') 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleAddNewMember} className="space-y-5">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Relationship *
                    </label>
                    <select
                      value={newMember.relationship_type}
                      onChange={(e) => setNewMember({...newMember, relationship_type: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={newMember.dob}
                      onChange={(e) => setNewMember({...newMember, dob: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      value={newMember.gender}
                      onChange={(e) => setNewMember({...newMember, gender: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all outlineoutline-none"
                  />
                </div>
              </div>
            </div>

            {/* Medical Preferences */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Medical Preferences</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Branch *
                  </label>
                  <select 
                    value={selectedBranch} 
                    onChange={(e) => {
                      setSelectedBranch(e.target.value);
                      setSelectedDoctorId('');
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Doctor *
                    </label>
                    <select 
                      value={selectedDoctorId} 
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
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
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Profile Picture *
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden" 
                  id="family-picture-upload"
                  required
                />
                <label htmlFor="family-picture-upload" className="cursor-pointer block">
                  <div className="w-16 h-16 mx-auto mb-3 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <Upload className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
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