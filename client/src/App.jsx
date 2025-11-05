import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css'
import Homepage from './Pages/HomePage'
import TreatmentsPage from './Pages/TreatmentsPage'
import BranchesPage from './Pages/BranchesPage'
import DoctorsPage from './Pages/DoctorsPage'
import PatientLogin from './Pages/PatientLogin'
import PatientSignup from './Pages/PatientSignup'
import PatientDashboard from './Pages/PatientDashboard'
import ComingSoon from './components/ComingSoon'
import SecureAccess from './Pages/SecureAccess';
import DoctorLogin from './Pages/DoctorLogin';
import DoctorDashboard from './Pages/DoctorDashboard'
import ReceptionistLogin from './Pages/ReceptionistLogin'
import ReceptionistDashboard from './Pages/ReceptionistDashboard'
import RoleProtectedRoute from './components/RoleProtectedRoute';
import DoctorSchedule from './Pages/DoctorSchedule'
import ManageExceptions from './components/doctor/ManageExceptions'
import AvailableSlots from './components/doctor/AvailableSlots'
import AvailableSlotsPatient from './components/patients/AvailableSlotsPatient'
import MyAppointments from './components/patients/MyAppointments'




function App() {


  return (
    <> 
    <Router>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/treatments" element={<TreatmentsPage/>} />
        <Route path="/branches" element={<BranchesPage/>} />
        <Route path="/doctors" element={<DoctorsPage/>} />
        <Route path='coming-soon' element={<ComingSoon/>}></Route>
        <Route path="/patients/login" element={<PatientLogin/>} />
        <Route path="/patients/signup" element={<PatientSignup/>} />
        <Route
          path="/patient/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route path="/secure-login" element={<SecureAccess />} />
        <Route path="/doctors/login" element={<DoctorLogin />} />
        <Route path="/receptionists/login" element={<ReceptionistLogin/>} />
        <Route
          path="/dashboard-doctor"
          element={
            <RoleProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </RoleProtectedRoute>
          }
        >
          <Route path="schedule" element={<DoctorSchedule />} />
          <Route path="exceptions" element={<ManageExceptions />} />
          <Route path="available" element={<AvailableSlots />} />
        </Route>
        <Route
          path="/dashboard-receptionist"
          element={
            <RoleProtectedRoute allowedRoles={['receptionist']}>
              <ReceptionistDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/patient/dashboard/available-slots"
          element={
            <RoleProtectedRoute allowedRoles={["patient"]}>
              <AvailableSlotsPatient />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/patient/dashboard/my-appointments"
          element={
            <RoleProtectedRoute allowedRoles={["patient"]}>
              <MyAppointments />
            </RoleProtectedRoute>
          }
        />


      </Routes>
    </Router>
    </>
  )
}

export default App
