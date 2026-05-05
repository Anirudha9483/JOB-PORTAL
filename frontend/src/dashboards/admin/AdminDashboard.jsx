// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import axios from 'axios';

// const AdminDashboard = () => {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState('applications');

//   // --- STATE FOR REAL DB DATA ---
//   const [usersList, setUsersList] = useState([]);
//   const [companiesList, setCompaniesList] = useState([]);
//   const [applicationsList, setApplicationsList] = useState([]);
//   const [jobsList, setJobsList] = useState([]); // NEW: Manage Jobs
//   const [loading, setLoading] = useState(true);

//   // --- FETCH DATA FROM MONGODB BASED ON TAB ---
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('token');
//         const headers = { Authorization: `Bearer ${token}` };

//         if (activeTab === 'users') {
//           const res = await axios.get('http://localhost:5000/api/admin/users', { headers });
//           setUsersList(res.data);
//         } 
//         else if (activeTab === 'companies') {
//           const res = await axios.get('http://localhost:5000/api/admin/companies', { headers });
//           setCompaniesList(res.data);
//         } 
//         else if (activeTab === 'applications') {
//           const res = await axios.get('http://localhost:5000/api/admin/applications', { headers });
//           setApplicationsList(res.data);
//         }
//         else if (activeTab === 'manageJobs') {
//           const res = await axios.get('http://localhost:5000/api/jobs', { headers });
//           setJobsList(res.data);
//         }
//       } catch (error) {
//         console.error(`Error fetching ${activeTab}:`, error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [activeTab]);

//   // --- DELETE HANDLERS ---
//   const handleDeleteJob = async (jobId, jobTitle) => {
//     if (window.confirm(`Permanently remove job listing: ${jobTitle}?`)) {
//       try {
//         const token = localStorage.getItem('token');
//         await axios.delete(`http://localhost:5000/api/admin/jobs/${jobId}`, { headers: { Authorization: `Bearer ${token}` } });
//         setJobsList(jobsList.filter(j => j._id !== jobId));
//         alert('Job listing removed.');
//       } catch (e) { alert('Action failed.'); }
//     }
//   };

//   const handleDeleteCompany = async (companyId, companyName) => {
//     if (window.confirm(`Permanently delete ${companyName}? All their jobs will also be removed.`)) {
//       try {
//         const token = localStorage.getItem('token');
//         await axios.delete(`http://localhost:5000/api/admin/companies/${companyId}`, { headers: { Authorization: `Bearer ${token}` } });
//         setCompaniesList(companiesList.filter(c => c._id !== companyId));
//         alert(`${companyName} removed.`);
//       } catch (e) { alert('Action failed.'); }
//     }
//   };

//   // --- PREMIUM UI STYLES ---
//   const getBadgeStyle = (status) => {
//     let bg = '#e2e8f0', color = '#475569'; 
//     if (status === 'Applied') { bg = '#fef3c7'; color = '#b45309'; }
//     if (status === 'Accepted') { bg = '#dcfce7'; color = '#15803d'; }
//     if (status === 'Rejected') { bg = '#fee2e2'; color = '#b91c1c'; }
//     if (status === 'Interview Scheduled') { bg = '#dbeafe'; color = '#0369a1'; }
//     return { padding: '6px 12px', borderRadius: '20px', color: color, fontSize: '12px', fontWeight: 'bold', backgroundColor: bg, display: 'inline-block' };
//   };

//   const styles = {
//     layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: "'Segoe UI', Roboto, sans-serif" },
//     sidebar: { width: '280px', backgroundColor: '#0f172a', color: '#e2e8f0', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'sticky', top: 0, height: '100vh' },
//     sidebarTitle: { margin: '0 0 30px 10px', color: '#ffffff', fontSize: '22px', fontWeight: '900' },
//     sidebarBtn: (isActive) => ({ padding: '14px 20px', backgroundColor: isActive ? '#1e293b' : 'transparent', color: isActive ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontSize: '15px', fontWeight: isActive ? '700' : '600', display: 'flex', alignItems: 'center', gap: '12px', transition: '0.2s' }),
//     content: { flex: 1, padding: '40px 50px' },
//     pageHeader: { marginTop: 0, color: '#0f172a', fontSize: '32px', fontWeight: '800' },
//     card: { backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' },
//     table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
//     th: { borderBottom: '2px solid #e2e8f0', padding: '16px 12px', textAlign: 'left', color: '#64748b', fontSize: '13px', textTransform: 'uppercase' },
//     td: { borderBottom: '1px solid #f1f5f9', padding: '20px 12px', verticalAlign: 'middle', color: '#334155', fontSize: '15px' },
//     btnDanger: { padding: '8px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
//   };

