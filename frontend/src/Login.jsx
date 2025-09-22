import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

function Login({ setUserType, setUserId }) {
  const [name, setName] = useState('');
  const [userType, setLocalUserType] = useState('student');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint = userType === 'student' ? '/student/login' : userType === 'company' ? '/company/login' : '/admin/login';
      const res = await axios.post(`http://127.0.0.1:5000/api${endpoint}`, { name });
      setUserType(userType);
      setUserId(res.data.id);
      navigate(`/${userType}`);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-blue-50"
    >
      <h1 className="text-4xl font-bold mb-8">Project Nexus</h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={userType}
          onChange={(e) => setLocalUserType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="student">Student</option>
          <option value="company">Company</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Login
        </button>
      </form>
    </motion.div>
  );
}

export default Login;