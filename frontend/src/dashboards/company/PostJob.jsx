import React, { useState } from 'react';
import axios from 'axios';

// Accept setActiveTab so we can redirect the user after a successful post
const PostJob = ({ setActiveTab }) => {
  const [newJob, setNewJob] = useState({ 
    title: '', 
    type: 'Full-time', 
    industry: '', 
    description: '' 
  });

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.industry) return alert('Please fill in required fields!');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/jobs', newJob, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      alert(`Successfully posted: ${newJob.title}`);
      
      // Reset form
      setNewJob({ title: '', type: 'Full-time', industry: '', description: '' });
      
      // Redirect to the "Manage Jobs" tab automatically!
      setActiveTab('jobs'); 
      
    } catch (error) { 
      alert(error.response?.data?.message || 'Failed to post job.'); 
    }
  };

  const styles = {
    pageHeader: { marginTop: 0, color: '#0f172a', fontSize: '32px', fontWeight: '800', marginBottom: '8px' },
    pageSub: { color: '#64748b', fontSize: '16px', marginBottom: '35px' },
    card: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', maxWidth: '800px', border: '1px solid #f1f5f9' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155', fontSize: '14px' },
    input: { width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontSize: '15px', outline: 'none' },
    textarea: { width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontSize: '15px', minHeight: '150px', outline: 'none' },
    buttonPrimary: { padding: '14px 24px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', width: '100%' }
  };

  return (
    <div>
      <h1 style={styles.pageHeader}>Post a New Job</h1>
      <p style={styles.pageSub}>Publish an open role to the global job board.</p>
      
      <div style={styles.card}>
        <form onSubmit={handlePostJob}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Job Title *</label>
            <input type="text" style={styles.input} required value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} placeholder="e.g., Senior Data Scientist" />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={styles.label}>Job Type</label>
              <select style={styles.input} value={newJob.type} onChange={(e) => setNewJob({...newJob, type: e.target.value})}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Industry *</label>
              <input type="text" style={styles.input} required value={newJob.industry} onChange={(e) => setNewJob({...newJob, industry: e.target.value})} placeholder="e.g., IT, Finance, Healthcare" />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Job Description</label>
            <textarea style={styles.textarea} required value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} placeholder="Describe the role, responsibilities, and requirements..."></textarea>
          </div>
          
          <button type="submit" style={styles.buttonPrimary}>🚀 Publish Job Listing</button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;