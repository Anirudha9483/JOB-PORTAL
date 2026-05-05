import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Default fallback questions for the "General Practice" mode
const defaultQuestions = [
  { questionText: "Which of the following is NOT a core module built into Node.js?", options: ["http", "fs", "path", "mongoose"], correctAnswer: "mongoose" },
  { questionText: "In React, what is the primary purpose of the 'key' prop?", options: ["To style items", "To uniquely identify elements", "To sort the array", "To create a primary key"], correctAnswer: "To uniquely identify elements" },
  { questionText: "Which React hook fetches API data when a component loads?", options: ["useState", "useEffect", "useMemo", "useContext"], correctAnswer: "useEffect" },
];

const PracticeTest = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Need to know if it's a candidate or company
  const { testId } = useParams(); // Retrieves ID if company is previewing

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  // --- 1. FETCH LOGIC (FIXED INFINITE LOADING) ---
  useEffect(() => {
    const fetchCustomTest = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/tests/${testId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestions(response.data.questions);
        setTimeLeft(response.data.duration * 60 || 1800); 
        setLoading(false);
      } catch (error) {
        console.error("Error loading company test:", error);
        alert("Failed to load the assessment preview.");
        navigate(-1); // Send user back to previous page
      }
    };

    // If there is a testId in the URL, fetch it.
    // If NOT, load the default practice questions!
    if (testId) {
      fetchCustomTest();
    } else {
      setQuestions(defaultQuestions);
      setTimeLeft(600); // 10 minutes for general practice
      setLoading(false); // Stop the loading screen!
    }
  }, [testId, navigate]);

  // --- 2. TIMER LOGIC ---
  useEffect(() => {
    if (loading || showResult || timeLeft <= 0) {
      if (timeLeft <= 0 && !loading && !showResult) setShowResult(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showResult, loading]);

  const handleAnswerClick = (selectedOption) => {
    let newScore = score;
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      newScore = score + 1;
      setScore(newScore);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
    }
  };

  // --- 3. SAVE LOGIC ---
  const saveScoreToDatabase = async () => {
    setIsSaving(true);
    const finalScorePercentage = Math.round((score / questions.length) * 100);

    // If a company is just previewing their test, do not save to DB!
    if (user?.role === 'Company') {
      alert(`Preview Complete! Your test works perfectly. Score: ${finalScorePercentage}%`);
      navigate('/company/dashboard');
      return;
    }

    // If it's a user taking a general practice test, save to their profile
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/users/quiz', 
        { testName: 'General Practice Assessment', score: `${finalScorePercentage}%` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`✅ Practice Score Saved: ${finalScorePercentage}%`);
      navigate('/user/dashboard'); 
    } catch (error) {
      alert("Error saving practice score.");
      setIsSaving(false);
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '100px', backgroundColor: '#1e293b', color: 'white', minHeight: '100vh'}}><h2>Loading Assessment...</h2></div>;

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const styles = {
    wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '20px', fontFamily: "'Segoe UI', sans-serif" },
    container: { backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: '700px', padding: '50px', textAlign: 'center', position: 'relative', overflow: 'hidden' },
    progressBar: { position: 'absolute', top: 0, left: 0, height: '6px', backgroundColor: '#007BFF', width: `${progress}%`, transition: '0.4s ease' },
    timer: { fontSize: '18px', fontWeight: 'bold', color: timeLeft < 20 ? '#ef4444' : '#64748b', marginBottom: '20px' },
    questionText: { fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '30px', lineHeight: '1.4' },
    optionBtn: { display: 'block', width: '100%', padding: '18px', margin: '10px 0', backgroundColor: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', transition: '0.2s', color: '#334155' },
    resultScore: { fontSize: '80px', fontWeight: '900', color: '#16a34a', margin: '20px 0' },
    actionBtn: (bg) => ({ width: '100%', padding: '16px', backgroundColor: bg, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' })
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.progressBar}></div>

        {showResult ? (
          <div>
            <h2 style={{fontSize: '32px', color: '#0f172a'}}>Assessment Finished</h2>
            <div style={styles.resultScore}>{Math.round((score / questions.length) * 100)}%</div>
            
            <button style={styles.actionBtn('#16a34a')} onClick={saveScoreToDatabase} disabled={isSaving}>
              {isSaving ? 'Processing...' : user?.role === 'Company' ? 'Finish Preview' : 'Save Score to Profile'}
            </button>
          </div>
        ) : (
          <div>
            {user?.role === 'Company' && <div style={{backgroundColor: '#fef3c7', color: '#b45309', padding: '5px', borderRadius: '8px', marginBottom: '15px', fontWeight: 'bold', fontSize: '12px'}}>COMPANY PREVIEW MODE</div>}
            
            <div style={styles.timer}>
               ⏱ Time Remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>

            <div style={styles.questionText}>
              {questions[currentQuestion].questionText}
            </div>

            <div>
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  style={styles.optionBtn}
                  onClick={() => handleAnswerClick(option)}
                  onMouseOver={(e) => { e.target.style.borderColor = '#007BFF'; e.target.style.backgroundColor = '#eff6ff'; }}
                  onMouseOut={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; }}
                >
                  {option}
                </button>
              ))}
            </div>

            <div style={{marginTop: '30px', color: '#94a3b8', fontSize: '14px', fontWeight: 'bold'}}>
               Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeTest;