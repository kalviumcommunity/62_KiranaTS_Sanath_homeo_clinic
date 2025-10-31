import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FamilyLinkingModal = ({ isOpen, onClose, currentPatient, onFamilyUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  
  // Add new family member form
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: '',
    email: '',
    relationship_type: 'other'
  });
  const [picture, setPicture] = useState(null);

  // Fetch doctors and branches when modal opens
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
      
      // Extract unique branches from doctors' availability
      const uniqueBranches = [...new Set(
        doctorsData.flatMap(doc => 
          doc.availability?.map(avail => avail.branch) || []
        )
      )];
      setBranches(uniqueBranches);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  // Filter doctors based on selected branch
  const filteredDoctors = selectedBranch 
    ? doctors.filter(doc => 
        doc.availability?.some(avail => avail.branch === selectedBranch)
      )
    : doctors;

  if (!isOpen) return null;

  const handleAddNewMember = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validation
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
      
      // Append all form fields
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
        // Reset form
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Add Family Member</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.includes('success') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Family Code Display */}
          <div className="text-center p-4 bg-blue-50 rounded-lg mb-4">
            <p className="text-sm text-blue-700">
              Family Code: <strong>{currentPatient?.family_code}</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Each family member can choose their own doctor
            </p>
          </div>

          <form onSubmit={handleAddNewMember} className="space-y-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Relationship *
                  </label>
                  <select
                    value={newMember.relationship_type}
                    onChange={(e) => setNewMember({...newMember, relationship_type: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all outline-none"
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={newMember.dob}
                    onChange={(e) => setNewMember({...newMember, dob: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={newMember.gender}
                    onChange={(e) => setNewMember({...newMember, gender: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all outline-none"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all outline-none"
                />
              </div>
            </div>

            {/* Medical Preferences */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Medical Preferences</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Branch *
                </label>
                <select 
                  value={selectedBranch} 
                  onChange={(e) => {
                    setSelectedBranch(e.target.value);
                    setSelectedDoctorId(''); // Reset doctor when branch changes
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all outline-none"
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred Doctor *
                  </label>
                  <select 
                    value={selectedDoctorId} 
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all outline-none"
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

            {/* Profile Picture */}
            <div className="pt-4 border-t border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Profile Picture *
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-300 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden" 
                  id="family-picture-upload"
                  required
                />
                <label htmlFor="family-picture-upload" className="cursor-pointer">
                  <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-slate-600">
                    {picture ? picture.name : "Click to upload photo"}
                  </p>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !picture || !selectedBranch || !selectedDoctorId}
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
            >
              {isLoading ? 'Adding Family Member...' : 'Add Family Member'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FamilyLinkingModal;