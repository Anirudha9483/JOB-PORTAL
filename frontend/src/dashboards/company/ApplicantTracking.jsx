import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplicantTracking = () => {
  const [applications, setApplications] = useState([]);
  const [myTests, setMyTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [currentAppId, setCurrentAppId] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({ date: '', time: '', link: '' });

  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [appRes, testRes] = await Promise.all([
          axios.get('http://localhost:5000/api/applications/company', { headers }),
          axios.get('http://localhost:5000/api/tests/company', { headers })
        ]);
        setApplications(appRes.data);
        setMyTests(testRes.data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/applications/${appId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      setApplications(applications.map(app => app._id === appId ? { ...app, status: newStatus } : app));
    } catch (error) { alert('Failed to update status.'); }
  };

  const openTestModal = (appId) => {
    if (myTests.length === 0) return alert("Create a test in the 'Custom Assessments' tab first!");
    setCurrentAppId(appId); setShowTestModal(true);
  };

  const handleSendTestSubmit = async (e) => {
    e.preventDefault();
    if(!selectedTestId) return alert("Please select a test!");

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/applications/${currentAppId}/send-test`, { testId: selectedTestId }, { headers: { Authorization: `Bearer ${token}` } });
      
      // Update local state immediately so UI changes without refresh
      setApplications(applications.map(app => app._id === currentAppId ? { ...app, status: 'Test Sent' } : app));
      
      alert('Assessment sent successfully!'); 
      setShowTestModal(false); 
      setSelectedTestId('');
    } catch (error) { 
      alert(error.response?.data?.message || 'Failed to send test.'); 
    }
  };

  const openScheduleModal = (appId) => { setCurrentAppId(appId); setShowModal(true); };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const combinedDateTime = new Date(`${interviewDetails.date}T${interviewDetails.time}`).toISOString();
      await axios.put(`http://localhost:5000/api/applications/${currentAppId}/schedule`, { interviewDate: combinedDateTime, interviewLink: interviewDetails.link }, { headers: { Authorization: `Bearer ${token}` } });
      setApplications(applications.map(app => app._id === currentAppId ? { ...app, status: 'Interview Scheduled', interviewDate: combinedDateTime, interviewLink: interviewDetails.link } : app));
      setShowModal(false); setInterviewDetails({ date: '', time: '', link: '' }); alert('Interview Scheduled!');
    } catch (error) { alert('Failed to schedule.'); }
  };

  const getBadgeStyle = (status) => {
    let bg = '#e2e8f0', color = '#475569'; 
    if (status === 'Applied') { bg = '#fef3c7'; color = '#b45309'; }
    if (status === 'Test Sent') { bg = '#e0f2fe'; color = '#0284c7'; }
    if (status === 'Test Completed') { bg = '#f3e8ff'; color = '#7e22ce'; }
    if (status === 'Interview Scheduled') { bg = '#dbeafe'; color = '#0369a1'; }
    if (status === 'Accepted') { bg = '#dcfce7'; color = '#15803d'; }
    if (status === 'Rejected') { bg = '#fee2e2'; color = '#b91c1c'; }
    return { padding: '6px 12px', borderRadius: '20px', color: color, fontSize: '12px', fontWeight: 'bold', backgroundColor: bg, display: 'inline-block' };
  };

  const styles = {
    pageHeader: { marginTop: 0, color: '#0f172a', fontSize: '32px', fontWeight: '800', marginBottom: '8px' },
    pageSub: { color: '#64748b', fontSize: '16px', marginBottom: '35px' },
    card: { backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { borderBottom: '2px solid #e2e8f0', padding: '16px 12px', textAlign: 'left', color: '#64748b', fontSize: '13px', textTransform: 'uppercase' },
    td: { borderBottom: '1px solid #f1f5f9', padding: '20px 12px', verticalAlign: 'middle', color: '#334155', fontSize: '15px' },
    buttonAction: (bg, color) => ({ padding: '8px 14px', backgroundColor: bg, color: color, border: `1px solid ${bg}`, borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', marginRight: '8px', marginBottom: '5px' }),
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '500px' },
    input: { width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontSize: '15px', outline: 'none' },
    buttonPrimary: { padding: '12px 24px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }
  };

  return (
    <div>
      <h1 style={styles.pageHeader}>Applicant Tracking System</h1>
      <p style={styles.pageSub}>Manage your hiring pipeline and review incoming candidates.</p>
      
      <div style={styles.card}>
        {loading ? <p>Loading...</p> : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Candidate Profile</th>
                <th style={styles.th}>Role Applied For</th>
                <th style={styles.th}>Pipeline Status</th>
                <th style={styles.th}>Assessment</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No applications yet.</td></tr>
              ) : (
                applications.map(app => (
                  <tr key={app._id}>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={`https://ui-avatars.com/api/?name=${app.userId?.name}&background=e2e8f0&color=475569&bold=true`} alt="Avatar" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
                        <div>
                          <strong style={{fontSize: '16px'}}>{app.userId?.name}</strong><br/>
                          <a href={`mailto:${app.userId?.email}`} style={{ fontSize: '13px', color: '#007BFF', textDecoration: 'none' }}>{app.userId?.email}</a>
                        </div>
                      </div>
                      {app.userId?.resume && (
                        <a href={app.userId.resume.startsWith('http') ? app.userId.resume : `http://localhost:5000/uploads/${app.userId.resume.split(/[\\/]/).pop()}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#007BFF', fontWeight: 'bold', textDecoration: 'none', backgroundColor: '#e0f2fe', padding: '6px 12px', borderRadius: '6px', display: 'inline-block', marginTop: '12px' }}>📄 Open Resume</a>
                      )}
                    </td>
                    <td style={styles.td}><strong>{app.jobId?.title}</strong></td>
                    <td style={styles.td}><span style={getBadgeStyle(app.status)}>{app.status}</span></td>
                    
                    {/* SHOW SCORE IF IT EXISTS */}
                    <td style={styles.td}>{app.testScore !== undefined && app.testScore !== null ? <strong>{app.testScore}%</strong> : <span style={{color: '#94a3b8'}}>Pending</span>}</td>
                    
                    <td style={styles.td}>
                      {/* FIXED CONDITIONAL RENDERING FOR ACTIONS */}
                      {(!app.status || app.status === 'Applied') && (
                        <button style={styles.buttonAction('#0f172a', '#fff')} onClick={() => openTestModal(app._id)}>✉️ Assign Test</button>
                      )}
                      
                      {app.status === 'Test Sent' && (
                         <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', fontWeight: 'bold' }}>Waiting on Candidate...</span>
                      )}

                      {app.status === 'Test Completed' && (
                        <button style={styles.buttonAction('#007BFF', '#fff')} onClick={() => openScheduleModal(app._id)}>📅 Schedule Interview</button>
                      )}
                      
                      {app.status === 'Interview Scheduled' && (
                        <div>
                          <button style={styles.buttonAction('#16a34a', '#fff')} onClick={() => handleStatusUpdate(app._id, 'Accepted')}>✓ Hire Candidate</button>
                          <button style={styles.buttonAction('#fee2e2', '#dc2626')} onClick={() => handleStatusUpdate(app._id, 'Rejected')}>✗ Reject</button>
                        </div>
                      )}

                      {(app.status === 'Accepted' || app.status === 'Rejected') && (
                         <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>Process Finished</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODALS FOR THIS TAB */}
      {showTestModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Assign Assessment</h2>
            <form onSubmit={handleSendTestSubmit}>
              <select required style={styles.input} value={selectedTestId} onChange={(e) => setSelectedTestId(e.target.value)}>
                <option value="">-- Choose a custom test --</option>
                {myTests.map(test => <option key={test._id} value={test._id}>{test.testName}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button type="submit" style={{...styles.buttonPrimary, flex: 1}}>Send Test</button>
                <button type="button" onClick={() => setShowTestModal(false)} style={{...styles.buttonPrimary, flex: 1, backgroundColor: '#f1f5f9', color: '#475569'}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Schedule Interview</h2>
            <form onSubmit={handleScheduleSubmit}>
              <input type="date" required style={{...styles.input, marginBottom: '10px'}} value={interviewDetails.date} onChange={(e) => setInterviewDetails({...interviewDetails, date: e.target.value})} />
              <input type="time" required style={{...styles.input, marginBottom: '10px'}} value={interviewDetails.time} onChange={(e) => setInterviewDetails({...interviewDetails, time: e.target.value})} />
              <input type="url" required placeholder="Zoom Link" style={{...styles.input, marginBottom: '20px'}} value={interviewDetails.link} onChange={(e) => setInterviewDetails({...interviewDetails, link: e.target.value})} />
              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="submit" style={{...styles.buttonPrimary, flex: 1, backgroundColor: '#16a34a'}}>Confirm</button>
                <button type="button" onClick={() => setShowModal(false)} style={{...styles.buttonPrimary, flex: 1, backgroundColor: '#f1f5f9', color: '#475569'}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantTracking;