// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const CompanyDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('applications');

//   // --- DATABASE STATES ---
//   const [myJobs, setMyJobs] = useState([]);
//   const [applications, setApplications] = useState([]);
//   const [myTests, setMyTests] = useState([]);
//   const [myVideos, setMyVideos] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // --- FORM STATES ---
//   const [newJob, setNewJob] = useState({ title: '', type: 'Full-time', industry: '', description: '' });
//   const [newVideo, setNewVideo] = useState({ title: '', url: '' });
//   const [newTest, setNewTest] = useState({ testName: '', role: '', duration: '30' });
//   const [questions, setQuestions] = useState([
//     { questionText: '', options: ['', '', '', ''], correctAnswer: '' }
//   ]);

//   // --- SCHEDULING MODAL STATES ---
//   const [showModal, setShowModal] = useState(false);
//   const [currentAppId, setCurrentAppId] = useState(null);
//   const [interviewDetails, setInterviewDetails] = useState({ date: '', time: '', link: '' });

//   // --- HELPER: GET YOUTUBE THUMBNAIL ---
//   const getYouTubeID = (url) => {
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return (match && match[2].length === 11) ? match[2] : null;
//   };

//   // --- FETCH ALL DATA ---
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('token');
//         const headers = { Authorization: `Bearer ${token}` };

//         if (activeTab === 'jobs') {
//           const res = await axios.get('http://localhost:5000/api/jobs');
//           setMyJobs(res.data.filter(job => job.companyId && job.companyId._id === user.id));
//         }
//         if (activeTab === 'applications' || activeTab === 'interviews') {
//           const res = await axios.get('http://localhost:5000/api/applications/company', { headers });
//           setApplications(res.data);
//         }
//         if (activeTab === 'manageTests') {
//           const res = await axios.get('http://localhost:5000/api/tests/company', { headers });
//           setMyTests(res.data);
//         }
//         if (activeTab === 'manageVideos') {
//           const res = await axios.get('http://localhost:5000/api/videos/company', { headers });
//           setMyVideos(res.data);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboardData();
//   }, [activeTab, user.id]);

//   // --- VIDEO ACTIONS ---
//   const handleAddVideo = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post('http://localhost:5000/api/videos', newVideo, { headers: { Authorization: `Bearer ${token}` } });
//       alert('Video added successfully!');
//       setMyVideos([response.data.video, ...myVideos]);
//       setNewVideo({ title: '', url: '' });
//     } catch (error) { alert('Failed to add video.'); }
//   };

//   const handleDeleteVideo = async (videoId) => {
//     if (window.confirm('Are you sure you want to remove this video?')) {
//       try {
//         const token = localStorage.getItem('token');
//         await axios.delete(`http://localhost:5000/api/videos/${videoId}`, { headers: { Authorization: `Bearer ${token}` } });
//         setMyVideos(myVideos.filter(v => v._id !== videoId));
//       } catch (error) { alert('Failed to delete video.'); }
//     }
//   };

//   // --- DYNAMIC QUESTION BUILDER LOGIC ---
//   const handleQuestionChange = (index, field, value) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index][field] = value;
//     setQuestions(updatedQuestions);
//   };
//   const handleOptionChange = (qIndex, optIndex, value) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[qIndex].options[optIndex] = value;
//     setQuestions(updatedQuestions);
//   };
//   const addQuestion = () => setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
//   const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));

//   const handleCreateTest = async (e) => {
//     e.preventDefault();
//     const isValid = questions.every(q => q.correctAnswer !== '');
//     if (!isValid) return alert("Please make sure you have selected a 'Correct Answer' for every question!");
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post('http://localhost:5000/api/tests', { ...newTest, questions }, { headers: { Authorization: `Bearer ${token}` } });
//       alert(`Test "${response.data.test.testName}" created successfully!`);
//       setNewTest({ testName: '', role: '', duration: '30' });
//       setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
//       setMyTests([...myTests, response.data.test]);
//     } catch (error) { alert('Failed to save test.'); }
//   };

//   // --- NEW: DELETE TEST LOGIC ---
//   const handleDeleteTest = async (testId) => {
//     if (window.confirm('Are you sure you want to delete this assessment?')) {
//       try {
//         const token = localStorage.getItem('token');
//         await axios.delete(`http://localhost:5000/api/tests/${testId}`, { 
//           headers: { Authorization: `Bearer ${token}` } 
//         });
//         // Remove it from the screen
//         setMyTests(myTests.filter(test => test._id !== testId));
//         alert('Assessment deleted successfully!');
//       } catch (error) { 
//         alert('Failed to delete the assessment.'); 
//       }
//     }
//   };

//   // --- POST JOB ---
//   const handlePostJob = async (e) => {
//     e.preventDefault();
//     if (!newJob.title || !newJob.industry) return alert('Please fill in required fields!');
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post('http://localhost:5000/api/jobs', newJob, { headers: { Authorization: `Bearer ${token}` } });
//       alert(`Successfully posted: ${response.data.job.title}`);
//       setMyJobs([...myJobs, response.data.job]);
//       setNewJob({ title: '', type: 'Full-time', industry: '', description: '' });
//       setActiveTab('jobs'); 
//     } catch (error) { alert(error.response?.data?.message || 'Failed to post job.'); }
//   };

//   const handleDeleteJob = async (jobId) => {
//     if (window.confirm('Delete this job posting?')) {
//       setMyJobs(myJobs.filter(job => job._id !== jobId));
//       alert('Job removed.');
//     }
//   };

//   // --- ATS ACTIONS ---
//   const handleStatusUpdate = async (appId, newStatus) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`http://localhost:5000/api/applications/${appId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
//       setApplications(applications.map(app => app._id === appId ? { ...app, status: newStatus } : app));
//     } catch (error) { alert('Failed to update status.'); }
//   };

//   const handleSendTest = async (appId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`http://localhost:5000/api/applications/${appId}/send-test`, {}, { headers: { Authorization: `Bearer ${token}` } });
//       setApplications(applications.map(app => app._id === appId ? { ...app, status: 'Test Sent' } : app));
//       alert('Assessment sent!');
//     } catch (error) { alert('Failed to send test. Create one first!'); }
//   };

//   const openScheduleModal = (appId) => { setCurrentAppId(appId); setShowModal(true); };

//   const handleScheduleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const combinedDateTime = new Date(`${interviewDetails.date}T${interviewDetails.time}`).toISOString();
//       await axios.put(`http://localhost:5000/api/applications/${currentAppId}/schedule`, { interviewDate: combinedDateTime, interviewLink: interviewDetails.link }, { headers: { Authorization: `Bearer ${token}` } });
//       setApplications(applications.map(app => app._id === currentAppId ? { ...app, status: 'Interview Scheduled', interviewDate: combinedDateTime, interviewLink: interviewDetails.link } : app));
//       setShowModal(false);
//       setInterviewDetails({ date: '', time: '', link: '' });
//       alert('Interview Scheduled!');
//     } catch (error) { alert('Failed to schedule.'); }
//   };

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
//     sidebar: { width: '280px', backgroundColor: '#ffffff', borderRight: '1px solid #e1e4e8', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box' },
//     sidebarTitle: { margin: '0 0 30px 10px', color: '#0f172a', fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' },
//     sidebarBtn: (isActive) => ({ padding: '14px 20px', backgroundColor: isActive ? '#eff6ff' : 'transparent', color: isActive ? '#007BFF' : '#475569', border: 'none', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontSize: '15px', fontWeight: isActive ? '700' : '600', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '12px' }),
//     content: { flex: 1, padding: '40px 50px', overflowX: 'auto' },
//     pageHeader: { marginTop: 0, color: '#0f172a', fontSize: '32px', fontWeight: '800', marginBottom: '8px' },
//     pageSub: { color: '#64748b', fontSize: '16px', marginBottom: '35px' },
//     card: { backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', marginBottom: '30px' },
//     formGroup: { marginBottom: '20px' },
//     label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155', fontSize: '14px' },
//     input: { width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontSize: '15px', outline: 'none', transition: 'border 0.2s' },
//     textarea: { width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontSize: '15px', minHeight: '120px', outline: 'none' },
//     buttonPrimary: { padding: '12px 24px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', transition: '0.2s', boxShadow: '0 4px 10px rgba(0,123,255,0.2)' },
//     buttonAction: (bg, color) => ({ padding: '8px 14px', backgroundColor: bg, color: color, border: `1px solid ${bg}`, borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: '0.2s', marginRight: '8px', marginBottom: '5px' }),
//     table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
//     th: { borderBottom: '2px solid #e2e8f0', padding: '16px 12px', textAlign: 'left', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' },
//     td: { borderBottom: '1px solid #f1f5f9', padding: '20px 12px', verticalAlign: 'middle', color: '#334155', fontSize: '15px' },
//     questionBox: { border: '1px solid #e2e8f0', padding: '25px', borderRadius: '12px', marginBottom: '25px', backgroundColor: '#fdfdfd', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
//     modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
//     modalContent: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }
//   };

//   const scheduledInterviews = applications.filter(app => app.status === 'Interview Scheduled' || app.status === 'Accepted');

//   return (
//     <div style={styles.layout}>
      
//       {/* SIDEBAR */}
//       <div style={styles.sidebar}>
//         <h3 style={styles.sidebarTitle}>Company Portal</h3>
//         <button style={styles.sidebarBtn(activeTab === 'applications')} onClick={() => setActiveTab('applications')}>
//           <span style={{fontSize:'18px'}}>📥</span> Applicant Tracking
//         </button>
//         <button style={styles.sidebarBtn(activeTab === 'interviews')} onClick={() => setActiveTab('interviews')}>
//           <span style={{fontSize:'18px'}}>📅</span> Upcoming Interviews
//         </button>
//         <button style={styles.sidebarBtn(activeTab === 'manageTests')} onClick={() => setActiveTab('manageTests')}>
//           <span style={{fontSize:'18px'}}>📝</span> Custom Assessments
//         </button>
//         <button style={styles.sidebarBtn(activeTab === 'manageVideos')} onClick={() => setActiveTab('manageVideos')}>
//           <span style={{fontSize:'18px'}}>🎥</span> Interview Videos
//         </button>
//         <div style={{height: '1px', backgroundColor: '#e1e4e8', margin: '15px 10px'}}></div>
//         <button style={styles.sidebarBtn(activeTab === 'jobs')} onClick={() => setActiveTab('jobs')}>
//           <span style={{fontSize:'18px'}}>💼</span> Manage Jobs
//         </button>
//         <button style={styles.sidebarBtn(activeTab === 'postJob')} onClick={() => setActiveTab('postJob')}>
//           <span style={{fontSize:'18px'}}>✨</span> Post a New Job
//         </button>
//       </div>

//       {/* MAIN CONTENT */}
//       <div style={styles.content}>
        
//         {/* --- TAB 1: APPLICANT TRACKING (ATS) --- */}
//         {activeTab === 'applications' && (
//           <div>
//             <h1 style={styles.pageHeader}>Applicant Tracking System</h1>
//             <p style={styles.pageSub}>Manage your hiring pipeline and review incoming candidates.</p>
            
