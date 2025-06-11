import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PatientLogin() {
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    if (!phone || !dob) {
      setMessage("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/patients/login",
        { phone, dob },
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
    <div>
      <h1>Patient Login</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Loading..." : "Login"}
        </button>
      </form>
      <p>New patient? <a href="/patients/signup">Create account</a></p>
      <p><a href="/forgot-password">Need help signing in?</a></p>
    </div>
  );
}