import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Calendar, Search, AlertCircle } from "lucide-react";

export default function AvailableSlots({ doctorId }) {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDoctorId, setCurrentDoctorId] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (doctorId) {
      setCurrentDoctorId(doctorId);
    } else {
      const storedDoctor = JSON.parse(localStorage.getItem('doctor'));
      if (storedDoctor && storedDoctor._id) {
        setCurrentDoctorId(storedDoctor._id);
      }
    }
  }, [doctorId]);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const fetchSlots = async () => {
    if (!currentDoctorId) {
      showMessage("Please select a doctor first", "error");
      return;
    }
    
    if (!date) {
      showMessage("Please select a date", "error");
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/schedule/available/${currentDoctorId}/${date}`,
        { withCredentials: true }
      );
      setSlots(res.data.slots || []);
      showMessage(`Found ${res.data.slots?.length || 0} available slots`, "success");
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Error fetching available slots", "error");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Available Slots
              </h1>
              <p className="text-gray-500 text-sm mt-1">View your available time slots for any date</p>
            </div>
          </div>

          {/* Doctor ID Info */}
          {currentDoctorId && (
            <div className="bg-gray-50 px-4 py-2 rounded-lg mb-6 border border-gray-200">
              <p className="text-xs text-gray-500">
                Doctor ID: <span className="font-mono text-gray-700">{currentDoctorId}</span>
              </p>
            </div>
          )}

          {/* Search Form */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchSlots}
                disabled={loading || !currentDoctorId || !date}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    <span>Search Slots</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg flex items-center space-x-3 border ${
              messageType === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              messageType === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
              'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {!date && !loading && (
            <div className="text-center py-12">
              <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-400">Select a date to view available slots</p>
            </div>
          )}

          {date && slots.length === 0 && !loading && (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto text-orange-400 mb-4" size={48} />
              <p className="text-gray-600 font-medium">No available slots for this date</p>
              <p className="text-gray-400 text-sm mt-2">Try selecting a different date</p>
            </div>
          )}

          {slots.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Available Time Slots
                </h3>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                  {slots.length} slot{slots.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {slots.map((s, idx) => (
                  <div 
                    key={idx} 
                    className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Clock className="text-emerald-600" size={16} />
                      <div className="font-semibold text-emerald-800 text-base">
                        {s.from}
                      </div>
                    </div>
                    <div className="text-center text-gray-500 text-xs">
                      to
                    </div>
                    <div className="text-center font-semibold text-emerald-800 text-base mt-1">
                      {s.to}
                    </div>
                    {s.isoFrom && (
                      <div className="text-xs text-gray-400 text-center mt-2 pt-2 border-t border-emerald-200">
                        {new Date(s.isoFrom).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}