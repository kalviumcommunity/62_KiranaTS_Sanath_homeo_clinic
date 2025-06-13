import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PatientLogin() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    if (!name || !phone || !dob) {
      setMessage("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/patients/login",
        { name, phone, dob },
        { withCredentials: true }
      );
      setMessage("Login successful. Redirecting...");
      setTimeout(() => navigate("/patient/dashboard"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center">
      <Navbar />
      <div className="max-w-md w-full pt-12 pb-16 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md border border-[#D9D9D9]">
          <div className="text-center mb-8">
            <div className="text-blue-600 text-2xl">👤</div>
            <h2 className="mt-4 text-3xl font-bold text-[#000000]">Patient Portal</h2>
            <p className="mt-2 text-sm text-[#89A0A4]">Secure access to your medical records</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${message.includes("success") ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"}`}>
              <p>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-[#000000] mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="block w-full px-4 py-3 bg-white border border-[#D9D9D9] rounded-lg shadow-sm text-[#000000] placeholder-[#A7A7A7] focus:ring-2 focus:ring-[#429DAB] focus:border-[#429DAB]"
                required
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-[#000000] mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#89A0A4] sm:text-sm">+91</div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(123) 456-7890"
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-[#D9D9D9] rounded-lg shadow-sm text-[#000000] placeholder-[#A7A7A7] focus:ring-2 focus:ring-[#429DAB] focus:border-[#429DAB]"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>

            {/* DOB Field */}
            <div>
              <label className="block text-sm font-medium text-[#000000] mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={dob ? new Date(dob) : null}
                onChange={(date) => setDob(date.toISOString().split("T")[0])}
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                placeholderText="Select your date of birth"
                className="block w-full px-20 py-3 bg-white border border-[#D9D9D9] rounded-lg shadow-sm text-[#000000] placeholder-[#A7A7A7] focus:ring-2 focus:ring-[#429DAB] focus:border-[#429DAB]"
                dateFormat="yyyy-MM-dd"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  isSubmitting ? "bg-[#C08A69]" : "bg-[#429DAB] hover:bg-[#3a8c99]"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#429DAB] transition-all duration-200`}
              >
                {isSubmitting ? "Authenticating..." : "Sign In Securely"}
              </button>
            </div>

            <div className="text-center text-sm space-y-3">
              <p className="text-[#89A0A4]">
                New patient?{" "}
                <a href="/patients/signup" className="font-medium text-[#429DAB] hover:text-[#3a8c99] hover:underline">
                  Create account
                </a>
              </p>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-[#89A0A4]">
            🔒 Your information is secure
          </p>
        </div>
      </div>
    </div>
  );
}
