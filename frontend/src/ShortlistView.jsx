import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// A component for the progress bar
const ScoreBar = ({ label, score, color }) => (
  <div className="mb-2">
    <div className="flex justify-between text-sm text-slate-300 mb-1">
      <span>{label}</span>
      <span>{(score * 100).toFixed(0)}%</span>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-2">
      <motion.div
        className={`h-2 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${score * 100}%` }}
        transition={{ duration: 0.8 }}
      />
    </div>
  </div>
);

export default function ShortlistView({ internship, onBack }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:5000/api/internships/${internship.id}/matches`)
      .then(res => res.json())
      .then(data => {
        setMatches(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch matches:", error);
        setLoading(false);
      });
  }, [internship.id]);

  const toggleStudentDetails = (studentId) => {
    setSelectedStudentId(selectedStudentId === studentId ? null : studentId);
  };

  if (loading) {
    return <div className="text-center p-10">Loading Candidates...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded transition-colors">
        &larr; Back to Internships
      </button>
      <h1 className="text-3xl font-bold text-cyan-400">{internship.title}</h1>
      <h2 className="text-xl text-slate-400 mb-8">{internship.company} - Ranked Shortlist</h2>

      <div className="space-y-4">
        {matches.map((student, index) => (
          <div key={student.id} className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            <div
              className="p-4 cursor-pointer flex justify-between items-center hover:bg-slate-700 transition-colors"
              onClick={() => toggleStudentDetails(student.id)}
            >
              <div className="flex items-center">
                <span className="text-2xl font-bold text-slate-500 w-10">{index + 1}</span>
                <div>
                  <p className="text-xl font-semibold text-white">{student.name}</p>
                  <p className="text-sm text-slate-400">{student.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-cyan-400">Match Score</p>
                <p className="text-2xl font-bold text-white">{(student.final_score * 100).toFixed(1)}%</p>
              </div>
            </div>

            <AnimatePresence>
              {selectedStudentId === student.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="bg-slate-800/50 px-4 pb-4"
                >
                  <div className="border-t border-slate-700 pt-4">
                    <h3 className="font-semibold text-lg mb-2 text-slate-200">Score Breakdown</h3>
                    <ScoreBar label="Proficiency" score={student.score_breakdown.Proficiency} color="bg-green-500" />
                    <ScoreBar label="Structured Skills" score={student.score_breakdown['Structured Skills']} color="bg-blue-500" />
                    <ScoreBar label="Potential" score={student.score_breakdown.Potential} color="bg-purple-500" />
                    <ScoreBar label="Accolades" score={student.score_breakdown.Accolades} color="bg-yellow-500" />
                    <ScoreBar label="Affirmative Action" score={student.score_breakdown['Affirmative Action']} color="bg-red-500" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}