import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import {
  FaUserGraduate,
  FaBuilding,
  FaHandshake,
  FaChalkboardTeacher,
  FaBriefcase,
  FaLightbulb,
  FaChartLine,
  FaAward,
  FaSearch,
  FaClipboardList,
  FaCheckCircle,
  FaComments,
} from "react-icons/fa";
import { MdMonetizationOn } from "react-icons/md"; 
import Sectors from "./components/Sectors";
import DashboardStats from "./components/Dashboard";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />

      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-100 min-h-[calc(100vh-theme(spacing.24))] pt-40 pb-20 flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-300 rounded-full opacity-20 blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-6 text-center z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 animate-fade-in-down">
            Ignite Your Career with <span className="text-orange-600">PM Internship</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-10 animate-fade-in-up">
            Meaningful Allocation for students, fostering skill development, and connecting talent with leading organizations across India.
          </p>
          <div className="flex flex-wrap justify-center gap-6 animate-fade-in-up delay-200">
            <button
              onClick={() => navigate("/explore-internship")}
              className="bg-orange-600 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:bg-orange-700 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <FaUserGraduate /> Explore Internships
            </button>
            <button
              onClick={() => navigate("/company")}
              className="bg-white text-orange-600 text-lg px-8 py-4 rounded-full shadow-lg border-2 border-orange-600 hover:bg-orange-50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <FaBuilding /> Partner with Us
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">About the PM Internship Scheme</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12">
            The PM Internship Scheme is a flagship initiative designed to bridge the gap between academia and industry. We provide a robust platform for students to gain invaluable real-world experience and contribute to India's skilled workforce.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-orange-50 rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300 text-center">
              <FaChalkboardTeacher className="text-orange-600 text-5xl mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Skill Development</h3>
              <p className="text-gray-700">Hands-on experience in diverse sectors to enhance practical skills and theoretical knowledge.</p>
            </div>
            <div className="bg-orange-50 rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300 text-center">
              <FaBriefcase className="text-orange-600 text-5xl mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Career Launchpad</h3>
              <p className="text-gray-700">Connecting bright minds with top companies, opening doors to future career opportunities.</p>
            </div>
            <div className="bg-orange-50 rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300 text-center">
              <FaLightbulb className="text-orange-600 text-5xl mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Innovation & Growth</h3>
              <p className="text-gray-700">Foster innovation by bringing fresh perspectives to industry challenges and driving economic growth.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
            Our seamless process ensures students and companies connect efficiently for successful internships.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <FaSearch className="text-orange-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Discover</h3>
              <p className="text-gray-700 text-center">Browse diverse internship opportunities from leading companies.</p>
            </div>

            <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <FaClipboardList className="text-orange-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Apply</h3>
              <p className="text-gray-700 text-center">Submit your application effortlessly through our portal.</p>
            </div>

            <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <FaHandshake className="text-orange-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Connect</h3>
              <p className="text-gray-700 text-center">Interview with companies and get allocation by AI.</p>
            </div>

            <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <FaCheckCircle className="text-orange-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">4. Intern</h3>
              <p className="text-gray-700 text-center">Begin your transformative internship journey.</p>
            </div>
          </div>
        </div>
      </section>

      <DashboardStats />

      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Core Benefits of the <span className="text-orange-600">PM Internship Scheme</span></h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
            Experience unparalleled advantages designed for your professional growth and financial support.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300 text-center">
              <FaChartLine className="text-orange-600 text-5xl mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Real-world Experience</h3>
              <p className="text-gray-700">Gain practical skills and industry insights with India's top companies.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300 text-center">
              <MdMonetizationOn className="text-orange-600 text-5xl mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Financial Assistance</h3>
              <p className="text-gray-700">Receive monthly stipend from the Government and contributing industry partners.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300 text-center">
              <FaAward className="text-orange-600 text-5xl mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Certification & Recognition</h3>
              <p className="text-gray-700">Boost your resume with official certificates upon successful completion.</p>
            </div>
          </div>
        </div>
      </section>

      <Sectors />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Interns Say</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
            Hear directly from students who have transformed their careers with the PM Internship Scheme.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-orange-50 rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300 text-left relative">
              <FaComments className="absolute top-4 right-4 text-orange-200 text-6xl opacity-50 rotate-3" />
              <p className="text-gray-700 text-lg italic mb-4 z-10 relative">
                "The PM Internship Scheme gave me the invaluable opportunity to work on cutting-edge projects. The exposure was incredible, and it truly shaped my career path."
              </p>
              <p className="font-semibold text-gray-900">- Anjali Sharma, IIT Delhi Alumna</p>
              <p className="text-sm text-gray-600">Interned at TechSolutions Pvt. Ltd.</p>
            </div>
            <div className="bg-orange-50 rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300 text-left relative">
              <FaComments className="absolute top-4 right-4 text-orange-200 text-6xl opacity-50 rotate-3" />
              <p className="text-gray-700 text-lg italic mb-4 z-10 relative">
                "Finding a structured internship used to be daunting. This scheme made it so easy, and the stipend was a huge help. Highly recommended for all students!"
              </p>
              <p className="font-semibold text-gray-900">- Rahul Kumar, Delhi University Student</p>
              <p className="text-sm text-gray-600">Interned at FinCorp India</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-orange-600 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Internship Journey?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            Join thousands of students who are building their future with the PM Internship Scheme.
            Your next big opportunity awaits!
          </p>
          <button
            onClick={() => navigate("/student")}
            className="bg-white text-orange-600 text-xl font-bold px-10 py-5 rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
          >
            Register Now
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Landing;