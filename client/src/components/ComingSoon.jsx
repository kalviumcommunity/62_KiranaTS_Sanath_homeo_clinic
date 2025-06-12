import React from "react";
import Lottie from "lottie-react";
import comingSoonAnimation from "../assets/comingSoon.json";
import { Link } from "react-router-dom";
import Navbar from "./NavBar";

function ComingSoon() {
  return (
    <>
    <Navbar/>
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
