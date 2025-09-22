import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing.jsx';
import StudentOnboarding from './StudentOnboarding.jsx';
import CompanyOnboarding from './CompanyOnboarding.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/student" element={<StudentOnboarding />} />
        <Route path="/company" element={<CompanyOnboarding />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;