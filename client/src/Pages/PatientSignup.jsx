import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PatientSignup() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
    email: "",
    doctorId: "",
  });
  const [message, setMessage] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/doctors")
      .then(response => {
        setDoctors(response.data.doctors);
        const uniqueBranches = [...new Set(
          response.data.doctors.flatMap(doc =>
            doc.availability?.map(avail => avail.branch) || []
          )
        )];
        setBranches(uniqueBranches);
      })
      .catch(error => console.error("Failed to fetch doctors:", error));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(
        "http://localhost:5000/api/patients/signup",
        form,
        { withCredentials: true }
      );
      setMessage("Registration successful!");
      setTimeout(() => navigate("/patient/dashboard"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <h1>Patient Registration</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Gender:</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Branch:</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            required
          >
            <option value="">Select</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
        {selectedBranch && (
          <div>
            <label>Doctor:</label>
            <select
              name="doctorId"
              value={form.doctorId}
              onChange={handleChange}
              required
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}