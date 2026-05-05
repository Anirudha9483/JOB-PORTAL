import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeName, setResumeName] = useState('No file chosen');
  const [resumeUrl, setResumeUrl] = useState(null); // To hold the actual link

  // --- EXTENDED FORM STATE ---
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', location: '', bio: '', 
    education: '', experience: '', portfolioUrl: '', 
    linkedinUrl: '', githubUrl: '', twitterUrl: '',
    skills: '', projects: '', expectedSalary: '', preferredJobType: 'Full-time'
  });

  // --- 1. FETCH PROFILE DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = response.data;
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
          education: data.education || '',
          experience: data.experience || '',
          portfolioUrl: data.portfolioUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          githubUrl: data.githubUrl || '',
          twitterUrl: data.twitterUrl || '',
          skills: data.skills ? data.skills.join(', ') : '',
          projects: data.projects || '',
          expectedSalary: data.expectedSalary || '',
          preferredJobType: data.preferredJobType || 'Full-time'
        });

        if (data.resume) {
          setResumeName('✅ Resume Uploaded');
          // Format URL safely handling backslashes from windows
          setResumeUrl(data.resume.startsWith('http') 
            ? data.resume 
            : `http://localhost:5000/uploads/${data.resume.split(/[\\/]/).pop()}`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 2. SAVE PROFILE DATA ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
          ...formData,
          skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== "")
      };
      await axios.put('http://localhost:5000/api/users/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('🚀 Profile synchronized with database!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert('Update failed. Check your connection.');
    } finally {
      setSaving(false);
    }
  };

  // --- 3. UPLOAD RESUME ---
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Quick validation
    if (file.size > 5 * 1024 * 1024) return alert('File is too large. Max 5MB.');

    const resumeData = new FormData();
    resumeData.append('resume', file);
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/users/upload-resume', resumeData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      alert('📑 Resume attached to profile!');
      setResumeName(`✅ ${file.name}`);
      
      // Update preview link immediately
      if(res.data.resume) {
         setResumeUrl(`http://localhost:5000/uploads/${res.data.resume.split(/[\\/]/).pop()}`);
      }
    } catch (error) {
      alert('Upload failed.');
    }
  };

  // --- CALCULATE PROFILE COMPLETION ---
  const calculateCompletion = () => {
    const fieldsToCheck = [
      formData.name, formData.phone, formData.location, formData.bio, 
      formData.experience, formData.education, formData.skills, 
      formData.linkedinUrl, formData.expectedSalary, resumeUrl
    ];
    const filledFields = fieldsToCheck.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fieldsToCheck.length) * 100);
  };

  const completionRate = calculateCompletion();

  // --- PREMIUM UI STYLES ---
  const styles = {
    layout: { backgroundColor: '#f0f4f8', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Plus Jakarta Sans', sans-serif" },
    container: { maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '30px' },
    
    // Sidebar/Profile Card
    profileCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '30px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e1e8ed' },
    avatar: { width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 15px auto', fontWeight: 'bold' },
    
    // Progress Bar
    progressBg: { width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', margin: '15px 0' },
    progressFill: { height: '100%', backgroundColor: completionRate === 100 ? '#16a34a' : '#007BFF', width: `${completionRate}%`, transition: 'width 0.5s ease' },
    
    // Main Content Styles
    main: { display: 'flex', flexDirection: 'column', gap: '25px' },
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '35px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e1e8ed', marginBottom: '25px' },
    sectionHeader: { fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' },
    
    // Form Elements
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '700', color: '#334155', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    input: { width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', backgroundColor: '#f8fafc', transition: '0.2s', outline: 'none', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', backgroundColor: '#f8fafc', minHeight: '120px', resize: 'vertical', outline: 'none', boxSizing: 'border-box' },
    
    // Buttons
    saveBtn: { backgroundColor: '#007BFF', color: 'white', border: 'none', padding: '16px 30px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', boxShadow: '0 4px 12px rgba(0,123,255,0.3)', width: '100%' },
    fileBox: { border: '2px dashed #cbd5e0', padding: '30px', borderRadius: '12px', textAlign: 'center', backgroundColor: '#f8fafc', cursor: 'pointer', position: 'relative' },
    viewResumeBtn: { display: 'inline-block', marginTop: '15px', padding: '8px 16px', backgroundColor: '#e0f2fe', color: '#0284c7', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }
  };

  // Adjust container for larger screens
  if (window.innerWidth > 900) {
    styles.container.gridTemplateColumns = '320px 1fr';
  }

  if (loading) return <div style={styles.layout}><h2 style={{textAlign: 'center', color: '#64748b', marginTop: '50px'}}>Loading your workspace...</h2></div>;

  return (
    <div style={styles.layout}>
      <div style={styles.container}>
        
        {/* --- LEFT SIDEBAR --- */}
        <div>
          <div style={{...styles.profileCard, position: 'sticky', top: '20px'}}>
            <div style={styles.avatar}>{formData.name ? formData.name[0].toUpperCase() : 'U'}</div>
            <h2 style={{margin: '0 0 5px 0', fontSize: '24px', color: '#0f172a'}}>{formData.name || 'Set your name'}</h2>
            <p style={{color: '#64748b', fontSize: '14px', margin: '0 0 20px 0'}}>{formData.email}</p>
            
            {/* PROGRESS BAR */}
            <div style={{ textAlign: 'left', marginTop: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>
                <span>Profile Completion</span>
                <span style={{color: completionRate === 100 ? '#16a34a' : '#007BFF'}}>{completionRate}%</span>
              </div>
              <div style={styles.progressBg}>
                <div style={styles.progressFill}></div>
              </div>
              {completionRate < 100 && <p style={{fontSize: '12px', color: '#64748b', margin: 0}}>Complete your profile to stand out to employers.</p>}
            </div>

            <div style={{height: '1px', backgroundColor: '#e2e8f0', margin: '25px 0'}}></div>
            
            <div style={{textAlign: 'left'}}>
              <h3 style={{fontSize: '15px', color: '#0f172a', marginBottom: '15px'}}>🔗 Quick Links</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>LinkedIn URL</label>
                <input type="url" name="linkedinUrl" style={styles.input} value={formData.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Portfolio / Website</label>
                <input type="url" name="portfolioUrl" style={styles.input} value={formData.portfolioUrl} onChange={handleChange} placeholder="https://yourwebsite.com" />
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div style={styles.main}>
          <form onSubmit={handleSaveProfile}>
            
            {/* PERSONAL DETAILS */}
            <div style={styles.card}>
              <h2 style={styles.sectionHeader}>👤 Basic Information</h2>
              <div style={styles.grid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name *</label>
                  <input type="text" name="name" style={styles.input} value={formData.name} onChange={handleChange} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input type="tel" name="phone" style={styles.input} value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Location / City</label>
                  <input type="text" name="location" style={styles.input} value={formData.location} onChange={handleChange} placeholder="e.g., New York, NY" />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Professional Summary</label>
                <textarea name="bio" style={styles.textarea} value={formData.bio} onChange={handleChange} placeholder="Highlight your core strengths and career goals..."></textarea>
              </div>
            </div>

            {/* JOB PREFERENCES (NEW SECTION) */}
            <div style={styles.card}>
              <h2 style={styles.sectionHeader}>🎯 Job Preferences</h2>
              <div style={styles.grid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Expected Salary</label>
                  <input type="text" name="expectedSalary" style={styles.input} value={formData.expectedSalary} onChange={handleChange} placeholder="e.g., $80,000 / year" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Preferred Job Type</label>
                  <select name="preferredJobType" style={styles.input} value={formData.preferredJobType} onChange={handleChange}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SKILLS & PROJECTS */}
            <div style={styles.card}>
              <h2 style={styles.sectionHeader}>🛠️ Technical Assets</h2>
              <div style={styles.formGroup}>
                <label style={styles.label}>Core Skills (Comma separated)</label>
                <input type="text" name="skills" style={styles.input} value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Project Management, etc." />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Key Projects</label>
                <textarea name="projects" style={styles.textarea} value={formData.projects} onChange={handleChange} placeholder="Describe your key projects, technologies used, and outcomes..."></textarea>
              </div>
            </div>

            {/* EXPERIENCE & EDUCATION */}
            <div style={styles.card}>
              <h2 style={styles.sectionHeader}>📜 History</h2>
              <div style={styles.formGroup}>
                <label style={styles.label}>Work Experience</label>
                <textarea name="experience" style={styles.textarea} value={formData.experience} onChange={handleChange} placeholder="Company Name | Job Title | Dates&#10;Describe your responsibilities and achievements..."></textarea>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Education</label>
                <textarea name="education" style={styles.textarea} value={formData.education} onChange={handleChange} placeholder="University Name | Degree | Year"></textarea>
              </div>
            </div>

            {/* RESUME BOX */}
            <div style={styles.card}>
              <h2 style={styles.sectionHeader}>📄 Resume Management</h2>
              <div style={styles.fileBox}>
                <label style={{display: 'block', marginBottom: '10px', fontSize: '16px', color: '#0f172a', fontWeight: 'bold'}}>
                  {resumeName === 'No file chosen' ? 'Upload your latest CV' : resumeName}
                </label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleResumeUpload} 
                  style={{cursor: 'pointer', display: 'block', margin: '0 auto'}} 
                />
                
                {resumeUrl && (
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer" style={styles.viewResumeBtn}>
                     View Current Resume
                  </a>
                )}
              </div>
              <p style={{fontSize: '13px', color: '#64748b', textAlign: 'center', marginTop: '10px'}}>Supported formats: PDF, DOCX (Max 5MB)</p>
            </div>

            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? '☁️ Syncing Data...' : '💾 Save & Update Profile'}
            </button>
            <div style={{height: '40px'}}></div>
          </form>

        </div>

      </div>
    </div>
  );
};

export default Profile;