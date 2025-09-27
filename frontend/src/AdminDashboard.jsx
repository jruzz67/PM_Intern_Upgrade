import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [approvedCompanies, setApprovedCompanies] = useState([]);
  const [pendingInternships, setPendingInternships] = useState([]);
  const [rejectedInternships, setRejectedInternships] = useState([]);
  const [companyHistory, setCompanyHistory] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    if (user.user_type === 'admin') {
      setIsSignedIn(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [pendingResponse, approvedResponse, internshipsResponse, historyResponse] = await Promise.all([
        axios.get('http://127.0.0.1:5000/api/admin/companies/pending'),
        axios.get('http://127.0.0.1:5000/api/admin/companies/approved'),
        axios.get('http://127.0.0.1:5000/api/internship/all?user_type=admin'),
        axios.get('http://127.0.0.1:5000/api/admin/companies/history'),
      ]);
      setPendingCompanies(pendingResponse.data);
      setApprovedCompanies(approvedResponse.data);
      setPendingInternships(internshipsResponse.data.filter(i => i.status === 'pending'));
      setRejectedInternships(internshipsResponse.data.filter(i => i.status === 'rejected'));
      setCompanyHistory(historyResponse.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || `Failed to fetch data: ${err.message}`);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/admin/login', { name: loginName });
      localStorage.setItem('user', JSON.stringify({ id: response.data.id, user_type: 'admin', name: loginName }));
      setIsSignedIn(true);
      setError('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || `Login failed: ${err.message}`);
    }
  };

  const handleApproveCompany = async (companyId) => {
    try {
      await axios.post(`http://127.0.0.1:5000/api/admin/company/approve/${companyId}`, {}, {
        headers: { 'Admin-ID': user.id }
      });
      setPendingCompanies(pendingCompanies.filter(company => company.id !== companyId));
      const approvedResponse = await axios.get('http://127.0.0.1:5000/api/admin/companies/approved');
      setApprovedCompanies(approvedResponse.data);
      const historyResponse = await axios.get('http://127.0.0.1:5000/api/admin/companies/history');
      setCompanyHistory(historyResponse.data);
      setError('Company approved');
    } catch (err) {
      setError(err.response?.data?.error || `Failed to approve company: ${err.response?.status} - ${err.message}`);
    }
  };

  const handleDenyCompany = async (companyId) => {
    try {
      await axios.post(`http://127.0.0.1:5000/api/admin/company/deny/${companyId}`, {}, {
        headers: { 'Admin-ID': user.id }
      });
      setPendingCompanies(pendingCompanies.filter(company => company.id !== companyId));
      const historyResponse = await axios.get('http://127.0.0.1:5000/api/admin/companies/history');
      setCompanyHistory(historyResponse.data);
      setError('Company denied');
    } catch (err) {
      setError(err.response?.data?.error || `Failed to deny company: ${err.response?.status} - ${err.message}`);
    }
  };

  const handleApproveInternship = async (internshipId) => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/api/internship/admin/internship/approve/${internshipId}`, {}, {
        headers: { 'Admin-ID': user.id }
      });
      setPendingInternships(pendingInternships.filter(internship => internship.id !== internshipId));
      setError(response.data.message || 'Internship approved');
    } catch (err) {
      setError(err.response?.data?.error || `Failed to approve internship: ${err.response?.status} - ${err.message}`);
    }
  };

  const handleDenyInternship = async (internshipId) => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/api/internship/admin/internship/deny/${internshipId}`, {}, {
        headers: { 'Admin-ID': user.id }
      });
      setPendingInternships(pendingInternships.filter(internship => internship.id !== internshipId));
      setRejectedInternships([...rejectedInternships, ...(await axios.get('http://127.0.0.1:5000/api/internship/all?user_type=admin')).data.filter(i => i.id === internshipId)]);
      setError(response.data.message || 'Internship rejected');
    } catch (err) {
      setError(err.response?.data?.error || `Failed to deny internship: ${err.response?.status} - ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsSignedIn(false);
    setLoginName('');
    setPendingCompanies([]);
    setApprovedCompanies([]);
    setPendingInternships([]);
    setRejectedInternships([]);
    setCompanyHistory([]);
    setError('');
    navigate('/admin');
  };

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Admin Signin</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSignIn} className="w-full max-w-md bg-white p-6 rounded shadow">
          <input
            type="text"
            placeholder="Admin Name"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Sign In</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <button
        onClick={handleLogout}
        className="mb-4 p-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
      {error && <p className={error.includes('approved') || error.includes('rejected') ? 'text-green-500 mb-4' : 'text-red-500 mb-4'}>{error}</p>}

      <h2 className="text-xl font-semibold mb-2">Pending Companies</h2>
      <div className="w-full max-w-4xl mb-8">
        {pendingCompanies.length === 0 ? (
          <p>No pending companies</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Legal Entity</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Sector</th>
                <th className="border p-2">Industry</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingCompanies.map(company => (
                <tr key={company.id}>
                  <td className="border p-2">{company.name}</td>
                  <td className="border p-2">{company.legal_entity}</td>
                  <td className="border p-2">{company.address}</td>
                  <td className="border p-2">{company.phone}</td>
                  <td className="border p-2">{company.email}</td>
                  <td className="border p-2">{company.sector}</td>
                  <td className="border p-2">{company.industry}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleApproveCompany(company.id)}
                      className="mr-2 p-1 bg-green-500 text-white rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDenyCompany(company.id)}
                      className="p-1 bg-red-500 text-white rounded"
                    >
                      Deny
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">Approved Companies</h2>
      <div className="w-full max-w-4xl mb-8">
        {approvedCompanies.length === 0 ? (
          <p>No approved companies</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Total Internships Posted</th>
                <th className="border p-2">Total Intake</th>
              </tr>
            </thead>
            <tbody>
              {approvedCompanies.map(company => (
                <tr key={company.id}>
                  <td className="border p-2">{company.name}</td>
                  <td className="border p-2">{company.total_internships}</td>
                  <td className="border p-2">{company.total_intake}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">Pending Internships</h2>
      <div className="w-full max-w-4xl mb-8">
        {pendingInternships.length === 0 ? (
          <p>No pending internships</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Title</th>
                <th className="border p-2">Company</th>
                <th className="border p-2">Sector</th>
                <th className="border p-2">Area</th>
                <th className="border p-2">Work Mode</th>
                <th className="border p-2">Intake</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingInternships.map(internship => (
                <tr key={internship.id}>
                  <td className="border p-2">{internship.title}</td>
                  <td className="border p-2">{internship.company_name}</td>
                  <td className="border p-2">{internship.sector}</td>
                  <td className="border p-2">{internship.area}</td>
                  <td className="border p-2">{internship.work_mode}</td>
                  <td className="border p-2">{internship.intake}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleApproveInternship(internship.id)}
                      className="mr-2 p-1 bg-green-500 text-white rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDenyInternship(internship.id)}
                      className="p-1 bg-red-500 text-white rounded"
                    >
                      Deny
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">Rejected Internships</h2>
      <div className="w-full max-w-4xl mb-8">
        {rejectedInternships.length === 0 ? (
          <p>No rejected internships</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Title</th>
                <th className="border p-2">Company</th>
                <th className="border p-2">Sector</th>
                <th className="border p-2">Area</th>
                <th className="border p-2">Work Mode</th>
                <th className="border p-2">Intake</th>
              </tr>
            </thead>
            <tbody>
              {rejectedInternships.map(internship => (
                <tr key={internship.id}>
                  <td className="border p-2">{internship.title}</td>
                  <td className="border p-2">{internship.company_name}</td>
                  <td className="border p-2">{internship.sector}</td>
                  <td className="border p-2">{internship.area}</td>
                  <td className="border p-2">{internship.work_mode}</td>
                  <td className="border p-2">{internship.intake}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">Company History</h2>
      <div className="w-full max-w-4xl">
        {companyHistory.length === 0 ? (
          <p>No company history</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Total Internships</th>
                <th className="border p-2">Total Intake</th>
              </tr>
            </thead>
            <tbody>
              {companyHistory.map(company => (
                <tr key={company.id}>
                  <td className="border p-2">{company.name}</td>
                  <td className="border p-2">{company.status}</td>
                  <td className="border p-2">{company.total_internships}</td>
                  <td className="border p-2">{company.total_intake}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;