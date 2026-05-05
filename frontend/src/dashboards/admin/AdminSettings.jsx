import React from 'react';

const AdminSettings = () => {
  const btnStyle = { padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', border: 'none' };

  return (
    <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
      <h2 style={{ marginTop: 0, borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>Platform Configuration</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
        
        <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0 }}>Maintenance Mode</h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>Temporarily disable job applications for scheduled database maintenance.</p>
          <button style={{ ...btnStyle, backgroundColor: '#0f172a', color: '#fff' }}>Enable Maintenance</button>
        </div>
        
        <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0 }}>System Admin Logs</h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>Download a CSV file containing all system activities and administrative actions.</p>
          <button style={{ ...btnStyle, backgroundColor: '#007BFF', color: '#fff' }}>Export System Logs</button>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;