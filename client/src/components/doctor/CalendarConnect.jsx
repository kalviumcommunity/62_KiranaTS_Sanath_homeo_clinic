import React, { useState } from "react";
import axios from "axios";

export default function CalendarConnect() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);

      // ✅ Get doctorId safely from localStorage
      const doctorData = localStorage.getItem("doctor");
      if (!doctorData) {
        alert("Doctor not logged in. Please log in again.");
        return;
      }

      const doctor = JSON.parse(doctorData);
      const doctorId = doctor?._id;

      if (!doctorId) {
        alert("Doctor ID not found in session.");
        return;
      }

      console.log("🩺 Connecting Google Calendar for doctor:", doctorId);

      // ✅ Make backend request with proper doctorId
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/google/calendar/init?doctorId=${doctorId}`
      );

      console.log("🔗 Redirecting to Google OAuth URL:", res.data.url);
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Calendar connect error:", err);
      alert("Failed to initiate Google Calendar connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Google Calendar Integration
      </h1>
      <p className="text-gray-600 mb-6">
        Connect your Google Calendar to automatically sync your appointments.
      </p>
      <button
        onClick={handleConnect}
        disabled={isLoading || isConnected}
        className={`px-6 py-3 rounded-lg font-medium transition-all
          ${isConnected ? "bg-gray-200 text-gray-500" : "bg-emerald-600 text-white hover:bg-emerald-700"}
        `}
      >
        {isConnected ? "Connected" : isLoading ? "Connecting..." : "Connect Google Calendar"}
      </button>
    </div>
  );
}
