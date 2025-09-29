import React, { useState } from 'react';
// import axios from 'axios'; // Backend calls are commented out
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// An inspiring background image for the left panel
const backgroundImageUrl = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop';

// --- Reusable UI Components (for cleaner code) ---

const FormInput = React.memo(({ name, type = 'text', placeholder, value, onChange, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {placeholder}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
            required
            {...props}
        />
    </div>
));

const FormSelect = React.memo(({ name, value, onChange, children }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {name.replace('_', ' ')}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition appearance-none bg-white pr-8"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
            required
        >
            {children}
        </select>
    </div>
));


const SignUpFormComponent = React.memo(({ formData, handleInputChange, handleSignUp, isLoading }) => (
    <>
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Create Your Student Account</h1>
            <p className="text-gray-500 mt-2">Join our community to find your next opportunity.</p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} />
                <FormInput name="age" type="number" placeholder="Age" value={formData.age} onChange={handleInputChange} />
                <FormInput name="cgpa" type="number" placeholder="CGPA" step="0.01" value={formData.cgpa} onChange={handleInputChange} />
                <FormInput name="family_income" type="number" placeholder="Family Income (₹)" value={formData.family_income} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Third Gender">Third Gender</option>
                </FormSelect>
                <FormSelect name="urban_rural" value={formData.urban_rural} onChange={handleInputChange}>
                    <option value="">Select Area</option>
                    <option value="Urban">Urban</option>
                    <option value="Rural">Rural</option>
                </FormSelect>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect name="community_category" value={formData.community_category} onChange={handleInputChange}>
                    <option value="">Select Community</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="OBC">OBC</option>
                    <option value="General">General</option>
                    <option value="Others">Others</option>
                </FormSelect>
                <FormSelect name="education_level" value={formData.education_level} onChange={handleInputChange}>
                    <option value="">Select Education</option>
                    <option value="High School">High School</option>
                    <option value="Higher Secondary">Higher Secondary</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor">Bachelor</option>
                </FormSelect>
            </div>
            <button
                type="submit"
                className="w-full p-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all hover:scale-105 disabled:bg-orange-300 disabled:scale-100"
                disabled={isLoading}
            >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
        </form>
    </>
));

const SignInFormComponent = React.memo(({ loginName, setLoginName, handleSignIn, isLoading }) => (
    <>
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
            <p className="text-gray-500 mt-2">Sign in to continue your journey.</p>
        </div>
        <form onSubmit={handleSignIn} className="space-y-6">
            <FormInput name="name" placeholder="Enter Your Name" value={loginName} onChange={(e) => setLoginName(e.target.value)} />
            <button
                type="submit"
                className="w-full p-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all hover:scale-105 disabled:bg-orange-300 disabled:scale-100"
                disabled={isLoading}
            >
                {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
    </>
));


const StudentOnboarding = () => {
    // --- STATE MANAGEMENT ---
    const [isSignUp, setIsSignUp] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', age: '', cgpa: '', community_category: '', gender: '',
        urban_rural: '', family_income: '', education_level: ''
    });
    const [loginName, setLoginName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // --- LOGIC AND HANDLERS ---
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            // Simulate network delay for UI testing
            await new Promise(resolve => setTimeout(resolve, 1000));

            // --- OLD: The backend call is now commented out ---
            // await axios.post('http://127.0.0.1:5000/api/student/register', formData);
            
            // This part now runs directly, simulating a successful sign-up
            setError('Signup successful! Please sign in.');
            setIsSignUp(false);
            setFormData({
                name: '', age: '', cgpa: '', community_category: '', gender: '',
                urban_rural: '', family_income: '', education_level: ''
            });
        } catch (err) {
            setError('Simulated signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            // Simulate network delay for UI testing
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // --- OLD: The backend call and localStorage are commented out ---
            // const response = await axios.post('http://127.0.0.1:5000/api/student/login', { name: loginName });
            // localStorage.setItem('user', JSON.stringify({ id: response.data.id, user_type: 'student', name: loginName }));
            
            // --- NEW: This now navigates directly to the dashboard ---
            navigate('/student/dashboard');

        } catch (err) {
            setError('Simulated login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- MAIN RENDER ---
    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
            <div className="flex w-full max-w-5xl h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden m-4">

                {/* Left Panel: Branding & Image */}
                <div
                    className="hidden md:block w-1/2 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${backgroundImageUrl})` }}
                >
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex flex-col justify-center items-start p-12 text-white">
                        <h2 className="text-4xl font-bold leading-tight mb-4">
                            Unlock Your Potential.
                        </h2>
                        <p className="text-lg text-gray-200">
                            Your gateway to premier internships and a successful career path. Let's get started.
                        </p>
                    </div>
                </div>

                {/* Right Panel: Form Area */}
                <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`text-center mb-4 font-medium p-3 rounded-lg ${error.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isSignUp ? 'signup' : 'signin'}
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {isSignUp ? (
                                <SignUpFormComponent
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    handleSignUp={handleSignUp}
                                    isLoading={isLoading}
                                />
                            ) : (
                                <SignInFormComponent
                                    loginName={loginName}
                                    setLoginName={setLoginName}
                                    handleSignIn={handleSignIn}
                                    isLoading={isLoading}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
                            }}
                            className="font-semibold text-orange-500 hover:text-orange-600 focus:outline-none"
                            disabled={isLoading}
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentOnboarding;