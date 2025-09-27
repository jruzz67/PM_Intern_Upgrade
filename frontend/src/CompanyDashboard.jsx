import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState('');

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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/company');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Company Dashboard</h1>
      <p className="text-lg mb-4">Welcome, {user.name || 'Company'}!</p>
      <button
        onClick={() => navigate('/company/internship/create')}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Create Internship
      </button>
      <button
        onClick={handleLogout}
        className="mb-4 p-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h2 className="text-xl font-semibold mb-2">Posted Internships</h2>
      <div className="w-full max-w-4xl">
        {internships.length === 0 ? (
          <p>No internships posted</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Title</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {internships.map(internship => (
                <tr key={internship.id}>
                  <td className="border p-2">{internship.title}</td>
                  <td className="border p-2">{internship.status}</td>
                  <td className="border p-2">{new Date(internship.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;