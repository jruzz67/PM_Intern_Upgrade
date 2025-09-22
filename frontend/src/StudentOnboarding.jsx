import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone';

function StudentOnboarding() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [institution, setInstitution] = useState('');
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [resume, setResume] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [certificateData, setCertificateData] = useState([]);
  const [pluginData, setPluginData] = useState('');
  const navigate = useNavigate();

  const fetchInternships = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/student/internships', {
        params: { domain, search }
      });
      setInternships(response.data);
    } catch (error) {
      console.error('Failed to fetch internships', error);
      alert('Failed to fetch internships: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [domain, search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name) {
      alert('Please enter a name');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/student/login', { name });
      setUser(response.data);
      setName('');
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !age || !cgpa || !institution) {
      alert('Please fill all fields');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('age', age);
      formData.append('cgpa', cgpa);
      formData.append('institution_name', institution);
      const response = await axios.post('http://127.0.0.1:5000/api/student/register', formData);
      setUser(response.data);
      setName('');
      setAge('');
      setCgpa('');
      setInstitution('');
    } catch (error) {
      alert('Signup failed: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleApply = async (internshipId) => {
    if (!user) return alert('Please log in first');
    if (!resume || certificates.length === 0 || certificateData.length === 0 || !pluginData) {
      alert('Please upload a resume, at least one certificate, and provide a GitHub URL');
      return;
    }
    const formData = new FormData();
    formData.append('student_id', user.id);
    formData.append('internship_id', internshipId);
    formData.append('resume', resume);
    certificates.forEach((cert) => {
      formData.append('certificates', cert);
    });
    formData.append('certificate_data', JSON.stringify(certificateData));
    formData.append('plugin_data', JSON.stringify({ github: pluginData }));
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/student/apply', formData);
      alert('Application submitted! Score: ' + JSON.stringify(response.data.score));
      setResume(null);
      setCertificates([]);
      setCertificateData([]);
      setPluginData('');
    } catch (error) {
      alert('Application failed: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Student Login/Signup</h1>
        <form className="mt-4 space-y-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            step="0.1"
            placeholder="CGPA"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Institution"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <div className="flex space-x-4">
            <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded w-full">Login</button>
            <button onClick={handleSignup} className="bg-green-500 text-white p-2 rounded w-full">Signup</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="mt-4 flex space-x-4 max-w-md">
        <input
          type="text"
          placeholder="Search internships..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Domain (e.g., Python)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <h2 className="text-xl mt-4">Available Internships</h2>
      <div className="mt-4 space-y-4">
        {internships.map((internship) => (
          <div key={internship.id} className="border p-4 rounded">
            <h3 className="font-bold">{internship.role}</h3>
            <p>Sector: {internship.sector}</p>
            <p>Description: {internship.description}</p>
            <p>Locations: {internship.locations.join(', ')}</p>
            <p>Skills: {internship.must_required_skills.join(', ')}</p>
            <p>Certifications: {internship.appreciated_certifications.map(c => c.title).join(', ')}</p>
            <p>Plugin: {internship.plugin.name}</p>
            <p>Deadline: {internship.registration_end}</p>
            <Dropzone onDrop={(files) => setResume(files[0])}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="border-dashed border-2 p-4 mt-2 rounded">
                  <input {...getInputProps()} />
                  <p>Drag & drop resume here, or click to select</p>
                </div>
              )}
            </Dropzone>
            <Dropzone onDrop={(files) => setCertificates(files)}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="border-dashed border-2 p-4 mt-2 rounded">
                  <input {...getInputProps()} />
                  <p>Drag & drop certificates here, or click to select</p>
                </div>
              )}
            </Dropzone>
            <input
              type="text"
              placeholder="Certificate Provider (e.g., AWS)"
              onChange={(e) => setCertificateData([{ provider: e.target.value, title: certificateData[0]?.title || '' }])}
              className="border p-2 mt-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Certificate Title (e.g., Cloud Practitioner)"
              onChange={(e) => setCertificateData([{ provider: certificateData[0]?.provider || '', title: e.target.value }])}
              className="border p-2 mt-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="GitHub URL"
              value={pluginData}
              onChange={(e) => setPluginData(e.target.value)}
              className="border p-2 mt-2 rounded w-full"
            />
            <button
              onClick={() => handleApply(internship.id)}
              className="bg-blue-500 text-white p-2 mt-2 rounded w-full"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentOnboarding;