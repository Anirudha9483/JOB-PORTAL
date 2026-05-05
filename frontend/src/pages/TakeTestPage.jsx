import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TakeTestPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('official'); // 'official' or 'practice'
  
  const [assignedTests, setAssignedTests] = useState([]);
  const [practiceTests, setPracticeTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH ASSIGNED & PRACTICE TESTS ---
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch both the user's job applications AND the global practice tests simultaneously
        const [appRes, practiceRes] = await Promise.all([
          axios.get('http://localhost:5000/api/applications/user', { headers }),
          axios.get('http://localhost:5000/api/tests/practice', { headers })
        ]);
        
        // Filter applications where the employer has clicked "Send Test"
        const pendingAssessments = appRes.data.filter(app => app.status === 'Test Sent');
        
        setAssignedTests(pendingAssessments);
        setPracticeTests(practiceRes.data); // Store the Practice Hub tests
      } catch (error) {
        console.error("Failed to load assessments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  // --- PREMIUM STYLES ---
  const styles = {
    layout: { padding: '50px 20px', backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" },
    container: { maxWidth: '1000px', margin: '0 auto' },
    
    // Header & Tabs
    headerBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' },
    title: { fontSize: '36px', fontWeight: '800', color: '#0f172a', margin: 0 },
    subtitle: { color: '#64748b', fontSize: '16px', marginTop: '5px' },
    
    tabContainer: { display: 'flex', gap: '10px', backgroundColor: '#e2e8f0', padding: '6px', borderRadius: '30px' },
    tabBtn: (isActive) => ({
      padding: '12px 24px', borderRadius: '24px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s',
      backgroundColor: isActive ? '#fff' : 'transparent', 
      color: isActive ? '#007BFF' : '#475569', 
      boxShadow: isActive ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
    }),
    
    // Cards
    sectionTitle: { color: '#64748b', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px', marginBottom: '20px', fontWeight: 'bold' },
    cardGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '20px' },
    testCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', transition: 'transform 0.2s' },
    
    jobTitle: { fontSize: '22px', fontWeight: '800', color: '#1e293b', margin: '0 0 5px 0' },
    companyName: { margin: 0, color: '#007BFF', fontWeight: '600', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' },
    
    startBtn: (bg, hoverBg) => ({ backgroundColor: bg, color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', transition: '0.2s' }),
    emptyState: { textAlign: 'center', backgroundColor: '#fff', padding: '60px 20px', borderRadius: '20px', border: '2px dashed #cbd5e1' }
  };

  return (
    <div style={styles.layout}>
      <div style={styles.container}>
        
        {/* --- HEADER & TOGGLE TABS --- */}
        <div style={styles.headerBox}>
          <div>
            <h1 style={styles.title}>Assessment Center</h1>
            <p style={styles.subtitle}>Complete employer tests or practice your skills.</p>
          </div>
          
          <div style={styles.tabContainer}>
            <button 
              style={styles.tabBtn(activeTab === 'official')} 
              onClick={() => setActiveTab('official')}
            >
              🏢 Pending Assessments
            </button>
            <button 
              style={styles.tabBtn(activeTab === 'practice')} 
              onClick={() => setActiveTab('practice')}
            >
              🧠 Practice Hub
            </button>
          </div>
        </div>

        {/* --- DYNAMIC CONTENT SECTION --- */}
        <section>
          {loading ? (
            <div style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>Loading data...</div>
          ) : (
            <div style={styles.cardGrid}>
              
              {/* --- VIEW 1: OFFICIAL ASSESSMENTS --- */}
              {activeTab === 'official' && (
                assignedTests.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={{fontSize: '48px', marginBottom: '15px'}}>🎉</div>
                    <h3 style={{color: '#0f172a', margin: '0 0 10px 0'}}>You're all caught up!</h3>
                    <p style={{color: '#64748b', margin: 0}}>No company assessments are currently pending. <br/>Switch to the Practice Hub to keep your skills sharp.</p>
                  </div>
                ) : (
                  assignedTests.map(app => (
                    <div 
                      key={app._id} 
                      style={styles.testCard}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div>
                        <span style={{backgroundColor: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '10px'}}>ACTION REQUIRED</span>
                        <h4 style={styles.jobTitle}>{app.jobId?.title || 'Custom Assessment'}</h4>
                        <p style={styles.companyName}>
                          <img 
                            src={`https://ui-avatars.com/api/?name=${app.companyId?.companyName || 'Company'}&background=random&color=fff`} 
                            alt="logo" 
                            style={{width: '24px', height: '24px', borderRadius: '6px'}} 
                          />
                          Requested by {app.companyId?.companyName || 'Employer'}
                        </p>
                      </div>

                      <button 
                        onClick={() => navigate(`/user/application-test/${app._id}`)}
                        style={styles.startBtn('#ef4444')}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                      >
                        ▶ Start Assessment
                      </button>
                    </div>
                  ))
                )
              )}

              {/* --- VIEW 2: PRACTICE HUB --- */}
              {activeTab === 'practice' && (
                practiceTests.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={{fontSize: '48px', marginBottom: '15px'}}>🚧</div>
                    <h3 style={{color: '#0f172a', margin: '0 0 10px 0'}}>No Practice Tests Available</h3>
                    <p style={{color: '#64748b', margin: 0}}>Employers haven't published any practice material yet. Check back later!</p>
                  </div>
                ) : (
                  practiceTests.map(test => (
                    <div 
                      key={test._id} 
                      style={{...styles.testCard, borderLeft: '4px solid #16a34a'}}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div>
                        <span style={{backgroundColor: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '10px'}}>PRACTICE MODE</span>
                        <h4 style={styles.jobTitle}>{test.testName}</h4>
                        <p style={{color: '#64748b', margin: '5px 0 0 0', fontSize: '14px'}}>
                          <strong>Topic:</strong> {test.role} • <strong>Questions:</strong> {test.questions.length} • <strong>Time:</strong> {test.duration} Mins
                        </p>
                      </div>

                      <button 
                        onClick={() => navigate(`/user/practice-test/${test._id}`)}
                        style={styles.startBtn('#16a34a')}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                      >
                        ▶ Take Practice Test
                      </button>
                    </div>
                  ))
                )
              )}

            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default TakeTestPage;