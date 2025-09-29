import React, { useState } from 'react';
// import axios from 'axios'; // Not needed for frontend demo
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiBriefcase, FiCheckCircle, FiXCircle, FiLogOut, FiShield, FiFileText, FiSearch } from 'react-icons/fi';

// --- Sample Data for Demonstration ---
const sampleData = {
    pendingCompanies: [
        { id: 'comp-01', name: 'QuantumLeap Tech', legal_entity: 'Pvt Ltd', address: '123 Cyber St, Bangalore', phone: '9876543210', email: 'hr@quantum.io', sector: 'IT', industry: 'AI/ML' },
        { id: 'comp-02', name: 'GreenScape Solutions', legal_entity: 'LLP', address: '456 Eco Park, Pune', phone: '9876543211', email: 'contact@greenscape.com', sector: 'Environmental', industry: 'Sustainability' },
        { id: 'comp-04', name: 'FinSecure Capital', legal_entity: 'Pvt Ltd', address: '789 Dalal Street, Mumbai', phone: '9123456780', email: 'careers@finsecure.com', sector: 'Finance', industry: 'FinTech' },
        { id: 'comp-05', name: 'AutoDrive Dynamics', legal_entity: 'Ltd', address: '101 Auto Hub, Chennai', phone: '9988776655', email: 'hr@autodrive.com', sector: 'Automotive', industry: 'Manufacturing' },
        { id: 'comp-06', name: 'HealWell Pharma', legal_entity: 'LLP', address: '21 Bio-Corridor, Hyderabad', phone: '9876554321', email: 'talent@healwell.co', sector: 'Healthcare', industry: 'Pharmaceuticals' },
    ],
    approvedCompanies: [
        { id: 'comp-03', name: 'Innovate Solutions Inc.', total_internships: 5, total_intake: 20 },
        { id: 'comp-07', name: 'Tech Systems Co.', total_internships: 3, total_intake: 10 },
        { id: 'comp-08', name: 'Data Insights Ltd.', total_internships: 4, total_intake: 15 },
        { id: 'comp-09', name: 'Growth Hackers', total_internships: 2, total_intake: 8 },
        { id: 'comp-10', name: 'Creative Minds Studio', total_internships: 1, total_intake: 3 },
    ],
    pendingInternships: [
        { id: 'int-01', title: 'Cloud DevOps Intern', company_name: 'Innovate Solutions Inc.', sector: 'IT', area: 'Cloud Computing', work_mode: 'Remote', intake: 5 },
        { id: 'int-02', title: 'Human Resources Intern', company_name: 'People First Corp', sector: 'HR', area: 'Recruitment', work_mode: 'Hybrid', intake: 2 },
        { id: 'int-03', title: 'UI/UX Design Intern', company_name: 'Creative Minds Studio', sector: 'Design', area: 'User Experience', work_mode: 'Remote', intake: 3 },
        { id: 'int-04', title: 'Civil Engineering Intern', company_name: 'InfraBuilders Pvt. Ltd.', sector: 'Engineering', area: 'Construction', work_mode: 'On-site', intake: 10 },
        { id: 'int-05', title: 'Marketing Analyst Intern', company_name: 'Growth Hackers', sector: 'Marketing', area: 'Data Analytics', work_mode: 'Remote', intake: 2 },
    ],
    rejectedInternships: [
        { id: 'int-06', title: 'Data Entry Operator (Part-Time)', company_name: 'QuickData Solutions', sector: 'Admin', area: 'Data Management', work_mode: 'Remote', intake: 15 },
        { id: 'int-07', title: 'Personal Assistant', company_name: 'ExecuSupport', sector: 'Admin', area: 'Support Services', work_mode: 'On-site', intake: 1 },
    ],
    companyHistory: [
        { id: 'hist-01', name: 'Data Weavers', status: 'Denied', total_internships: 0, total_intake: 0 },
        { id: 'hist-02', name: 'AdStack Digital', status: 'Denied', total_internships: 0, total_intake: 0 },
        { id: 'hist-03', name: 'Innovate Solutions Inc.', status: 'Approved', total_internships: 5, total_intake: 20 },
        { id: 'hist-04', name: 'Tech Systems Co.', status: 'Approved', total_internships: 3, total_intake: 10 },
    ],
};


const AdminDashboard = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [loginName, setLoginName] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('Pending Companies');
    const [searchTerm, setSearchTerm] = useState('');

    const [pendingCompanies, setPendingCompanies] = useState(sampleData.pendingCompanies);
    const [approvedCompanies, setApprovedCompanies] = useState(sampleData.approvedCompanies);
    const [pendingInternships, setPendingInternships] = useState(sampleData.pendingInternships);
    const [rejectedInternships, setRejectedInternships] = useState(sampleData.rejectedInternships);
    const [companyHistory, setCompanyHistory] = useState(sampleData.companyHistory);

    const navigate = useNavigate();

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
        setPendingCompanies(sampleData.pendingCompanies);
        setApprovedCompanies(sampleData.approvedCompanies);
        setPendingInternships(sampleData.pendingInternships);
    };
    
    const handleApproveCompany = (companyId) => {
        const companyToApprove = pendingCompanies.find(c => c.id === companyId);
        if (!companyToApprove) return;
        setPendingCompanies(pendingCompanies.filter(c => c.id !== companyId));
        setApprovedCompanies([...approvedCompanies, { ...companyToApprove, total_internships: 0, total_intake: 0 }]);
    };

    const handleDenyCompany = (companyId) => {
        setPendingCompanies(pendingCompanies.filter(c => c.id !== companyId));
    };

    const handleApproveInternship = (internshipId) => {
        setPendingInternships(pendingInternships.filter(i => i.id !== internshipId));
    };

    const handleDenyInternship = (internshipId) => {
        const internshipToDeny = pendingInternships.find(i => i.id === internshipId);
        if(!internshipToDeny) return;
        setPendingInternships(pendingInternships.filter(i => i.id !== internshipId));
        setRejectedInternships([...rejectedInternships, internshipToDeny]);
    };

    const term = searchTerm.toLowerCase();
    const filteredPendingCompanies = pendingCompanies.filter(c => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term));
    const filteredPendingInternships = pendingInternships.filter(i => i.title.toLowerCase().includes(term) || i.company_name.toLowerCase().includes(term));
    const filteredApprovedCompanies = approvedCompanies.filter(c => c.name.toLowerCase().includes(term));
    const filteredRejectedInternships = rejectedInternships.filter(i => i.title.toLowerCase().includes(term) || i.company_name.toLowerCase().includes(term));


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
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                </header>
                
                <div className="flex-1 p-6 overflow-y-auto">
                    {/* --- NEW: Statistics Cards --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <StatCard
                            title="Pending Companies"
                            value={pendingCompanies.length}
                            icon={<FiUsers size={22} />}
                            colorClass={{ bg: 'bg-yellow-100', text: 'text-yellow-600' }}
                        />
                        <StatCard
                            title="Pending Internships"
                            value={pendingInternships.length}
                            icon={<FiBriefcase size={22} />}
                            colorClass={{ bg: 'bg-blue-100', text: 'text-blue-600' }}
                        />
                        <StatCard
                            title="Total Approved Companies"
                            value={approvedCompanies.length}
                            icon={<FiCheckCircle size={22} />}
                            colorClass={{ bg: 'bg-green-100', text: 'text-green-600' }}
                        />
                    </div>

                    {/* --- Content section with search and tables --- */}
                    <div className="bg-white rounded-lg shadow">
                         <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">{activeTab}</h2>
                            <p className="text-sm text-gray-500">Manage and review all {activeTab.toLowerCase()}.</p>
                        </div>
                        <div className="p-4">
                            <div className="relative w-full md:w-1/2">
                                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={`Search in ${activeTab}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                                />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={activeTab} 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, y: -20 }}
                                className="px-4 pb-4"
                            >
                                {activeTab === 'Pending Companies' && (
                                    <DataTable
                                        headers={['Name', 'Email', 'Phone', 'Sector', 'Actions']}
                                        data={filteredPendingCompanies}
                                        originalDataLength={pendingCompanies.length}
                                        searchTerm={searchTerm}
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
                                        data={filteredPendingInternships}
                                        originalDataLength={pendingInternships.length}
                                        searchTerm={searchTerm}
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
                                        data={filteredApprovedCompanies}
                                        originalDataLength={approvedCompanies.length}
                                        searchTerm={searchTerm}
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
                                        data={filteredRejectedInternships}
                                        originalDataLength={rejectedInternships.length}
                                        searchTerm={searchTerm}
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
                </div>
            </main>
        </div>
    );
};

// --- NEW Helper component for displaying stats ---
const StatCard = ({ title, value, icon, colorClass }) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-sm flex items-center space-x-4 border border-gray-200">
            <div className={`p-3 rounded-full ${colorClass.bg} ${colorClass.text}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

const DataTable = ({ headers, data, renderRow, emptyMessage, originalDataLength, searchTerm }) => {
    if (originalDataLength === 0) {
        return (
            <div className="text-center text-gray-500 p-8">
                <FiFileText className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">{emptyMessage}</h3>
            </div>
        );
    }
    if (data.length === 0 && searchTerm) {
        return (
            <div className="text-center text-gray-500 p-8">
                <FiSearch className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">No Results Found</h3>
                <p className="mt-1 text-sm">Your search for "{searchTerm}" did not match any records.</p>
            </div>
        )
    }
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                    <tr>
                        {headers.map(header => <th key={header} className="p-3 font-semibold whitespace-nowrap">{header}</th>)}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            {renderRow(item)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

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