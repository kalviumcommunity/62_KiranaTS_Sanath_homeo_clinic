import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to #branches if on homepage
  const handleBranchesClick = () => {
    if (window.innerWidth >= 1024) {
      if (location.pathname === "/") {
        const el = document.getElementById("branches");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate("/#branches");
      }
    } else {
      navigate("/branches");
      setIsMenuOpen(false);
    }
  };

  const handleDoctorsClick = () => {
    if (window.innerWidth >= 1024) {
      if (location.pathname === "/") {
        const el = document.getElementById("doctors");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate("/#doctors");
      }
    } else {
      navigate("/doctors");
      setIsMenuOpen(false);
    }
  };

  //book appointment button
  const handleBookAppointment = () => {
    const isLoggedIn = document.cookie.includes("token");
    if (!isLoggedIn) {
      navigate("/patients/login");
    } else {
      navigate("/appointments");
    }
  };

  const handleRatingsClick = () => {
    navigate("/coming-soon");
  };

  const navButtons = [
    { label: "Branches", onClick: handleBranchesClick },
    { label: "Our Doctors", onClick: handleDoctorsClick },
    { label: "Ratings", onClick: handleRatingsClick }
  ];

  return (
    <nav className="w-full h-20 bg-gradient-to-r shadow-md relative z-50 border-b border-amber-200">
      <div className="container mx-auto h-full px-4 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Left side - Logo and Clinic Name */}
        <div className="flex items-center space-x-2">
          <img 
            className="w-32 h-16 md:w-40 md:h-20 transition-transform hover:scale-105" 
            src="images/logo-removebg-preview.png" 
            alt="Sanath Homeo Clinic Logo"
            onClick={() => navigate("/")}
          />
          <div className="hidden md:block border-amber-400 h-12 mx-2"></div>
          <span 
            className="hidden md:block text-2xl text-gray-800 tracking-tight hover:text-gray-700 transition-colors cursor-pointer"
            onClick={() => navigate("/")}
             style={{ fontFamily: 'Merriweather' }}
          >
            SANATH HOMEO CLINIC
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <div className="flex items-center space-x-8">
            {navButtons.map((button, index) => (
              <span
                key={index}
                onClick={button.onClick}
                className="cursor-pointer relative text-gray-800 text-sm font-medium transition-all duration-300
                  bg-gradient-to-r from-emerald-600 to-emerald-600 bg-no-repeat bg-[length:0%_2px] bg-bottom hover:bg-[length:100%_2px]"
              >
                {button.label}
              </span>
            ))}
          </div>
          <button 
            className="h-10 px-6 text-white text-sm rounded-none font-semibold bg-gradient-to-r from-rose-600 to-rose-700 shadow-md hover:from-rose-700 hover:to-rose-800 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
            onClick={handleBookAppointment}
          >
            Book Appointment
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 ml-4 rounded-md hover:bg-amber-300/30 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 " fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-gradient-to-b shadow-lg bg-white transition-all duration-300 overflow-hidden z-50 ${isMenuOpen ? 'max-h-96 py-4 border-t border-amber-200' : 'max-h-0 py-0'}`}>
        <div className="container mx-auto px-4 md:px-6 flex flex-col space-y-3">
          {navButtons.map((button, index) => (
            <button 
              key={index}
              onClick={button.onClick}
              className="w-full relative h-10 overflow-hidden border border-emerald-600 bg-white/90 px-4 text-center text-sm text-gray-700 shadow-sm transition-all duration-300 
                before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-emerald-600 before:transition-all before:duration-300 
                hover:text-white hover:before:w-full group rounded-md"
            >
              <span className="relative z-10 group-hover:text-white transition-colors font-medium">
                {button.label}
              </span>
            </button>
          ))}
          <button 
            className="w-full h-10 px-6 text-white text-sm font-semibold bg-gradient-to-r from-rose-600 to-rose-700 shadow-md hover:from-rose-700 hover:to-rose-800 transition-all duration-300 rounded-md mt-2"
            onClick={handleBookAppointment}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </nav>
  );
}