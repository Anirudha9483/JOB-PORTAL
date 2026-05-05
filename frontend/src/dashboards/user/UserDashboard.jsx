// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const UserDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const [activeTab, setActiveTab] = useState('applications'); 

//   // --- STATE ---
//   const [appliedJobs, setAppliedJobs] = useState([]);
//   const [quizResults, setQuizResults] = useState([]); 
//   const [videos, setVideos] = useState([]); 
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState(''); 
  
//   const [skills, setSkills] = useState('React, Node.js, JavaScript, MongoDB');
//   const [resumeName, setResumeName] = useState('No file chosen');

//   // --- FETCH DATA ---
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setErrorMessage(''); 
//       try {
//         const token = localStorage.getItem('token');
//         const headers = { Authorization: `Bearer ${token}` };

//         if (activeTab === 'applications') {
//           const res = await axios.get('http://localhost:5000/api/applications/user', { headers });
//           setAppliedJobs(Array.isArray(res.data) ? res.data : []);
//         } else if (activeTab === 'quiz') {
//           const res = await axios.get('http://localhost:5000/api/users/profile', { headers });
//           setQuizResults(res.data.assessments || []);
//         } else if (activeTab === 'videos') {
//           const res = await axios.get('http://localhost:5000/api/videos', { headers });
//           setVideos(Array.isArray(res.data) ? res.data : []);
//         }

//       } catch (error) {
//         console.error("Dashboard Fetch Error:", error);
//         setErrorMessage(error.response?.data?.message || "Failed to load database. Is the backend running?");
//         setAppliedJobs([]);
//         setVideos([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [activeTab]); 

//   // --- RESUME UPLOAD ---
//   const handleFileUpload = async (e) => {
//     e.preventDefault();
//     const fileInput = document.getElementById('resumeUpload');
//     const file = fileInput?.files[0];
//     if (!file) return alert('Please select a file first!');
    
//     const formData = new FormData();
//     formData.append('resume', file); 

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post('http://localhost:5000/api/users/upload-resume', formData, {
//         headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
//       });
//       alert(response.data.message || 'Resume uploaded successfully!');
//       setResumeName(file.name); 
//     } catch (error) {
//       alert('Error uploading file. Make sure your backend server is running.');
//     }
//   };

//   // --- BADGE STYLES ---
//   const getBadgeStyle = (status) => {
//     let bg = '#e2e8f0', color = '#475569'; 
//     if (status === 'Applied') { bg = '#fef3c7'; color = '#b45309'; }
//     if (status === 'Test Sent') { bg = '#e0f2fe'; color = '#0284c7'; }
//     if (status === 'Test Completed') { bg = '#f3e8ff'; color = '#7e22ce'; }
//     if (status === 'Interview Scheduled') { bg = '#dbeafe'; color = '#0369a1'; }
//     if (status === 'Accepted') { bg = '#dcfce7'; color = '#15803d'; }
//     if (status === 'Rejected') { bg = '#fee2e2'; color = '#b91c1c'; }
//     return { padding: '6px 12px', borderRadius: '20px', color: color, fontSize: '12px', fontWeight: 'bold', backgroundColor: bg, display: 'inline-block' };
//   };

//   // --- PREMIUM STYLES ---
//   const styles = {
//     layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" },
    
//     // Sidebar
//     sidebar: { width: '280px', backgroundColor: '#ffffff', borderRight: '1px solid #e1e4e8', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box' },
//     sidebarTitle: { margin: '0 0 30px 10px', color: '#0f172a', fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' },
//     sidebarBtn: (isActive) => ({ 
//       padding: '14px 20px', 
//       backgroundColor: isActive ? '#eff6ff' : 'transparent', 
//       color: isActive ? '#007BFF' : '#475569', 
//       border: 'none', 
//       borderRadius: '12px', 
//       cursor: 'pointer', 
//       textAlign: 'left', 
//       fontSize: '15px', 
//       fontWeight: isActive ? '700' : '600', 
//       transition: 'all 0.2s ease',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '12px'
//     }),
    
//     // Content Area
//     content: { flex: 1, padding: '40px 50px', overflowX: 'auto' },
//     pageHeader: { marginTop: 0, color: '#0f172a', fontSize: '32px', fontWeight: '800', marginBottom: '8px' },
//     pageSub: { color: '#64748b', fontSize: '16px', marginBottom: '35px' },
    
//     // Cards & Forms
//     card: { backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', marginBottom: '30px' },
//     formGroup: { marginBottom: '20px' },
//     label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155', fontSize: '14px' },
//     input: { width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontSize: '15px', outline: 'none', transition: 'border 0.2s' },
    
//     // Buttons
//     buttonPrimary: { padding: '12px 24px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', transition: '0.2s', boxShadow: '0 4px 10px rgba(0,123,255,0.2)' },
//     buttonAction: (bg, color) => ({ padding: '8px 16px', backgroundColor: bg, color: color, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: '0.2s', textDecoration: 'none', display: 'inline-block', textAlign: 'center', marginTop: '5px' }),
    
//     // Tables
//     table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
//     th: { borderBottom: '2px solid #e2e8f0', padding: '16px 12px', textAlign: 'left', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' },
//     td: { borderBottom: '1px solid #f1f5f9', padding: '20px 12px', verticalAlign: 'middle', color: '#334155', fontSize: '15px' },
    
//     // Misc
//     errorBox: { padding: '15px 20px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '12px', marginBottom: '25px', border: '1px solid #fca5a5', fontWeight: '500' },
//     videoCard: { padding: '25px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fdfdfd', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
//     fileUploadBox: { display: 'flex', gap: '20px', alignItems: 'center', padding: '25px', border: '2px dashed #cbd5e1', borderRadius: '12px', backgroundColor: '#f8fafc' }
//   };

//   return (
//     <div style={styles.layout}>
      
//       {/* --- SIDEBAR --- */}
//       <div style={styles.sidebar}>
//         <h3 style={styles.sidebarTitle}>Candidate Portal</h3>
//         <button style={styles.sidebarBtn(activeTab === 'applications')} onClick={() => setActiveTab('applications')}>
//           <span style={{fontSize:'18px'}}>📄</span> Applied Jobs
//         </button>
//         <button style={styles.sidebarBtn(activeTab === 'videos')} onClick={() => setActiveTab('videos')}>
//           <span style={{fontSize:'18px'}}>🎥</span> Prep Videos
//         </button>
//         <button style={styles.sidebarBtn(activeTab === 'profile')} onClick={() => setActiveTab('profile')}>
//           <span style={{fontSize:'18px'}}>👤</span> Profile & Resume
//         </button>
//         <button style={styles.sidebarBtn(activeTab === 'quiz')} onClick={() => setActiveTab('quiz')}>
//           <span style={{fontSize:'18px'}}>🧠</span> General Quizzes
//         </button>
        
//         <div style={{height: '1px', backgroundColor: '#e1e4e8', margin: '15px 10px'}}></div>
        
//         <button 
//           style={{...styles.sidebarBtn(false), backgroundColor: '#f0fdf4', color: '#16a34a'}} 
//           onClick={() => navigate('/user/take-test')}
//         >
//           <span style={{fontSize:'18px'}}>📝</span> Take Practice Test
//         </button>
//       </div>
      
//       {/* --- MAIN CONTENT --- */}
//       <div style={styles.content}>
//         <h1 style={styles.pageHeader}>My Dashboard</h1>
//         <p style={styles.pageSub}>Logged in as: <strong style={{color: '#0f172a'}}>{user.email}</strong></p>

//         {errorMessage && <div style={styles.errorBox}><strong>Error:</strong> {errorMessage}</div>}

//         {/* --- TAB 1: APPLICATIONS --- */}
//         {activeTab === 'applications' && (
//           <div style={styles.card}>
//             <h2 style={{marginTop: 0, color: '#0f172a', fontSize: '22px'}}>Application Tracker</h2>
//             <p style={{ color: '#64748b', marginBottom: '25px' }}>Monitor your progress through the hiring pipeline.</p>
            
//             {loading ? <p style={{color: '#64748b'}}>Loading your applications...</p> : (
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Company & Role</th>
//                     <th style={styles.th}>Current Status</th>
//                     <th style={styles.th}>Action Required</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appliedJobs.length === 0 && !errorMessage ? (
//                     <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>You haven't applied to any jobs yet. Start browsing!</td></tr>
//                   ) : (
//                     appliedJobs.map(app => {
//                       const companyName = app.companyId?.name || app.companyId?.companyName || 'Unknown Company';
//                       return (
//                         <tr key={app._id}>
//                           <td style={styles.td}>
//                             <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//                               <img src={`https://ui-avatars.com/api/?name=${companyName}&background=random&color=fff&bold=true`} alt="Logo" style={{width: '45px', height: '45px', borderRadius: '10px'}} />
//                               <div>
//                                 <strong style={{fontSize: '16px', color: '#0f172a'}}>{app.jobId?.title || 'Role Unavailable'}</strong><br/>
//                                 <span style={{ fontSize: '14px', color: '#64748b' }}>{companyName}</span>
//                               </div>
//                             </div>
//                           </td>
//                           <td style={styles.td}><span style={getBadgeStyle(app.status)}>{app.status}</span></td>
//                           <td style={styles.td}>
//                             {(!app.status || app.status === 'Applied') && (
//                               <span style={{ color: '#94a3b8', fontSize: '14px', fontStyle: 'italic' }}>Under Review...</span>
//                             )}
                            
//                             {app.status === 'Test Sent' && (
//                               <button 
//                                 style={{...styles.buttonAction('#ef4444', '#fff'), animation: 'pulse 2s infinite'}} 
//                                 onClick={() => navigate(`/user/application-test/${app._id}`)}
//                               >
//                                 ⏱️ Take Assigned Test
//                               </button>
//                             )}

//                             {app.status === 'Test Completed' && (
//                               <span style={{ color: '#7e22ce', fontWeight: 'bold', fontSize: '15px' }}>Score: {app.testScore}%</span>
//                             )}

//                             {app.status === 'Interview Scheduled' && (
//                               <div>
//                                 <div style={{ fontSize: '14px', color: '#0f172a', marginBottom: '8px', fontWeight: 'bold' }}>
//                                   📅 {new Date(app.interviewDate).toLocaleString()}
//                                 </div>
//                                 <a href={app.interviewLink} target="_blank" rel="noopener noreferrer" style={styles.buttonAction('#16a34a', '#fff')}>
//                                   📹 Join Interview
//                                 </a>
//                                 <button onClick={() => setActiveTab('videos')} style={{...styles.buttonAction('#f8fafc', '#007BFF'), border: '1px solid #cbd5e1', marginLeft: '5px'}}>
//                                   📺 Prep Videos
//                                 </button>
//                               </div>
//                             )}

//                             {app.status === 'Accepted' && <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '15px' }}> Done</span>}
//                             {app.status === 'Rejected' && <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '14px' }}>Not Selected</span>}
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {/* --- TAB 2: VIDEOS --- */}
//         {activeTab === 'videos' && (
//           <div style={styles.card}>
//             <h2 style={{marginTop: 0, color: '#0f172a', fontSize: '22px'}}>🎥 Interview Preparation Videos</h2>
//             <p style={{ color: '#64748b', marginBottom: '30px' }}>Watch these resources uploaded by employers to help you prepare for technical interviews and company culture.</p>
            
//             {loading ? <p style={{color: '#64748b'}}>Loading videos...</p> : (
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
//                 {videos.length === 0 ? (
//                   <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '12px' }}>
//                     Employers have not uploaded any preparation videos yet.
//                   </div>
//                 ) : (
//                   videos.map(vid => (
//                     <div key={vid._id} style={styles.videoCard}>
//                       <div>
//                         <strong style={{ fontSize: '18px', color: '#0f172a', display: 'block', marginBottom: '5px' }}>{vid.title}</strong>
//                         <div style={{ fontSize: '14px', color: '#64748b' }}>
//                           Uploaded by: <span style={{color: '#007BFF', fontWeight: '600'}}>{vid.companyId?.companyName || 'Employer'}</span>
//                         </div>
//                       </div>
//                       <a 
//                         href={vid.url} 
//                         target="_blank" 
//                         rel="noopener noreferrer" 
//                         style={styles.buttonAction('#ef4444', '#fff')}
//                       >
//                         ▶ Watch Video
//                       </a>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {/* --- TAB 3: PROFILE --- */}
//         {activeTab === 'profile' && (
//           <div style={styles.card} styl={{maxWidth: '800px', ...styles.card}}>
//             <h2 style={{marginTop: 0, color: '#0f172a', fontSize: '22px'}}>Profile & Resume</h2>
//             <form onSubmit={handleFileUpload}> 
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>My Top Skills</label>
//                 <input type="text" style={styles.input} value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g., React, Node.js, Express, MongoDB" />
//               </div>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Upload Resume Document (PDF/DOC)</label>
//                 <div style={styles.fileUploadBox}>
//                   <input type="file" id="resumeUpload" accept=".pdf,.doc,.docx" onChange={(e) => setResumeName(e.target.files[0]?.name || 'No file chosen')} style={{flex: 1}} />
//                   <div style={{ color: '#334155', fontSize: '14px', backgroundColor: '#fff', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
//                     Current file: <strong style={{color: '#16a34a'}}>{resumeName}</strong>
//                   </div>
//                 </div>
//               </div>
//               <button type="submit" style={styles.buttonPrimary}>💾 Save Profile Updates</button>
//             </form>
//           </div>
//         )}

//         {/* --- TAB 4: QUIZZES --- */}
//         {activeTab === 'quiz' && (
//            <div style={styles.card}>
//              <h2 style={{marginTop: 0, color: '#0f172a', fontSize: '22px'}}>My Practice Scores</h2>
//              <p style={{ color: '#64748b', marginBottom: '25px' }}>Scores from your general skill assessments.</p>
//              <table style={styles.table}>
//                <thead>
//                  <tr>
//                    <th style={styles.th}>Assessment Name</th>
//                    <th style={styles.th}>Date Taken</th>
//                    <th style={styles.th}>Final Score</th>
//                  </tr>
//                </thead>
//                <tbody>
//                  {quizResults.length === 0 ? (
//                    <tr><td colSpan="3" style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>No practice assessments taken yet.</td></tr>
//                  ) : (
//                    quizResults.map((quiz, index) => (
//                      <tr key={quiz._id || index}>
//                        <td style={styles.td}><strong style={{color: '#0f172a'}}>{quiz.testName}</strong></td>
//                        <td style={styles.td}>{new Date(quiz.dateTaken).toLocaleDateString()}</td>
//                        <td style={styles.td}>
//                          <span style={{ backgroundColor: quiz.score === '100%' ? '#dcfce7' : '#e0f2fe', color: quiz.score === '100%' ? '#15803d' : '#0369a1', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
//                            {quiz.score}
//                          </span>
//                        </td>
//                      </tr>
//                    ))
//                  )}
//                </tbody>
//              </table>
//            </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [appRes, profileRes] = await Promise.all([
          axios.get('http://localhost:5000/api/applications/user', { headers }),
          axios.get('http://localhost:5000/api/users/profile', { headers })
        ]);
        setAppliedJobs(appRes.data);
        setQuizResults(profileRes.data.assessments || []);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const avgScore = quizResults.length > 0 
    ? Math.round(quizResults.reduce((acc, q) => acc + parseInt(q.score), 0) / quizResults.length) 
    : 0;

  const styles = {
    layout: { padding: '40px', backgroundColor: '#f4f7fa', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" },
    
    // Welcome Banner
    banner: { 
      background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)', 
      padding: '40px', 
      borderRadius: '24px', 
      color: 'white', 
      marginBottom: '40px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,123,255,0.2)'
    },
    bannerCircle: { position: 'absolute', right: '-50px', top: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px', marginBottom: '40px' },
    
    // Modern Stat Card
    card: { 
      backgroundColor: 'white', 
      padding: '30px', 
      borderRadius: '20px', 
      boxShadow: '0 4px 15px rgba(0,0,0,0.03)', 
      border: '1px solid #eef2f6',
      transition: 'transform 0.3s ease'
    },
    iconBox: (bg) => ({ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '15px' }),
    statNum: { fontSize: '32px', fontWeight: '800', color: '#1a202c', margin: '5px 0' },
    statLabel: { color: '#64748b', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' },

    // Chart Area
    chartCard: { backgroundColor: 'white', padding: '35px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eef2f6' },
    
    // Quick Actions
    actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' },
    actionBtn: { padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }
  };

  const chartData = quizResults.slice(-6).map(q => ({ 
    name: q.testName.length > 10 ? q.testName.substring(0, 10) + '...' : q.testName, 
    score: parseInt(q.score) 
  }));

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}><h2>Analyzing your data...</h2></div>;

  return (
    <div style={styles.layout}>
      
      {/* 1. WELCOME BANNER */}
      <div style={styles.banner}>
        <div style={styles.bannerCircle}></div>
        <h1 style={{fontSize: '36px', fontWeight: '800', margin: '0 0 10px 0'}}>Career Insights</h1>
        <p style={{fontSize: '18px', opacity: 0.9}}>Welcome back, {user.name || 'Candidate'}. Here is your current hiring progress.</p>
        <div style={{display: 'flex', gap: '15px', marginTop: '25px'}}>
            <button onClick={() => navigate('/jobs')} style={{padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: 'white', color: '#007BFF', fontWeight: 'bold', cursor: 'pointer'}}>Find New Jobs</button>
            <button onClick={() => navigate('/user/profile')} style={{padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.4)', backgroundColor: 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer'}}>Update Profile</button>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.iconBox('#e0f2fe')}>📂</div>
          <p style={styles.statLabel}>Applications</p>
          <h2 style={styles.statNum}>{appliedJobs.length}</h2>
          <span style={{fontSize: '12px', color: '#16a34a', fontWeight: 'bold'}}>Total active requests</span>
        </div>

        <div style={styles.card}>
          <div style={styles.iconBox('#fef3c7')}>🎯</div>
          <p style={styles.statLabel}>Avg. Assessment</p>
          <h2 style={styles.statNum}>{avgScore}%</h2>
          <span style={{fontSize: '12px', color: avgScore > 70 ? '#16a34a' : '#ef4444', fontWeight: 'bold'}}>
            {avgScore > 70 ? 'Excellent performance' : 'Keep practicing'}
          </span>
        </div>

        <div style={styles.card}>
          <div style={styles.iconBox('#dcfce7')}>🤝</div>
          <p style={styles.statLabel}>Interviews</p>
          <h2 style={{...styles.statNum, color: '#16a34a'}}>{appliedJobs.filter(a => a.status === 'Interview Scheduled').length}</h2>
          <span style={{fontSize: '12px', color: '#64748b', fontWeight: 'bold'}}>Scheduled meetings</span>
        </div>
      </div>

      {/* 3. CHART & SIDE INFO */}
      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px'}}>
        
        <div style={styles.chartCard}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
            <h3 style={{fontSize: '20px', fontWeight: '800'}}>Recent Assessment Performance</h3>
            <span style={{fontSize: '12px', color: '#64748b', fontWeight: 'bold'}}>LAST 6 TESTS</span>
          </div>
          <div style={{height: '300px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 75 ? '#16a34a' : '#007BFF'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <div style={{...styles.card, backgroundColor: '#0f172a', color: 'white'}}>
                <h4 style={{marginBottom: '10px'}}>Preparation Level</h4>
                <div style={{height: '8px', width: '100%', backgroundColor: '#334155', borderRadius: '10px', margin: '15px 0'}}>
                    <div style={{height: '100%', width: `${avgScore}%`, backgroundColor: '#38bdf8', borderRadius: '10px'}}></div>
                </div>
                <p style={{fontSize: '13px', opacity: 0.7}}>Based on your test scores and profile completeness.</p>
            </div>
            
            <div style={styles.card}>
                <h4 style={{marginBottom: '15px'}}>Quick Navigation</h4>
                <button onClick={() => navigate('/user/take-test')} style={{...styles.actionBtn, backgroundColor: '#f0fdf4', color: '#16a34a', width: '100%', marginBottom: '10px'}}>
                    📝 Take Practice Test
                </button>
                <button onClick={() => navigate('/user/applied-jobs')} style={{...styles.actionBtn, backgroundColor: '#eff6ff', color: '#007BFF', width: '100%'}}>
                    📄 View Applications
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;