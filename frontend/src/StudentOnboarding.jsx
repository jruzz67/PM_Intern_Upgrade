import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentOnboarding = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    cgpa: '',
    community_category: '',
    gender: '',
    urban_rural: '',
    family_income: '',
    education_level: ''
  });
  const [loginName, setLoginName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/student/register', data);
      setError('Signup successful! Please sign in.');
      setIsSignUp(false); // Switch to signin form
      setFormData({
        name: '',
        age: '',
        cgpa: '',
        community_category: '',
        gender: '',
        urban_rural: '',
        family_income: '',
        education_level: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/student/login', { name: loginName });
      localStorage.setItem('user', JSON.stringify({ id: response.data.id, user_type: 'student', name: loginName }));
      navigate('/student/dashboard'); // Fixed navigation to dashboard
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">{isSignUp ? 'Student Signup' : 'Student Signin'}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isSignUp ? (
        <form onSubmit={handleSignUp} className="w-full max-w-md bg-white p-6 rounded shadow">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="number"
            name="cgpa"
            placeholder="CGPA"
            step="0.1"
            value={formData.cgpa}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <select
            name="community_category"
            value={formData.community_category}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          >
            <option value="">Select Community Category</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="OBC">OBC</option>
            <option value="General">General</option>
            <option value="Others">Others</option>
          </select>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Third Gender">Third Gender</option>
          </select>
          <select
            name="urban_rural"
            value={formData.urban_rural}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          >
            <option value="">Select Urban/Rural</option>
            <option value="Urban">Urban</option>
            <option value="Rural">Rural</option>
          </select>
          <input
            type="number"
            name="family_income"
            placeholder="Family Income (₹)"
            value={formData.family_income}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <select
            name="education_level"
            value={formData.education_level}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          >
            <option value="">Select Education Level</option>
            <option value="High School">High School</option>
            <option value="Higher Secondary">Higher Secondary</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor">Bachelor</option>
          </select>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Sign Up</button>
        </form>
      ) : (
        <form onSubmit={handleSignIn} className="w-full max-w-md bg-white p-6 rounded shadow">
          <input
            type="text"
            placeholder="Name"
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

export default StudentOnboarding;