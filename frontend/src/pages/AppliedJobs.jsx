import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppliedJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/applications/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppliedJobs(res.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

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
    layout: { padding: '60px 20px', backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" },
    container: { maxWidth: '1100px', margin: '0 auto' },
    // Summary Section Styles
    summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' },
    summaryCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', textAlign: 'center' },
    
    card: { backgroundColor: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { borderBottom: '2px solid #e2e8f0', padding: '16px 12px', textAlign: 'left', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' },
    td: { borderBottom: '1px solid #f1f5f9', padding: '20px 12px', verticalAlign: 'middle' },
    companyLogo: { width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' },
    jobTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', display: 'block' },
    companyName: { fontSize: '14px', color: '#64748b' },
    actionBtn: { padding: '10px 18px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', transition: '0.2s' }
  };

  // Helper stats for the summary section
  const totalApplied = appliedJobs.length;
  const activeInterviews = appliedJobs.filter(a => a.status === 'Interview Scheduled').length;
  const pendingTests = appliedJobs.filter(a => a.status === 'Test Sent').length;

  return (
    <div style={styles.layout}>
      <div style={styles.container}>
        
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', margin: 0 }}>Application Command Center</h1>
          <p style={{ color: '#64748b', fontSize: '18px' }}>Track your journey and next steps with ease.</p>
        </div>

        {/* --- DYNAMIC POINTS / SUMMARY SECTION --- */}
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <div style={{ fontSize: '24px' }}>📁</div>
            <h4 style={{ margin: '10px 0 5px 0', color: '#64748b' }}>Total Applied</h4>
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a' }}>{totalApplied}</span>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ fontSize: '24px' }}>🎯</div>
            <h4 style={{ margin: '10px 0 5px 0', color: '#64748b' }}>Active Tests</h4>
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#007BFF' }}>{pendingTests}</span>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ fontSize: '24px' }}>📅</div>
            <h4 style={{ margin: '10px 0 5px 0', color: '#64748b' }}>Interviews</h4>
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#16a34a' }}>{activeInterviews}</span>
          </div>
        </div>

        <div style={styles.card}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px' }}>Syncing with database...</p>
          ) : appliedJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
               <h3>No applications found</h3>
               <button onClick={() => navigate('/jobs')} style={{...styles.actionBtn, backgroundColor: '#007BFF', color: '#fff', marginTop: '20px'}}>Explore Jobs</button>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Job Opportunity</th>
                  <th style={styles.th}>Timeline</th>
                  <th style={styles.th}>Current Status</th>
                  <th style={styles.th}>Next Step</th>
                </tr>
              </thead>
              <tbody>
                {appliedJobs.map(app => {
                  const companyName = app.companyId?.companyName || 'Private Employer';
                  const jobTitle = app.jobId?.title || 'Position Removed';
                  
                  return (
                    <tr key={app._id}>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={`https://ui-avatars.com/api/?name=${companyName}&background=random&color=fff&bold=true`} style={styles.companyLogo} alt="logo" />
                          <div>
                            <span style={styles.jobTitle}>{jobTitle}</span>
                            <span style={styles.companyName}>{companyName}</span>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>{new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={getBadgeStyle(app.status)}>{app.status}</span>
                      </td>
                      <td style={styles.td}>
                        {app.status === 'Interview Scheduled' ? (
                          <button style={{ ...styles.actionBtn, backgroundColor: '#16a34a', color: '#fff' }} onClick={() => navigate('/user/interviews')}>📅 Join Interview</button>
                        ) : app.status === 'Test Sent' ? (
                          <button style={{ ...styles.actionBtn, backgroundColor: '#007BFF', color: '#fff' }} onClick={() => navigate('/user/take-test')}>✍️ Start Test</button>
                        ) : (
                          // FIXED VIEW ROLE: Passes state to the job list so you can find the job easily
                          <button 
                            style={{ ...styles.actionBtn, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}
                            onClick={() => navigate('/jobs', { state: { highlightJobId: app.jobId?._id } })}
                          >
                            🔍 View Role
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedJobs;