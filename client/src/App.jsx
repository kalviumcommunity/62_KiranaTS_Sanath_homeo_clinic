import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Homepage from './Pages/HomePage'
import './App.css'
import KammanahalliPage from './Pages/KammanahalliPage'
import HoramavuPage from './Pages/HoramavuPage'
import HennurPage from './Pages/HennurPage'
import ComingSoon from './components/ComingSoon'
import AboutUs from './Pages/AboutUs'
import ContactUs from './Pages/ContactUs'
import Footer from './components/Footer'

function App() {


  return (
    <> 
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/kammanahalli" element={<KammanahalliPage />} />
        <Route path="/horamavu" element={<HoramavuPage/>}/>
        <Route path="/hennur" element={<HennurPage/>}/>
        <Route path="/coming-soon" element={<ComingSoon/>} />
        <Route path="/about" element={<AboutUs/>} />
        <Route path="/contact-us" element={<ContactUs/>} />

      </Routes>
    <Footer/>
    </Router>
    </>
  )
}

export default App
