import React from "react";
import { useNavigate } from "react-router-dom";

import { FaUserPlus, FaSignInAlt } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="w-full fixed top-0 left-0 z-50 shadow-lg">
      {/* Top bar with scrolling text */}
      <div className="bg-black text-white flex justify-between items-center px-6 py-2 text-sm">
        <div className="flex-1 overflow-hidden">
          {/* The text inside this paragraph has been extended */}
          <p className="animate-marquee whitespace-nowrap">
            Note: This portal is a demonstration for the PM Internship Scheme. Registrations are now open.   •   Our intelligent matching system now uses an AI/ML engine to connect the right talent with the right opportunity, ensuring a perfect fit for both students and companies.   •   Companies are invited to register and post new internship opportunities.
          </p>
        </div>
        <div className="flex items-center gap-4 pl-4">
          <select className="bg-black text-white border border-gray-600 px-2 py-1 rounded-md text-xs">
            <option>English</option>
            <option>हिन्दी</option>
          </select>
          <button className="hover:text-orange-400 text-xs">
            Screen Reader
          </button>
          <div className="flex items-center gap-2 text-xs">
            <span>A-</span>
            <span>A</span>
            <span>A+</span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="bg-white flex justify-between items-center px-6 py-3">
        {/* Left side: Title */}
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/')} // Navigate to home on click
        >
          <span className="text-2xl font-bold text-gray-800 tracking-wide">
            PM <span className="text-orange-500">INTERNSHIP</span>
          </span>
        </div>

        {/* Right side: Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/student")}
            className="bg-orange-500 text-white font-semibold flex items-center gap-2 px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            <FaUserPlus />
            Youth Registration
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-gray-800 text-white font-semibold flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-900 transition-colors"
          >
            <FaSignInAlt />
            Login
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;