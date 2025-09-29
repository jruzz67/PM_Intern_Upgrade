import React from "react";
import { useNavigate } from "react-router-dom";

import indiaFlag from "../assets/indian_flag.svg";
import ministryLogo from "../assets/MCA.svg"; 
import pmInternshipLogo from "../assets/pm_internship_logo_eng.svg"; 
import viksitBharatLogo from "../assets/viksit-bharath.png"; 

import { FaUserPlus, FaSignInAlt } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="w-full fixed top-0 left-0 z-50 shadow-lg">
      <div className="bg-black text-white flex justify-between items-center px-6 py-2 text-sm">
        <div className="flex items-center gap-3">
          <img
            src={indiaFlag}
            alt="India Flag"
            className="h-5 w-auto" 
          />
          <span className="font-medium">
            भारत सरकार / Government of India
          </span>
        </div>
        <div className="flex items-center gap-4">
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

      <div className="bg-white flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-4">
          <img
            src={ministryLogo}
            alt="Ministry of Corporate Affairs Logo"
            className="h-16 w-auto"
          />
          <img
            src={pmInternshipLogo}
            alt="PM Internship Logo"
            className="h-12 w-auto"
          />
        </div>

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
            className="bg-orange-500 text-white font-semibold flex items-center gap-2 px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            <FaSignInAlt />
            Login
          </button>
          <img
            src={viksitBharatLogo}
            alt="Viksit Bharat Logo"
            className="h-14 w-auto"
          />
        </div>
      </div>
    </header>
  );
}

export default Navbar;