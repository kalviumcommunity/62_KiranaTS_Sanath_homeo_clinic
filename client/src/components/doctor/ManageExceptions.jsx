import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarX, Ban, Umbrella, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

export default function ManageExceptions() {
  const [doctorId, setDoctorId] = useState('');
  const [blocked, setBlocked] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [date, setDate] = useState('');
  const [from, setFrom] = useState('09:00');
  const [to, setTo] = useState('10:00');
  const [reason, setReason] = useState('');
  const [holidayReason, setHolidayReason] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const storedDoctor = JSON.parse(localStorage.getItem('doctor'));
    if (storedDoctor && storedDoctor._id) {
      setDoctorId(storedDoctor._id);
    }
  }, []);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const loadSchedule = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/schedule/${doctorId}`, {
        withCredentials: true,
      });
      setBlocked(res.data.blockedSlots || []);
      setHolidays(res.data.holidays || []);
    } catch (err) {
      console.error(err);
      showMessage('Error loading exceptions.', 'error');
    }
  };

  useEffect(() => {
    if (doctorId) loadSchedule();
  }, [doctorId]);

  const addBlocked = async () => {
    if (!date || !from || !to) {
      showMessage('Please fill all required fields', 'error');
      return;
    }
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/schedule/blocked`,
        { doctorId, date, from, to, reason },
        { withCredentials: true }
      );
      showMessage(res.data.message, 'success');
      setDate('');
      setFrom('09:00');
      setTo('10:00');
      setReason('');
      loadSchedule();
    } catch (err) {
      console.error(err);
      showMessage('Error adding blocked slot: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const addHoliday = async () => {
    if (!date || !holidayReason) {
      showMessage('Please fill all required fields', 'error');
      return;
    }
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/schedule/holiday`,
        { doctorId, date, reason: holidayReason },
        { withCredentials: true }
      );
      showMessage(res.data.message, 'success');
      setDate('');
      setHolidayReason('');
      loadSchedule();
    } catch (err) {
      console.error(err);
      showMessage('Error adding holiday: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const deleteBlocked = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/schedule/blocked/${id}`, { 
        withCredentials: true 
      });
      showMessage('Blocked slot deleted successfully', 'success');
      loadSchedule();
    } catch (err) {
      console.error(err);
      showMessage('Error deleting blocked slot', 'error');
    }
  };

  const deleteHoliday = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/schedule/holiday/${id}`, { 
        withCredentials: true 
      });
      showMessage('Holiday deleted successfully', 'success');
      loadSchedule();
    } catch (err) {
      console.error(err);
      showMessage('Error deleting holiday', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <CalendarX className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Manage Exceptions
              </h1>
              <p className="text-gray-500 text-sm mt-1">Block time slots and add holidays</p>
            </div>
          </div>

          {/* Doctor ID Info */}
          {doctorId && (
            <div className="bg-gray-50 px-4 py-2 rounded-lg mb-6 border border-gray-200">
              <p className="text-xs text-gray-500">
                Doctor ID: <span className="font-mono text-gray-700">{doctorId}</span>
              </p>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg flex items-center space-x-3 border ${
              messageType === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              'bg-red-50 text-red-700 border-red-200'
            }`}>
              {messageType === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}
        </div>

        {/* Add Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Add Blocked Slot */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Ban className="text-white" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Block Time Slot</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <input 
                    type="time" 
                    value={from} 
                    onChange={(e) => setFrom(e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <input 
                    type="time" 
                    value={to} 
                    onChange={(e) => setTo(e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g., Personal appointment" 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <button 
                onClick={addBlocked} 
                className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus size={18} />
                <span>Add Blocked Slot</span>
              </button>
            </div>
          </div>

          {/* Add Holiday */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Umbrella className="text-white" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Add Holiday</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <input 
                  type="text" 
                  placeholder="e.g., Christmas, Diwali" 
                  value={holidayReason} 
                  onChange={(e) => setHolidayReason(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <button 
                onClick={addHoliday} 
                className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 mt-4"
              >
                <Plus size={18} />
                <span>Add Holiday</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blocked Slots List */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Ban className="text-emerald-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Blocked Slots</h3>
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                {blocked.length}
              </span>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {blocked.length === 0 ? (
                <div className="text-center py-8">
                  <Ban className="mx-auto text-gray-300 mb-3" size={32} />
                  <p className="text-gray-400">No blocked slots</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {blocked.map((b) => (
                    <div key={b._id} className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start justify-between hover:shadow-sm transition-all duration-200">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {new Date(b.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {b.from} - {b.to}
                        </div>
                        {b.reason && (
                          <div className="text-sm text-gray-500 mt-1 italic">
                            {b.reason}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => deleteBlocked(b._id)} 
                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Holidays List */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Umbrella className="text-emerald-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Holidays</h3>
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                {holidays.length}
              </span>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {holidays.length === 0 ? (
                <div className="text-center py-8">
                  <Umbrella className="mx-auto text-gray-300 mb-3" size={32} />
                  <p className="text-gray-400">No holidays</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {holidays.map((h) => (
                    <div key={h._id} className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start justify-between hover:shadow-sm transition-all duration-200">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {new Date(h.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {h.reason}
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteHoliday(h._id)} 
                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}