// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// // --- MERN STACK PRACTICE QUESTIONS ---
// const practiceQuestions = [
//   {
//     question: "Which of the following is NOT a core module built into Node.js?",
//     options: ["http", "fs", "path", "mongoose"],
//     answer: "mongoose"
//   },
//   {
//     question: "In React, what is the primary purpose of the 'key' prop when rendering lists?",
//     options: ["To style the list items", "To uniquely identify elements for efficient re-rendering", "To sort the array automatically", "To create a primary key for the database"],
//     answer: "To uniquely identify elements for efficient re-rendering"
//   },
//   {
//     question: "How do you define a dynamic route parameter in Express.js?",
//     options: ["/users?id=1", "/users/:id", "/users/{id}", "/users/id"],
//     answer: "/users/:id"
//   },
//   {
//     question: "Which React hook should be used to fetch API data when a component first loads?",
//     options: ["useState", "useEffect", "useMemo", "useContext"],
//     answer: "useEffect"
//   },
//   {
//     question: "In MongoDB, what is the equivalent of a traditional relational database 'table'?",
//     options: ["Document", "Collection", "Schema", "Cluster"],
//     answer: "Collection"
//   }
// ];

// const QuizSystem = () => {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [score, setScore] = useState(0);
//   const [showResult, setShowResult] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const navigate = useNavigate();

//   // --- HANDLE ANSWER SELECTION ---
//   const handleAnswer = (selectedOption) => {
//     let newScore = score;
    
//     // Check if the answer is correct
//     if (selectedOption === practiceQuestions[currentQuestion].answer) {
//       newScore = score + 1;
//       setScore(newScore);
//     }

//     // Move to the next question or show the results screen
//     const nextQuestion = currentQuestion + 1;
//     if (nextQuestion < practiceQuestions.length) {
//       setCurrentQuestion(nextQuestion);
//     } else {
//       setShowResult(true);
//     }
//   };

//   // --- SAVE SCORE TO MONGODB ---
//   const submitScoreToDatabase = async () => {
//     setSaving(true);
//     // Calculate percentage (e.g., 4/5 = 80%)
//     const finalScorePercentage = `${((score / practiceQuestions.length) * 100)}%`;

//     try {
//       const token = localStorage.getItem('token');
      
//       // Send the score to the User Profile in the database
//       await axios.post('http://localhost:5000/api/users/quiz', 
//         { testName: 'MERN Stack Practice Test', score: finalScorePercentage },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       alert(`Score of ${finalScorePercentage} saved to your profile!`);
//       navigate('/user/dashboard'); // Send them back to dashboard to see it
//     } catch (error) {
//       console.error("Error saving score:", error);
//       alert("Failed to save score to database. Is your backend running?");
//       setSaving(false);
//     }
//   };

//   // --- STYLES ---
//   const styles = {
//     container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f4f7f6', fontFamily: 'Arial, sans-serif', padding: '20px' },
//     card: { backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px', textAlign: 'center' },
//     title: { color: '#007BFF', marginBottom: '10px', fontSize: '28px' },
//     questionCount: { color: '#666', fontSize: '16px', marginBottom: '20px', fontWeight: 'bold' },
//     questionText: { fontSize: '22px', color: '#333', marginBottom: '30px', lineHeight: '1.4' },
//     optionBtn: { display: 'block', width: '100%', padding: '15px', margin: '12px 0', backgroundColor: '#f8f9fa', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left', fontWeight: 'bold', color: '#444' },
//     scoreText: { fontSize: '54px', color: '#28a745', margin: '20px 0', fontWeight: 'bold' },
//     submitBtn: { padding: '15px 30px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', marginTop: '20px', transition: '0.2s', width: '100%' },
//     cancelBtn: { padding: '15px 30px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '15px', width: '100%' }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
        
//         {showResult ? (
//           // --- RESULT SCREEN ---
//           <div>
//             <h2 style={styles.title}>Practice Complete! 🎉</h2>
//             <p style={{ fontSize: '18px', color: '#555' }}>You scored {score} out of {practiceQuestions.length}</p>
            
//             <div style={styles.scoreText}>
//               {((score / practiceQuestions.length) * 100)}%
//             </div>
            
//             <button style={styles.submitBtn} onClick={submitScoreToDatabase} disabled={saving}>
//               {saving ? 'Saving to Database...' : 'Save Score to My Profile'}
//             </button>
//             <button style={styles.cancelBtn} onClick={() => navigate('/user/dashboard')} disabled={saving}>
//               Exit Without Saving
//             </button>
//           </div>
//         ) : (
//           // --- QUIZ SCREEN ---
//           <div>
//             <h1 style={styles.title}>Practice Assessment</h1>
//             <div style={styles.questionCount}>
//               Question {currentQuestion + 1} of {practiceQuestions.length}
//             </div>
            
//             <div style={styles.questionText}>
//               {practiceQuestions[currentQuestion].question}
//             </div>
            
//             <div>
//               {practiceQuestions[currentQuestion].options.map((option, index) => (
//                 <button 
//                   key={index} 
//                   style={styles.optionBtn} 
//                   onClick={() => handleAnswer(option)}
//                   onMouseOver={(e) => { e.target.style.borderColor = '#007BFF'; e.target.style.backgroundColor = '#f0f7ff'; }}
//                   onMouseOut={(e) => { e.target.style.borderColor = '#e9ecef'; e.target.style.backgroundColor = '#f8f9fa'; }}
//                 >
//                   {option}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default QuizSystem;