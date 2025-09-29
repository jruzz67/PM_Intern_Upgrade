import React, { useState } from 'react';
// import axios from 'axios'; // Not needed for frontend demo
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiBriefcase, FiCheckCircle, FiXCircle, FiLogOut, FiShield, FiFileText } from 'react-icons/fi';

// --- NEW: Sample Data for Demonstration ---
const sampleData = {
    pendingCompanies: [
        { id: 'comp-01', name: 'QuantumLeap Tech', legal_entity: 'Pvt Ltd', address: '123 Cyber St, Bangalore', phone: '9876543210', email: 'hr@quantum.io', sector: 'IT', industry: 'AI/ML' },
        { id: 'comp-02', name: 'GreenScape Solutions', legal_entity: 'LLP', address: '456 Eco Park, Pune', phone: '9876543211', email: 'contact@greenscape.com', sector: 'Environmental', industry: 'Sustainability' },
    ],
    approvedCompanies: [
        { id: 'comp-03', name: 'Innovate Solutions Inc.', total_internships: 5, total_intake: 20 },
    ],
    pendingInternships: [
        { id: 'int-01', title: 'Cloud DevOps Intern', company_name: 'Innovate Solutions Inc.', sector: 'IT', area: 'Cloud Computing', work_mode: 'Remote', intake: 5 },
    ],
    rejectedInternships: [],
    companyHistory: [
        { id: 'hist-01', name: 'Data Weavers', status: 'Denied', total_internships: 0, total_intake: 0 }
    ],
};


