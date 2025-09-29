import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiPaperclip, FiX, FiLink, FiInfo, FiCheckCircle, FiCheck } from 'react-icons/fi';

// Helper component for each step in the sidebar
const Step = ({ stepNumber, label, isActive, isCompleted, onClick, isClickable }) => (
    <div
        onClick={isClickable ? onClick : undefined}
        className={`flex items-center space-x-4 p-2 rounded-md transition-colors ${isClickable ? 'cursor-pointer hover:bg-gray-200' : 'cursor-default'}`}
    >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${isActive ? 'bg-orange-500 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {isCompleted ? <FiCheck /> : stepNumber}
        </div>
        <div>
            <p className="text-sm text-gray-500">Step {stepNumber}</p>
            <p className={`font-semibold ${isActive ? 'text-orange-600' : 'text-gray-800'}`}>{label}</p>
        </div>
    </div>
);

const ApplyPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { internship } = location.state || { internship: { title: 'Not Found' } };

    const [currentStep, setCurrentStep] = useState(1);
    const [maxStepReached, setMaxStepReached] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const [resume, setResume] = useState(null);
    const [certifications, setCertifications] = useState([]);
    const [skillsExperience, setSkillsExperience] = useState('');
    const [achievements, setAchievements] = useState('');
    const [profiles, setProfiles] = useState({ github: '', linkedin: '', portfolio: '' });
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleProfileChange = (e) => {
        setProfiles({ ...profiles, [e.target.name]: e.target.value });
    };
    
    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (file) setResume(file);
    };

    const handleCertificationUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.size < 2 * 1024 * 1024) { // 2MB limit
            setCertifications([...certifications, file]);
        } else if (file) {
            alert("File size must be less than 2MB.");
        }
    };
    
    const removeCertification = (fileName) => {
        setCertifications(certifications.filter(f => f.name !== fileName));
    };

    const handleNext = () => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        if (nextStep > maxStepReached) {
            setMaxStepReached(nextStep);
        }
    };

    const handleStepClick = (step) => {
        if (step <= maxStepReached) {
            setCurrentStep(step);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setTimeout(() => {
            navigate('/student/dashboard'); 
        }, 3000);
    };

    const steps = ["Resume", "Certifications", "Achievements", "Profiles", "Acknowledgement"];

    // --- UPDATED: Validation logic now includes Steps 3 & 4 ---
    let isNextDisabled = false;
    switch (currentStep) {
        case 1:
            isNextDisabled = !resume;
            break;
        case 2:
            isNextDisabled = skillsExperience.trim() === '';
            break;
        case 3:
            isNextDisabled = achievements.trim() === '';
            break;
        case 4:
            isNextDisabled = (
                profiles.github.trim() === '' &&
                profiles.linkedin.trim() === '' &&
                profiles.portfolio.trim() === ''
            );
            break;
        default:
            isNextDisabled = false;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            {isSubmitted && (
                 <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <FiCheckCircle className="mx-auto text-green-500 h-24 w-24 mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800">Internship Applied Successfully!</h2>
                    <p className="text-gray-600 mt-2">You will be redirected to the dashboard shortly.</p>
                </motion.div>
            )}

            {!isSubmitted && (
            <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl flex">
                {/* Sidebar */}
                <div className="w-1/3 bg-gray-100 p-8 rounded-l-lg">
                    <h2 className="text-xl font-bold mb-2">Applying for</h2>
                    <h1 className="text-2xl font-bold text-orange-600 mb-8">{internship.title}</h1>
                    <div className="space-y-6">
                        {steps.map((label, index) => (
                            <Step 
                                key={label} 
                                stepNumber={index + 1} 
                                label={label} 
                                isActive={currentStep === index + 1} 
                                isCompleted={index + 1 < maxStepReached}
                                isClickable={index + 1 <= maxStepReached}
                                onClick={() => handleStepClick(index + 1)}
                            />
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-2/3 p-8 flex flex-col">
                    <div className="flex-grow">
                        {/* Step 1: Resume */}
                        {currentStep === 1 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-2xl font-bold mb-6">Step 1: Upload Your Resume</h2>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center relative cursor-pointer hover:border-orange-500">
                                    <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400"/>
                                    <p className="mt-2 text-sm text-gray-600">Drag & drop or click to upload (Required)</p>
                                    <input type="file" onChange={handleResumeUpload} accept=".pdf,.doc,.docx" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"/>
                                </div>
                                {resume && <div className="mt-4 bg-gray-100 p-3 rounded-md flex items-center justify-between">
                                    <p className="flex items-center text-sm"><FiPaperclip className="mr-2"/>{resume.name}</p>
                                    <button onClick={() => setResume(null)}><FiX className="text-gray-500"/></button>
                                </div>}
                            </motion.div>
                        )}
                        
                        {/* Step 2: Certifications */}
                        {currentStep === 2 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-2xl font-bold mb-6">Step 2: Certifications & Skills</h2>
                                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative cursor-pointer hover:border-orange-500">
                                    <FiUploadCloud className="mx-auto h-8 w-8 text-gray-400"/>
                                    <p className="mt-1 text-xs text-gray-600">Upload certifications (optional, max 2MB)</p>
                                    <input type="file" onChange={handleCertificationUpload} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"/>
                                </div>
                                <div className="space-y-2 mt-4">
                                    {certifications.map(cert => (
                                         <div key={cert.name} className="bg-gray-100 p-3 rounded-md flex items-center justify-between">
                                            <p className="flex items-center text-sm"><FiPaperclip className="mr-2"/>{cert.name}</p>
                                            <button onClick={() => removeCertification(cert.name)}><FiX className="text-gray-500"/></button>
                                        </div>
                                    ))}
                                </div>
                                <textarea 
                                    placeholder="Describe your key skills and relevant work experience... (Required)" 
                                    className="w-full h-32 p-3 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none mt-4"
                                    value={skillsExperience}
                                    onChange={(e) => setSkillsExperience(e.target.value)}
                                ></textarea>
                            </motion.div>
                        )}

                        {/* Step 3: Achievements */}
                        {currentStep === 3 && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-2xl font-bold mb-6">Step 3: Achievements</h2>
                                <textarea 
                                    placeholder="List any specific achievements... (Required)" 
                                    className="w-full h-48 p-3 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={achievements}
                                    onChange={(e) => setAchievements(e.target.value)}
                                ></textarea>
                            </motion.div>
                        )}

                        {/* Step 4: Profiles */}
                        {currentStep === 4 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-2xl font-bold mb-2">Step 4: Professional Profiles</h2>
                                <p className="text-sm text-gray-500 mb-6">Please provide a link to at least one profile below.</p>
                                <div className="space-y-4">
                                    <div className="relative"><FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input name="github" value={profiles.github} onChange={handleProfileChange} placeholder="GitHub URL" className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none"/></div>
                                    <div className="relative"><FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input name="linkedin" value={profiles.linkedin} onChange={handleProfileChange} placeholder="LinkedIn URL" className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none"/></div>
                                    <div className="relative"><FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input name="portfolio" value={profiles.portfolio} onChange={handleProfileChange} placeholder="LeetCode/Portfolio URL" className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none"/></div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 5: Acknowledgement */}
                         {currentStep === 5 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-2xl font-bold mb-6">Step 5: Acknowledgement</h2>
                                <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md flex items-start space-x-3">
                                    <FiInfo className="h-6 w-6 mt-1 flex-shrink-0"/>
                                    <div>
                                        <h4 className="font-semibold">Recheck the details before submitting.</h4>
                                        <p className="text-sm mt-1">With the help of our AI/ML engine, the allocation will be managed. Ensure all provided information is accurate.</p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <label className="flex items-center text-sm cursor-pointer">
                                        <input type="checkbox" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} className="mr-2 h-4 w-4 rounded text-orange-600 focus:ring-orange-500"/>
                                        I accept the terms and conditions and confirm that all information is correct.
                                    </label>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 flex-shrink-0">
                        <button onClick={() => setCurrentStep(s => Math.max(1, s - 1))} disabled={currentStep === 1} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md disabled:opacity-50 transition-colors">Back</button>
                        {currentStep < 5 && <button onClick={handleNext} disabled={isNextDisabled} className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">Next</button>}
                        {currentStep === 5 && <button onClick={handleSubmit} disabled={!termsAccepted} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">Submit Application</button>}
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default ApplyPage;