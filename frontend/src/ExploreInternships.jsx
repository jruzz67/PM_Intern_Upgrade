import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMapPin, FiBriefcase, FiClock, FiX, FiChevronsLeft,
    FiStar, FiCheck, FiArrowRight
} from 'react-icons/fi';
import { sampleInternships } from './components/SampleData'; 

// --- Reusable UI Components ---
const SkillTag = ({ skill, isMustHave = false }) => (
    <span className={`flex items-center gap-1.5 text-xs font-medium mr-2 mb-2 px-3 py-1.5 rounded-full ${isMustHave ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-700'}`}>
        {isMustHave && <FiStar className="h-3 w-3" />}
        {skill}
    </span>
);

const InternshipCard = ({ internship, onSelect }) => (
    <motion.div
        layoutId={`internship-card-${internship.id}`} // For potential shared layout animations
        onClick={() => onSelect(internship)}
        className="bg-white rounded-lg shadow-md p-5 border-l-4 border-orange-500 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
        <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{internship.title}</h3>
            <p className="text-gray-600 font-medium mb-4 text-sm">{internship.company_name}</p>
            <div className="space-y-2 text-sm text-gray-500">
                <p className="flex items-center gap-2"><FiMapPin className="text-orange-500 flex-shrink-0" />{internship.location}</p>
                <p className="flex items-center gap-2"><FiBriefcase className="text-orange-500 flex-shrink-0" />{internship.work_mode}</p>
                <p className="flex items-center gap-2"><FiClock className="text-orange-500 flex-shrink-0" />Apply by {new Date(internship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            </div>
        </div>
        <div className="mt-5 text-sm font-semibold text-orange-600 flex items-center gap-1">
            View Details <FiArrowRight />
        </div>
    </motion.div>
);

const ExploreInternships = () => {
    const [internships, setInternships] = useState(sampleInternships);
    const [selectedInternship, setSelectedInternship] = useState(null);
    const navigate = useNavigate();

    const handleSelectInternship = (internship) => {
        setSelectedInternship(internship);
    };

    const handleDeselect = () => {
        setSelectedInternship(null);
    };

    const listVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const panelVariants = {
        open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
        closed: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Explore Internships</h1>
                    <button 
                        onClick={() => navigate('/')} // Navigate to your landing page
                        className="text-sm font-semibold text-gray-600 hover:text-orange-500 flex items-center gap-2"
                    >
                       <FiChevronsLeft /> Back to Home
                    </button>
                </div>
            </header>
            
            <main className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <motion.div 
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {internships.map(internship => (
                        <motion.div key={internship.id} variants={itemVariants}>
                             <InternshipCard internship={internship} onSelect={handleSelectInternship} />
                        </motion.div>
                    ))}
                </motion.div>

                <AnimatePresence>
                    {selectedInternship && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={handleDeselect}
                                className="fixed inset-0 bg-black bg-opacity-50 z-30"
                            />
                            {/* Details Panel */}
                            <motion.div
                                variants={panelVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-40 flex flex-col"
                            >
                                <div className="p-6 flex justify-between items-center border-b">
                                    <h2 className="text-xl font-bold text-gray-800">Internship Details</h2>
                                    <button onClick={handleDeselect} className="text-gray-500 hover:text-gray-800">
                                        <FiX size={24} />
                                    </button>
                                </div>

                                <div className="flex-1 p-6 overflow-y-auto">
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedInternship.title}</h3>
                                    <p className="text-md text-orange-600 font-semibold mt-1">{selectedInternship.company_name}</p>

                                    <div className="grid grid-cols-2 gap-4 text-sm my-5 text-gray-600">
                                        <p className="flex items-center gap-2"><FiMapPin className="text-gray-400"/>{selectedInternship.location}</p>
                                        <p className="flex items-center gap-2"><FiBriefcase className="text-gray-400"/>{selectedInternship.work_mode}</p>
                                        <p className="flex items-center gap-2"><FiClock className="text-gray-400"/>Apply by {new Date(selectedInternship.deadline).toLocaleDateString()}</p>
                                        <p className="flex items-center gap-2"><FiClock className="text-gray-400"/>Starts on {new Date(selectedInternship.start_date).toLocaleDateString()}</p>
                                    </div>

                                    <p className="text-gray-700 leading-relaxed">{selectedInternship.description}</p>
                                    
                                    <div className="mt-6">
                                        <h4 className="font-semibold text-gray-800 mb-3">Skills Required</h4>
                                        <div className="flex flex-wrap">
                                            {selectedInternship.must_have_skills.map(skill => <SkillTag key={skill} skill={skill} isMustHave />)}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <h4 className="font-semibold text-gray-800 mb-3">Good to Have</h4>
                                        <div className="flex flex-wrap">
                                            {selectedInternship.good_to_have_skills.map(skill => <SkillTag key={skill} skill={skill} />)}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6 border-t bg-gray-50">
                                    <button 
                                        onClick={() => navigate('/student')} // Navigate to sign-up/login page
                                        className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Apply Now <FiArrowRight />
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ExploreInternships;