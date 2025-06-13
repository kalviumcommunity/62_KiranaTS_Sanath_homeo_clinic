import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PatientSignup() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    dob: null,
    gender: "",
    email: "",
    doctorId: "",
  });
  const [message, setMessage] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/doctors")
      .then((res) => {
        setDoctors(res.data.doctors);
        const uniqueBranches = [...new Set(
          res.data.doctors.flatMap(doc =>
            doc.availability?.map(avail => avail.branch) || []
          )
        )];
        setBranches(uniqueBranches);
      })
      .catch((err) => console.error("Doctor fetch error:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, picture: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("dob", form.dob ? form.dob.toISOString().split("T")[0] : "");
      formData.append("gender", form.gender);
      formData.append("email", form.email);
      formData.append("doctorId", form.doctorId);
      formData.append("picture", form.picture);

      await axios.post("http://localhost:5000/api/patients/signup", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Registration successful. Redirecting...");
      setTimeout(() => navigate("/patient/dashboard"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center">
      <Navbar />
      <div className="max-w-md w-full pt-8 pb-16">
        <div className="bg-white p-8 rounded-lg shadow-md border border-[#D9D9D9]">
          <div className="text-center mb-8">
            <div className="text-blue-600 text-2xl">📝</div>
            <h2 className="mt-4 text-3xl font-bold text-[#000000]">Create Patient Account</h2>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${message.includes("successful") ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"}`}>
              <p>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#000000] mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 bg-white border border-[#D9D9D9] rounded-lg shadow-sm text-[#000000] placeholder-[#A7A7A7] focus:ring-2 focus:ring-[#429DAB] focus:border-[#429DAB]"
                placeholder="John Doe"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#000000] mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#89A0A4] sm:text-sm">+1</div>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter 10 digit phone number"
                  pattern="[0-9]{10}"
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-[#D9D9D9] rounded-lg shadow-sm text-[#000000] placeholder-[#A7A7A7] focus:ring-2 focus:ring-[#429DAB] focus:border-[#429DAB]"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-[#000000] mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={form.dob}
                onChange={(date) => setForm({ ...form, dob: date })}
                maxDate={new Date()}
                placeholderText="Select date"
                dateFormat="yyyy-MM-dd"
                className="block w-full px-4 py-3 bg-white border border-[#D9D9D9] rounded-lg shadow-sm text-[#000000] placeholder-[#A7A7A7] focus:ring-2 focus:ring-[#429DAB] focus:border-[#429DAB]"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-[#000000] mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 bg-white border border-[#D9D9D9] rounded-lg shadow-sm text-[#000000] focus:ring-2 focus:ring-[#429DAB] focus:border-[#429DAB]"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#000000] mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="example@email.com"
                className="block w-full px-4 py-3 bg-white border border-[#D9D9D9] rounded-lg shadow-sm text-[#000000] placeholder-[#A7A7A7] focus:ring-2 focus:ring-[#429DAB] focus:border-[#429DAB]"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-[#000000] mb-2">
                Branch <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                required
                className="block w-full px-4 py-3 bg-white border border-[#D9D9D9] rounded-lg shadow-sm text-[#000000] focus:ring-2 focus:ring-[#429DAB] focus:border-[#429DAB]"
              >
                <option value="">Select</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            {selectedBranch && (
              <div>
                <label className="block text-sm font-medium text-[#000000] mb-2">
                  Doctor <span className="text-red-500">*</span>
                </label>
                <select
                  name="doctorId"
                  value={form.doctorId}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 bg-white border border-[#D9D9D9] rounded-lg shadow-sm text-[#000000] focus:ring-2 focus:ring-[#429DAB] focus:border-[#429DAB]"
                >
                  <option value="">Select</option>
                  {doctors
                    .filter(doc => doc.availability?.some(avail => avail.branch === selectedBranch))
                    .map(doc => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name} ({doc.specialization})
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-[#000000] mb-2">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
              {form.picture && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected: {form.picture.name}
                </p>
              )}
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
                {isSubmitting ? "Registering..." : "Register Account"}
              </button>
            </div>

            <div className="text-center text-sm space-y-3">
              <p className="text-[#89A0A4]">
                Already registered?{" "}
                <a href="/patients/login" className="font-medium text-[#429DAB] hover:text-[#3a8c99] hover:underline">
                  Sign In
                </a>
              </p>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-[#89A0A4]">🔒Your data is securely encrypted</p>
        </div>
      </div>
    </div>
  );
}
