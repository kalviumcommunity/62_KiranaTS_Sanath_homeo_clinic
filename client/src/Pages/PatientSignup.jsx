import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GoogleLoginButton from "../components/GoogleLoginButton";

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
  const [currentStep, setCurrentStep] = useState(0);
  const [activeAuthMethod, setActiveAuthMethod] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [familyCode, setFamilyCode] = useState(null);


  const navigate = useNavigate();

  useEffect(() => {
  axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors`)
    .then((res) => {
      console.log("Doctor data:", res.data);
      setDoctors(res.data.doctors);

      const uniqueBranches = [...new Set(
        res.data.doctors.flatMap(doc => doc.branches || [])
      )];

      console.log("Unique branches:", uniqueBranches);
      setBranches(uniqueBranches);
    })
    .catch((err) => console.error("Doctor fetch error:", err));
}, []);


  const steps = [
    { title: "Personal", fields: ["name", "dob", "gender"] },
    { title: "Contact", fields: ["email", "phone"] },
    { title: "Medical", fields: ["branch", "doctorId"] },
    { title: "Complete", fields: [] }
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, picture: e.target.files[0] }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    // eslint-disable-next-line no-unused-vars
    const currentFields = steps[currentStep].fields;
    
    if (currentStep === 0) {
      return form.name && form.dob && form.gender;
    } else if (currentStep === 1) {
      return form.email && form.phone;
    } else if (currentStep === 2) {
      return selectedBranch && form.doctorId;
    }
    return true;
  };

  const isFormComplete = () => {
    return (
      form.name?.trim() &&
      form.phone?.trim() &&
      form.dob &&
      form.gender &&
      form.email?.trim() &&
      form.doctorId &&
      selectedBranch
    );
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep !== steps.length - 1 || !isFormComplete()) {
      setMessage("Please complete all steps before submitting");
      return;
    }
    
    setIsSubmitting(true);
    setActiveAuthMethod('manual');
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("phone", form.phone.trim());
      formData.append("dob", form.dob ? form.dob.toISOString().split("T")[0] : "");
      formData.append("gender", form.gender);
      formData.append("email", form.email.trim().toLowerCase());
      formData.append("doctorId", form.doctorId);
      
      if (form.picture) {
        formData.append("picture", form.picture);
      }

      console.log("Submitting manual signup:", Object.fromEntries(formData));

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/patients/signup`, 
        formData, 
        {
          withCredentials: true,
          headers: { 
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Manual signup response:", response.data);

      if (response.data.message === "Patient registered successfully") {
        setMessage("Registration successful! Redirecting...");
        setTimeout(() => navigate("/patient/dashboard"), 2000);
      } else {
        setMessage(response.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Manual registration error:", err);
      setMessage(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      setActiveAuthMethod(null);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setIsSubmitting(true);
    setActiveAuthMethod('google');
    setMessage("Google registration successful! Redirecting...");

      if (response?.patient?.family_code) {
        setFamilyCode(response.patient.family_code);
      }

    
    try {
      // The actual API call happens in GoogleLoginButton
      console.log('Google registration successful:', response);
      
      setTimeout(() => navigate("/patient/dashboard"), 2000);
    } catch (err) {
      console.error('Google success handler error:', err);
      setMessage(err.response?.data?.message || "Google registration completed with issues");
      setIsSubmitting(false);
      setActiveAuthMethod(null);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google auth error:', error);
    setMessage("Google authentication failed. Please try again.");
    setActiveAuthMethod(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl text-white">🏥</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm">Join us in a few simple steps</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    index === currentStep
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : index < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}>
                    {index < currentStep ? "✓" : index + 1}
                  </div>
                  <span className={`text-xs mt-1 hidden sm:block ${
                    index === currentStep ? "text-blue-600 font-medium" : "text-slate-500"
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                    index < currentStep ? "bg-green-500" : "bg-slate-200"
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {message && (
            <div className={`mb-6 p-4 rounded-xl border ${
              message.includes("successful") 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}>
              <div className="flex items-center gap-3">
                {message.includes("successful") ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <p className="font-medium text-sm">{message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleManualSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 0 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">Personal Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date of Birth *
                    </label>
                    <DatePicker 
                      selected={form.dob} 
                      onChange={(date) => setForm({ ...form, dob: date })} 
                      maxDate={new Date()}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="DD/MM/YYYY"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Gender *
                    </label>
                    <select 
                      name="gender" 
                      value={form.gender} 
                      onChange={handleChange}
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
                    Profile Picture
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-300 transition-colors cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="hidden" 
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-slate-600">
                        {form.picture ? form.picture.name : "Click to upload photo"}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">Contact Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange}
                    placeholder="1234567890"
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all outline-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Medical Preferences */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">Medical Preferences</h2>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred Branch *
                  </label>
                  <select 
                    value={selectedBranch} 
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all outline-none"
                    required
                  >
                    <option value="">Select branch</option>
                    {branches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
                  </select>
                </div>

                {selectedBranch && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preferred Doctor *
                    </label>
                    <select 
                      name="doctorId" 
                      value={form.doctorId} 
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all outline-none"
                      required
                    >
                      <option value="">Select doctor</option>
                      {doctors
                      .filter(doc => doc.branches?.includes(selectedBranch))
                      .map(doc => (
                        <option key={doc._id} value={doc._id}>{doc.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Complete */}
            {currentStep === 3 && (
              <div className="text-center animate-fadeIn">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-800 mb-2">Ready to Complete!</h2>
                <p className="text-slate-600 mb-6">
                  Choose your preferred signup method
                </p>
                
                {/* Account Summary */}
                <div className="bg-slate-50 rounded-xl p-4 text-left mb-6">
                  <h3 className="font-medium text-slate-700 mb-3">Your Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Name:</span>
                      <span className="font-medium">{form.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-medium">{form.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-medium">{form.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Gender:</span>
                      <span className="font-medium">{form.gender}</span>
                    </div>
                  </div>
                </div>

                {/* Signup Options */}
                <div className="space-y-4">
                  {/* Google Signup */}
                  <div className={`transition-opacity ${!isFormComplete() ? 'opacity-50' : ''}`}>
                    <GoogleLoginButton 
                      formData={{
                        name: form.name,
                        email: form.email,
                        phone: form.phone,
                        dob: form.dob,
                        gender: form.gender,
                        doctorId: form.doctorId
                      }}
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      disabled={!isFormComplete() || isSubmitting}
                    />
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-4 text-slate-500 text-sm">OR</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  {/* Manual Signup */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormComplete() || activeAuthMethod === 'google'}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    {isSubmitting && activeAuthMethod === 'manual' ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account Manually"
                    )}
                  </button>
                </div>

                {!isFormComplete() && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mt-4">
                    <p className="text-amber-700 text-sm">Complete all steps to enable signup options</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons for steps 0-2 */}
            {currentStep < 3 && (
              <div className={`flex ${currentStep === 0 ? 'justify-end' : 'justify-between'} mt-6`}>
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                  >
                    Back
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-600 text-sm">
            Already have an account?{" "}
            <a href="/patients/login" className="font-semibold text-blue-500 hover:text-blue-600 transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}