//             <div style={styles.card}>
//               {loading ? <p style={{color: '#64748b'}}>Fetching applications...</p> : (
//                 <table style={styles.table}>
//                   <thead>
//                     <tr>
//                       <th style={styles.th}>Candidate Profile</th>
//                       <th style={styles.th}>Role Applied For</th>
//                       <th style={styles.th}>Pipeline Status</th>
//                       <th style={styles.th}>Assessment</th>
//                       <th style={styles.th}>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {applications.length === 0 ? (
//                       <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No applications received yet. Post a job to get started!</td></tr>
//                     ) : (
//                       applications.map(app => (
//                         <tr key={app._id}>
//                           <td style={styles.td}>
//                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                               <img src={`https://ui-avatars.com/api/?name=${app.userId?.name || 'U'}&background=e2e8f0&color=475569&bold=true`} alt="Avatar" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
//                               <div>
//                                 <strong style={{fontSize: '16px', color: '#0f172a'}}>{app.userId?.name || 'Unknown Candidate'}</strong><br/>
//                                 <a href={`mailto:${app.userId?.email}`} style={{ fontSize: '13px', color: '#007BFF', textDecoration: 'none' }}>{app.userId?.email}</a>
//                               </div>
//                             </div>
//                             {app.userId?.resume && (
//                                 <a 
//                                   href={app.userId.resume.startsWith('http') 
//                                     ? app.userId.resume 
//                                     : `http://localhost:5000/uploads/${app.userId.resume.split(/[\\/]/).pop()}`} 
//                                   target="_blank" 
//                                   rel="noreferrer" 
//                                   style={{ fontSize: '12px', color: '#007BFF', fontWeight: 'bold', textDecoration: 'none', backgroundColor: '#e0f2fe', padding: '6px 12px', borderRadius: '6px', display: 'inline-block', marginTop: '12px' }}
//                                 >
//                                   📄 Open Resume
//                                 </a>
//                               )}
//                           </td>
//                           <td style={styles.td}><strong>{app.jobId?.title || 'Unknown Role'}</strong></td>
//                           <td style={styles.td}><span style={getBadgeStyle(app.status)}>{app.status}</span></td>
//                           <td style={styles.td}>
//                             {app.testScore !== null && app.testScore !== undefined ? <strong style={{ color: '#7e22ce', fontSize: '18px' }}>{app.testScore}%</strong> : <span style={{ color: '#cbd5e1' }}>Pending</span>}
//                           </td>
//                           <td style={styles.td}>
//                             {(!app.status || app.status === 'Applied') && (
//                               <button style={styles.buttonAction('#0f172a', '#fff')} onClick={() => handleSendTest(app._id)}>✉️ Assign Test</button>
//                             )}
//                             {app.status === 'Test Sent' && <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Awaiting Submission</span>}
//                             {app.status === 'Test Completed' && (
//                               <button style={styles.buttonAction('#007BFF', '#fff')} onClick={() => openScheduleModal(app._id)}>📅 Schedule Interview</button>
//                             )}
//                             {app.status === 'Interview Scheduled' && (
//                               <div style={{display: 'flex', gap: '5px'}}>
//                                 <button style={styles.buttonAction('#16a34a', '#fff')} onClick={() => handleStatusUpdate(app._id, 'Accepted')}>✓ Hire</button>
//                                 <button style={styles.buttonAction('#fff', '#dc2626')} onClick={() => handleStatusUpdate(app._id, 'Rejected')}>✗ Pass</button>
//                               </div>
//                             )}
//                             {(app.status === 'Accepted' || app.status === 'Rejected') && <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>Decision Finalized</span>}
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         )}

//         {/* --- TAB 2: INTERVIEWS --- */}
//         {activeTab === 'interviews' && (
//           <div>
//             <h1 style={styles.pageHeader}>Upcoming Interviews</h1>
//             <p style={styles.pageSub}>Review your confirmed candidate meetings.</p>
//             <div style={styles.card}>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Candidate</th>
//                     <th style={styles.th}>Target Role</th>
//                     <th style={styles.th}>Scheduled Time</th>
//                     <th style={styles.th}>Meeting Link</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {scheduledInterviews.length === 0 ? (
//                     <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No interviews scheduled.</td></tr>
//                   ) : (
//                     scheduledInterviews.map(app => (
//                       <tr key={`int-${app._id}`}>
//                         <td style={styles.td}><strong>{app.userId?.name}</strong></td>
//                         <td style={styles.td}>{app.jobId?.title}</td>
//                         <td style={styles.td}>
//                           <div style={{color: '#0f172a', fontWeight: 'bold'}}>{new Date(app.interviewDate).toLocaleDateString()}</div>
//                           <div style={{fontSize: '14px', color: '#64748b'}}>{new Date(app.interviewDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
//                         </td>
//                         <td style={styles.td}>
//                           <a href={app.interviewLink} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 16px', backgroundColor: '#eff6ff', color: '#007BFF', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>📹 Join Meeting</a>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* --- TAB 3: MANAGE TESTS --- */}
//         {activeTab === 'manageTests' && (
//           <div>
//             <h1 style={styles.pageHeader}>Custom Assessments</h1>
//             <p style={styles.pageSub}>Build automated skill tests to screen candidates efficiently.</p>
            
//             <div style={styles.card}>
//               <h2 style={{fontSize: '20px', marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px'}}>Create New Assessment</h2>
//               <form onSubmit={handleCreateTest}>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
//                   <div>
//                     <label style={styles.label}>Assessment Name</label>
//                     <input type="text" required style={styles.input} value={newTest.testName} onChange={(e) => setNewTest({...newTest, testName: e.target.value})} placeholder="e.g., Senior React Check" />
//                   </div>
//                   <div>
//                     <label style={styles.label}>Target Role</label>
//                     <input type="text" required style={styles.input} value={newTest.role} onChange={(e) => setNewTest({...newTest, role: e.target.value})} placeholder="e.g., Frontend Developer" />
//                   </div>
//                   <div>
//                     <label style={styles.label}>Time Limit (Minutes)</label>
//                     <select style={styles.input} value={newTest.duration} onChange={(e) => setNewTest({...newTest, duration: e.target.value})}>
//                       <option value="15">15 Minutes</option>
//                       <option value="30">30 Minutes</option>
//                       <option value="60">60 Minutes</option>
//                     </select>
//                   </div>
//                 </div>

//                 <h3 style={{ fontSize: '16px', color: '#475569', marginBottom: '15px' }}>Assessment Questions</h3>
//                 {questions.map((q, qIndex) => (
//                   <div key={qIndex} style={styles.questionBox}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
//                       <strong style={{ color: '#007BFF' }}>Question {qIndex + 1}</strong>
//                       {questions.length > 1 && (
//                         <button type="button" onClick={() => removeQuestion(qIndex)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button>
//                       )}
//                     </div>
//                     <input type="text" required style={{...styles.input, marginBottom: '20px'}} placeholder="Type your question here..." value={q.questionText} onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)} />
                    
//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
//                       {q.options.map((opt, optIndex) => (
//                         <input key={optIndex} type="text" required style={styles.input} placeholder={`Option ${optIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)} />
//                       ))}
//                     </div>
//                     <div>
//                       <label style={styles.label}>Select Correct Answer:</label>
//                       <select required style={styles.input} value={q.correctAnswer} onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}>
//                         <option value="">-- Choose the correct option --</option>
//                         {q.options.map((opt, idx) => ( opt !== '' && <option key={idx} value={opt}>{opt}</option> ))}
//                       </select>
//                     </div>
//                   </div>
//                 ))}

//                 <button type="button" onClick={addQuestion} style={{ padding: '10px 20px', backgroundColor: '#eff6ff', color: '#007BFF', border: '2px dashed #007BFF', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '25px' }}>➕ Add Another Question</button>
//                 <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '25px' }}>
//                   <button type="submit" style={styles.buttonPrimary}>💾 Save Assessment to Library</button>
//                 </div>
//               </form>
//             </div>

//             {myTests.length > 0 && (
//               <div style={styles.card}>
//                 <h2 style={{fontSize: '20px', marginTop: 0, marginBottom: '20px'}}>My Assessment Library</h2>
//                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
//                   {myTests.map(test => (
//                     <div key={test._id} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
//                       <strong style={{fontSize: '18px', color: '#0f172a', display: 'block', marginBottom: '5px'}}>{test.testName}</strong>
//                       <span style={{color: '#64748b', fontSize: '14px', display: 'block', marginBottom: '15px'}}>{test.role}</span>
                      
//                       <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
//                         <span style={{backgroundColor: '#e0f2fe', color: '#0284c7', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold'}}>{test.questions.length} Questions</span>
//                         <span style={{backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold'}}>⏱ {test.duration} Mins</span>
//                       </div>

//                       {/* --- UPDATED: PREVIEW AND DELETE BUTTONS --- */}
//                       <div style={{ display: 'flex', gap: '10px' }}>
//                         <button 
//                           onClick={() => navigate(`/company/test-preview/${test._id}`)} 
//                           style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #007BFF', backgroundColor: '#fff', color: '#007BFF', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
//                           onMouseOver={(e) => { e.target.style.backgroundColor = '#007BFF'; e.target.style.color = '#fff'; }}
//                           onMouseOut={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#007BFF'; }}
//                         >
//                           👁️ Preview
//                         </button>
                        
//                         <button 
//                           onClick={() => handleDeleteTest(test._id)} 
//                           style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #fca5a5', backgroundColor: '#fff', color: '#dc2626', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
//                           onMouseOver={(e) => { e.target.style.backgroundColor = '#fee2e2'; }}
//                           onMouseOut={(e) => { e.target.style.backgroundColor = '#fff'; }}
//                         >
//                           🗑️ Delete
//                         </button>
//                       </div>

//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* --- TAB 4: INTERVIEW VIDEOS --- */}
//         {activeTab === 'manageVideos' && (
//           <div>
//             <h1 style={styles.pageHeader}>Preparation Resources</h1>
//             <p style={styles.pageSub}>Upload videos to help candidates prepare for your interviews.</p>
            
//             <div style={styles.card}>
//               <form onSubmit={handleAddVideo}>
//                 <div style={{display: 'flex', gap: '20px', alignItems: 'flex-end'}}>
//                   <div style={{flex: 1}}>
//                     <label style={styles.label}>Video Title</label>
//                     <input type="text" required style={styles.input} value={newVideo.title} onChange={(e) => setNewVideo({...newVideo, title: e.target.value})} placeholder="e.g., Company Culture Overview" />
//                   </div>
//                   <div style={{flex: 2}}>
//                     <label style={styles.label}>YouTube URL</label>
//                     <input type="url" required style={styles.input} value={newVideo.url} onChange={(e) => setNewVideo({...newVideo, url: e.target.value})} placeholder="https://youtube.com/..." />
//                   </div>
//                   <button type="submit" style={styles.buttonPrimary}>Add Video</button>
//                 </div>
//               </form>
//             </div>

//             {myVideos.length > 0 && (
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
//                 {myVideos.map(v => {
//                   const videoId = getYouTubeID(v.url); // Extract ID for thumbnail
//                   return (
//                     <div key={v._id} style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                      
//                       {/* --- NEW: THUMBNAIL RENDERER --- */}
//                       {videoId ? (
//                         <img 
//                           src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} 
//                           alt="Thumbnail" 
//                           style={{ width: '100%', height: '160px', objectFit: 'cover' }} 
//                         />
//                       ) : (
//                         <div style={{ width: '100%', height: '160px', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
//                           No Thumbnail
//                         </div>
//                       )}
                      
//                       <div style={{ padding: '20px' }}>
//                         <strong style={{ fontSize: '18px', color: '#0f172a', display: 'block', marginBottom: '15px', height: '45px', overflow: 'hidden' }}>
//                           {v.title}
//                         </strong>
                        
//                         <div style={{ display: 'flex', gap: '10px' }}>
//                           <a 
//                             href={v.url} 
//                             target="_blank" 
//                             rel="noreferrer" 
//                             style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: '#ef4444', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}
//                           >
//                             ▶ Watch
//                           </a>
//                           <button 
//                             onClick={() => handleDeleteVideo(v._id)} 
//                             style={{ flex: 1, padding: '10px', backgroundColor: '#fff', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
//                             onMouseOver={(e) => { e.target.style.backgroundColor = '#fee2e2'; }}
//                             onMouseOut={(e) => { e.target.style.backgroundColor = '#fff'; }}
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       </div>

//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         )}

//         {/* --- TAB 5: MANAGE JOBS --- */}
//         {activeTab === 'jobs' && (
//           <div>
//             <h1 style={styles.pageHeader}>Active Job Listings</h1>
//             <p style={styles.pageSub}>Manage your open roles on the job board.</p>
//             <div style={styles.card}>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Role Details</th>
//                     <th style={styles.th}>Type</th>
//                     <th style={styles.th}>Date Posted</th>
//                     <th style={styles.th}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {myJobs.length === 0 ? (
//                     <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No active jobs. Click 'Post a New Job' to start hiring!</td></tr>
//                   ) : (
//                     myJobs.map(job => (
//                       <tr key={job._id}>
//                         <td style={styles.td}>
//                           <strong style={{color: '#0f172a', fontSize: '16px', display: 'block'}}>{job.title}</strong>
//                           <span style={{color: '#64748b', fontSize: '13px'}}>{job.industry}</span>
//                         </td>
//                         <td style={styles.td}><span style={{backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold'}}>{job.type}</span></td>
//                         <td style={styles.td}>{new Date(job.createdAt).toLocaleDateString()}</td>
//                         <td style={styles.td}>
//                           <button style={styles.buttonAction('#fee2e2', '#dc2626')} onClick={() => handleDeleteJob(job._id)}>Close Job</button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* --- TAB 6: POST A JOB --- */}
//         {activeTab === 'postJob' && (
//           <div>
//             <h1 style={styles.pageHeader}>Post a New Job</h1>
//             <p style={styles.pageSub}>Publish an open role to the global job board.</p>
//             <div style={styles.card} styl={{maxWidth: '800px', ...styles.card}}>
//               <form onSubmit={handlePostJob}>
//                 <div style={styles.formGroup}>
//                   <label style={styles.label}>Job Title *</label>
//                   <input type="text" style={styles.input} value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} placeholder="e.g., Senior Data Scientist" />
//                 </div>
                
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
//                   <div>
//                     <label style={styles.label}>Job Type</label>
//                     <select style={styles.input} value={newJob.type} onChange={(e) => setNewJob({...newJob, type: e.target.value})}>
//                       <option value="Full-time">Full-time</option>
//                       <option value="Part-time">Part-time</option>
//                       <option value="Remote">Remote</option>
//                       <option value="Internship">Internship</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label style={styles.label}>Industry *</label>
//                     <input type="text" style={styles.input} value={newJob.industry} onChange={(e) => setNewJob({...newJob, industry: e.target.value})} placeholder="e.g., IT, Finance, Healthcare" />
//                   </div>
//                 </div>

//                 <div style={styles.formGroup}>
//                   <label style={styles.label}>Job Description</label>
//                   <textarea style={styles.textarea} value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} placeholder="Describe the role, responsibilities, and requirements..."></textarea>
//                 </div>
//                 <button type="submit" style={styles.buttonPrimary}>🚀 Publish Job Listing</button>
//               </form>
//             </div>
//           </div>
//         )}

//       </div>

//       {/* --- SCHEDULING MODAL --- */}
//       {showModal && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modalContent}>
//             <h2 style={{ marginTop: 0, color: '#0f172a', fontSize: '24px', marginBottom: '10px' }}>Schedule Interview</h2>
//             <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '25px' }}>Set the date and meeting link. The candidate will be notified.</p>
            
//             <form onSubmit={handleScheduleSubmit}>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
//                 <div>
//                   <label style={styles.label}>Date</label>
//                   <input type="date" required style={styles.input} value={interviewDetails.date} onChange={(e) => setInterviewDetails({...interviewDetails, date: e.target.value})} />
//                 </div>
//                 <div>
//                   <label style={styles.label}>Time</label>
//                   <input type="time" required style={styles.input} value={interviewDetails.time} onChange={(e) => setInterviewDetails({...interviewDetails, time: e.target.value})} />
//                 </div>
//               </div>
//               <div style={{marginBottom: '30px'}}>
//                 <label style={styles.label}>Meeting Link (Zoom/Google Meet)</label>
//                 <input type="url" required placeholder="https://zoom.us/j/..." style={styles.input} value={interviewDetails.link} onChange={(e) => setInterviewDetails({...interviewDetails, link: e.target.value})} />
//               </div>
              
//               <div style={{ display: 'flex', gap: '15px' }}>
//                 <button type="submit" style={{...styles.buttonPrimary, flex: 1, backgroundColor: '#16a34a', boxShadow: 'none'}}>Confirm Schedule</button>
//                 <button type="button" onClick={() => setShowModal(false)} style={{...styles.buttonPrimary, flex: 1, backgroundColor: '#f1f5f9', color: '#475569', boxShadow: 'none'}}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default CompanyDashboard;

import React, { useState } from 'react';
import ApplicantTracking from './ApplicantTracking';
import UpcomingInterviews from './UpcomingInterviews';
import CustomAssessments from './CustomAssessments';
import InterviewVideos from './InterviewVideos';
import ManageJobs from './ManageJobs';
import PostJob from './PostJob';

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('applications');

  const styles = {
    layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: "'Segoe UI', sans-serif" },
    sidebar: { width: '280px', backgroundColor: '#ffffff', borderRight: '1px solid #e1e4e8', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box' },
    sidebarTitle: { margin: '0 0 30px 10px', color: '#0f172a', fontSize: '20px', fontWeight: '800' },
    sidebarBtn: (isActive) => ({ padding: '14px 20px', backgroundColor: isActive ? '#eff6ff' : 'transparent', color: isActive ? '#007BFF' : '#475569', border: 'none', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontSize: '15px', fontWeight: isActive ? '700' : '600', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '12px' }),
    content: { flex: 1, padding: '40px 50px', overflowX: 'auto' },
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'applications': return <ApplicantTracking />;
      case 'interviews': return <UpcomingInterviews />;
      case 'manageTests': return <CustomAssessments />;
      case 'manageVideos': return <InterviewVideos />;
      case 'jobs': return <ManageJobs />;
      case 'postJob': return <PostJob setActiveTab={setActiveTab} />; // Pass function to redirect after posting
      default: return <ApplicantTracking />;
    }
  };

  return (
    <div style={styles.layout}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>Company Portal</h3>
        <button style={styles.sidebarBtn(activeTab === 'applications')} onClick={() => setActiveTab('applications')}>
          <span style={{fontSize:'18px'}}>📥</span> Applicant Tracking
        </button>
        <button style={styles.sidebarBtn(activeTab === 'interviews')} onClick={() => setActiveTab('interviews')}>
          <span style={{fontSize:'18px'}}>📅</span> Upcoming Interviews
        </button>
        <button style={styles.sidebarBtn(activeTab === 'manageTests')} onClick={() => setActiveTab('manageTests')}>
          <span style={{fontSize:'18px'}}>📝</span> Custom Assessments
        </button>
        <button style={styles.sidebarBtn(activeTab === 'manageVideos')} onClick={() => setActiveTab('manageVideos')}>
          <span style={{fontSize:'18px'}}>🎥</span> Interview Videos
        </button>
        <div style={{height: '1px', backgroundColor: '#e1e4e8', margin: '15px 10px'}}></div>
        <button style={styles.sidebarBtn(activeTab === 'jobs')} onClick={() => setActiveTab('jobs')}>
          <span style={{fontSize:'18px'}}>💼</span> Manage Jobs
        </button>
        <button style={styles.sidebarBtn(activeTab === 'postJob')} onClick={() => setActiveTab('postJob')}>
          <span style={{fontSize:'18px'}}>✨</span> Post a New Job
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

export default CompanyDashboard;