const AdminDashboard = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [loginName, setLoginName] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('Pending Companies');

    // --- State initialized with sample data ---
    const [pendingCompanies, setPendingCompanies] = useState(sampleData.pendingCompanies);
    const [approvedCompanies, setApprovedCompanies] = useState(sampleData.approvedCompanies);
    const [pendingInternships, setPendingInternships] = useState(sampleData.pendingInternships);
    const [rejectedInternships, setRejectedInternships] = useState(sampleData.rejectedInternships);
    const [companyHistory, setCompanyHistory] = useState(sampleData.companyHistory);

    const navigate = useNavigate();

    // --- OLD: useEffect and fetchData are commented out ---
    /*
    const user = JSON.parse(localStorage.getItem('user')) || {};
    useEffect(() => {
        if (user.user_type === 'admin') {
            setIsSignedIn(true);
            fetchData();
        }
    }, []);
    const fetchData = async () => { ... };
    */

    // --- UPDATED: Frontend-only functions ---

    const handleSignIn = (e) => {
        e.preventDefault();
        if (loginName) {
            setIsSignedIn(true);
            setError('');
        } else {
            setError('Please enter a name.');
        }
    };

    const handleLogout = () => {
        setIsSignedIn(false);
        setLoginName('');
        // Reset to initial sample data on logout for a clean demo
        setPendingCompanies(sampleData.pendingCompanies);
        setApprovedCompanies(sampleData.approvedCompanies);
        setPendingInternships(sampleData.pendingInternships);
        // navigate('/admin');
    };
    
    const handleApproveCompany = (companyId) => {
        const companyToApprove = pendingCompanies.find(c => c.id === companyId);
        if (!companyToApprove) return;

        setPendingCompanies(pendingCompanies.filter(c => c.id !== companyId));
        setApprovedCompanies([...approvedCompanies, { ...companyToApprove, total_internships: 0, total_intake: 0 }]);
    };

    const handleDenyCompany = (companyId) => {
        setPendingCompanies(pendingCompanies.filter(c => c.id !== companyId));
        // Optionally add to a 'denied' history list here
    };

    const handleApproveInternship = (internshipId) => {
        setPendingInternships(pendingInternships.filter(i => i.id !== internshipId));
        // Optionally move to an 'approved' internships list
    };

    const handleDenyInternship = (internshipId) => {
        const internshipToDeny = pendingInternships.find(i => i.id === internshipId);
        if(!internshipToDeny) return;

        setPendingInternships(pendingInternships.filter(i => i.id !== internshipId));
        setRejectedInternships([...rejectedInternships, internshipToDeny]);
    };


    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Admin Portal</h1>
                    <p className="text-gray-500 mb-6 text-center">Sign in to manage the platform.</p>
                    {error && <p className="text-red-500 mb-4 text-center text-sm">{error}</p>}
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Admin Name"
                            value={loginName}
                            onChange={(e) => setLoginName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            required
                        />
                        <button type="submit" className="w-full p-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                            Sign In
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className="w-72 bg-gray-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-gray-700 flex items-center gap-3"><FiShield /> Admin Portal</div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {['Pending Companies', 'Pending Internships', 'Approved Companies', 'Rejected Internships'].map(tab => (
                         <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center px-4 py-2.5 rounded-md text-left transition-colors ${activeTab === tab ? 'bg-orange-500' : 'hover:bg-gray-700'}`}>
                            {tab.includes('Companies') && <FiUsers className="mr-3" />}
                            {tab.includes('Internships') && <FiBriefcase className="mr-3" />}
                            {tab}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                        <FiLogOut className="mr-3" /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-6 bg-white border-b">
                    <h1 className="text-2xl font-bold text-gray-800">{activeTab}</h1>
                </header>

                <div className="flex-1 p-6 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab} 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -20 }}
                        >
                           {/* Render content based on active tab */}
                            {activeTab === 'Pending Companies' && (
                                <DataTable
                                    headers={['Name', 'Email', 'Phone', 'Sector', 'Actions']}
                                    data={pendingCompanies}
                                    renderRow={(company) => (
                                        <>
                                            <td className="p-3 font-medium text-gray-800">{company.name}</td>
                                            <td className="p-3">{company.email}</td>
                                            <td className="p-3">{company.phone}</td>
                                            <td className="p-3">{company.sector}</td>
                                            <td className="p-3 space-x-2">
                                                <ActionButton icon={<FiCheckCircle />} onClick={() => handleApproveCompany(company.id)} variant="approve" />
                                                <ActionButton icon={<FiXCircle />} onClick={() => handleDenyCompany(company.id)} variant="deny" />
                                            </td>
                                        </>
                                    )}
                                    emptyMessage="No pending companies for approval."
                                />
                            )}
                             {activeTab === 'Pending Internships' && (
                                <DataTable
                                    headers={['Title', 'Company', 'Work Mode', 'Intake', 'Actions']}
                                    data={pendingInternships}
                                    renderRow={(internship) => (
                                        <>
                                            <td className="p-3 font-medium text-gray-800">{internship.title}</td>
                                            <td className="p-3">{internship.company_name}</td>
                                            <td className="p-3">{internship.work_mode}</td>
                                            <td className="p-3">{internship.intake}</td>
                                            <td className="p-3 space-x-2">
                                                <ActionButton icon={<FiCheckCircle />} onClick={() => handleApproveInternship(internship.id)} variant="approve" />
                                                <ActionButton icon={<FiXCircle />} onClick={() => handleDenyInternship(internship.id)} variant="deny" />
                                            </td>
                                        </>
                                    )}
                                    emptyMessage="No pending internships for approval."
                                />
                            )}
                             {activeTab === 'Approved Companies' && (
                                <DataTable
                                    headers={['Name', 'Total Internships', 'Total Intake']}
                                    data={approvedCompanies}
                                    renderRow={(company) => (
                                        <>
                                            <td className="p-3 font-medium text-gray-800">{company.name}</td>
                                            <td className="p-3">{company.total_internships}</td>
                                            <td className="p-3">{company.total_intake}</td>
                                        </>
                                    )}
                                    emptyMessage="No companies have been approved yet."
                                />
                            )}
                             {activeTab === 'Rejected Internships' && (
                                <DataTable
                                    headers={['Title', 'Company', 'Sector']}
                                    data={rejectedInternships}
                                    renderRow={(internship) => (
                                        <>
                                            <td className="p-3 font-medium text-gray-800">{internship.title}</td>
                                            <td className="p-3">{internship.company_name}</td>
                                            <td className="p-3">{internship.sector}</td>
                                        </>
                                    )}
                                    emptyMessage="No internships have been rejected."
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

// Helper component for rendering tables consistently
const DataTable = ({ headers, data, renderRow, emptyMessage }) => {
    if (data.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-12 p-8 bg-white rounded-lg shadow">
                <FiFileText className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">{emptyMessage}</h3>
            </div>
        );
    }
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                    <tr>
                        {headers.map(header => <th key={header} className="p-3 font-semibold">{header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                            {renderRow(item)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Helper component for action buttons
const ActionButton = ({ icon, onClick, variant }) => {
    const styles = {
        approve: 'bg-green-100 text-green-700 hover:bg-green-200',
        deny: 'bg-red-100 text-red-700 hover:bg-red-200'
    }
    return (
        <button onClick={onClick} className={`p-2 rounded-md transition-colors ${styles[variant]}`}>
            {icon}
        </button>
    );
}

export default AdminDashboard;