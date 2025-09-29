import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Not needed for frontend demo
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiPlusSquare, FiLogOut, FiBriefcase, FiAlertOctagon, FiCheckCircle } from 'react-icons/fi';

// --- NEW: Sample data for frontend demonstration ---
const sampleInternships = [
  { id: '1', title: 'Frontend Developer Intern (React)', status: 'approved', created_at: '2025-09-20T10:00:00Z', applicants: 12 },
  { id: '2', title: 'Backend Engineering Intern (Node.js)', status: 'pending', created_at: '2025-09-22T14:30:00Z', applicants: 5 },
  { id: '3', title: 'Data Analytics Intern', status: 'rejected', created_at: '2025-09-15T11:00:00Z', applicants: 25 },
  { id: '4', title: 'UI/UX Design Intern', status: 'approved', created_at: '2025-09-18T09:00:00Z', applicants: 8 },
];

// Helper component for status badges
const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5";
    const styles = {
        approved: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        rejected: 'bg-red-100 text-red-800',
    };
    const icon = {
        approved: <FiCheckCircle />,
        pending: <FiBriefcase />,
        rejected: <FiAlertOctagon />,
    }
    return (
        <span className={`${baseClasses} ${styles[status]}`}>
            {icon[status]}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const CompanyDashboard = () => {
    const navigate = useNavigate();

    // --- NEW: Mock user for frontend demonstration ---
    const user = { name: 'Innovate Solutions Inc.', user_type: 'company', id: 'comp-123' };
    
    // --- OLD: Real user from localStorage is commented out ---
    // const user = JSON.parse(localStorage.getItem('user')) || {};

    // --- NEW: State is initialized with sample data ---
    const [internships, setInternships] = useState(sampleInternships);
    const [error, setError] = useState('');

    // --- OLD: useEffect hook is commented out to remove restrictions and backend calls ---
    /*
    useEffect(() => {
        if (user.user_type !== 'company') {
            navigate('/company');
        }
        const fetchInternships = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/internship/company/${user.id}`);
                setInternships(response.data);
                setError('');
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch internships');
            }
        };
        if (user.id) {
            fetchInternships();
        }
    }, [navigate, user.id, user.user_type]);
    */

    const handleLogout = () => {
        // localStorage.removeItem('user'); // In a real app
        navigate('/');
    };

    const listVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-gray-700">Company Portal</div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <button className="w-full flex items-center px-4 py-2 rounded-md text-left bg-orange-500">
                        <FiGrid className="mr-3" /> Dashboard
                    </button>
                    <button onClick={() => navigate('/company/internship/create')} className="w-full flex items-center px-4 py-2 rounded-md text-left hover:bg-gray-700 transition-colors">
                        <FiPlusSquare className="mr-3" /> Create Internship
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                        <FiLogOut className="mr-3" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-6 bg-white border-b">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name || 'Company'}!</h1>
                </header>

                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700">Your Posted Internships ({internships.length})</h2>
                        <button onClick={() => navigate('/company/internship/create')} className="bg-orange-500 text-white font-semibold flex items-center gap-2 px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                            <FiPlusSquare /> Create New
                        </button>
                    </div>

                    {error && <p className="text-red-500 mb-4 bg-red-100 p-3 rounded-md">{error}</p>}
                    
                    {internships.length === 0 ? (
                        <div className="text-center text-gray-500 mt-12">
                            <FiBriefcase className="mx-auto h-16 w-16 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium">No internships posted yet</h3>
                            <p className="mt-1 text-sm">Click "Create New" to post your first internship opportunity.</p>
                        </div>
                    ) : (
                        <motion.div variants={listVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {internships.map(internship => (
                                <motion.div key={internship.id} variants={itemVariants} className="bg-white rounded-lg shadow-md p-5 border-l-4 border-orange-500 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-bold text-gray-800">{internship.title}</h3>
                                            <StatusBadge status={internship.status} />
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Posted on: {new Date(internship.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <p className="text-sm font-semibold text-gray-700">{internship.applicants} Applicants</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CompanyDashboard;