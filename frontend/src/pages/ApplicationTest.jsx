import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ApplicationTest = () => {
  const navigate = useNavigate();
  // 1. GET THE APPLICATION ID FROM THE URL (e.g., /user/application-test/12345)
  const { applicationId } = useParams(); 

  // --- STATE MANAGEMENT ---
  const [questions, setQuestions] = useState([]);
  const [testDetails, setTestDetails] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  // --- 2. DATABASE CONNECTION: FETCH THE CUSTOM QUESTIONS ---
  useEffect(() => {
    const fetchOfficialTest = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // This hits your Node.js backend. The backend looks at the Application ID,
        // finds which Test the company assigned, and returns the custom questions!
        const response = await axios.get(`http://localhost:5000/api/applications/${applicationId}/test`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setTestDetails(response.data);
        setQuestions(response.data.questions); // The custom questions from the employer
        setTimeLeft(response.data.duration * 60 || 1800); // Convert minutes to seconds
        setLoading(false);

      } catch (error) {
        console.error("Error loading official test:", error);
        alert(error.response?.data?.message || "Failed to load the assessment.");
        navigate('/user/take-test');
      }
    };

    if (applicationId) fetchOfficialTest();
  }, [applicationId, navigate]);

  // --- 3. TIMER LOGIC ---
  useEffect(() => {
    if (loading || showResult || timeLeft <= 0) {
      if (timeLeft <= 0 && !loading && !showResult) {
        setShowResult(true); // Force test to end if time runs out
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showResult, loading]);

  // --- 4. HANDLE USER CLICKS ---
  const handleAnswerClick = (selectedOption) => {
    let newScore = score;
    // Check if what the user clicked matches the correctAnswer set by the company
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      newScore = score + 1;
      setScore(newScore);
    }

    // Move to next question or end test
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
    }
  };

  // --- 5. DATABASE CONNECTION: SUBMIT SCORE ---
  const submitScoreToEmployer = async () => {
    setIsSaving(true);
    // Calculate percentage (e.g., 3 out of 4 = 75%)
    const finalScorePercentage = Math.round((score / questions.length) * 100);

    try {
      const token = localStorage.getItem('token');
      
      // Update the application status to 'Test Completed' and save the score in the DB
      await axios.put(`http://localhost:5000/api/applications/${applicationId}/submit-test`, 
        { score: finalScorePercentage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(`✅ Official Assessment Submitted! Score: ${finalScorePercentage}%`);
      // Redirect back to the ATS tracking page so they see it is done
      navigate('/user/applied-jobs'); 
      
    } catch (error) {
      alert("Error submitting your score to the employer.");
      setIsSaving(false);
    }
  };

  // --- UI RENDER LOGIC ---
  if (loading) {
    return <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b', color: 'white'}}><h2>Securely loading employer assessment...</h2></div>;
  }

  if (!questions || questions.length === 0) {
    return <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b', color: 'white'}}><h2>Error: No questions found for this assessment.</h2></div>;
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const styles = {
    wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '20px', fontFamily: "'Segoe UI', sans-serif" },
    container: { backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: '700px', padding: '50px', textAlign: 'center', position: 'relative', overflow: 'hidden' },
    progressBar: { position: 'absolute', top: 0, left: 0, height: '6px', backgroundColor: '#007BFF', width: `${progress}%`, transition: '0.4s ease' },
    headerBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' },
    timer: { fontSize: '18px', fontWeight: 'bold', color: timeLeft < 60 ? '#ef4444' : '#64748b' },
    questionText: { fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '30px', lineHeight: '1.4' },
    optionBtn: { display: 'block', width: '100%', padding: '18px', margin: '10px 0', backgroundColor: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', transition: '0.2s', color: '#334155' },
    resultScore: { fontSize: '80px', fontWeight: '900', color: '#16a34a', margin: '20px 0' },
    btnPrimary: { width: '100%', padding: '16px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.progressBar}></div>

        {showResult ? (
          <div>
            <h2 style={{fontSize: '32px', color: '#0f172a'}}>Assessment Complete</h2>
            <p style={{color: '#64748b'}}>Your final score will be sent directly to the employer.</p>
            <div style={styles.resultScore}>{Math.round((score / questions.length) * 100)}%</div>
            
            <button style={styles.btnPrimary} onClick={submitScoreToEmployer} disabled={isSaving}>
              {isSaving ? 'Submitting securely...' : 'Submit to Employer'}
            </button>
          </div>
        ) : (
          <div>
            <div style={styles.headerBox}>
               <span style={{fontWeight: 'bold', color: '#007BFF'}}>{testDetails?.testName || 'Company Test'}</span>
               <div style={styles.timer}>
                 ⏱ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
               </div>
            </div>

            {/* SHOWS THE CUSTOM QUESTION TEXT */}
            <div style={styles.questionText}>
              {questions[currentQuestion].questionText}
            </div>

            {/* SHOWS THE CUSTOM OPTIONS */}
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

export default ApplicationTest;