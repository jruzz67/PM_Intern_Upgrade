import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompanyOnboarding = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    legal_entity: '',
    address: '',
    phone: '',
    email: '',
    sector: '',
    industry: ''
  });
  const [loginName, setLoginName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Phone number must be 10 digits');
      return false;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      setError('Invalid email format');
      return false;
    }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/company/register', data);
      setError('Signup successful! Awaiting admin approval.');
      setIsSignUp(false);
      setFormData({
        name: '',
        legal_entity: '',
        address: '',
        phone: '',
        email: '',
        sector: '',
        industry: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/company/login', { name: loginName });
      localStorage.setItem('user', JSON.stringify({ id: response.data.id, user_type: 'company', name: loginName }));
      navigate('/company/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">{isSignUp ? 'Company Signup' : 'Company Signin'}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isSignUp ? (
        <form onSubmit={handleSignUp} className="w-full max-w-md bg-white p-6 rounded shadow">
          <input
            type="text"
            name="name"
            placeholder="Company Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            name="legal_entity"
            placeholder="Legal Entity (e.g., Pvt Ltd)"
            value={formData.legal_entity}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number (10 digits)"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            name="sector"
            placeholder="Sector (e.g., IT, Manufacturing)"
            value={formData.sector}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            name="industry"
            placeholder="Industry (e.g., Software, Automotive)"
            value={formData.industry}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Sign Up</button>
        </form>
      ) : (
        <form onSubmit={handleSignIn} className="w-full max-w-md bg-white p-6 rounded shadow">
          <input
            type="text"
            placeholder="Company Name"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Sign In</button>
        </form>
      )}
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-4 text-blue-500 underline"
      >
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </button>
    </div>
  );
};

export default CompanyOnboarding;