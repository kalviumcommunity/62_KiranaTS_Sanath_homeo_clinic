import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css'
import Homepage from './Pages/HomePage'
import TreatmentsPage from './Pages/TreatmentsPage'
import BranchesPage from './Pages/BranchesPage'
import DoctorsPage from './Pages/DoctorsPage'


function App() {


  return (
    <> 
    <Router>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/treatments" element={<TreatmentsPage/>} />
        <Route path="/branches" element={<BranchesPage/>} />
        <Route path="/doctors" element={<DoctorsPage/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
