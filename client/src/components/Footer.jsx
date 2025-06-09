// src/components/Footer.jsx
import React from "react";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative w-full bg-[#FDFBEA] text-gray-800 text-sm shadow-inner px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
      <div className="sm:w-1/3 text-center sm:text-left">
        <Link 
          to="/" 
          className="text-gray-800 hover:text-[#0082BA] font-medium transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Homepage
        </Link>
      </div>
      
      <div className="sm:w-1/3 text-center font-medium">
        © {new Date().getFullYear()} Sanath Homeo Clinic
      </div>
      
      <div className="sm:w-1/3 flex items-center justify-center sm:justify-end gap-4">
        <span className="hidden sm:inline">Created by Kirana</span>
        <div className="flex gap-3">
          <a
            href="https://www.linkedin.com/in/kirana-ts-0b2190316/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-[#0082BA] transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="text-lg" />
          </a>
          <a
            href="mailto:kiranats2006@gmail.com"
            className="text-gray-700 hover:text-[#0082BA] transition-colors duration-200"
            aria-label="Email"
          >
            <FaEnvelope className="text-lg" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;