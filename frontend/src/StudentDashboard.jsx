/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiHome, FiFileText, FiBookmark, FiBell, FiLogOut, FiBriefcase,
    FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiMapPin, FiCpu, FiStar,
    FiInfo, FiCheck, FiUser, FiSettings, FiArrowLeft, FiSearch
} from 'react-icons/fi';

// --- SAMPLE DATA ---
const sampleInternships = [
  {
    id: 1,
    title: 'Frontend Developer Intern (React)',
    company_name: 'Innovate Solutions Inc.',
    location: 'Bengaluru, Karnataka',
    work_mode: 'Hybrid',
    deadline: '2025-10-31T23:59:59Z',
    start_date: '2025-11-15T09:00:00Z',
    description: 'Join our dynamic team to build cutting-edge user interfaces with React. You will work closely with our senior developers and UI/UX designers.',
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
    description: 'Learn to build and manage scalable cloud infrastructure on Microsoft Azure. This role involves working with VMs, containerization, and IaC principles.',
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
    description: 'Support our marketing team in creating and executing digital campaigns across social media, email, and SEO. Analyze campaign performance.',
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
    description: 'Work with our product team to define product roadmaps, write specifications, and analyze user feedback to understand the full product lifecycle.',
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
    description: 'Develop cross-platform mobile applications using Flutter. You will be responsible for building beautiful UIs and integrating with backend services.',
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
    description: 'Join our security operations center (SOC) to monitor for threats, analyze security alerts, and assist in incident response.',
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
    description: 'Bridge the gap between business and technology. You will be responsible for gathering requirements, creating process flow diagrams, and documenting business needs.',
    must_have_skills: ['Requirement Gathering', 'MS Excel', 'Analytical Skills'],
    good_to_have_skills: ['SQL', 'Power BI'],
    status: 'approved'
  },
  {
    id: 11,
    title: 'Mechanical Engineering Intern',
    company_name: 'Precision Motors Ltd.',
    location: 'Chennai, Tamil Nadu',
    work_mode: 'On-site',
    deadline: '2025-11-10T23:59:59Z',
    start_date: '2025-12-01T09:00:00Z',
    description: 'Assist in the design, development, and testing of mechanical components and systems. Gain hands-on experience with CAD software and manufacturing processes.',
    must_have_skills: ['AutoCAD', 'SolidWorks', 'Engineering Mechanics'],
    good_to_have_skills: ['ANSYS', 'CATIA'],
    status: 'approved'
  },
  {
    id: 12,
    title: 'Finance & Accounting Intern',
    company_name: 'Capital Advisors LLP',
    location: 'Mumbai, Maharashtra',
    work_mode: 'Hybrid',
    deadline: '2025-11-25T23:59:59Z',
    start_date: '2025-12-10T09:00:00Z',
    description: 'Support the finance team with tasks such as financial reporting, budget analysis, and preparation of financial statements. A great opportunity to learn about corporate finance.',
    must_have_skills: ['MS Excel', 'Accounting Principles', 'Financial Modeling Basics'],
    good_to_have_skills: ['Tally ERP', 'QuickBooks'],
    status: 'approved'
  },
  {
    id: 13,
    title: 'Human Resources Intern',
    company_name: 'People First Corp',
    location: 'Delhi',
    work_mode: 'On-site',
    deadline: '2025-11-15T23:59:59Z',
    start_date: '2025-12-01T09:00:00Z',
    description: 'Assist the HR department with recruitment, onboarding, employee engagement activities, and maintaining HR records.',
    must_have_skills: ['Communication Skills', 'MS Office Suite', 'Interpersonal Skills'],
    good_to_have_skills: ['Recruitment Software', 'HR Policies'],
    status: 'approved'
  },
  {
    id: 14,
    title: 'Civil Engineering Site Intern',
    company_name: 'InfraBuilders Pvt. Ltd.',
    location: 'Hyderabad, Telangana',
    work_mode: 'On-site',
    deadline: '2025-11-05T23:59:59Z',
    start_date: '2025-11-20T09:00:00Z',
    description: 'Gain practical experience in on-site construction management, including quality control, site supervision, and interpreting technical drawings.',
    must_have_skills: ['Site Supervision', 'AutoCAD', 'Building Materials Knowledge'],
    good_to_have_skills: ['Primavera P6', 'Surveying'],
    status: 'approved'
  },
  {
    id: 15,
    title: 'Content Writer Intern',
    company_name: 'WordWeavers Agency',
    location: 'Remote',
    work_mode: 'Remote',
    deadline: '2025-11-30T23:59:59Z',
    start_date: '2025-12-15T09:00:00Z',
    description: 'Create engaging and SEO-friendly content for blogs, websites, and social media. Research industry-related topics and produce well-written articles.',
    must_have_skills: ['Excellent Writing Skills', 'SEO Writing', 'Content Editing'],
    good_to_have_skills: ['WordPress', 'Grammarly'],
    status: 'approved'
  },
  {
    id: 16,
    title: 'Architectural Design Intern',
    company_name: 'Urban Blueprints',
    location: 'Pune, Maharashtra',
    work_mode: 'Hybrid',
    deadline: '2025-12-10T23:59:59Z',
    start_date: '2026-01-05T09:00:00Z',
    description: 'Work alongside architects to develop architectural designs, prepare drawings and presentations, and create 3D models of buildings.',
    must_have_skills: ['Revit', 'SketchUp', 'Architectural Drawing'],
    good_to_have_skills: ['AutoCAD 3D', 'Adobe Photoshop'],
    status: 'approved'
  },
  {
    id: 17,
    title: 'Biotechnology Research Intern',
    company_name: 'GeneLife Sciences',
    location: 'Hyderabad, Telangana',
    work_mode: 'On-site',
    deadline: '2025-11-20T23:59:59Z',
    start_date: '2025-12-05T09:00:00Z',
    description: 'Assist researchers in a laboratory setting. Responsibilities include conducting experiments, collecting data, and performing techniques like PCR and cell culture.',
    must_have_skills: ['PCR', 'Cell Culture', 'Laboratory Techniques'],
    good_to_have_skills: ['ELISA', 'Data Analysis'],
    status: 'approved'
  },
  {
    id: 18,
    title: 'Business Development Intern',
    company_name: 'GrowthLeap',
    location: 'Noida, Uttar Pradesh',
    work_mode: 'Hybrid',
    deadline: '2025-11-18T23:59:59Z',
    start_date: '2025-12-02T09:00:00Z',
    description: 'Focus on generating leads, qualifying prospects, and supporting the sales team. Learn about sales strategies and CRM software.',
    must_have_skills: ['Lead Generation', 'Communication Skills', 'MS Office'],
    good_to_have_skills: ['CRM Software (e.g., Salesforce)', 'Negotiation'],
    status: 'approved'
  },
  {
    id: 19,
    title: 'Quality Assurance Intern',
    company_name: 'BugFinders Inc.',
    location: 'Bengaluru, Karnataka',
    work_mode: 'Hybrid',
    deadline: '2025-11-22T23:59:59Z',
    start_date: '2025-12-08T09:00:00Z',
    description: 'Perform manual testing of web and mobile applications to find and report bugs. Create test cases and work closely with the development team.',
    must_have_skills: ['Manual Testing', 'Test Case Writing', 'JIRA'],
    good_to_have_skills: ['Automation Testing Basics', 'Selenium'],
    status: 'approved'
  },
  {
    id: 20,
    title: 'Graphic Design Intern',
    company_name: 'Pixel Perfect Studios',
    location: 'Mumbai, Maharashtra',
    work_mode: 'Remote',
    deadline: '2025-12-05T23:59:59Z',
    start_date: '2025-12-20T09:00:00Z',
    description: 'Create visual concepts for websites, social media, and marketing materials. Use design software to bring ideas to life and build a strong portfolio.',
    must_have_skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Creativity'],
    good_to_have_skills: ['Adobe InDesign', 'After Effects'],
    status: 'approved'
  },
  {
    id: 21,
    title: 'Supply Chain Management Intern',
    company_name: 'LogiTrack Solutions',
    location: 'Chennai, Tamil Nadu',
    work_mode: 'On-site',
    deadline: '2025-11-28T23:59:59Z',
    start_date: '2025-12-12T09:00:00Z',
    description: 'Learn the fundamentals of logistics and supply chain. Assist with inventory management, tracking shipments, and optimizing supply chain processes.',
    must_have_skills: ['Inventory Management Concepts', 'MS Excel', 'Analytical Skills'],
    good_to_have_skills: ['SAP', 'Logistics Software'],
    status: 'approved'
  },
  {
    id: 22,
    title: 'Legal Intern',
    company_name: 'Veritas Legal Associates',
    location: 'Delhi',
    work_mode: 'On-site',
    deadline: '2025-11-12T23:59:59Z',
    start_date: '2025-11-28T09:00:00Z',
    description: 'Support lawyers with legal research, drafting documents, and preparing case files. An excellent opportunity for law students to gain practical experience.',
    must_have_skills: ['Legal Research', 'Drafting', 'Case Law Analysis'],
    good_to_have_skills: ['Corporate Law', 'Litigation'],
    status: 'approved'
  },
  {
    id: 23,
    title: 'AI/ML Engineer Intern',
    company_name: 'Cognitive AI',
    location: 'Bengaluru, Karnataka',
    work_mode: 'Remote',
    deadline: '2025-12-15T23:59:59Z',
    start_date: '2026-01-10T09:00:00Z',
    description: 'Work on real-world machine learning projects. Responsibilities include data preprocessing, training models, and evaluating their performance.',
    must_have_skills: ['Python', 'TensorFlow or PyTorch', 'Machine Learning Concepts'],
    good_to_have_skills: ['Natural Language Processing (NLP)', 'Computer Vision'],
    status: 'approved'
  },
  {
    id: 24,
    title: 'Hospitality Management Intern',
    company_name: 'Grand Palace Hotels',
    location: 'Jaipur, Rajasthan',
    work_mode: 'On-site',
    deadline: '2025-10-30T23:59:59Z',
    start_date: '2025-11-15T09:00:00Z',
    description: 'Experience the operations of a luxury hotel. Rotate through various departments like front office, F&B, and housekeeping to learn about guest relations.',
    must_have_skills: ['Guest Relations', 'Communication', 'Teamwork'],
    good_to_have_skills: ['Hotel Management Software', 'Event Coordination'],
    status: 'approved'
  },
  {
    id: 25,
    title: 'Electrical Engineering Intern',
    company_name: 'PowerGrid Solutions',
    location: 'Kolkata, West Bengal',
    work_mode: 'On-site',
    deadline: '2025-11-20T23:59:59Z',
    start_date: '2025-12-05T09:00:00Z',
    description: 'Assist in the design and analysis of electrical systems. Work on projects related to power distribution, circuit design, and control systems.',
    must_have_skills: ['Circuit Analysis', 'MATLAB', 'Electrical Schematics'],
    good_to_have_skills: ['PLC Programming', 'Power Systems'],
    status: 'approved'
  }
];
// --- END OF SAMPLE DATA ---


