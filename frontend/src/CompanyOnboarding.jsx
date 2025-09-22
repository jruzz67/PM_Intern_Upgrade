import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

function CompanyOnboarding() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [internships, setInternships] = useState([]);
  const [role, setRole] = useState('');
  const [sector, setSector] = useState(null);
  const [description, setDescription] = useState('');
  const [locations, setLocations] = useState([]);
  const [skills, setSkills] = useState('');
  const [certifications, setCertifications] = useState('');
  const [plugin, setPlugin] = useState(null);
  const [deadline, setDeadline] = useState('');
  const navigate = useNavigate();

  // Dropdown options
  const sectorOptions = [
    { value: 'IT', label: 'Information Technology' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Engineering', label: 'Engineering' }
  ];

  const locationOptions = [
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Chennai', label: 'Chennai' }
  ];

  const pluginOptions = [
    { value: 'github', label: 'GitHub' },
    { value: 'pdf', label: 'PDF' },
    { value: 'leetcode', label: 'LeetCode' }
  ];

  const fetchInternships = async () => {
    if (!user) return;
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/company/internships', {
        params: { company_id: user.id }
      });
      setInternships(response.data);
    } catch (error) {
      console.error('Failed to fetch internships', error);
      alert('Failed to fetch internships: ' + error.response?.data?.error || 'Unknown error');
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/company/login', { name });
      setUser(response.data);
    } catch (error) {
      alert('Login failed: ' + error.response?.data?.error || 'Unknown error');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/company/register', { name });
      setUser(response.data);
    } catch (error) {
      alert('Signup failed: ' + error.response?.data?.error || 'Unknown error');
    }
  };

  const handlePostInternship = async (e) => {
    e.preventDefault();
    if (!sector || locations.length === 0 || !plugin) {
      alert('Please select a sector, at least one location, and a plugin');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/company/post', {
        company_id: user.id,
        role,
        sector: sector.value,
        description,
        locations: locations.map(loc => loc.value),
        must_required_skills: skills.split(',').map(s => s.trim()).filter(s => s),
        appreciated_certifications: certifications.split(',').map(c => {
          const [provider, title] = c.split(':').map(s => s.trim());
          return { provider, title, priority: 1 };
        }).filter(c => c.provider && c.title),
        plugin: { name: plugin.value, priority: 1 },
        registration_end: deadline
      });
      alert('Internship posted: ' + response.data.id);
      fetchInternships();
      // Reset form
      setRole('');
      setSector(null);
      setDescription('');
      setLocations([]);
      setSkills('');
      setCertifications('');
      setPlugin(null);
      setDeadline('');
    } catch (error) {
      alert('Failed to post internship: ' + error.response?.data?.error || 'Unknown error');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Company Login/Signup</h1>
        <form className="mt-4">
          <input
            type="text"
            placeholder="Company Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 mr-2 rounded w-full max-w-md"
          />
          <div className="mt-2">
            <button onClick={handleLogin} className="bg-blue-500 text-white p-2 mr-2 rounded">Login</button>
            <button onClick={handleSignup} className="bg-green-500 text-white p-2 rounded">Signup</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Company Dashboard</h1>
      <h2 className="text-xl mt-4">Post New Internship</h2>
      <form className="mt-4" onSubmit={handlePostInternship}>
        <input
          type="text"
          placeholder="Role (e.g., AI Intern)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
        />
        <Select
          options={sectorOptions}
          value={sector}
          onChange={setSector}
          placeholder="Select Sector"
          className="mb-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
        />
        <Select
          isMulti
          options={locationOptions}
          value={locations}
          onChange={setLocations}
          placeholder="Select Locations"
          className="mb-2"
        />
        <input
          type="text"
          placeholder="Required Skills (comma-separated, e.g., Python, Machine Learning)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Certifications (provider:title, comma-separated, e.g., AWS:Cloud Practitioner)"
          value={certifications}
          onChange={(e) => setCertifications(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
        />
        <Select
          options={pluginOptions}
          value={plugin}
          onChange={setPlugin}
          placeholder="Select Plugin"
          className="mb-2"
        />
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Post Internship</button>
      </form>
      <h2 className="text-xl mt-4">Your Internships</h2>
      <div className="mt-4">
        {internships.map((internship) => (
          <div key={internship.id} className="border p-4 mb-2 rounded">
            <h3 className="font-bold">{internship.role}</h3>
            <p>Sector: {internship.sector}</p>
            <p>Description: {internship.description}</p>
            <p>Locations: {internship.locations.join(', ')}</p>
            <p>Skills: {internship.must_required_skills.join(', ')}</p>
            <p>Certifications: {internship.appreciated_certifications.map(c => c.title).join(', ')}</p>
            <p>Plugin: {internship.plugin.name}</p>
            <p>Deadline: {internship.registration_end}</p>
            <p>Status: {internship.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompanyOnboarding;