/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiHome, FiFileText, FiBookmark, FiBell, FiLogOut, FiBriefcase,
    FiCalendar, FiClock, FiCheckCircle, FiX, FiMapPin, FiCpu, FiStar,
    FiInfo, FiCheck, FiUser, FiSettings, FiArrowLeft
} from 'react-icons/fi';

// --- PASTE THE EXPANDED SAMPLE DATA HERE ---
const sampleInternships = [
    {
        id: 1,
        title: 'Frontend Developer Intern (React)',
        company_name: 'Innovate Solutions Inc.',
        location: 'Bengaluru, Karnataka',
        work_mode: 'Hybrid',
        deadline: '2025-10-31T23:59:59Z',
        start_date: '2025-11-15T09:00:00Z',
        description: 'Join our dynamic team to build cutting-edge user interfaces with React. You will work closely with our senior developers and UI/UX designers to create responsive and engaging web applications for our clients.',
        must_have_skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
        good_to_have_skills: ['TypeScript', 'Redux', 'Next.js'],
        status: 'approved'
    },
    {
        id: 2,
        title: 'Backend Developer Intern (Node.js)',
        company_name: 'Tech Systems Co.',
        location: 'Pune, Maharashtra',
        work_mode: 'Remote',
        deadline: '2025-11-05T23:59:59Z',
        start_date: '2025-11-20T09:00:00Z',
        description: 'We are looking for a motivated backend intern to help develop and maintain our server-side logic, build robust APIs, and ensure high performance.',
        must_have_skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
        good_to_have_skills: ['Docker', 'AWS', 'GraphQL'],
        status: 'approved'
    },
    {
        id: 3,
        title: 'Data Science Intern',
        company_name: 'Data Insights Ltd.',
        location: 'Hyderabad, Telangana',
        work_mode: 'On-site',
        deadline: '2025-10-25T23:59:59Z',
        start_date: '2025-11-10T09:00:00Z',
        description: 'Dive into big data! This internship focuses on data analysis, machine learning model creation, and generating actionable insights from large datasets.',
        must_have_skills: ['Python', 'Pandas', 'NumPy', 'SQL'],
        good_to_have_skills: ['Scikit-learn', 'TensorFlow', 'Tableau'],
        status: 'approved'
    },
    {
        id: 4,
        title: 'Cloud Engineer Intern (Azure)',
        company_name: 'InfraCloud Solutions',
        location: 'Chennai, Tamil Nadu',
        work_mode: 'Hybrid',
        deadline: '2025-11-15T23:59:59Z',
        start_date: '2025-12-01T09:00:00Z',
        description: 'Learn to build and manage scalable cloud infrastructure on Microsoft Azure. This role involves working with virtual machines, containerization, and infrastructure-as-code principles.',
        must_have_skills: ['Azure', 'PowerShell', 'Networking Basics'],
        good_to_have_skills: ['Terraform', 'Kubernetes', 'CI/CD'],
        status: 'approved'
    },
    {
        id: 5,
        title: 'Digital Marketing Intern',
        company_name: 'Growth Hackers',
        location: 'Remote',
        work_mode: 'Remote',
        deadline: '2025-10-28T23:59:59Z',
        start_date: '2025-11-05T09:00:00Z',
        description: 'Support our marketing team in creating and executing digital campaigns across social media, email, and SEO. Analyze campaign performance and contribute creative ideas.',
        must_have_skills: ['Social Media Marketing', 'Content Creation', 'SEO Basics'],
        good_to_have_skills: ['Google Analytics', 'Email Marketing'],
        status: 'approved'
    },
     {
        id: 6,
        title: 'UI/UX Design Intern',
        company_name: 'Creative Minds Studio',
        location: 'Mumbai, Maharashtra',
        work_mode: 'Hybrid',
        deadline: '2025-12-01T23:59:59Z',
        start_date: '2026-01-05T09:00:00Z',
        description: 'We are seeking a creative UI/UX intern to help design intuitive user experiences. You will be involved in wireframing, prototyping, and user research.',
        must_have_skills: ['Figma', 'Sketch', 'Wireframing', 'Prototyping'],
        good_to_have_skills: ['Adobe XD', 'User Research'],
        status: 'approved'
    },
    {
        id: 7,
        title: 'Product Management Intern',
        company_name: 'NextGen Products',
        location: 'Noida, Uttar Pradesh',
        work_mode: 'On-site',
        deadline: '2025-11-10T23:59:59Z',
        start_date: '2025-11-25T09:00:00Z',
        description: 'Work with our product team to define product roadmaps, write specifications, and analyze user feedback. Understand the full product lifecycle from ideation to launch.',
        must_have_skills: ['Market Research', 'Agile Methodologies', 'Communication'],
        good_to_have_skills: ['JIRA', 'Product Roadmapping'],
        status: 'approved'
    },
    {
        id: 8,
        title: 'Mobile App Developer Intern (Flutter)',
        company_name: 'Appify Creations',
        location: 'Kochi, Kerala',
        work_mode: 'Remote',
        deadline: '2025-11-20T23:59:59Z',
        start_date: '2025-12-05T09:00:00Z',
        description: 'Develop cross-platform mobile applications using Flutter. You will be responsible for building beautiful UIs, implementing business logic, and integrating with backend services.',
        must_have_skills: ['Flutter', 'Dart', 'Mobile UI Design'],
        good_to_have_skills: ['Firebase', 'State Management'],
        status: 'approved'
    },
    {
        id: 9,
        title: 'Cybersecurity Analyst Intern',
        company_name: 'SecureNet',
        location: 'Delhi',
        work_mode: 'On-site',
        deadline: '2025-11-30T23:59:59Z',
        start_date: '2025-12-15T09:00:00Z',
        description: 'Join our security operations center (SOC) to monitor for threats, analyze security alerts, and assist in incident response. A great entry point into the world of cybersecurity.',
        must_have_skills: ['Networking Concepts', 'Operating Systems', 'Security Principles'],
        good_to_have_skills: ['Wireshark', 'SIEM tools'],
        status: 'approved'
    },
    {
        id: 10,
        title: 'Business Analyst Intern',
        company_name: 'Strategy First Consulting',
        location: 'Bengaluru, Karnataka',
        work_mode: 'Hybrid',
        deadline: '2025-10-20T23:59:59Z',
        start_date: '2025-11-01T09:00:00Z',
        description: 'Bridge the gap between business and technology. You will be responsible for gathering requirements, creating process flow diagrams, and documenting business needs for our software development team.',
        must_have_skills: ['Requirement Gathering', 'MS Excel', 'Analytical Skills'],
        good_to_have_skills: ['SQL', 'Power BI'],
        status: 'approved'
    }
];
// --- END OF SAMPLE DATA ---


