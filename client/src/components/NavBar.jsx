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

  const navButtons = [
    { label: "Branches", onClick: handleBranchesClick },
    { label: "Our Doctors", onClick: handleDoctorsClick },
    { label: "Ratings" }
  ];

  return (
    <nav className="w-full h-20 md:h-24 bg-[#FFF0BF] shadow-[0px_2px_8px_rgba(0,0,0,0.25)] relative z-50">
      <div className="container mx-auto h-full px-4 md:px-8 flex items-center justify-between">
        {/* Left side - Logo and Clinic Name */}
        <div className="flex items-center">
          <img 
            className="w-32 h-16 md:w-40 md:h-20" 
            src="images/logo.png" 
            alt="Sanath Homeo Clinic Logo" 
          />
          <span className="ml-2 md:ml-4 text-xl md:text-3xl text-gray-800 tracking-tight" style={{ fontFamily: 'Merriweather' }}>
            SANATH HOMEO CLINIC
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-4">
            {navButtons.map((button, index) => (
              <button 
                key={index}
                onClick={button.onClick}
                className="relative h-10 w-28 overflow-hidden border border-emerald-600 bg-white px-4 text-center text-sm text-gray-700 shadow-sm transition-all duration-300 
                  before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-emerald-600 before:transition-all before:duration-300 
                  hover:text-white hover:before:w-full group"
              >
                <span className="relative z-10 group-hover:text-white transition-colors">
                  {button.label}
                </span>
              </button>
            ))}
          </div>
          <button className="h-10 px-6 text-white text-sm font-medium bg-gradient-to-r from-rose-600 to-rose-700 shadow-md hover:from-rose-700 hover:to-rose-800 transition-all duration-300 rounded-sm">
            Book appointment
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 ml-auto"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-[#FFF0BF] shadow-md transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 py-4' : 'max-h-0 py-0'}`}>
        <div className="container mx-auto px-4 md:px-8">
          {navButtons.map((button, index) => (
            <button 
              key={index}
              onClick={button.onClick}
              className="w-full mb-3 relative h-10 overflow-hidden border border-emerald-600 bg-white px-4 text-center text-sm text-gray-700 shadow-sm transition-all duration-300 
                before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-emerald-600 before:transition-all before:duration-300 
                hover:text-white hover:before:w-full group"
            >
              <span className="relative z-10 group-hover:text-white transition-colors">
                {button.label}
              </span>
            </button>
          ))}
          <button className="w-full h-10 px-6 text-white text-sm font-medium bg-gradient-to-r from-rose-600 to-rose-700 shadow-md hover:from-rose-700 hover:to-rose-800 transition-all duration-300 rounded-sm">
            Book appointment
          </button>
        </div>
      </div>
    </nav>
  );
}
