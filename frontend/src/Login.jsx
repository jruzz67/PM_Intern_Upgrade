import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // Backend call is no longer needed
import { motion, AnimatePresence } from 'framer-motion';
import pmInternshipLogo from "./assets/pm_internship_logo_eng.svg";
// import PopupMessage from './components/PopupMessage'; // Popup is no longer used

// Define the content for your slides
const slidesContent = [
  {
    icon: "✨",
    title: "Bridge the Gap: Discover Your Next Opportunity",
    description: "Project Nexus connects students with leading companies for transformative internship experiences. Find your path, build your career, and make a real-world impact.",
  },
  {
    icon: "🚀",
    title: "Launch Your Career: Practical Experience Awaits",
    description: "Gain invaluable hands-on experience, develop new skills, and explore different industries. Our internships are designed to kickstart your professional journey.",
  },
  {
    icon: "🤝",
    title: "Network and Grow: Build Lasting Connections",
    description: "Meet industry leaders, collaborate with professionals, and expand your network. Interning through Nexus opens doors to future employment and mentorship.",
  },
];

function Login({ setUserType, setUserId }) {
  const [name, setName] = useState('');
  const [userType, setLocalUserType] = useState('');
  // const [message, setMessage] = useState(''); // No longer needed for frontend-only version
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // --- NEW: Frontend-only navigation ---
    // This simply navigates to the selected dashboard without calling a backend.
    navigate(`/${userType}/dashboard`);

    // --- OLD: Backend logic is commented out as requested ---
    /*
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const endpoint = userType === 'student' ? '/student/login' : userType === 'company' ? '/company/login' : '/admin/login';
        const res = await axios.post(`http://127.0.0.1:5000/api${endpoint}`, { name });
        
        // Show success popup
        setNotification({ message: 'Login Successful!', type: 'success' });
        
        // Navigate after a short delay to let the animation play
        setTimeout(() => {
          setUserType(userType);
          setUserId(res.data.id);
          navigate(`/${userType}`);
        }, 1500);

      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Login failed';
        // Show error popup
        setNotification({ message: errorMessage, type: 'error' });
      }
    };
    */
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentSlideIndex((prevIndex) => (prevIndex + newDirection + slidesContent.length) % slidesContent.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlideIndex ? 1 : -1);
    setCurrentSlideIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => paginate(1), 5000);
    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 1000 : -1000, opacity: 0 }),
  };

  const currentSlide = slidesContent[currentSlideIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-screen bg-gray-100 p-4"
    >
      <div className="flex bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full relative">
        
        {/* Left Section: Internship Scheme Info Slider */}
        <div className="hidden md:flex flex-col items-start justify-between w-1/2 p-8 bg-gradient-to-br from-gray-900 to-gray-700 text-white relative overflow-hidden">
          
          <div className="flex flex-col items-start justify-center flex-grow mt-16 relative w-full">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentSlideIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 150, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute w-full h-full flex flex-col justify-center items-start z-0"
              >
                <div className="mb-6 text-6xl text-orange-400">{currentSlide.icon}</div>
                <h2 className="text-4xl font-bold mb-4 leading-tight">{currentSlide.title}</h2>
                <p className="text-gray-300 text-lg leading-relaxed">{currentSlide.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex space-x-2 pb-8 z-10">
            {slidesContent.map((_, index) => (
              <span
                key={index}
                className={`block w-3 h-3 rounded-full cursor-pointer transition-colors ${
                  currentSlideIndex === index ? 'bg-white opacity-90' : 'bg-white opacity-30 hover:opacity-50'
                }`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
        </div>

        {/* Right Section: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
          
          <div className="absolute top-6 right-6 z-10">
            <span className="text-1xl font-bold text-gray-800 tracking-wide">
              PM <span className="text-orange-500">INTERNSHIP</span>
            </span>
          </div>

          <div className="flex-grow flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome!</h1>
            <p className="text-gray-600 text-sm mb-6">
              Please enter your details to sign in to your account.
            </p>

            <div className="space-y-3 mb-6">
              <button className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
                Continue with Google
              </button>
              <button className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition">
                <img src="https://www.apple.com/favicon.ico" alt="Apple" className="w-5 h-5 mr-2" />
                Continue with Apple
              </button>
            </div>

            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-x-0 h-px bg-gray-200"></div>
              <span className="relative bg-white px-4 text-xs text-gray-500 uppercase">Or sign in with</span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">Login As</label>
                <select
                    id="userType"
                    value={userType}
                    onChange={(e) => setLocalUserType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white pr-8 text-sm"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                    required  
                >
                    {/* 👇 Add this disabled default option */}
                    <option value="" disabled>Select a user type</option>

                    <option value="student">Student</option>
                    <option value="company">Company</option>
                    <option value="admin">Admin</option>
                </select>
              </div>

              <button type="submit" className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm mt-6">
                Login
              </button>
            </form>
            
            <div className="text-center mt-6 space-y-2">
              <a href="#" className="block text-sm text-blue-600 hover:underline">
                Forgot your credentials?
              </a>
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/student')} // Or a dedicated sign-up route
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
          
          <div className="flex justify-center text-xs text-gray-500 space-x-4 mt-8 md:mt-0">
            <span>© 2025 PM Internship</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Support</a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;