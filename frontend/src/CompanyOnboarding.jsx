import React, { useState } from 'react';
// import axios from 'axios'; // Backend calls are commented out
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiUser, FiBriefcase, FiMapPin, FiGlobe, FiFileText, FiAlertCircle } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';

// Helper component to prevent re-renders and focus loss
const InputField = ({ icon, id, name, type, placeholder, value, onChange }) => (
  <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
      {icon}
    </span>
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
      required
    />
  </div>
);


const CompanyOnboarding = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    legal_entity: '',
    address: '',
    phone: '',
    email: '',
    sector: '',
    industry: ''
  });
  const [loginName, setLoginName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (isSignUp) { // Only validate on sign-up form
        if (!/^\d{10}$/.test(formData.phone)) {
            setError('Phone number must be 10 digits');
            return false;
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            setError('Invalid email format');
            return false;
        }
    }
    setError('');
    return true;
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // --- NEW: Frontend-only sign-up simulation ---
    // This simulates a successful sign-up and switches to the sign-in form.
    setError('Signup successful! Please sign in.');
    setIsSignUp(false);
    setFormData({ name: '', legal_entity: '', address: '', phone: '', email: '', sector: '', industry: '' });

    // --- OLD: Backend logic is commented out as requested ---
    /*
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    try {
      await axios.post('http://127.0.0.1:5000/api/company/register', data);
      setError('Signup successful! Awaiting admin approval.');
      setIsSignUp(false);
      setFormData({ name: '', legal_entity: '', address: '', phone: '', email: '', sector: '', industry: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
    */
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    
    // --- NEW: Frontend-only navigation ---
    // This navigates directly to the company dashboard.
    navigate('/company/dashboard');
    
    // --- OLD: Backend logic is commented out as requested ---
    /*
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/company/login', { name: loginName });
      localStorage.setItem('user', JSON.stringify({ id: response.data.id, user_type: 'company', name: loginName }));
      navigate('/company/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
    */
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="hidden md:flex flex-col justify-between w-2/5 p-10 bg-gradient-to-br from-gray-900 to-gray-700 text-white">
            <div>
              <h2 className="text-3xl font-bold mb-3">Partner with Us</h2>
              <p className="text-gray-300 leading-relaxed">
                  Register your company to connect with aspiring talent, post internship opportunities, and shape the future of your industry.
              </p>
            </div>
            <FiBriefcase className="w-48 h-48 text-gray-600 self-center" />
        </div>

        <div className="w-full md:w-3/5 p-8 md:p-12">
            <AnimatePresence mode="wait">
                {isSignUp ? (
                    <motion.div key="signup" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Registration</h1>
                        <p className="text-gray-500 mb-6">Create your company profile to get started.</p>
                        
                        <AnimatePresence>
                            {error && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`flex items-center gap-2 mb-4 p-3 rounded-lg text-sm ${error.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                >
                                    <FiAlertCircle /> {error}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField icon={<FaBuilding className="text-gray-400"/>} id="name" name="name" type="text" placeholder="Company Name" value={formData.name} onChange={handleInputChange} />
                                <InputField icon={<FiFileText className="text-gray-400"/>} id="legal_entity" name="legal_entity" type="text" placeholder="Legal Entity (e.g., Pvt Ltd)" value={formData.legal_entity} onChange={handleInputChange} />
                            </div>
                            <InputField icon={<FiMapPin className="text-gray-400"/>} id="address" name="address" type="text" placeholder="Company Address" value={formData.address} onChange={handleInputChange} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField icon={<FiPhone className="text-gray-400"/>} id="phone" name="phone" type="text" placeholder="Phone (10 digits)" value={formData.phone} onChange={handleInputChange} />
                                <InputField icon={<FiMail className="text-gray-400"/>} id="email" name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField icon={<FiBriefcase className="text-gray-400"/>} id="sector" name="sector" type="text" placeholder="Sector (e.g., IT)" value={formData.sector} onChange={handleInputChange} />
                                <InputField icon={<FiGlobe className="text-gray-400"/>} id="industry" name="industry" type="text" placeholder="Industry (e.g., Software)" value={formData.industry} onChange={handleInputChange} />
                            </div>
                            <button type="submit" className="w-full p-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                                Create Account
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div key="signin" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-500 mb-6">Sign in to your company dashboard.</p>
                        
                        <AnimatePresence>
                            {error && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`flex items-center gap-2 mb-4 p-3 rounded-lg text-sm ${error.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                >
                                    <FiAlertCircle /> {error}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSignIn} className="space-y-5">
                             <InputField icon={<FiUser className="text-gray-400"/>} id="loginName" name="loginName" type="text" placeholder="Company Name" value={loginName} onChange={(e) => setLoginName(e.target.value)} />
                             <button type="submit" className="w-full p-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                                Sign In
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <p className="text-center text-sm text-gray-500 mt-8">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                    onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                    className="font-semibold text-orange-600 hover:underline ml-1"
                >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyOnboarding;