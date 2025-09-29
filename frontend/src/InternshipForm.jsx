import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiType, FiTag, FiBriefcase, FiFileText, FiList, FiHash, FiAlertTriangle,
    FiUsers, FiCalendar, FiClock, FiCpu, FiPlusCircle, FiArrowRight,
    FiGrid, FiPlusSquare, FiLogOut, FiSend
} from 'react-icons/fi';
import { FaLightbulb } from 'react-icons/fa';


// --- Reusable Components ---

const FormField = React.memo(({ icon, label, name, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span>
            <input id={name} name={name} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" {...props} />
        </div>
    </div>
));

const FormTextarea = React.memo(({ icon, label, name, ...props }) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <span className="absolute top-3 left-0 flex items-center pl-3 text-gray-400">{icon}</span>
            <textarea id={name} name={name} rows="5" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" {...props}></textarea>
        </div>
    </div>
));

const FormSelect = React.memo(({ icon, label, name, children, ...props }) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span>
            <select id={name} name={name} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none" {...props}>
                {children}
            </select>
        </div>
    </div>
));

const CompanySidebar = () => {
    const navigate = useNavigate();
    const handleLogout = () => navigate('/');

    return (
        <aside className="w-64 bg-gray-900 text-white flex-col hidden md:flex">
            <div className="p-6 text-2xl font-bold border-b border-gray-700">Company Portal</div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <button onClick={() => navigate('/company/dashboard')} className="w-full flex items-center px-4 py-2 rounded-md text-left hover:bg-gray-700 transition-colors">
                    <FiGrid className="mr-3" /> Dashboard
                </button>
                <button className="w-full flex items-center px-4 py-2 rounded-md text-left bg-orange-500">
                    <FiPlusSquare className="mr-3" /> Create Internship
                </button>
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                    <FiLogOut className="mr-3" /> Logout
                </button>
            </div>
        </aside>
    );
};


const InternshipForm = () => {
    const [formData, setFormData] = useState({
        title: '', sector: '', area: '', description: '', skills: '',
        keywords: '', special_requirements: '', work_mode: '', intake: '',
        start_date: '', deadline: '', plugin: 'none'
    });
    const [aiPrompt, setAiPrompt] = useState('');
    const [suggestions, setSuggestions] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = { name: 'Innovate Solutions Inc.', user_type: 'company', id: 'comp-123' }; // Mock user

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGetSuggestions = async () => {
        if (!formData.title || !formData.sector || !formData.area || !formData.description) {
            setError('Please fill Title, Sector, Area, and Description for AI suggestions.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            // Mock API call for frontend demo
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockSuggestions = {
                skills: ["React", "JavaScript (ES6+)", "HTML5 & CSS3", "State Management (Redux/Context)", "Git"],
                keywords: ["Frontend", "UI Development", "Web Application", "React.js"],
                special_requirements: ["Portfolio showcasing React projects", "Familiarity with RESTful APIs"],
                description: "Updated description with more details about team collaboration and project impact."
            };
            setSuggestions(mockSuggestions);
        } catch (err) {
            setError('Failed to fetch AI suggestions.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSuggestion = (field, value) => {
        if (field === 'description') {
             setFormData(prev => ({ ...prev, description: value }));
        } else {
             setFormData(prev => ({ ...prev, [field]: prev[field] ? `${prev[field]}, ${value}` : value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Backend logic is unchanged and would be here in a real app
        setError('Internship created successfully! Redirecting to dashboard...');
        setTimeout(() => navigate('/company/dashboard'), 2000);
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <CompanySidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-6 bg-white border-b">
                    <h1 className="text-2xl font-bold text-gray-800">Create a New Internship</h1>
                </header>

                <div className="flex-1 p-6 overflow-y-auto">
                    {error && <p className={`mb-4 p-3 rounded-lg text-sm ${error.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{error}</p>}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Form Section */}
                        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
                            {/* Section 1: Core Details */}
                            <div className="p-6 bg-white rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Core Details</h2>
                                <div className="space-y-4">
                                    <FormField icon={<FiType />} label="Internship Title" name="title" placeholder="e.g., Frontend Developer Intern" value={formData.title} onChange={handleInputChange} required />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField icon={<FiTag />} label="Sector" name="sector" placeholder="e.g., Information Technology" value={formData.sector} onChange={handleInputChange} required />
                                        <FormField icon={<FiBriefcase />} label="Area" name="area" placeholder="e.g., Web Development" value={formData.area} onChange={handleInputChange} required />
                                    </div>
                                </div>
                            </div>
                            
                             {/* Section 2: Description & Skills */}
                            <div className="p-6 bg-white rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Description & Skills</h2>
                                <div className="space-y-4">
                                    <FormTextarea icon={<FiFileText />} label="Role Description" name="description" placeholder="Describe the roles and responsibilities..." value={formData.description} onChange={handleInputChange} required />
                                    <FormField icon={<FiList />} label="Skills" name="skills" placeholder="Comma-separated, e.g., Python, SQL" value={formData.skills} onChange={handleInputChange} />
                                    <FormField icon={<FiHash />} label="Keywords" name="keywords" placeholder="Comma-separated, e.g., data, analytics" value={formData.keywords} onChange={handleInputChange} />
                                    <FormField icon={<FiAlertTriangle />} label="Special Requirements" name="special_requirements" placeholder="e.g., Own device required" value={formData.special_requirements} onChange={handleInputChange} />
                                </div>
                            </div>

                             {/* Section 3: Logistics */}
                            <div className="p-6 bg-white rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Logistics</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <FormSelect icon={<FiBriefcase />} label="Work Mode" name="work_mode" value={formData.work_mode} onChange={handleInputChange} required>
                                        <option value="">Select Work Mode</option>
                                        <option value="On-site">On-site</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </FormSelect>
                                    <FormField icon={<FiUsers />} label="Number of Positions" name="intake" type="number" placeholder="e.g., 5" value={formData.intake} onChange={handleInputChange} required />
                                    <FormField icon={<FiCalendar />} label="Start Date" name="start_date" type="date" value={formData.start_date} onChange={handleInputChange} required />
                                    <FormField icon={<FiClock />} label="Application Deadline" name="deadline" type="date" value={formData.deadline} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <button type="submit" className="w-full flex items-center justify-center p-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                                <FiSend className="mr-2" /> Submit Internship
                            </button>
                        </form>

                        {/* AI Assistant Section */}
                        <div className="lg:col-span-2">
                             <div className="sticky top-6 p-6 bg-white rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><FaLightbulb className="text-yellow-400" /> AI Assistant</h2>
                                <p className="text-sm text-gray-500 mt-1 mb-4">Fill the core details and description, then let AI suggest skills, keywords, and more.</p>
                                <FormTextarea icon={<FiCpu />} label="Optional AI Prompt" name="ai_prompt" placeholder="e.g., 'Emphasize collaboration skills'" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} rows="2" />
                                <button type="button" onClick={handleGetSuggestions} disabled={isLoading} className="w-full mt-3 flex items-center justify-center p-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-400">
                                    {isLoading ? 'Generating...' : 'Get Suggestions'} <FiArrowRight className="ml-2" />
                                </button>
                                
                                <AnimatePresence>
                                {suggestions && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 border-t pt-4 space-y-4">
                                        {['skills', 'keywords', 'special_requirements'].map(field => (
                                             suggestions[field] && Array.isArray(suggestions[field]) && <div key={field}>
                                                <h3 className="font-semibold capitalize text-gray-700">{field.replace('_', ' ')}</h3>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {suggestions[field].map((item, index) => (
                                                        <button key={index} type="button" onClick={() => handleAddSuggestion(field, item)} className="flex items-center gap-1.5 text-xs bg-gray-100 hover:bg-green-100 hover:text-green-800 text-gray-700 px-2 py-1 rounded-full transition-colors">
                                                            <FiPlusCircle /> {item}
                                                        </button>
                                                    ))}
                                                </div>
                                             </div>
                                        ))}
                                    </motion.div>
                                )}
                                </AnimatePresence>
                             </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InternshipForm;