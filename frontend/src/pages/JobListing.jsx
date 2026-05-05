import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const JobListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- STATE FOR DATABASE DATA ---
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE FOR FILTERS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');

  // --- MOCK CATEGORIES FOR UI ENHANCEMENT ---
  const categories = [
    { name: 'Engineering', icon: '💻', count: '150+' },
    { name: 'Marketing', icon: '📈', count: '80+' },
    { name: 'Design', icon: '🎨', count: '50+' },
    { name: 'Finance', icon: '💰', count: '120+' }
  ];

  // --- 1. FETCH REAL DATA FROM MONGODB ---
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // --- 2. FILTERING LOGIC ---
  const filteredJobs = jobs.filter((job) => {
    const titleMatch = job.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const companyMatch = job.companyId?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSearch = titleMatch || companyMatch;
    const matchesType = filterType ? job.type === filterType : true;
    const matchesIndustry = filterIndustry ? job.industry?.toLowerCase().includes(filterIndustry.toLowerCase()) : true;
    
    return matchesSearch && matchesType && matchesIndustry;
  });

  // Extract the latest 2 jobs to showcase as "Featured"
  const featuredJobs = [...jobs].reverse().slice(0, 2);

  // --- 3. APPLY BUTTON LOGIC (CONNECTED TO MONGODB) ---
  const handleApply = async (jobId, jobTitle) => {
    if (!user?.isAuthenticated) {
      alert('You must be logged in to apply for jobs!');
      navigate('/login');
      return;
    }
    if (user.role !== 'User') {
      alert('Only Job Seekers (Users) can apply for jobs. Companies cannot apply.');
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
      console.error("Application error:", error);
      alert(error.response?.data?.message || 'Failed to submit application. Please try again.');
    }
  };

  // --- 4. STYLES ---
  const styles = {
    container: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#333', backgroundColor: '#f9fbfd', minHeight: '100vh', paddingBottom: '60px' },
    
    // Hero Banner
    hero: { 
      backgroundImage: 'url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      padding: '100px 20px',
      textAlign: 'center',
      color: 'white',
      marginBottom: '40px'
    },
    heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 40, 90, 0.75)', zIndex: 1 },
    heroContent: { position: 'relative', zIndex: 2 },
    header: { margin: '0 0 15px 0', fontSize: '48px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' },
    subHeader: { margin: '0', fontSize: '20px', color: '#e0e0e0' },
    
    wrapper: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },

    // Categories Section (NEW)
    categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '50px' },
    categoryCard: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', cursor: 'pointer', transition: '0.3s' },
    catIcon: { fontSize: '36px', backgroundColor: '#eef2f5', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px' },

    // Filters
    filterBar: { display: 'flex', gap: '15px', marginBottom: '50px', flexWrap: 'wrap', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', border: '1px solid #eaeaea' },
    inputGroup: { flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '8px', padding: '0 15px', backgroundColor: '#fafafa' },
    inputIcon: { fontSize: '18px', marginRight: '10px', color: '#888' },
    input: { flex: 1, padding: '15px 0', border: 'none', backgroundColor: 'transparent', fontSize: '16px', outline: 'none' },
    select: { flex: 1, minWidth: '200px', padding: '15px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', backgroundColor: '#fafafa', outline: 'none' },
    
    // Sections
    sectionTitle: { fontSize: '28px', borderBottom: '3px solid #007BFF', paddingBottom: '10px', marginBottom: '30px', display: 'inline-block', fontWeight: 'bold' },
    
    // Grid & Cards
    jobGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px', marginBottom: '60px' },
    card: { border: '1px solid #eee', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.04)', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: '0.3s' },
    featuredCard: { border: '2px solid #007BFF', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,123,255,0.15)', backgroundColor: '#f8fbff', transition: '0.3s' },
    
    // Card Header (Logo + Title)
    cardHeader: { display: 'flex', gap: '15px', marginBottom: '15px' },
    companyLogo: { width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' },
    jobTitle: { margin: '0 0 5px 0', color: '#111', fontSize: '22px' },
    companyText: { margin: '0', color: '#666', fontSize: '15px', fontWeight: 'bold' },
    
    // Badges & Buttons
    badgeContainer: { display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' },
    badge: { padding: '6px 12px', backgroundColor: '#eef2f5', borderRadius: '6px', fontSize: '13px', color: '#555', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' },
    featuredBadge: { padding: '6px 12px', backgroundColor: '#ffc107', borderRadius: '6px', fontSize: '12px', color: '#000', fontWeight: 'bold', marginBottom: '15px', display: 'inline-block' },
    applyBtn: { width: '100%', padding: '14px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: '0.2s', boxShadow: '0 4px 10px rgba(0,123,255,0.2)' },
    
    // Newsletter Section
    newsletter: { 
      backgroundImage: 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      color: 'white', 
      padding: '60px 20px', 
      borderRadius: '16px', 
      textAlign: 'center', 
      marginTop: '60px',
      overflow: 'hidden'
    },
    newsOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1 },
    newsContent: { position: 'relative', zIndex: 2 },
    newsletterInput: { padding: '16px', width: '60%', maxWidth: '400px', borderRadius: '30px 0 0 30px', border: 'none', outline: 'none', fontSize: '16px' },
    newsletterBtn: { padding: '16px 30px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '0 30px 30px 0', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }
  };

  return (
    <div style={styles.container}>
      
      {/* --- HERO BANNER --- */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.header}>Discover Your Next Career Move</h1>
          <p style={styles.subHeader}>Explore thousands of job opportunities tailored for your skills.</p>
        </div>
      </div>

      <div style={styles.wrapper}>
        
        {/* --- SEARCH AND FILTER BAR --- */}
        <div style={styles.filterBar}>
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>🔍</span>
            <input 
              type="text" 
              placeholder="Job title or company..." 
              style={styles.input}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select style={styles.select} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">💼 All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>

          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>🏢</span>
            <input 
              type="text" 
              placeholder="Industry (e.g., IT, Finance)..." 
              style={styles.input}
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
            />
          </div>
        </div>

        {/* --- CATEGORIES SECTION (NEW) --- */}
        {!searchTerm && !filterType && !filterIndustry && (
          <>
            <h2 style={styles.sectionTitle}>Browse by Department</h2>
            <div style={styles.categoryGrid}>
              {categories.map((cat, idx) => (
                <div key={idx} style={styles.categoryCard} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={styles.catIcon}>{cat.icon}</div>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{cat.name}</h3>
                    <span style={{ color: '#888', fontSize: '14px' }}>{cat.count} Jobs</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {loading ? (
          <h2 style={{ textAlign: 'center', color: '#666', padding: '50px 0' }}>Fetching live jobs...</h2>
        ) : (
          <>
            {/* --- FEATURED JOBS SECTION --- */}
            {featuredJobs.length > 0 && !searchTerm && !filterType && !filterIndustry && (
              <div style={{ marginBottom: '60px' }}>
                <h2 style={styles.sectionTitle}>🔥 Featured Roles</h2>
                <div style={styles.jobGrid}>
                  {featuredJobs.map((job) => {
                    const companyName = job.companyId?.companyName || 'Company';
                    return (
                      <div key={`feat-${job._id}`} style={styles.featuredCard}>
                        <span style={styles.featuredBadge}>⚡ Actively Hiring</span>
                        
                        <div style={styles.cardHeader}>
                          {/* Generates a beautiful dynamic logo based on the company name! */}
                          <img src={`https://ui-avatars.com/api/?name=${companyName}&background=007BFF&color=fff&bold=true`} alt="logo" style={styles.companyLogo} />
                          <div>
                            <h2 style={styles.jobTitle}>{job.title}</h2>
                            <p style={styles.companyText}>{companyName}</p>
                          </div>
                        </div>

                        <div style={styles.badgeContainer}>
                          <span style={styles.badge}>🕒 {job.type}</span>
                          <span style={styles.badge}>🏢 {job.industry}</span>
                        </div>
                        <button style={styles.applyBtn} onClick={() => handleApply(job._id, job.title)}>Apply Now</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- MAIN JOB LISTINGS GRID --- */}
            <h2 style={styles.sectionTitle}>All Available Jobs</h2>
            <div style={styles.jobGrid}>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                  const companyName = job.companyId?.companyName || 'Company';
                  return (
                    <div key={job._id} style={styles.card} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                      <div>
                        <div style={styles.cardHeader}>
                          <img src={`https://ui-avatars.com/api/?name=${companyName}&background=random&color=fff&bold=true`} alt="logo" style={styles.companyLogo} />
                          <div>
                            <h2 style={{...styles.jobTitle, fontSize: '20px'}}>{job.title}</h2>
                            <p style={styles.companyText}>{companyName}</p>
                          </div>
                        </div>
                        
                        <div style={styles.badgeContainer}>
                          <span style={styles.badge}>🕒 {job.type}</span>
                          <span style={styles.badge}>🏢 {job.industry}</span>
                        </div>
                        
                        <p style={{ fontSize: '13px', color: '#999', margin: '0 0 15px 0' }}>
                          📅 Posted: {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <button 
                        style={{...styles.applyBtn, backgroundColor: '#fff', color: '#007BFF', border: '1px solid #007BFF', boxShadow: 'none'}} 
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#007BFF'; e.currentTarget.style.color = '#fff'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#007BFF'; }}
                        onClick={() => handleApply(job._id, job.title)}
                      >
                        View & Apply
                      </button>
                    </div>
                  );
                })
              ) : (
                <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#888', fontSize: '18px', padding: '50px 0' }}>
                  No jobs found matching your search criteria. Try adjusting your filters!
                </p>
              )}
            </div>
          </>
        )}

        {/* --- NEWSLETTER SECTION --- */}
        <div style={styles.newsletter}>
          <div style={styles.newsOverlay}></div>
          <div style={styles.newsContent}>
            <h2 style={{ margin: '0 0 15px 0', fontSize: '32px' }}>Never Miss an Opportunity!</h2>
            <p style={{ margin: '0 auto 25px auto', color: '#e0e0e0', maxWidth: '500px', fontSize: '18px' }}>
              Subscribe to our newsletter to get the latest jobs and career advice delivered straight to your inbox.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <input type="email" placeholder="Enter your email address..." style={styles.newsletterInput} />
              <button style={styles.newsletterBtn} onClick={() => alert('Subscribed successfully!')}>Subscribe</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobListing;