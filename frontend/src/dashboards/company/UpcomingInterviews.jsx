import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpcomingInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/applications/company', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        // Filter for both Scheduled and Accepted to keep historical context if needed
        setInterviews(res.data.filter(app => app.status === 'Interview Scheduled' || app.status === 'Accepted'));
      } catch (error) { 
        console.error("Failed to fetch interviews:", error); 
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const styles = {
    pageHeader: { marginTop: 0, color: '#0f172a', fontSize: '32px', fontWeight: '800', marginBottom: '8px' },
    pageSub: { color: '#64748b', fontSize: '16px', marginBottom: '35px' },
    
    card: { backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { borderBottom: '2px solid #e2e8f0', padding: '16px 12px', textAlign: 'left', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    td: { borderBottom: '1px solid #f1f5f9', padding: '20px 12px', verticalAlign: 'middle', color: '#334155', fontSize: '15px' },
    
    joinBtn: { padding: '10px 20px', backgroundColor: '#eff6ff', color: '#007BFF', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: '0.2s', border: '1px solid #bfdbfe' },
    emptyState: { textAlign: 'center', padding: '60px 20px', color: '#64748b' }
  };

  return (
    <div>
      <h1 style={styles.pageHeader}>Upcoming Interviews</h1>
      <p style={styles.pageSub}>Review and join your scheduled candidate meetings.</p>
      
      <div style={styles.card}>
        {loading ? (
          <p style={{color: '#64748b'}}>Loading your schedule...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Candidate Details</th>
                <th style={styles.th}>Target Role</th>
                <th style={styles.th}>Scheduled Time</th>
                <th style={styles.th}>Meeting Link</th>
              </tr>
            </thead>
            <tbody>
              {interviews.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div style={styles.emptyState}>
                      <div style={{fontSize: '40px', marginBottom: '10px'}}>📅</div>
                      <h3 style={{color: '#0f172a', margin: '0 0 5px 0'}}>Clear Calendar</h3>
                      <p style={{margin: 0}}>You have no upcoming interviews scheduled at this time.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                interviews.map(app => (
                  <tr key={app._id}>
                    
                    {/* CANDIDATE PROFILE COLUMN */}
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={`https://ui-avatars.com/api/?name=${app.userId?.name || 'U'}&background=e2e8f0&color=475569&bold=true`} 
                          alt="Avatar" 
                          style={{width: '40px', height: '40px', borderRadius: '50%'}} 
                        />
                        <div>
                          <strong style={{fontSize: '16px', color: '#0f172a'}}>{app.userId?.name || 'Unknown Candidate'}</strong><br/>
                          <a href={`mailto:${app.userId?.email}`} style={{ fontSize: '13px', color: '#007BFF', textDecoration: 'none' }}>
                            {app.userId?.email}
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* ROLE COLUMN */}
                    <td style={styles.td}>
                      <strong>{app.jobId?.title || 'Unknown Role'}</strong>
                    </td>

                    {/* DATE & TIME COLUMN */}
                    <td style={styles.td}>
                      <div style={{color: '#0f172a', fontWeight: 'bold'}}>
                        {new Date(app.interviewDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div style={{fontSize: '14px', color: '#64748b'}}>
                        {new Date(app.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* ACTIONS COLUMN */}
                    <td style={styles.td}>
                      {app.status === 'Accepted' ? (
                         <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                           ✓ Candidate Hired
                         </span>
                      ) : (
                        <a 
                          href={app.interviewLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={styles.joinBtn}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                        >
                          <span>📹</span> Join Room
                        </a>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UpcomingInterviews;