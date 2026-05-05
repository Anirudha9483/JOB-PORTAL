import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnalyticsUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- FETCH USERS ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Filter out admins/companies just in case, keeping only standard Users
        const standardUsers = res.data.filter(u => u.role === 'User' || !u.role);
        setUsers(standardUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // --- DELETE USER ---
  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`⚠️ Are you sure you want to permanently delete candidate: ${userName}?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(u => u._id !== userId));
        alert('✅ User successfully removed from the platform.');
      } catch (error) {
        alert('Failed to delete user. Please check your backend routes.');
      }
    }
  };

  // --- FILTER LOGIC ---
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- PREMIUM STYLES ---
  const styles = {
    container: { animation: 'fadeUp 0.5s ease-out forwards' },
    
    // Header & Search
    headerBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' },
    searchBar: { padding: '12px 20px', width: '300px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
    
    // Summary Cards
    summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
    summaryCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' },
    iconBox: { width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#007BFF', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' },
    
    // Table
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', minWidth: '700px' },
    th: { borderBottom: '2px solid #e2e8f0', padding: '15px', textAlign: 'left', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    td: { borderBottom: '1px solid #f1f5f9', padding: '15px', verticalAlign: 'middle', color: '#334155', fontSize: '14px' },
    
    // Elements
    avatar: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' },
    skillBadge: { backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', marginRight: '5px', display: 'inline-block', marginBottom: '4px' },
    btnDanger: { padding: '8px 12px', backgroundColor: '#fff', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', fontSize: '13px' }
  };

  return (
    <div style={styles.container}>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>🔄 Loading user database...</div>
      ) : (
        <>
          {/* TOP SUMMARY METRICS */}
          <div style={styles.summaryGrid}>
            <div style={styles.summaryCard}>
              <div style={styles.iconBox}>👥</div>
              <div>
                <h3 style={{margin: '0 0 4px 0', fontSize: '24px', color: '#0f172a'}}>{users.length}</h3>
                <p style={{margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase'}}>Total Candidates</p>
              </div>
            </div>
            <div style={styles.summaryCard}>
              <div style={{...styles.iconBox, backgroundColor: '#f0fdf4', color: '#16a34a'}}>📈</div>
              <div>
                <h3 style={{margin: '0 0 4px 0', fontSize: '24px', color: '#0f172a'}}>
                  {users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                </h3>
                <p style={{margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase'}}>New (Last 30 Days)</p>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            {/* HEADER & SEARCH */}
            <div style={styles.headerBox}>
              <h2 style={{margin: 0, color: '#0f172a', fontSize: '20px'}}>Candidate Directory</h2>
              <input 
                type="text" 
                placeholder="🔍 Search by name or email..." 
                style={styles.searchBar}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* DATA TABLE */}
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Candidate Profile</th>
                  <th style={styles.th}>Contact Details</th>
                  <th style={styles.th}>Top Skills</th>
                  <th style={styles.th}>Joined Date</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                      No candidates match your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user._id} style={{transition: 'background-color 0.2s'}} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      
                      {/* PROFILE COLUMN */}
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={`https://ui-avatars.com/api/?name=${user.name || 'User'}&background=e2e8f0&color=475569&bold=true`} 
                            alt="Avatar" 
                            style={styles.avatar} 
                          />
                          <strong style={{color: '#0f172a', fontSize: '15px'}}>{user.name || 'Anonymous User'}</strong>
                        </div>
                      </td>

                      {/* CONTACT COLUMN */}
                      <td style={styles.td}>
                        <div style={{color: '#007BFF', fontWeight: '500'}}>{user.email}</div>
                        <div style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>{user.phone || 'No phone provided'}</div>
                      </td>

                      {/* SKILLS COLUMN */}
                      <td style={styles.td}>
                        {user.skills && user.skills.length > 0 ? (
                          <>
                            {user.skills.slice(0, 2).map((skill, i) => (
                              <span key={i} style={styles.skillBadge}>{skill}</span>
                            ))}
                            {user.skills.length > 2 && (
                              <span style={{...styles.skillBadge, backgroundColor: '#e2e8f0'}}>+{user.skills.length - 2} more</span>
                            )}
                          </>
                        ) : (
                          <span style={{color: '#94a3b8', fontStyle: 'italic', fontSize: '13px'}}>No skills listed</span>
                        )}
                      </td>

                      {/* JOINED COLUMN */}
                      <td style={styles.td}>
                        {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>

                      {/* ACTIONS COLUMN */}
                      <td style={styles.td}>
                        <button 
                          style={styles.btnDanger} 
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#fff'}
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsUsers;