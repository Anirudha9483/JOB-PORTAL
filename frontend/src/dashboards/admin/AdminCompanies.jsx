import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCompanies = () => {
  const [companiesList, setCompaniesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/companies', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setCompaniesList(res.data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchCompanies();
  }, []);

  const handleDeleteCompany = async (companyId, companyName) => {
    if (window.confirm(`Permanently delete ${companyName}? All their jobs will also be removed.`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/companies/${companyId}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setCompaniesList(companiesList.filter(c => c._id !== companyId));
        alert(`${companyName} removed.`);
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

  if (loading) return <div style={{textAlign: 'center', padding: '50px', color: '#64748b'}}>🔄 Fetching company records...</div>;

  return (
    <div style={styles.card}>
      <h2 style={{marginTop: 0}}>Company Management</h2>
      <table style={styles.table}>
        <thead>
          <tr><th style={styles.th}>Company</th><th style={styles.th}>Email</th><th style={styles.th}>Joined</th><th style={styles.th}>Action</th></tr>
        </thead>
        <tbody>
          {companiesList.map(c => (
            <tr key={c._id}>
              <td style={styles.td}><strong>{c.companyName}</strong></td>
              <td style={styles.td}>{c.email}</td>
              <td style={styles.td}>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td style={styles.td}><button style={styles.btnDanger} onClick={() => handleDeleteCompany(c._id, c.companyName)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminCompanies;