import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCandidates = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/users', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setUsersList(res.data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchUsers();
  }, []);

  const styles = {
    card: { backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { borderBottom: '2px solid #e2e8f0', padding: '16px 12px', textAlign: 'left', color: '#64748b', fontSize: '13px', textTransform: 'uppercase' },
    td: { borderBottom: '1px solid #f1f5f9', padding: '20px 12px', verticalAlign: 'middle', color: '#334155', fontSize: '15px' }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px', color: '#64748b'}}>🔄 Fetching candidate records...</div>;

  return (
    <div style={styles.card}>
      <h2 style={{marginTop: 0}}>Candidate Database</h2>
      <table style={styles.table}>
        <thead>
          <tr><th style={styles.th}>Name</th><th style={styles.th}>Email</th><th style={styles.th}>Skills</th><th style={styles.th}>Joined</th></tr>
        </thead>
        <tbody>
          {usersList.map(u => (
            <tr key={u._id}>
              <td style={styles.td}><strong>{u.name}</strong></td>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}>{u.skills?.join(', ') || 'N/A'}</td>
              <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminCandidates;