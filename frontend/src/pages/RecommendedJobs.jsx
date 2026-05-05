import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const RecommendedJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [allJobs, setAllJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // We use these skills to match against the jobs in the database!
  const [mySkills, setMySkills] = useState('React, JavaScript, Node.js, Frontend'); 

  // --- 1. FETCH ALL JOBS ---
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs');
        setAllJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // --- 2. RECOMMENDATION ALGORITHM ---
  useEffect(() => {
    if (allJobs.length === 0) return;

    // Convert the user's comma-separated skills into an array of lowercase words
    const skillArray = mySkills.split(',').map(skill => skill.trim().toLowerCase()).filter(s => s);

    // Filter jobs: A job is recommended if any of the user's skills appear in the title, industry, or description
    const matchedJobs = allJobs.filter(job => {
      const jobString = `${job.title} ${job.industry} ${job.description}`.toLowerCase();
      
      // Check if at least one skill matches the job string
      return skillArray.some(skill => jobString.includes(skill));
    });

    setRecommendedJobs(matchedJobs);
  }, [mySkills, allJobs]);

  // --- 3. APPLY LOGIC ---
  const handleApply = async (jobId, jobTitle) => {
    if (!user?.isAuthenticated) {
      alert('You must be logged in to apply for jobs!');
      navigate('/login');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/applications/apply', 
        { jobId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`✅ Successfully applied for: ${jobTitle}!`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit application.');
    }
  };

  // --- PREMIUM STYLES ---
  const styles = {
    container: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#333', backgroundColor: '#f9fbfd', minHeight: '100vh', paddingBottom: '60px' },
    
    // AI/Smart Header
    hero: { 
      backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80")', // Tech/Network background
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      padding: '100px 20px 140px 20px', // Extra padding at bottom for the floating input
      textAlign: 'center',
      color: 'white',
      marginBottom: '80px'
    },
    heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 30, 80, 0.8)', zIndex: 1 },
    heroContent: { position: 'relative', zIndex: 2 },
    title: { margin: '0 0 15px 0', fontSize: '46px', fontWeight: '900', textShadow: '0 2px 4px rgba(0,0,0,0.5)' },
    subtitle: { margin: '0 auto', fontSize: '20px', color: '#e0e0e0', maxWidth: '600px', lineHeight: '1.5' },
    
    // Floating Skills Input Box
    skillsWrapper: {
      position: 'absolute',
      bottom: '-40px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '800px',
      backgroundColor: 'white',
      padding: '20px 30px',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      zIndex: 3,
      border: '1px solid #e2e8f0'
    },
    skillsIcon: { fontSize: '24px' },
    input: { flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: '500' },
    
    // Content Layout
    wrapper: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
    sectionTitle: { fontSize: '26px', color: '#0f172a', marginBottom: '30px', fontWeight: 'bold' },
    
    // Grid & Cards
    jobGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' },
    card: { border: '1px solid #eee', padding: '30px', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.04)', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '5px solid #20c997', transition: '0.3s' },
    
    // Card Header (Logo + Title)
    cardHeader: { display: 'flex', gap: '15px', marginBottom: '15px' },
    companyLogo: { width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' },
    jobTitle: { margin: '0 0 5px 0', color: '#0f172a', fontSize: '22px', fontWeight: 'bold' },
    companyText: { margin: '0', color: '#64748b', fontSize: '15px', fontWeight: '600' },
    
    // Badges & Buttons
    badgeContainer: { display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' },
    badge: { padding: '6px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '13px', color: '#475569', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' },
    matchBadge: { padding: '6px 12px', backgroundColor: '#dcfce7', borderRadius: '20px', fontSize: '12px', color: '#15803d', fontWeight: 'bold', marginBottom: '15px', display: 'inline-block' },
    applyBtn: { width: '100%', padding: '14px', backgroundColor: '#20c997', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: '0.2s', boxShadow: '0 4px 10px rgba(32,201,151,0.3)' },
    
    // Empty State
    noMatch: { textAlign: 'center', backgroundColor: 'white', padding: '60px 20px', borderRadius: '16px', border: '1px dashed #cbd5e1' },
    noMatchIcon: { fontSize: '48px', marginBottom: '20px' }
  };

  return (
    <div style={styles.container}>
      
      {/* --- HERO HEADER --- */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>✨ Smart Job Matches</h1>
          <p style={styles.subtitle}>
            Our recommendation engine analyzes your unique skills and pairs you with the perfect live roles from our database.
          </p>
        </div>

        {/* --- FLOATING SKILLS INPUT --- */}
        <div style={styles.skillsWrapper}>
          <div style={styles.skillsIcon}>🧠</div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}>
              Your Core Skills (Edit to update matches)
            </label>
            <input 
              type="text" 
              style={styles.input} 
              value={mySkills} 
              onChange={(e) => setMySkills(e.target.value)} 
              placeholder="e.g., React, Data Analysis, Marketing"
            />
          </div>
        </div>
      </div>

      {/* --- CONTENT WRAPPER --- */}
      <div style={styles.wrapper}>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px', color: '#64748b' }}>
            🔄 Running recommendation engine...
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={styles.sectionTitle}>Found {recommendedJobs.length} Top Matches</h2>
              <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>Based on your skills profile</span>
            </div>
            
            {recommendedJobs.length > 0 ? (
              <div style={styles.jobGrid}>
                {recommendedJobs.map((job) => {
                  const companyName = job.companyId?.companyName || 'Hiring Company';
                  return (
                    <div 
                      key={job._id} 
                      style={styles.card}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div>
                        <span style={styles.matchBadge}>🔥 Highly Recommended</span>
                        
                        <div style={styles.cardHeader}>
                          {/* Dynamic avatar generation! */}
                          <img src={`https://ui-avatars.com/api/?name=${companyName}&background=random&color=fff&bold=true`} alt="logo" style={styles.companyLogo} />
                          <div>
                            <h2 style={styles.jobTitle}>{job.title}</h2>
                            <p style={styles.companyText}>{companyName}</p>
                          </div>
                        </div>
                        
                        <div style={styles.badgeContainer}>
                          <span style={styles.badge}>💼 {job.type}</span>
                          <span style={styles.badge}>🏢 {job.industry}</span>
                        </div>
                        
                        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 20px 0' }}>
                          📅 Posted: {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <button 
                        style={styles.applyBtn} 
                        onClick={() => handleApply(job._id, job.title)}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1ba87e'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#20c997'}
                      >
                        Apply Now
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={styles.noMatch}>
                <div style={styles.noMatchIcon}>🔍</div>
                <h2 style={{ color: '#0f172a', margin: '0 0 10px 0' }}>No perfect matches found.</h2>
                <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>
                  Try adjusting the skills in the search box above, or check back later as new jobs are posted daily!
                </p>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default RecommendedJobs;