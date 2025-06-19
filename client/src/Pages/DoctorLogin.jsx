import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/NavBar";

export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsSubmitting(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/doctors/login`,
        { email, password },
        { withCredentials: true }
      );

      setMessage("Login successful!");
      navigate("/dashboard-doctor");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
        <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Doctor Login
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
              isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          {message && (
            <p className="text-center text-sm text-red-600 mt-2">⚠️ {message}</p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
