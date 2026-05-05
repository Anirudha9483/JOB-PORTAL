import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- MERN STACK QUIZ QUESTIONS ---
const quizQuestions = [
  {
    question: "Which of the following is a hook in React?",
    options: ["useFetch", "useState", "useData", "useComponent"],
    answer: "useState"
  },
  {
    question: "What does the 'M' stand for in MERN stack?",
    options: ["MySQL", "MongoDB", "Mongoose", "Middleware"],
    answer: "MongoDB"
  },
  {
    question: "In Express.js, what is used to parse incoming JSON requests?",
    options: ["express.json()", "JSON.parse()", "body.parser()", "app.parse()"],
    answer: "express.json()"
  },
  {
    question: "Which hook is used to perform side effects in a React functional component?",
    options: ["useEffect", "useContext", "useReducer", "useSideEffect"],
    answer: "useEffect"
  }
];

const QuizSystem = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (selectedOption) => {
    // Check if correct
    if (selectedOption === quizQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }

    // Move to next question or end quiz
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizQuestions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
    }
  };

  const submitScoreToDatabase = async () => {
    setSaving(true);
    const finalScorePercentage = `${((score / quizQuestions.length) * 100)}%`;

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/users/quiz', 
        { testName: 'MERN Stack Fundamentals', score: finalScorePercentage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(`Score of ${finalScorePercentage} saved to your profile!`);
      navigate('/user/dashboard'); // Send them back to dashboard to see it
    } catch (error) {
      console.error("Error saving score:", error);
      alert("Failed to save score to database.");
      setSaving(false);
    }
  };

  // --- STYLES ---
  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f4f7f6', fontFamily: 'Arial, sans-serif' },
    card: { backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px', textAlign: 'center' },
    title: { color: '#007BFF', marginBottom: '10px', fontSize: '28px' },
    questionCount: { color: '#666', fontSize: '16px', marginBottom: '20px', fontWeight: 'bold' },
    questionText: { fontSize: '22px', color: '#333', marginBottom: '30px' },
    optionBtn: { display: 'block', width: '100%', padding: '15px', margin: '10px 0', backgroundColor: '#f8f9fa', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', transition: '0.2s', textAlign: 'left', fontWeight: 'bold', color: '#444' },
    scoreText: { fontSize: '48px', color: '#28a745', margin: '20px 0', fontWeight: 'bold' },
    submitBtn: { padding: '15px 30px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', marginTop: '20px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {showResult ? (
          // --- RESULT SCREEN ---
          <div>
            <h2 style={styles.title}>Assessment Complete!</h2>
            <p style={{ fontSize: '18px', color: '#555' }}>You scored {score} out of {quizQuestions.length}</p>
            <div style={styles.scoreText}>
              {((score / quizQuestions.length) * 100)}%
            </div>
            <button style={styles.submitBtn} onClick={submitScoreToDatabase} disabled={saving}>
              {saving ? 'Saving to Profile...' : 'Save Score to My Profile'}
            </button>
          </div>
        ) : (
          // --- QUIZ SCREEN ---
          <div>
            <h1 style={styles.title}>MERN Stack Assessment</h1>
            <div style={styles.questionCount}>
              Question {currentQuestion + 1} of {quizQuestions.length}
            </div>
            
            <div style={styles.questionText}>
              {quizQuestions[currentQuestion].question}
            </div>
            
            <div>
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <button 
                  key={index} 
                  style={styles.optionBtn} 
                  onClick={() => handleAnswer(option)}
                  onMouseOver={(e) => e.target.style.borderColor = '#007BFF'}
                  onMouseOut={(e) => e.target.style.borderColor = '#e9ecef'}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuizSystem;