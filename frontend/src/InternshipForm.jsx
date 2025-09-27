import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InternshipForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    sector: '',
    area: '',
    description: '',
    skills: '',
    keywords: '',
    special_requirements: '',
    work_mode: '',
    intake: '',
    start_date: '',
    deadline: '',
    plugin: 'none'
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  if (!user.id || user.user_type !== 'company') {
    navigate('/company');
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetSuggestions = async () => {
    if (!formData.title || !formData.sector || !formData.area || !formData.description) {
      setError('Please fill Title, Sector, Area, and Description for AI suggestions');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/internship/suggestions', {
        title: formData.title,
        sector: formData.sector,
        area: formData.area,
        description: formData.description,
        prompt: aiPrompt
      });
      setSuggestions(response.data.suggestions);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch AI suggestions');
    }
  };

  const handleAddSuggestion = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] ? `${prev[field]}, ${value}` : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('company_id', user.id);
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/internship/create', data);
      setError(response.data.message);
      setFormData({
        title: '',
        sector: '',
        area: '',
        description: '',
        skills: '',
        keywords: '',
        special_requirements: '',
        work_mode: '',
        intake: '',
        start_date: '',
        deadline: '',
        plugin: 'none'
      });
      setSuggestions(null);
      setAiPrompt('');
      navigate('/company/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit internship');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Create Internship</h1>
      {error && <p className={error.includes('success') ? 'text-green-500 mb-4' : 'text-red-500 mb-4'}>{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded shadow">
        <input
          type="text"
          name="title"
          placeholder="Internship Title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          name="sector"
          placeholder="Sector (e.g., IT, Marketing)"
          value={formData.sector}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          name="area"
          placeholder="Area (e.g., Data Analytics, Digital Marketing)"
          value={formData.area}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Role Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills (e.g., Python, SQL)"
          value={formData.skills}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          name="keywords"
          placeholder="Keywords (e.g., data, analytics)"
          value={formData.keywords}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          name="special_requirements"
          placeholder="Special Requirements"
          value={formData.special_requirements}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <select
          name="work_mode"
          value={formData.work_mode}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        >
          <option value="">Select Work Mode</option>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <input
          type="number"
          name="intake"
          placeholder="Number of Positions"
          value={formData.intake}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <select
          name="plugin"
          value={formData.plugin}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="none">No Plugin</option>
          <option value="leetcode">LeetCode</option>
          <option value="github">GitHub</option>
        </select>
        <input
          type="text"
          placeholder="Optional AI Prompt"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleGetSuggestions}
            className="w-full p-2 bg-gray-500 text-white rounded"
          >
            Get AI Suggestions
          </button>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Submit
          </button>
        </div>
      </form>

      {suggestions && (
        <div className="w-full max-w-lg mt-4">
          <h2 className="text-xl font-semibold mb-2">AI Suggestions</h2>
          {['skills', 'keywords', 'special_requirements', 'description'].map(field => (
            <div key={field} className="mb-4">
              <h3 className="font-medium capitalize">{field.replace('_', ' ')}</h3>
              {Array.isArray(suggestions[field]) ? (
                suggestions[field].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span>{item}</span>
                    <button
                      onClick={() => handleAddSuggestion(field, item)}
                      className="ml-2 p-1 bg-green-500 text-white rounded"
                    >
                      Add
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex items-center">
                  <span>{suggestions[field]}</span>
                  <button
                    onClick={() => handleAddSuggestion(field, suggestions[field])}
                    className="ml-2 p-1 bg-green-500 text-white rounded"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternshipForm;