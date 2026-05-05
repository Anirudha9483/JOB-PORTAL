import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- EDIT MODAL STATES ---
  const [isEditing, setIsEditing] = useState(false);
  const [editJobData, setEditJobData] = useState({ id: '', title: '', type: '', industry: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FETCH JOBS ---
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        // Now using the newly created, secure route for this specific company
        const res = await axios.get('http://localhost:5000/api/jobs/my-jobs', {
           headers: { Authorization: `Bearer ${token}` }
        });
        setMyJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // --- DELETE JOB ---
  const handleDeleteJob = async (jobId) => {
    if (window.confirm('⚠️ Are you sure? This will permanently remove the job listing and all associated data.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
      } catch (error) {
        alert('Failed to delete job. Ensure you are authorized.');
      }
    }
  };

  // --- OPEN EDIT MODAL ---
  const handleEditClick = (job) => {
    setEditJobData({
      id: job._id,
      title: job.title,
      type: job.type,
      industry: job.industry,
      description: job.description || ''
    });
    setIsEditing(true);
  };

  // --- SUBMIT EDIT ---
  const handleUpdateJob = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/jobs/${editJobData.id}`, editJobData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Instantly update the UI with the edited job data
      setMyJobs(myJobs.map(job => job._id === editJobData.id ? res.data.job : job));
      
      setIsEditing(false);
      alert('✅ Job updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update job.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- PREMIUM STYLES ---
  const styles = {
    pageHeader: { marginTop: 0, color: '#0f172a', fontSize: '32px', fontWeight: '800', marginBottom: '8px' },
    pageSub: { color: '#64748b', fontSize: '16px', marginBottom: '35px' },
    card: { backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { borderBottom: '2px solid #e2e8f0', padding: '16px 12px', textAlign: 'left', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    td: { borderBottom: '1px solid #f1f5f9', padding: '20px 12px', verticalAlign: 'middle', color: '#334155', fontSize: '15px' },
    typeBadge: { backgroundColor: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    
    // Buttons
    btnDelete: { padding: '8px 16px', backgroundColor: '#fff', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' },
    btnEdit: { padding: '8px 16px', backgroundColor: '#eff6ff', color: '#007BFF', border: '1px solid #bfdbfe', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginRight: '8px', transition: '0.2s' },
    btnPrimary: { padding: '14px 24px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', flex: 1 },
    btnSecondary: { padding: '14px 24px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', flex: 1 },
    
    // Modal Styles
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155', fontSize: '14px' },
    input: { width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontSize: '15px', outline: 'none' },
    textarea: { width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontSize: '15px', minHeight: '120px', outline: 'none' }
  };

  return (
    <div>
      <h1 style={styles.pageHeader}>Active Job Listings</h1>
      <p style={styles.pageSub}>Oversee your published positions and manage candidate intake.</p>
      
      <div style={styles.card}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            Synchronizing with database...
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Job Information</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Post Date</th>
                <th style={styles.th}>Management</th>
              </tr>
            </thead>
            <tbody>
              {myJobs.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>💼</div>
                    <h3>No active jobs found</h3>
                    <p>Click "Post a New Job" in the sidebar to get started.</p>
                  </td>
                </tr>
              ) : (
                myJobs.map(job => (
                  <tr key={job._id}>
                    <td style={styles.td}>
                      <strong style={{ color: '#0f172a', fontSize: '16px', display: 'block' }}>{job.title}</strong>
                      <span style={{ color: '#64748b', fontSize: '13px' }}>{job.industry}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.typeBadge}>{job.type}</span>
                    </td>
                    <td style={styles.td}>
                      {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={styles.td}>
                      {/* EDIT BUTTON */}
                      <button 
                        style={styles.btnEdit} 
                        onClick={() => handleEditClick(job)}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#dbeafe'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#eff6ff'}
                      >
                        ✏️ Edit
                      </button>
                      
                      {/* DELETE BUTTON */}
                      <button 
                        style={styles.btnDelete} 
                        onClick={() => handleDeleteJob(job._id)}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#fff'}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* --- EDIT JOB MODAL --- */}
      {isEditing && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ marginTop: 0, color: '#0f172a', fontSize: '24px', marginBottom: '20px' }}>Edit Job Posting</h2>
            
            <form onSubmit={handleUpdateJob}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Job Title *</label>
                <input 
                  type="text" 
                  required 
                  style={styles.input} 
                  value={editJobData.title} 
                  onChange={(e) => setEditJobData({...editJobData, title: e.target.value})} 
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={styles.label}>Job Type</label>
                  <select 
                    style={styles.input} 
                    value={editJobData.type} 
                    onChange={(e) => setEditJobData({...editJobData, type: e.target.value})}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Industry *</label>
                  <input 
                    type="text" 
                    required 
                    style={styles.input} 
                    value={editJobData.industry} 
                    onChange={(e) => setEditJobData({...editJobData, industry: e.target.value})} 
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Job Description</label>
                <textarea 
                  required 
                  style={styles.textarea} 
                  value={editJobData.description} 
                  onChange={(e) => setEditJobData({...editJobData, description: e.target.value})}
                ></textarea>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <button type="submit" style={styles.btnPrimary} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} style={styles.btnSecondary}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageJobs;