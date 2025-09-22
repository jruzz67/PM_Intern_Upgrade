import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Project Nexus</h1>
      <p className="mb-4">Connecting students and companies for internships with transparency and automation.</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate('/student')}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Student
        </button>
        <button
          onClick={() => navigate('/company')}
          className="bg-green-500 text-white p-2 rounded"
        >
          Company
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="bg-purple-500 text-white p-2 rounded"
        >
          Admin
        </button>
      </div>
    </div>
  );
}

export default Landing;