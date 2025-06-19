import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ReceptionistLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/receptionists/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMessage({ text: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/dashboard-receptionist"), 1500);
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Login failed. Please try again.",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex justify-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-blue-600 text-2xl">👩‍💼</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Receptionist Portal</h1>
          <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
              required
              minLength="6"
            />
          </div>

          {message.text && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === "error"
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="text-center text-sm text-gray-500 mt-4">
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}