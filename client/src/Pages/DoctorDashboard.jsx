// pages/DoctorDashboard.jsx
import Navbar from "../components/doctor/Navbar";
import Sidebar from "../components/doctor/Sidebar";
import { Outlet } from "react-router-dom";

export default function DoctorDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <Navbar/>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
