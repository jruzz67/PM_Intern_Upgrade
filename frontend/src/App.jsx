import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing.jsx';
import StudentOnboarding from './StudentOnboarding.jsx';
import CompanyOnboarding from './CompanyOnboarding.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import StudentDashboard from './StudentDashboard.jsx';
import CompanyDashboard from './CompanyDashboard.jsx';
import InternshipForm from './InternshipForm.jsx';
import InternshipsView from './InternshipsView.jsx';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/student" element={<StudentOnboarding />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/internships" element={<InternshipsView />} />
        <Route path="/company" element={<CompanyOnboarding />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/internship/create" element={<InternshipForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;