import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomAssessments = () => {
  const navigate = useNavigate();
  const [myTests, setMyTests] = useState([]);
  
  // --- UI STATES ---
  const [viewTab, setViewTab] = useState('Assessment'); // 'Assessment' | 'Practice'
  const [isEditing, setIsEditing] = useState(false);
  const [editTestId, setEditTestId] = useState(null);

  // --- FORM STATES ---
  const [newTest, setNewTest] = useState({ testName: '', role: '', duration: '30', testType: 'Assessment' });
  const [questions, setQuestions] = useState([{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tests/company', { headers: { Authorization: `Bearer ${token}` } });
        setMyTests(res.data);
      } catch (error) { console.error(error); }
    };
    fetchTests();
  }, []);

  // --- QUESTION LOGIC ---
  const handleQuestionChange = (index, field, value) => { const updated = [...questions]; updated[index][field] = value; setQuestions(updated); };
  const handleOptionChange = (qIndex, optIndex, value) => { const updated = [...questions]; updated[qIndex].options[optIndex] = value; setQuestions(updated); };
  const addQuestion = () => setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));

  // --- ADD / EDIT SUBMIT LOGIC ---
  const handleSaveTest = async (e) => {
    e.preventDefault();
    if (!questions.every(q => q.correctAnswer !== '')) return alert("Select a correct answer for every question!");
    
    try {
      const token = localStorage.getItem('token');
      
      if (isEditing) {
        // UPDATE EXISTING TEST
        const response = await axios.put(`http://localhost:5000/api/tests/${editTestId}`, { ...newTest, questions }, { headers: { Authorization: `Bearer ${token}` } });
        setMyTests(myTests.map(t => t._id === editTestId ? response.data.test : t));
        alert('✅ Test updated successfully!');
      } else {
        // CREATE NEW TEST
        const response = await axios.post('http://localhost:5000/api/tests', { ...newTest, questions }, { headers: { Authorization: `Bearer ${token}` } });
        setMyTests([response.data.test, ...myTests]);
        alert('✅ Test created successfully!');
      }

      // Reset Form
      cancelEdit();
    } catch (error) { alert('Failed to save test.'); }
  };

  // --- EDIT & DELETE LOGIC ---
  const loadEditTest = (test) => {
    setIsEditing(true);
    setEditTestId(test._id);
    setViewTab(test.testType || 'Assessment');
    setNewTest({
      testName: test.testName,
      role: test.role,
      duration: test.duration,
      testType: test.testType || 'Assessment'
    });
    setQuestions(test.questions);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the form smoothly
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTestId(null);
    setNewTest({ testName: '', role: '', duration: '30', testType: viewTab });
    setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleDeleteTest = async (testId) => {
    if (window.confirm('Delete this assessment permanently?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/tests/${testId}`, { headers: { Authorization: `Bearer ${token}` } });
        setMyTests(myTests.filter(test => test._id !== testId));
      } catch (error) { alert('Failed to delete.'); }
    }
  };

  // Filter tests based on the active tab
  const filteredTests = myTests.filter(test => (test.testType || 'Assessment') === viewTab);

  // --- PREMIUM STYLES ---
  const styles = {
    layout: { fontFamily: "'Plus Jakarta Sans', sans-serif" },
    headerBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: 0 },
    
    // Toggle Tabs
    tabContainer: { display: 'flex', gap: '15px', backgroundColor: '#e2e8f0', padding: '6px', borderRadius: '12px', display: 'inline-flex' },
    tabBtn: (isActive) => ({ padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s', backgroundColor: isActive ? '#fff' : 'transparent', color: isActive ? '#007BFF' : '#475569', boxShadow: isActive ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }),
    
    // Form Elements
    card: { backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', marginBottom: '40px' },
    input: { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '15px', backgroundColor: '#f8fafc', outline: 'none' },
    qBox: { border: '1px solid #e2e8f0', padding: '25px', borderRadius: '12px', marginBottom: '25px', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' },
    
    // Buttons
    btnPrimary: { padding: '14px 28px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 4px 10px rgba(0,123,255,0.2)' },
    btnSecondary: { padding: '14px 28px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
    
    // Action Buttons
    actionBtn: (bg, color) => ({ padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: bg, color: color, fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', transition: '0.2s' })
  };

  return (
    <div style={styles.layout}>
      
      {/* HEADER & TABS */}
      <div style={styles.headerBox}>
        <div>
          <h1 style={styles.title}>Test & Practice Center</h1>
          <p style={{ color: '#64748b', marginTop: '5px' }}>Build official assessments and mock preparation tests.</p>
        </div>
        <div style={styles.tabContainer}>
          <button style={styles.tabBtn(viewTab === 'Assessment')} onClick={() => { setViewTab('Assessment'); setNewTest({...newTest, testType: 'Assessment'}); }}>📝 Official Tests</button>
          <button style={styles.tabBtn(viewTab === 'Practice')} onClick={() => { setViewTab('Practice'); setNewTest({...newTest, testType: 'Practice'}); }}>🧠 Practice Hub</button>
        </div>
      </div>

      {/* ADD / EDIT FORM */}
      <div style={{...styles.card, borderTop: isEditing ? '4px solid #f59e0b' : '4px solid #007BFF'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2 style={{ fontSize: '22px', margin: 0 }}>
              {isEditing ? `✏️ Edit ${viewTab}` : `➕ Create New ${viewTab}`}
            </h2>
            {isEditing && <button style={styles.btnSecondary} onClick={cancelEdit}>Cancel Editing</button>}
        </div>
        
        <form onSubmit={handleSaveTest}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <input type="text" required style={styles.input} placeholder={`${viewTab} Name`} value={newTest.testName} onChange={(e) => setNewTest({...newTest, testName: e.target.value})} />
            <input type="text" required style={styles.input} placeholder="Target Role / Topic" value={newTest.role} onChange={(e) => setNewTest({...newTest, role: e.target.value})} />
            <select style={styles.input} value={newTest.duration} onChange={(e) => setNewTest({...newTest, duration: e.target.value})}>
              <option value="15">⏱ 15 Mins</option>
              <option value="30">⏱ 30 Mins</option>
              <option value="60">⏱ 60 Mins</option>
            </select>
          </div>
          
          <h3 style={{fontSize: '16px', color: '#64748b', marginTop: '10px', marginBottom: '15px'}}>Questions</h3>
          
          {questions.map((q, qIndex) => (
            <div key={qIndex} style={styles.qBox}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                <strong style={{color: '#0f172a', fontSize: '18px'}}>Question {qIndex + 1}</strong> 
                {questions.length > 1 && <span style={{color:'#ef4444', cursor:'pointer', fontWeight: 'bold'}} onClick={() => removeQuestion(qIndex)}>🗑️ Remove</span>}
              </div>
              <input type="text" required style={styles.input} placeholder="Type your question here..." value={q.questionText} onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)} />
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                {q.options.map((opt, oIdx) => <input key={oIdx} type="text" required style={styles.input} placeholder={`Option ${oIdx+1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIdx, e.target.value)} />)}
              </div>
              <select required style={{...styles.input, marginTop: '15px'}} value={q.correctAnswer} onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}>
                <option value="">-- Select Correct Answer --</option>
                {q.options.map((opt, i) => opt && <option key={i} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
          
          <div style={{display: 'flex', gap: '15px'}}>
            <button type="button" onClick={addQuestion} style={{...styles.btnSecondary, backgroundColor: '#eff6ff', color: '#007BFF'}}>➕ Add Another Question</button>
            <button type="submit" style={{...styles.btnPrimary, backgroundColor: isEditing ? '#f59e0b' : '#007BFF', boxShadow: isEditing ? '0 4px 10px rgba(245, 158, 11, 0.3)' : '0 4px 10px rgba(0, 123, 255, 0.3)'}}>
                {isEditing ? '💾 Update Test' : '🚀 Publish Test'}
            </button>
          </div>
        </form>
      </div>

      {/* LIST OF TESTS BASED ON TAB */}
      <div>
        <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Your {viewTab} Library</h2>
        
        {filteredTests.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '16px', color: '#64748b'}}>
            No {viewTab.toLowerCase()}s found. Create one above!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredTests.map(test => (
              <div key={test._id} style={{ padding: '25px', border: '1px solid #e2e8f0', borderRadius: '16px', backgroundColor: '#fff', transition: '0.2s' }}>
                <span style={{backgroundColor: viewTab === 'Practice' ? '#f0fdf4' : '#e0f2fe', color: viewTab === 'Practice' ? '#16a34a' : '#0284c7', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', display: 'inline-block'}}>
                    {test.testType || 'Assessment'}
                </span>
                
                <strong style={{fontSize: '20px', color: '#0f172a', display: 'block', marginBottom: '5px'}}>{test.testName}</strong>
                <span style={{color: '#64748b', fontSize: '14px', display: 'block', marginBottom: '20px'}}>Role: {test.role}</span>
                
                <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                  <span style={{fontSize: '13px', fontWeight: 'bold', color: '#475569'}}>📝 {test.questions.length} Qs</span>
                  <span style={{fontSize: '13px', fontWeight: 'bold', color: '#475569'}}>⏱ {test.duration} Mins</span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {/* Take Test / Preview Button */}
                  <button 
                    onClick={() => navigate(`/company/test-preview/${test._id}`)} 
                    style={styles.actionBtn(viewTab === 'Practice' ? '#16a34a' : '#0f172a', '#fff')}
                  >
                    {viewTab === 'Practice' ? '▶ Take Test' : ' Preview'}
                  </button>
                  
                  {/* Edit Button */}
                  <button 
                    onClick={() => loadEditTest(test)} 
                    style={styles.actionBtn('#f1f5f9', '#007BFF')}
                  >
                    ✏️ Edit
                  </button>

                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDeleteTest(test._id)} 
                    style={styles.actionBtn('#fee2e2', '#dc2626')}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CustomAssessments;