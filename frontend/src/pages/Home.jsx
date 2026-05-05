import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [topIndustries, setTopIndustries] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [stats, setStats] = useState({ totalJobs: 0, totalCompanies: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- FETCH & PROCESS DB DATA ---
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs');
        const jobsData = response.data;

        // 1. RECENT JOBS (Top 3)
        const latest = [...jobsData].reverse().slice(0, 3);
        setRecentJobs(latest);

        // 2. LIVE STATISTICS
        const uniqueCompanies = new Set(jobsData.map(job => job.companyId?._id).filter(Boolean));
        setStats({ 
          totalJobs: jobsData.length, 
          totalCompanies: uniqueCompanies.size 
        });

        // 3. TOP INDUSTRIES
        const industryCounts = {};
        jobsData.forEach(job => {
          if (job.industry) {
            industryCounts[job.industry] = (industryCounts[job.industry] || 0) + 1;
          }
        });
        const sortedIndustries = Object.entries(industryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4);
        setTopIndustries(sortedIndustries);

        // 4. TOP HIRING COMPANIES
        const companyMap = new Map();
        jobsData.forEach(job => {
          if (job.companyId && !companyMap.has(job.companyId._id)) {
            companyMap.set(job.companyId._id, job.companyId.companyName);
          }
        });
        setTopCompanies(Array.from(companyMap.values()).slice(0, 4));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // --- STYLES ---
  const styles = {
    container: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#333', backgroundColor: '#f9fbfd' },
    
    // Updated Hero with Image Background
    hero: { 
      backgroundImage: 'url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      color: 'white', 
      padding: '140px 20px', 
      textAlign: 'center' 
    },
    heroOverlay: {
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 30, 80, 0.75)', // Dark blue transparent overlay
      zIndex: 1
    },
    heroContent: { position: 'relative', zIndex: 2 },
    heroTitle: { fontSize: '64px', margin: '0 0 20px 0', fontWeight: '900', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' },
    heroSub: { fontSize: '22px', margin: '0 auto 40px auto', maxWidth: '750px', lineHeight: '1.6', color: '#e0e0e0' },
    buttonGroup: { display: 'flex', gap: '20px', justifyContent: 'center' },
    btnPrimary: { padding: '16px 36px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(40,167,69,0.4)', transition: '0.3s' },
    btnSecondary: { padding: '16px 36px', backgroundColor: 'transparent', color: 'white', textDecoration: 'none', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', border: '2px solid white', transition: '0.3s' },
    
    section: { padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' },
    sectionAlt: { padding: '80px 20px', backgroundColor: '#ffffff' },
    sectionTitle: { textAlign: 'center', fontSize: '40px', marginBottom: '15px', color: '#111', fontWeight: 'bold' },
    sectionSub: { textAlign: 'center', fontSize: '18px', color: '#666', marginBottom: '50px', maxWidth: '600px', margin: '0 auto 50px auto' },
    
    // Stats Grid
    statsGrid: { display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', marginTop: '-60px', position: 'relative', zIndex: 3, maxWidth: '1000px', margin: '-60px auto 40px auto' },
    statBox: { textAlign: 'center', padding: '0 20px' },
    statNum: { fontSize: '54px', fontWeight: '900', color: '#007BFF', margin: '0 0 5px 0' },
    statLabel: { fontSize: '16px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' },

    // How It Works (New)
    stepGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' },
    stepCard: { textAlign: 'center', padding: '30px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eee' },
    stepImg: { width: '120px', height: '120px', marginBottom: '20px', objectFit: 'contain' },

    industryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
    industryCard: { backgroundImage: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', padding: '40px 30px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' },
    
    companyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
    companyCard: { backgroundColor: '#007BFF', backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', color: 'white', padding: '40px 20px', borderRadius: '12px', textAlign: 'center', fontSize: '22px', fontWeight: 'bold', boxShadow: '0 6px 15px rgba(0,123,255,0.3)' },

    jobGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' },
    card: { border: '1px solid #eee', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.03)', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: '0.3s' },
    badgeContainer: { display: 'flex', gap: '10px', margin: '20px 0' },
    badge: { padding: '6px 14px', backgroundColor: '#eef2f5', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', color: '#007BFF' },
    applyBtn: { width: '100%', padding: '14px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: '0.2s' },

    // Testimonials (New)
    testimonialGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' },
    testimonialCard: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', position: 'relative' },
    quoteIcon: { fontSize: '40px', color: '#eee', position: 'absolute', top: '20px', right: '20px' },
    userInfo: { display: 'flex', alignItems: 'center', gap: '15px', marginTop: '20px' },
    avatar: { width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' },

    ctaSection: { 
      backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      color: 'white', 
      padding: '100px 20px', 
      textAlign: 'center' 
    }
  };

  return (
    <div style={styles.container}>
      
      {/* 1. HERO SECTION WITH IMAGE OVERLAY */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Your Next Big Opportunity Awaits</h1>
          <p style={styles.heroSub}>
            Discover thousands of jobs, connect with elite companies, and accelerate your career with our intelligent Applicant Tracking System.
          </p>
          <div style={styles.buttonGroup}>
            <Link to="/jobs" style={styles.btnPrimary}>Browse Jobs</Link>
            <Link to="/register" style={styles.btnSecondary}>Post a Job</Link>
          </div>
        </div>
      </div>

      {/* 2. LIVE DATABASE STATS */}
      <div style={styles.statsGrid}>
        <div style={styles.statBox}>
          <h2 style={styles.statNum}>{stats.totalJobs}+</h2>
          <p style={styles.statLabel}>Active Jobs</p>
        </div>
        <div style={styles.statBox}>
          <h2 style={styles.statNum}>{stats.totalCompanies}+</h2>
          <p style={styles.statLabel}>Top Companies</p>
        </div>
        <div style={styles.statBox}>
          <h2 style={styles.statNum}>100%</h2>
          <p style={styles.statLabel}>Free for Seekers</p>
        </div>
      </div>

      {/* 3. HOW IT WORKS (NEW SECTION) */}
      <div style={styles.sectionAlt}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSub}>Our streamlined process makes finding a job or hiring talent easier than ever.</p>
          
          <div style={styles.stepGrid}>
            <div style={styles.stepCard}>
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Create Profile" style={styles.stepImg} />
              <h3>1. Create an Account</h3>
              <p style={{color: '#666'}}>Sign up, upload your resume, and list your top skills to stand out to employers.</p>
            </div>
            <div style={styles.stepCard}>
              <img src="https://cdn-icons-png.flaticon.com/512/5956/5956494.png" alt="Take Tests" style={styles.stepImg} />
              <h3>2. Apply & Assess</h3>
              <p style={{color: '#666'}}>Apply for jobs and take automated skill assessments directly on our platform.</p>
            </div>
            <div style={styles.stepCard}>
              <img src="https://cdn-icons-png.flaticon.com/512/6122/6122904.png" alt="Get Hired" style={styles.stepImg} />
              <h3>3. Get Hired</h3>
              <p style={{color: '#666'}}>Join video interviews with employers right from your dashboard and land the job!</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. RECENT JOBS SECTION */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Latest Opportunities</h2>
        <p style={styles.sectionSub}>Apply to the most recently posted positions on our platform.</p>
        {loading ? <p style={{textAlign: 'center'}}>Loading jobs...</p> : (
          <div style={styles.jobGrid}>
            {recentJobs.length > 0 ? recentJobs.map((job) => (
              <div 
                key={job._id} 
                style={styles.card}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)' }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.03)' }}
              >
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#111', fontSize: '22px' }}>{job.title}</h3>
                  <p style={{ margin: '0', color: '#007BFF', fontSize: '16px', fontWeight: 'bold' }}>{job.companyId?.companyName || 'Hiring Company'}</p>
                  <div style={styles.badgeContainer}>
                    <span style={styles.badge}>💼 {job.type}</span>
                    <span style={styles.badge}>🏢 {job.industry}</span>
                  </div>
                </div>
                <button style={styles.applyBtn} onClick={() => navigate('/jobs')}>View Job Details</button>
              </div>
            )) : <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#888' }}>No jobs have been posted yet.</p>}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Link to="/jobs" style={{ padding: '12px 30px', backgroundColor: '#eef2f5', color: '#007BFF', textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold' }}>Browse All Jobs →</Link>
        </div>
      </div>

      {/* 5. POPULAR INDUSTRIES */}
      <div style={styles.sectionAlt}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={styles.sectionTitle}>Trending Industries</h2>
          {loading ? <p style={{textAlign: 'center'}}>Loading data...</p> : (
            <div style={styles.industryGrid}>
              {topIndustries.length > 0 ? topIndustries.map(([industry, count], index) => (
                <div 
                  key={index} 
                  style={styles.industryCard} 
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#007BFF'; }} 
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#eee'; }}
                >
                  <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '20px' }}>{industry}</h3>
                  <p style={{ margin: '0', color: '#007BFF', fontWeight: 'bold', fontSize: '16px' }}>{count} Open Positions</p>
                </div>
              )) : <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Post some jobs to see trending industries!</p>}
            </div>
          )}
        </div>
      </div>

      {/* 6. TESTIMONIALS (NEW SECTION) */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Success Stories</h2>
        <p style={styles.sectionSub}>Hear from people who found their dream careers using our platform.</p>
        
        <div style={styles.testimonialGrid}>
          <div style={styles.testimonialCard}>
            <div style={styles.quoteIcon}>"</div>
            <p style={{ color: '#555', lineHeight: '1.6', fontSize: '16px', position: 'relative', zIndex: 2 }}>
              "The custom skill assessments helped me prove my MERN stack knowledge to employers. I received three interview requests in my first week and accepted a great offer!"
            </p>
            <div style={styles.userInfo}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=100&q=80" alt="User" style={styles.avatar} />
              <div>
                <strong style={{ display: 'block', color: '#111' }}>Rahul S.</strong>
                <span style={{ fontSize: '13px', color: '#888' }}>Full Stack Developer</span>
              </div>
            </div>
          </div>
          
          <div style={styles.testimonialCard}>
            <div style={styles.quoteIcon}>"</div>
            <p style={{ color: '#555', lineHeight: '1.6', fontSize: '16px', position: 'relative', zIndex: 2 }}>
              "As an employer, the built-in Applicant Tracking System and the ability to send timed tests directly to candidates saved us dozens of hours in screening."
            </p>
            <div style={styles.userInfo}>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&w=100&q=80" alt="User" style={styles.avatar} />
              <div>
                <strong style={{ display: 'block', color: '#111' }}>Priya M.</strong>
                <span style={{ fontSize: '13px', color: '#888' }}>HR Manager</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. EMPLOYER CTA */}
      <div style={styles.ctaSection}>
        <div style={styles.heroOverlay}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '42px', marginBottom: '20px', fontWeight: 'bold' }}>Are you an employer?</h2>
          <p style={{ fontSize: '20px', color: '#f0f0f0', marginBottom: '40px', lineHeight: '1.5' }}>
            Join the hundreds of companies that use our platform to find top-tier talent. Streamline your hiring with custom tests, interview scheduling, and video resources.
          </p>
          <Link to="/register" style={{...styles.btnPrimary, backgroundColor: '#007BFF', boxShadow: '0 4px 15px rgba(0,123,255,0.4)'}}>Start Hiring Today</Link>
        </div>
      </div>

    </div>
  );
};

export default Home;