//   return (
//     <div style={styles.layout}>
      
//       {/* SIDEBAR */}
//       <div style={styles.sidebar}>
//         <h3 style={styles.sidebarTitle}>🛡️ Super Admin</h3>
//         <button style={styles.sidebarBtn(activeTab === 'applications')} onClick={() => setActiveTab('applications')}>📄 Global ATS</button>
//         <button style={styles.sidebarBtn(activeTab === 'users')} onClick={() => setActiveTab('users')}>👥 Candidates</button>
//         <button style={styles.sidebarBtn(activeTab === 'companies')} onClick={() => setActiveTab('companies')}>🏢 Companies</button>
//         <button style={styles.sidebarBtn(activeTab === 'manageJobs')} onClick={() => setActiveTab('manageJobs')}>💼 Job Postings</button>
//         <div style={{height: '1px', backgroundColor: '#334155', margin: '20px 0'}}></div>
//         <button style={styles.sidebarBtn(activeTab === 'settings')} onClick={() => setActiveTab('settings')}>⚙️ System Settings</button>
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <div style={styles.content}>
//         <h1 style={styles.pageHeader}>Administrative Control</h1>
//         <p style={{ color: '#64748b', marginBottom: '35px' }}>Logged in as: <strong>{user.email}</strong></p>

//         {loading ? (
//           <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>🔄 Fetching DB records...</div>
//         ) : (
//           <div style={styles.card}>
            
//             {/* --- TAB: GLOBAL ATS --- */}
//             {activeTab === 'applications' && (
//               <>
//                 <h2>Global Application Monitor</h2>
//                 <table style={styles.table}>
//                   <thead>
//                     <tr><th style={styles.th}>Applicant</th><th style={styles.th}>Role & Company</th><th style={styles.th}>Status</th><th style={styles.th}>Interview</th></tr>
//                   </thead>
//                   <tbody>
//                     {applicationsList.map(app => (
//                       <tr key={app._id}>
//                         <td style={styles.td}>
//                           <strong>{app.userId?.name}</strong><br/>
//                           <span style={{fontSize: '12px', color: '#64748b'}}>{app.userId?.email}</span>
//                         </td>
//                         <td style={styles.td}>
//                           <strong>{app.jobId?.title}</strong><br/>
//                           <span style={{color: '#007BFF'}}>{app.companyId?.companyName}</span>
//                         </td>
//                         <td style={styles.td}><span style={getBadgeStyle(app.status)}>{app.status}</span></td>
//                         <td style={styles.td}>
//                           {app.interviewDate ? '📅 ' + new Date(app.interviewDate).toLocaleDateString() : '--'}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </>
//             )}

//             {/* --- TAB: USERS --- */}
//             {activeTab === 'users' && (
//               <>
//                 <h2>Candidate Database</h2>
//                 <table style={styles.table}>
//                   <thead>
//                     <tr><th style={styles.th}>Name</th><th style={styles.th}>Email</th><th style={styles.th}>Skills</th><th style={styles.th}>Joined</th></tr>
//                   </thead>
//                   <tbody>
//                     {usersList.map(u => (
//                       <tr key={u._id}>
//                         <td style={styles.td}><strong>{u.name}</strong></td>
//                         <td style={styles.td}>{u.email}</td>
//                         <td style={styles.td}>{u.skills?.join(', ') || 'N/A'}</td>
//                         <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </>
//             )}

//             {/* --- TAB: COMPANIES --- */}
//             {activeTab === 'companies' && (
//               <>
//                 <h2>Company Management</h2>
//                 <table style={styles.table}>
//                   <thead>
//                     <tr><th style={styles.th}>Company</th><th style={styles.th}>Email</th><th style={styles.th}>Joined</th><th style={styles.th}>Action</th></tr>
//                   </thead>
//                   <tbody>
//                     {companiesList.map(c => (
//                       <tr key={c._id}>
//                         <td style={styles.td}><strong>{c.companyName}</strong></td>
//                         <td style={styles.td}>{c.email}</td>
//                         <td style={styles.td}>{new Date(c.createdAt).toLocaleDateString()}</td>
//                         <td style={styles.td}><button style={styles.btnDanger} onClick={() => handleDeleteCompany(c._id, c.companyName)}>Remove</button></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </>
//             )}

