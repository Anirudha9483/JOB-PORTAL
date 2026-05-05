import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnalyticsCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- FETCH COMPANIES ---
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/companies', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompanies(res.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // --- DELETE COMPANY ---
  const handleDeleteCompany = async (companyId, companyName) => {
    if (window.confirm(`⚠️ DANGER: Are you sure you want to permanently delete ${companyName}? This will also remove all their job postings and associated applications.`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/companies/${companyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompanies(companies.filter(c => c._id !== companyId));
        alert('✅ Company successfully removed from the platform.');
      } catch (error) {
        alert('Failed to delete company. Please check your backend routes.');
      }
    }
  };

  // --- FILTER LOGIC ---
  const filteredCompanies = companies.filter(company => 
    company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    company.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
    iconBox: { width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' },
    
    // Table
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', minWidth: '700px' },
    th: { borderBottom: '2px solid #e2e8f0', padding: '15px', textAlign: 'left', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    td: { borderBottom: '1px solid #f1f5f9', padding: '15px', verticalAlign: 'middle', color: '#334155', fontSize: '14px' },
    
    // Elements
    avatar: { width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' },
    btnDanger: { padding: '8px 12px', backgroundColor: '#fff', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', fontSize: '13px' }
  };

  return (
    <div style={styles.container}>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>🔄 Loading corporate partners...</div>
      ) : (
        <>
          {/* TOP SUMMARY METRICS */}
          <div style={styles.summaryGrid}>
            <div style={styles.summaryCard}>
              <div style={styles.iconBox}>🏢</div>
              <div>
                <h3 style={{margin: '0 0 4px 0', fontSize: '24px', color: '#0f172a'}}>{companies.length}</h3>
                <p style={{margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase'}}>Partner Companies</p>
              </div>
            </div>
            <div style={styles.summaryCard}>
              <div style={{...styles.iconBox, backgroundColor: '#e0f2fe', color: '#0284c7'}}>🤝</div>
              <div>
                <h3 style={{margin: '0 0 4px 0', fontSize: '24px', color: '#0f172a'}}>
                  {companies.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                </h3>
                <p style={{margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase'}}>Onboarded (Last 30 Days)</p>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            {/* HEADER & SEARCH */}
            <div style={styles.headerBox}>
              <h2 style={{margin: 0, color: '#0f172a', fontSize: '20px'}}>Corporate Directory</h2>
              <input 
                type="text" 
                placeholder="🔍 Search by company name or email..." 
                style={styles.searchBar}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* DATA TABLE */}
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Company Profile</th>
                  <th style={styles.th}>Primary Contact</th>
                  <th style={styles.th}>Account Created</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                      No companies match your search.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map(company => (
                    <tr key={company._id} style={{transition: 'background-color 0.2s'}} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      
                      {/* PROFILE COLUMN */}
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={`https://ui-avatars.com/api/?name=${company.companyName || 'Company'}&background=random&color=fff&bold=true`} 
                            alt="Logo" 
                            style={styles.avatar} 
                          />
                          <strong style={{color: '#0f172a', fontSize: '15px'}}>{company.companyName || 'Unnamed Company'}</strong>
                        </div>
                      </td>

                      {/* CONTACT COLUMN */}
                      <td style={styles.td}>
                        <div style={{color: '#007BFF', fontWeight: '500'}}>{company.email}</div>
                        <div style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>{company.contactNumber || 'No phone provided'}</div>
                      </td>

                      {/* JOINED COLUMN */}
                      <td style={styles.td}>
                        {new Date(company.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>

                      {/* ACTIONS COLUMN */}
                      <td style={styles.td}>
                        <button 
                          style={styles.btnDanger} 
                          onClick={() => handleDeleteCompany(company._id, company.companyName)}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#fff'}
                        >
                          Delete Partner
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

export default AnalyticsCompanies;