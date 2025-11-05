import React, { useState } from "react";
import axios from "axios";
import { Search, User } from "lucide-react";

export default function PatientSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setMessage("Please enter a name or phone number");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/patients/search?query=${query}`,
        { withCredentials: true }
      );
      setPatients(res.data.patients || []);
      if (res.data.patients.length === 0) setMessage("No patients found");
    } catch (err) {
      console.error(err);
      setMessage("Error fetching patients");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (patient) => {
    setSelectedId(patient._id);
    onSelect(patient); // send data back to SlotModal
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <form onSubmit={handleSearch} className="flex items-center space-x-3 mb-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient by name or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Message */}
      {message && <p className="text-sm text-gray-500 mb-2">{message}</p>}

      {/* Results */}
      <div className="max-h-52 overflow-y-auto space-y-2">
        {patients.map((p) => (
          <div
            key={p._id}
            onClick={() => handleSelect(p)}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all border ${
              selectedId === p._id
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-200 hover:bg-gray-100"
            }`}
          >
            <img
              src={
                p.picture
                  ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${p.picture}`
                  : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt={p.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-200 mr-3"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-800">{p.name}</p>
              <p className="text-xs text-gray-500">{p.phone}</p>
            </div>
            <User
              size={16}
              className={
                selectedId === p._id
                  ? "text-emerald-600"
                  : "text-gray-400"
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