//             {/* --- TAB: MANAGE JOBS (NEW) --- */}
//             {activeTab === 'manageJobs' && (
//               <>
//                 <h2>Active Platform Jobs</h2>
//                 <table style={styles.table}>
//                   <thead>
//                     <tr><th style={styles.th}>Job Title</th><th style={styles.th}>Company</th><th style={styles.th}>Type</th><th style={styles.th}>Action</th></tr>
//                   </thead>
//                   <tbody>
//                     {jobsList.map(j => (
//                       <tr key={j._id}>
//                         <td style={styles.td}><strong>{j.title}</strong></td>
//                         <td style={styles.td}>{j.companyId?.companyName}</td>
//                         <td style={styles.td}><span style={{fontWeight: 'bold', color: '#64748b'}}>{j.type}</span></td>
//                         <td style={styles.td}><button style={styles.btnDanger} onClick={() => handleDeleteJob(j._id, j.title)}>Delete Post</button></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </>
//             )}

//             {/* --- TAB: SETTINGS (NEW) --- */}
//             {activeTab === 'settings' && (
//               <div style={{padding: '20px 0'}}>
//                 <h2 style={{borderBottom: '2px solid #eee', paddingBottom: '15px'}}>Platform Configuration</h2>
//                 <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px'}}>
//                   <div style={{backgroundColor: '#f8fafc', padding: '25px', borderRadius: '12px'}}>
//                     <h3>Maintenance Mode</h3>
//                     <p style={{color: '#64748b'}}>Temporarily disable job applications for scheduled maintenance.</p>
//                     <button style={{...styles.sidebarBtn(false), backgroundColor: '#0f172a', color: '#fff', width: 'auto'}}>Enable Maintenance</button>
//                   </div>
//                   <div style={{backgroundColor: '#f8fafc', padding: '25px', borderRadius: '12px'}}>
//                     <h3>Admin Logs</h3>
//                     <p style={{color: '#64748b'}}>Download CSV of all system activities and deletions.</p>
//                     <button style={{...styles.sidebarBtn(false), backgroundColor: '#38bdf8', color: '#fff', width: 'auto'}}>Export System Logs</button>
//                   </div>
//                 </div>
//               </div>
//             )}

//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// Import the new modular components
import AdminGlobalATS from './AdminGlobalATS';
import AdminCandidates from './AdminCandidates';
import AdminCompanies from './AdminCompanies';
import AdminJobs from './AdminJobs';
import AdminSettings from './AdminSettings';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');

  const styles = {
    layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: "'Segoe UI', Roboto, sans-serif" },
    sidebar: { width: '280px', backgroundColor: '#0f172a', color: '#e2e8f0', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box' },
    sidebarTitle: { margin: '0 0 30px 10px', color: '#ffffff', fontSize: '22px', fontWeight: '900' },
    sidebarBtn: (isActive) => ({ padding: '14px 20px', backgroundColor: isActive ? '#1e293b' : 'transparent', color: isActive ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontSize: '15px', fontWeight: isActive ? '700' : '600', display: 'flex', alignItems: 'center', gap: '12px', transition: '0.2s' }),
    content: { flex: 1, padding: '40px 50px', overflowX: 'auto' },
    pageHeader: { marginTop: 0, color: '#0f172a', fontSize: '32px', fontWeight: '800' }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'applications': return <AdminGlobalATS />;
      case 'users': return <AdminCandidates />;
      case 'companies': return <AdminCompanies />;
      case 'manageJobs': return <AdminJobs />;
      case 'settings': return <AdminSettings />;
      default: return <AdminGlobalATS />;
    }
  };

  return (
    <div style={styles.layout}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>🛡️ Super Admin</h3>
        <button style={styles.sidebarBtn(activeTab === 'applications')} onClick={() => setActiveTab('applications')}>📄 Global ATS</button>
        <button style={styles.sidebarBtn(activeTab === 'users')} onClick={() => setActiveTab('users')}>👥 Candidates</button>
        <button style={styles.sidebarBtn(activeTab === 'companies')} onClick={() => setActiveTab('companies')}>🏢 Companies</button>
        <button style={styles.sidebarBtn(activeTab === 'manageJobs')} onClick={() => setActiveTab('manageJobs')}>💼 Job Postings</button>
        <div style={{height: '1px', backgroundColor: '#334155', margin: '20px 0'}}></div>
        <button style={styles.sidebarBtn(activeTab === 'settings')} onClick={() => setActiveTab('settings')}>⚙️ System Settings</button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={styles.content}>
        <h1 style={styles.pageHeader}>Administrative Control</h1>
        <p style={{ color: '#64748b', marginBottom: '35px' }}>Logged in as: <strong>{user?.email}</strong></p>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;