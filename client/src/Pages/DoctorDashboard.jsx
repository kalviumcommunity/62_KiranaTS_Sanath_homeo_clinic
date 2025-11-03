import Navbar from "../components/doctor/Navbar";
import Sidebar from "../components/doctor/Sidebar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

export default function DoctorDashboard() {
  const [doctorId, setDoctorId] = useState("");

  useEffect(() => {
    const storedDoctor = JSON.parse(localStorage.getItem("doctor"));
    if (storedDoctor && storedDoctor._id) {
      setDoctorId(storedDoctor._id);
    }
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6">
          <Outlet context={{ doctorId }} />
        </div>
      </div>
    </div>
  );
}