import React from "react";
import Lottie from "lottie-react";
import comingSoonAnimation from "../assets/comingSoon.json";
import { Link } from "react-router-dom";

function ComingSoon() {
  return (
    <>
<nav
          className="fixed top-0 left-0 w-full z-50 p-4 flex flex-col md:flex-row items-center shadow-2xl bg-[#E8E669]"
          style={{ height: "100px" }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-2 md:mb-0 md:mr-4">
            <img
              src="/images/logo.png"
              alt="Sanath Homeo Clinic Logo"
              className="h-12 md:h-20 max-w-full"
            />
          </div>

          {/* Title */}
          <div className="flex w-full items-center justify-center gap-3">
            <span className="text-2xl md:text-4xl font-bold text-black text-center" style={{ fontFamily: 'Merriweather' }}>
              SANATH HOMEO CLINIC
            </span>

            {/* Navbar Buttons */}
            <div className="hidden md:flex gap-4 ml-auto">
            {[
                { label: "About", path: "/about" },
                { label: "Contact us", path: "/contact-us" },
                { label: "Login", path: "/coming-soon" },
                { label: "Sign up", path: "/coming-soon" },
              ].map(({ label, path }) => (
                <Link
                  key={label}
                  to={path}
                  className="text-black hover:before:bg-[#0082BA] relative h-[40px] w-24 overflow-hidden border border-[#2CE663] bg-white px-2 text-center text-sm shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#2CE663] before:transition-all before:duration-500 hover:text-white hover:shadow-[#CB5BCC] hover:before:left-0 hover:before:w-full flex items-center justify-center"
                >
                  <span className="relative z-10">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center px-4">
      <div className="w-[300px] sm:w-[400px] mb-8">
        <Lottie animationData={comingSoonAnimation} loop={true} />
      </div>
      <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-2">Coming Soon</h1>
      <p className="text-gray-600">Please wait for more updates</p>
    </div>
    </>
  );
}

export default ComingSoon;