const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const SkillTag = ({ skill }) => <span className="bg-orange-100 text-orange-800 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full">{skill}</span>;
const ApplicationStatusTracker = ({ status }) => {
    const steps = ['Applied', 'Under Review', 'Accepted'];
    const currentStepIndex = steps.indexOf(status);
    return (
        <div className="bg-gray-100 p-6 rounded-lg mt-6">
            <h4 className="font-semibold text-gray-800 mb-4">Application Status</h4>
            <div className="flex items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStepIndex ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}><FiCheck /></div>
                            <p className={`mt-2 text-xs font-medium w-20 ${index <= currentStepIndex ? 'text-green-600' : 'text-gray-500'}`}>{step}</p>
                        </div>
                        {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const StudentDashboard = () => {
    const [internships, setInternships] = useState(sampleInternships);
    const [myApplications, setMyApplications] = useState([
        { ...sampleInternships[1], status: 'Under Review' },
        { ...sampleInternships[3], status: 'Applied' },
    ]);
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [activeTab, setActiveTab] = useState('Available');
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Student' };
    const profileRef = useRef(null);

    // UPDATED: This function now navigates to the new ApplyPage
    const handleApplyClick = (internship) => {
        navigate('/apply', { state: { internship } });
    };
    
    const handleLogout = () => navigate('/');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileDropdownOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const today = new Date();
    const internshipsToList = internships.filter(i => {
        if (activeTab === 'Available') return new Date(i.deadline) >= today && i.status === 'approved';
        if (activeTab === 'Upcoming') return new Date(i.start_date) > today && i.status === 'approved';
        if (activeTab === 'My Applications') return myApplications.some(app => app.id === i.id);
        return true;
    });

    const panelVariants = {
        hidden: { x: "100%" },
        visible: { x: 0 },
        exit: { x: "100%" }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <aside className="w-64 bg-gray-900 text-white flex-col hidden md:flex">
                <div className="p-6 text-2xl font-bold border-b border-gray-700">Internship Portal</div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {['Available', 'My Applications', 'Upcoming'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center px-4 py-2 rounded-md text-left transition-colors ${activeTab === tab ? 'bg-orange-500' : 'hover:bg-gray-700'}`}>
                            {tab === 'Available' && <FiHome className="mr-3" />}
                             {tab === 'My Applications' && <FiFileText className="mr-3" />}
                            {tab === 'Upcoming' && <FiBookmark className="mr-3" />}
                            {tab}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"><FiLogOut className="mr-3" /> Logout</button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-5 bg-white border-b flex-shrink-0">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h1>
                    <div className="flex items-center space-x-4">
                        <FiBell className="text-gray-500 h-6 w-6 cursor-pointer hover:text-orange-500"/>
                        <div className="relative" ref={profileRef}>
                            <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="w-10 h-10 bg-orange-500 rounded-full text-white flex items-center justify-center font-bold">{user.name ? user.name.charAt(0).toUpperCase() : 'S'}</button>
                            <AnimatePresence>
                                {isProfileDropdownOpen && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50">
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"><FiUser className="mr-2"/>Profile</a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"><FiSettings className="mr-2"/>Account Status</a>
                                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"><FiLogOut className="mr-2"/>Logout</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 relative">
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {internshipsToList.map(internship => {
                            const isApplied = myApplications.some(app => app.id === internship.id);
                            return (
                                <motion.div layout key={internship.id} onClick={() => setSelectedInternship(internship)}
                                    className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer relative">
                                    
                                    {isApplied && (
                                        <div title="Applied" className="absolute top-4 right-4 text-green-500">
                                            <FiCheckCircle size={24} />
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold text-gray-800 mb-2 pr-8">{internship.title}</h3>
                                    <p className="text-gray-600 font-medium mb-4">{internship.company_name}</p>
                                    <div className="space-y-2 text-sm text-gray-500">
                                        <p className="flex items-center"><FiMapPin className="mr-2 text-orange-500" />{internship.location}</p>
                                        <p className="flex items-center"><FiCalendar className="mr-2 text-orange-500" />Apply by: {formatDate(internship.deadline)}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    <AnimatePresence>
                        {selectedInternship && (
                            <motion.div
                                variants={panelVariants} initial="hidden" animate="visible" exit="exit"
                                transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
                                className="absolute top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl border-l z-30 flex flex-col"
                            >
                                <div className="p-5 border-b flex-shrink-0 flex items-center">
                                    <button onClick={() => setSelectedInternship(null)} className="p-2 rounded-full hover:bg-gray-100 mr-4">
                                        <FiArrowLeft size={20} />
                                    </button>
                                    <h2 className="text-xl font-bold text-gray-800">Internship Details</h2>
                                </div>

                                <div className="p-8 overflow-y-auto flex-1">
                                    {/* Details content... */}
                                     <h2 className="text-3xl font-bold text-gray-900">{selectedInternship.title}</h2>
                                    <p className="text-md text-gray-500 mt-1">{selectedInternship.company_name}</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm my-6 text-gray-600">
                                        <p className="flex items-center"><FiMapPin className="mr-2 text-gray-400"/>{selectedInternship.location}</p>
                                        <p className="flex items-center"><FiBriefcase className="mr-2 text-gray-400"/>{selectedInternship.work_mode}</p>
                                        <p className="flex items-center"><FiCalendar className="mr-2 text-gray-400"/>Apply by {formatDate(selectedInternship.deadline)}</p>
                                        <p className="flex items-center"><FiClock className="mr-2 text-gray-400"/>Starts on {formatDate(selectedInternship.start_date)}</p>
                                    </div>
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Description</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">{selectedInternship.description}</p>
                                    </div>
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-800 mb-3 text-sm">Skills Required</h4>
                                        <div className="flex flex-wrap">{(selectedInternship.must_have_skills || []).map(skill => <SkillTag key={skill} skill={skill} />)}</div>
                                    </div>
                                    {myApplications.find(app => app.id === selectedInternship.id) && (
                                        <ApplicationStatusTracker status={myApplications.find(app => app.id === selectedInternship.id).status} />
                                    )}
                                </div>

                                <div className="p-6 border-t bg-gray-50 flex-shrink-0">
                                    {!myApplications.some(app => app.id === selectedInternship.id) && (
                                         <button onClick={() => handleApplyClick(selectedInternship)} className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                                            Apply Now
                                         </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
