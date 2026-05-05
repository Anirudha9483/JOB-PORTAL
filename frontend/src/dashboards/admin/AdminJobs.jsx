import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminJobs = () => {
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/jobs', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setJobsList(res.data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (window.confirm(`Permanently remove job listing: ${jobTitle}?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/jobs/${jobId}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setJobsList(jobsList.filter(j => j._id !== jobId));
        alert('Job listing removed.');
      } catch (e) { alert('Action failed.'); }
    }
  };

  const styles = {
    card: { backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { borderBottom: '2px solid #e2e8f0', padding: '16px 12px', textAlign: 'left', color: '#64748b', fontSize: '13px', textTransform: 'uppercase' },
    td: { borderBottom: '1px solid #f1f5f9', padding: '20px 12px', verticalAlign: 'middle', color: '#334155', fontSize: '15px' },
    btnDanger: { padding: '8px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px', color: '#64748b'}}>🔄 Fetching job records...</div>;

  return (
    <div style={styles.card}>
      <h2 style={{marginTop: 0}}>Active Platform Jobs</h2>
      <table style={styles.table}>
        <thead>
          <tr><th style={styles.th}>Job Title</th><th style={styles.th}>Company</th><th style={styles.th}>Type</th><th style={styles.th}>Action</th></tr>
        </thead>
        <tbody>
          {jobsList.map(j => (
            <tr key={j._id}>
              <td style={styles.td}><strong>{j.title}</strong></td>
              <td style={styles.td}>{j.companyId?.companyName}</td>
              <td style={styles.td}><span style={{fontWeight: 'bold', color: '#64748b'}}>{j.type}</span></td>
              <td style={styles.td}><button style={styles.btnDanger} onClick={() => handleDeleteJob(j._id, j.title)}>Delete Post</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminJobs;