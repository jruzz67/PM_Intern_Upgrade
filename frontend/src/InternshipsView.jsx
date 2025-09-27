import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InternshipsView = () => {
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    if (user.user_type !== 'student') {
      navigate('/student');
    }
    const fetchInternships = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/internship/all?user_type=student');
        setInternships(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch internships');
      }
    };
    fetchInternships();
  }, [navigate, user.user_type]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Available Internships</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="w-full max-w-4xl">
        {internships.length === 0 ? (
          <p>No internships available</p>
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
                <th className="border p-2">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {internships.map(internship => (
                <tr key={internship.id}>
                  <td className="border p-2">{internship.title}</td>
                  <td className="border p-2">{internship.company_name}</td>
                  <td className="border p-2">{internship.sector}</td>
                  <td className="border p-2">{internship.area}</td>
                  <td className="border p-2">{internship.work_mode}</td>
                  <td className="border p-2">{internship.intake}</td>
                  <td className="border p-2">{new Date(internship.deadline).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InternshipsView;