import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css'
import Homepage from './Pages/HomePage'
import TreatmentsPage from './Pages/TreatmentsPage'
import BranchesPage from './Pages/BranchesPage'
import DoctorsPage from './Pages/DoctorsPage'
import PatientLogin from './Pages/PatientLogin'
import PatientSignup from './Pages/PatientSignup'
import ProtectedRoute from './components/ProtectedRoutes'
import PatientDashboard from './Pages/PatientDashboard'


function App() {


  return (
    <> 
    <Router>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/treatments" element={<TreatmentsPage/>} />
        <Route path="/branches" element={<BranchesPage/>} />
        <Route path="/doctors" element={<DoctorsPage/>} />
        <Route path="/patients/login" element={<PatientLogin/>} />
        <Route path="/patients/signup" element={<PatientSignup/>} />
        <Route 
          path="/patient/dashboard" 
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
    </>
  )
}

export default App
