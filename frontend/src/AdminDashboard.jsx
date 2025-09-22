import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [companies, setCompanies] = useState([]);
  const [internships, setInternships] = useState([]);

  const fetchData = async () => {
    try {
      const compResponse = await axios.get('http://127.0.0.1:5000/api/admin/companies');
      setCompanies(compResponse.data);
      const intResponse = await axios.get('http://127.0.0.1:5000/api/admin/internships');
      setInternships(intResponse.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
      alert('Failed to fetch data: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name) {
      alert('Please enter a name');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/admin/login', { name });
      setUser(response.data);
      setName('');
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleApprove = async (type, id, status) => {
    try {
      const endpoint = type === 'company' ? 'approve-company' : 'approve-internship';
      const response = await axios.post(`http://127.0.0.1:5000/api/admin/${endpoint}`, { [`${type}_id`]: id, status });
      alert(`${type} ${status}: ${response.data.message}`);
      fetchData();
    } catch (error) {
      alert(`Failed to update ${type}: ` + (error.response?.data?.error || 'Unknown error'));
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <form className="mt-4">
          <input
            type="text"
            placeholder="Admin Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 mr-2 rounded w-full max-w-md"
          />
          <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded mt-2">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <h2 className="text-xl mt-4">Companies</h2>
      <div className="mt-4 space-y-4">
        {companies.map((company) => (
          <div key={company.id} className="border p-4 rounded">
            <p>Name: {company.name}</p>
            <p>Status: {company.status}</p>
            <button
              onClick={() => handleApprove('company', company.id, 'approved')}
              className="bg-green-500 text-white p-2 mr-2 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => handleApprove('company', company.id, 'rejected')}
              className="bg-red-500 text-white p-2 rounded"
            >
              Reject
            </button>
          </div>
        ))}
      </div>
      <h2 className="text-xl mt-4">Internships</h2>
      <div className="mt-4 space-y-4">
        {internships.map((internship) => (
          <div key={internship.id} className="border p-4 rounded">
            <p>Role: {internship.role}</p>
            <p>Company ID: {internship.company_id}</p>
            <p>Status: {internship.status}</p>
            <button
              onClick={() => handleApprove('internship', internship.id, 'approved')}
              className="bg-green-500 text-white p-2 mr-2 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => handleApprove('internship', internship.id, 'rejected')}
              className="bg-red-500 text-white p-2 rounded"
            >
              Reject
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;