import React from "react";
import { FaLinkedin, FaEnvelope, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white text-gray-700 px-6 py-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left section - Staff Login */}
          <div className="md:w-1/3 flex justify-start">
            <Link 
              to="/secure-login" 
              className="inline-flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              aria-label="Staff secure login"
            >
              <div className="mr-2 text-base" />
              Staff Login
            </Link>
          </div>
          
          {/* Middle section - Copyright */}
          <div className="md:w-1/3 flex flex-col items-center">
            <p className="font-medium text-sm">
              © {new Date().getFullYear()} Sanath Homeo Clinic.
            </p>
            <div className="mt-2 flex gap-4 md:hidden">
              <a
                href="/privacy"
                className="text-xs text-gray-500 hover:text-blue-600"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-xs text-gray-500 hover:text-blue-600"
              >
                Terms of Service
              </a>
            </div>
          </div>
          
          {/* Right section - Creator info */}
          <div className="md:w-1/3 flex flex-col items-end">
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-xs text-gray-500">
                Designed & Developed by Kirana
              </span>
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/in/kirana-ts-0b2190316/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  aria-label="Visit Kirana's LinkedIn profile"
                >
                  <FaLinkedin className="text-base" />
                </a>
                <a
                  href="mailto:kiranats2006@gmail.com"
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  aria-label="Email Kirana"
                >
                  <FaEnvelope className="text-base" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop legal links */}
        <div className="mt-4 pt-4 border-t border-gray-100 hidden md:flex justify-center gap-6">
          <a
            href="/privacy"
            className="text-xs text-gray-500 hover:text-blue-600"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-xs text-gray-500 hover:text-blue-600"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;