const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const SkillTag = ({ skill }) => <span className="bg-orange-100 text-orange-800 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full">{skill}</span>;

const RejectionInfo = ({ reason, quote }) => (
    <div className="bg-red-50 border border-red-200 p-6 rounded-lg mt-6">
        <h4 className="font-semibold text-red-800 mb-2 flex items-center"><FiXCircle className="mr-2"/> Application Update</h4>
        <p className="text-sm text-red-700 mb-4">{reason}</p>
        <p className="text-sm font-semibold text-red-800 italic">"{quote}"</p>
    </div>
);

const ApplicationStatusTracker = ({ status }) => {
    const isRejected = status === 'Rejected';
    const steps = isRejected ? ['Applied', 'Rejected'] : ['Applied', 'Under Review', 'Accepted'];
    const currentStepIndex = steps.indexOf(status);

    return (
        <div className="bg-gray-100 p-6 rounded-lg mt-6">
            <h4 className="font-semibold text-gray-800 mb-4">Application Status</h4>
            <div className="flex items-center">
                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isRejectedStep = isRejected && step === 'Rejected';
                    
                    return (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isRejectedStep ? 'bg-red-500 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {isRejectedStep ? <FiXCircle /> : <FiCheck />}
                                </div>
                                <p className={`mt-2 text-xs font-medium w-20 ${isRejectedStep ? 'text-red-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>{step}</p>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${index < currentStepIndex ? (isRejected ? 'bg-red-500' : 'bg-green-500') : 'bg-gray-200'}`}></div>}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};


const StudentDashboard = () => {
    const [internships, setInternships] = useState(sampleInternships);
    const [myApplications, setMyApplications] = useState([
    { ...sampleInternships[1], status: 'Under Review' },
    { ...sampleInternships[3], status: 'Applied' },      
    {
        ...sampleInternships[4],                                
        status: 'Rejected',
        rejection_reason: 'While your profile is promising, the candidate pool was highly competitive. We prioritized applicants with direct experience in Google Analytics and email marketing automation tools.',
        motivational_quote: "Every rejection is a redirection. Use this as fuel to refine your skills and come back even stronger."
    },
    { ...sampleInternships[0], status: 'Under Review' },
    { ...sampleInternships[6], status: 'Applied' },
    {
        ...sampleInternships[2],
        status: 'Rejected',
        rejection_reason: 'Your academic background is impressive; however, this role required demonstrated project experience with large-scale SQL databases, which was a key differentiator for other candidates.',
        motivational_quote: "Don't let this dishearten you. Every 'no' gets you closer to a 'yes'. Focus on building a project that showcases your SQL skills."
    }
]);
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [activeTab, setActiveTab] = useState('Available');
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedWorkMode, setSelectedWorkMode] = useState('');
    
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Student' };
    const profileRef = useRef(null);

    const handleApplyNow = (internship) => {
        setMyApplications(prev => [...prev, { ...internship, status: 'Applied' }]);
        // Keep the details panel open to show the "Applied" status
        // Find the newly applied internship object to update the selectedInternship state
        const newlyAppliedInternship = { ...internship, status: 'Applied' };
        setMyApplications(prev => [...prev, newlyAppliedInternship]);
        setSelectedInternship(newlyAppliedInternship);
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

    const filterOptions = useMemo(() => {
        const locations = [...new Set(sampleInternships.map(i => i.location))];
        const workModes = [...new Set(sampleInternships.map(i => i.work_mode))];
        return { locations, workModes };
    }, []);

    const today = new Date();
    const internshipsToList = internships.filter(i => {
        if (activeTab === 'Available') return new Date(i.deadline) >= today && i.status === 'approved';
        if (activeTab === 'Upcoming') return new Date(i.start_date) > today && i.status === 'approved';
        if (activeTab === 'My Applications') return myApplications.some(app => app.id === i.id);
        return true;
    }).filter(i => {
        const term = searchTerm.toLowerCase();
        return (
            i.title.toLowerCase().includes(term) ||
            i.company_name.toLowerCase().includes(term) ||
            (i.must_have_skills && i.must_have_skills.some(skill => skill.toLowerCase().includes(term)))
        );
    }).filter(i => {
        return selectedLocation ? i.location === selectedLocation : true;
    }).filter(i => {
        return selectedWorkMode ? i.work_mode === selectedWorkMode : true;
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
                
                <div className="p-5 bg-white border-b flex-shrink-0 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:flex-grow">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title, company, or skill..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full md:w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        >
                            <option value="">All Locations</option>
                            {filterOptions.locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                        <select
                            value={selectedWorkMode}
                            onChange={(e) => setSelectedWorkMode(e.target.value)}
                            className="w-full md:w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        >
                            <option value="">All Work Modes</option>
                            {filterOptions.workModes.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 relative">
                    {internshipsToList.length > 0 ? (
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {internshipsToList.map(internship => {
                                const applicationDetails = myApplications.find(app => app.id === internship.id);
                                
                                return (
                                    <motion.div layout key={internship.id} onClick={() => setSelectedInternship(internship)}
                                        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer relative">
                                        
                                        {applicationDetails && activeTab === 'My Applications' && (
                                            <div
                                                title={applicationDetails.status}
                                                className={`absolute top-4 right-4 ${
                                                    applicationDetails.status === 'Rejected' ? 'text-red-500' : 'text-green-500'
                                                }`}
                                            >
                                                {applicationDetails.status === 'Rejected' ? (
                                                    <FiXCircle size={24} />
                                                ) : (
                                                    <FiCheckCircle size={24} />
                                                )}
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
                    ) : (
                         <div className="text-center py-16">
                            <h3 className="text-xl font-semibold text-gray-700">No Internships Found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}

                    <AnimatePresence>
                        {selectedInternship && (
                            <motion.div
                                variants={panelVariants} initial="hidden" animate="visible" exit="exit"
                                transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
                                className="fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl border-l z-30 flex flex-col"
                            >
                                <div className="p-5 border-b flex-shrink-0 flex items-center">
                                    <button onClick={() => setSelectedInternship(null)} className="p-2 rounded-full hover:bg-gray-100 mr-4">
                                        <FiArrowLeft size={20} />
                                    </button>
                                    <h2 className="text-xl font-bold text-gray-800">Internship Details</h2>
                                </div>

                                <div className="p-8 overflow-y-auto flex-1">
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
                                    
                                    {/* --- UPDATED: Show status ONLY on 'My Applications' tab --- */}
                                    {activeTab === 'My Applications' && (() => {
                                        const applicationDetails = myApplications.find(app => app.id === selectedInternship.id);
                                        if (!applicationDetails) return null;

                                        return applicationDetails.status === 'Rejected' ? (
                                            <RejectionInfo reason={applicationDetails.rejection_reason} quote={applicationDetails.motivational_quote} />
                                        ) : (
                                            <ApplicationStatusTracker status={applicationDetails.status} />
                                        );
                                    })()}
                                </div>

                                <div className="p-6 border-t bg-gray-50 flex-shrink-0">
                                    {/* --- UPDATED: Conditional footer logic based on activeTab --- */}
                                    {activeTab === 'Available' && (
                                        myApplications.some(app => app.id === selectedInternship.id) ? (
                                            <div className="text-center font-semibold text-green-600 p-3 bg-green-100 rounded-md flex items-center justify-center">
                                               <FiCheckCircle className="mr-2"/> Already Applied
                                            </div>
                                        ) : (
                                            <button onClick={() => handleApplyNow(selectedInternship)} className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                                                Apply Now
                                            </button>
                                        )
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