import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    if (user.user_type === 'student') {
      fetchInternships();
    } else {
      navigate('/student');
    }
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/internship/all?user_type=student');
      setInternships(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || `Failed to fetch internships: ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setInternships([]);
    setError('');
    navigate('/student');
  };

  // Categorize internships
  const today = new Date();
  const upcomingInternships = internships.filter(
    internship => internship.status === 'approved' && new Date(internship.start_date) > today
  );
  const openInternships = internships.filter(
    internship => 
      internship.status === 'approved' &&
      new Date(internship.start_date) <= today &&
      new Date(internship.deadline) >= today
  );
  const closedInternships = internships.filter(
    internship => internship.status === 'approved' && new Date(internship.deadline) < today
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <p className="text-lg mb-4">Welcome, {user.name || 'Student'}!</p>
      <button
        onClick={handleLogout}
        className="mb-4 p-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h2 className="text-xl font-semibold mb-2">Upcoming Internships</h2>
      <div className="w-full max-w-4xl mb-8">
        {upcomingInternships.length === 0 ? (
          <p>No upcoming internships</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Title</th>
                <th className="border p-2">Company</th>
                <th className="border p-2">Sector</th>
                <th className="border p-2">Area</th>
                <th className="border p-2">Work Mode</th>
                <th className="border p-2">Start Date</th>
                <th className="border p-2">Openings</th>
                <th className="border p-2">Applicants</th>
              </tr>
            </thead>
            <tbody>
              {upcomingInternships.map(internship => (
                <tr key={internship.id}>
                  <td className="border p-2">{internship.title}</td>
                  <td className="border p-2">{internship.company_name}</td>
                  <td className="border p-2">{internship.sector}</td>
                  <td className="border p-2">{internship.area}</td>
                  <td className="border p-2">{internship.work_mode}</td>
                  <td className="border p-2">{internship.start_date}</td>
                  <td className="border p-2">{internship.intake}</td>
                  <td className="border p-2">{internship.applicant_count || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">Open Internships</h2>
      <div className="w-full max-w-4xl mb-8">
        {openInternships.length === 0 ? (
          <p>No open internships</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Title</th>
                <th className="border p-2">Company</th>
                <th className="border p-2">Sector</th>
                <th className="border p-2">Area</th>
                <th className="border p-2">Work Mode</th>
                <th className="border p-2">Registration Deadline</th>
                <th className="border p-2">Openings</th>
                <th className="border p-2">Applicants</th>
              </tr>
            </thead>
            <tbody>
              {openInternships.map(internship => (
                <tr key={internship.id}>
                  <td className="border p-2">{internship.title}</td>
                  <td className="border p-2">{internship.company_name}</td>
                  <td className="border p-2">{internship.sector}</td>
                  <td className="border p-2">{internship.area}</td>
                  <td className="border p-2">{internship.work_mode}</td>
                  <td className="border p-2">{internship.deadline}</td>
                  <td className="border p-2">{internship.intake}</td>
                  <td className="border p-2">{internship.applicant_count || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">Closed Internships</h2>
      <div className="w-full max-w-4xl mb-8">
        {closedInternships.length === 0 ? (
          <p>No closed internships</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Title</th>
                <th className="border p-2">Company</th>
                <th className="border p-2">Sector</th>
                <th className="border p-2">Area</th>
                <th className="border p-2">Work Mode</th>
                <th className="border p-2">Registration Deadline</th>
                <th className="border p-2">Openings</th>
                <th className="border p-2">Applicants</th>
              </tr>
            </thead>
            <tbody>
              {closedInternships.map(internship => (
                <tr key={internship.id}>
                  <td className="border p-2">{internship.title}</td>
                  <td className="border p-2">{internship.company_name}</td>
                  <td className="border p-2">{internship.sector}</td>
                  <td className="border p-2">{internship.area}</td>
                  <td className="border p-2">{internship.work_mode}</td>
                  <td className="border p-2">{internship.deadline}</td>
                  <td className="border p-2">{internship.intake}</td>
                  <td className="border p-2">{internship.applicant_count || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;