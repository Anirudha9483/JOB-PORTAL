import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminGlobalATS = () => {
  const [applicationsList, setApplicationsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/applications', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setApplicationsList(res.data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchApps();
  }, []);

  const getBadgeStyle = (status) => {
    let bg = '#e2e8f0', color = '#475569'; 
    if (status === 'Applied') { bg = '#fef3c7'; color = '#b45309'; }
    if (status === 'Accepted') { bg = '#dcfce7'; color = '#15803d'; }
    if (status === 'Rejected') { bg = '#fee2e2'; color = '#b91c1c'; }
    if (status === 'Interview Scheduled') { bg = '#dbeafe'; color = '#0369a1'; }
    return { padding: '6px 12px', borderRadius: '20px', color: color, fontSize: '12px', fontWeight: 'bold', backgroundColor: bg, display: 'inline-block' };
  };

  const styles = {
    card: { backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { borderBottom: '2px solid #e2e8f0', padding: '16px 12px', textAlign: 'left', color: '#64748b', fontSize: '13px', textTransform: 'uppercase' },
    td: { borderBottom: '1px solid #f1f5f9', padding: '20px 12px', verticalAlign: 'middle', color: '#334155', fontSize: '15px' }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px', color: '#64748b'}}>🔄 Fetching ATS records...</div>;

  return (
    <div style={styles.card}>
      <h2 style={{marginTop: 0}}>Global Application Monitor</h2>
      <table style={styles.table}>
        <thead>
          <tr><th style={styles.th}>Applicant</th><th style={styles.th}>Role & Company</th><th style={styles.th}>Status</th><th style={styles.th}>Interview</th></tr>
        </thead>
        <tbody>
          {applicationsList.map(app => (
            <tr key={app._id}>
              <td style={styles.td}>
                <strong>{app.userId?.name}</strong><br/>
                <span style={{fontSize: '12px', color: '#64748b'}}>{app.userId?.email}</span>
              </td>
              <td style={styles.td}>
                <strong>{app.jobId?.title}</strong><br/>
                <span style={{color: '#007BFF'}}>{app.companyId?.companyName}</span>
              </td>
              <td style={styles.td}><span style={getBadgeStyle(app.status)}>{app.status}</span></td>
              <td style={styles.td}>{app.interviewDate ? '📅 ' + new Date(app.interviewDate).toLocaleDateString() : '--'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminGlobalATS;