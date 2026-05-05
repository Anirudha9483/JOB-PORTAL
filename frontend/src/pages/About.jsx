import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const About = () => {
  // --- DATABASE STATE ---
  const [dbStats, setDbStats] = useState({ jobs: 0, companies: 0 });
  const [loading, setLoading] = useState(true);

  // --- FETCH LIVE STATS FROM MONGODB ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs');
        const jobs = response.data;
        
        // Calculate unique companies from the jobs list
        const uniqueCompanies = new Set(jobs.map(job => job.companyId?._id).filter(Boolean));
        
        setDbStats({
          jobs: jobs.length,
          companies: uniqueCompanies.size
        });
      } catch (error) {
        console.error("Failed to fetch stats for About page", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // --- MOCK DATA FOR PROCESS & VALUES ---
  const steps = [
    { id: 1, img: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', title: 'Create an Account', desc: 'Sign up as a Job Seeker or an Employer in just two minutes.' },
    { id: 2, img: 'https://cdn-icons-png.flaticon.com/512/1006/1006544.png', title: 'Build Your Profile', desc: 'Upload your resume or post your company\'s open positions.' },
    { id: 3, img: 'https://cdn-icons-png.flaticon.com/512/6122/6122904.png', title: 'Connect & Succeed', desc: 'Apply for your dream job or hire the perfect candidate.' },
  ];

  const values = [
    { id: 1, icon: '💡', title: 'Innovation', desc: 'We constantly upgrade our ATS and assessment tools to stay ahead.' },
    { id: 2, icon: '🤝', title: 'Community', desc: 'We believe in building bridges between amazing talent and great workplaces.' },
    { id: 3, icon: '🛡️', title: 'Integrity', desc: 'Transparency and honesty are at the core of everything we build.' },
    { id: 4, icon: '🚀', title: 'Growth', desc: 'We measure our success by the career growth of our users.' }
  ];

  // --- STYLES ---
  const styles = {
    container: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#333', backgroundColor: '#fff', minHeight: '100vh' },
    
    // Hero with Image Overlay
    hero: { 
      backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      color: 'white', 
      padding: '120px 20px', 
      textAlign: 'center' 
    },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 30, 80, 0.8)', zIndex: 1 },
    heroContent: { position: 'relative', zIndex: 2 },
    heroTitle: { fontSize: '54px', margin: '0 0 20px 0', fontWeight: '900', textShadow: '2px 2px 5px rgba(0,0,0,0.5)' },
    heroText: { fontSize: '22px', maxWidth: '750px', margin: '0 auto', lineHeight: '1.6', color: '#e0e0e0' },
    
    section: { padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' },
    sectionAlt: { padding: '80px 20px', backgroundColor: '#f9fbfd' },
    sectionTitle: { textAlign: 'center', fontSize: '38px', marginBottom: '15px', color: '#111', fontWeight: 'bold' },
    sectionSub: { textAlign: 'center', fontSize: '18px', color: '#666', marginBottom: '50px', maxWidth: '700px', margin: '0 auto 50px auto' },
    
    // Stats Grid
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center', position: 'relative', zIndex: 3, marginTop: '-50px', padding: '0 20px' },
    statCard: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #eee' },
    statNum: { fontSize: '48px', fontWeight: '900', color: '#007BFF', margin: '0 0 5px 0' },
    statLabel: { fontSize: '16px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' },

    // Split Mission Section
    splitFlex: { display: 'flex', flexWrap: 'wrap', gap: '50px', alignItems: 'center', justifyContent: 'space-between' },
    splitText: { flex: '1 1 500px', fontSize: '18px', lineHeight: '1.8', color: '#555' },
    splitImage: { flex: '1 1 400px', width: '100%', maxWidth: '500px', borderRadius: '12px', boxShadow: '0 15px 30px rgba(0,0,0,0.1)', objectFit: 'cover' },
    
    // Grid Layouts
    stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' },
    stepCard: { textAlign: 'center', padding: '40px 20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 5px 15px rgba(0,0,0,0.03)', transition: 'transform 0.3s' },
    stepIcon: { width: '80px', height: '80px', marginBottom: '20px' },
    stepTitle: { fontSize: '22px', color: '#111', marginBottom: '15px', fontWeight: 'bold' },

    valuesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' },
    valueCard: { padding: '30px', backgroundColor: '#fff', borderRadius: '12px', borderLeft: '4px solid #007BFF', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },

    // CTA
    ctaSection: { 
      backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      textAlign: 'center', 
      padding: '100px 20px', 
      color: 'white' 
    },
    ctaTitle: { fontSize: '42px', marginBottom: '20px', fontWeight: 'bold' },
    buttonGroup: { display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px', flexWrap: 'wrap' },
    btnPrimary: { padding: '16px 36px', backgroundColor: '#007BFF', color: 'white', textDecoration: 'none', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', transition: '0.3s', boxShadow: '0 4px 15px rgba(0,123,255,0.4)' },
    btnSecondary: { padding: '16px 36px', backgroundColor: 'transparent', color: 'white', border: '2px solid white', textDecoration: 'none', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', transition: '0.3s' }
  };

  return (
    <div style={styles.container}>
      
      {/* 1. HERO SECTION WITH IMAGE */}
      <div style={styles.hero}>
        <div style={styles.overlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Bridging the Gap Between Talent and Opportunity</h1>
          <p style={styles.heroText}>
            We are more than just a job board. We are an intelligent, community-driven platform dedicated to helping professionals find their purpose and companies build world-class teams.
          </p>
        </div>
      </div>

      {/* 2. DYNAMIC STATS SECTION (Pulled from Database!) */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h2 style={styles.statNum}>{loading ? '...' : `${dbStats.jobs}+`}</h2>
            <p style={styles.statLabel}>Active Job Listings</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={styles.statNum}>{loading ? '...' : `${dbStats.companies}+`}</h2>
            <p style={styles.statLabel}>Hiring Companies</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={styles.statNum}>100%</h2>
            <p style={styles.statLabel}>Free for Seekers</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={styles.statNum}>24/7</h2>
            <p style={styles.statLabel}>Platform Support</p>
          </div>
        </div>
      </div>

      {/* 3. MISSION & VISION (Split Layout with Image) */}
      <div style={styles.section}>
        <div style={styles.splitFlex}>
          <div style={styles.splitText}>
            <h2 style={{ fontSize: '36px', color: '#111', marginBottom: '20px' }}>Our Mission & Vision</h2>
            <h3 style={{ color: '#007BFF', fontSize: '24px', marginBottom: '10px' }}>The Mission</h3>
            <p style={{ marginBottom: '30px' }}>
              To empower individuals by providing a transparent, efficient, and accessible platform to discover meaningful career opportunities. We strive to simplify the hiring process for employers, ensuring they can connect with the right talent faster and smarter using our built-in Applicant Tracking System and assessment tools.
            </p>
            <h3 style={{ color: '#28a745', fontSize: '24px', marginBottom: '10px' }}>The Vision</h3>
            <p>
              We envision a world where every professional is placed in a role where they can thrive, innovate, and contribute positively to society. By leveraging technology, custom assessments, and video interviews, we aim to be the global standard for modern talent acquisition.
            </p>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80" 
            alt="Team Collaboration" 
            style={styles.splitImage} 
          />
        </div>
      </div>

      {/* 4. OUR CORE VALUES (NEW SECTION) */}
      <div style={styles.sectionAlt}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={styles.sectionTitle}>Our Core Values</h2>
          <p style={styles.sectionSub}>The principles that guide our platform, our team, and our features.</p>
          <div style={styles.valuesGrid}>
            {values.map(val => (
              <div key={val.id} style={styles.valueCard}>
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>{val.icon}</div>
                <h3 style={{ fontSize: '22px', marginBottom: '10px', color: '#111' }}>{val.title}</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. HOW IT WORKS SECTION */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <p style={styles.sectionSub}>Your journey to a better career or a better hire starts here.</p>
        <div style={styles.stepsGrid}>
          {steps.map(step => (
            <div 
              key={step.id} 
              style={styles.stepCard}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img src={step.img} alt={step.title} style={styles.stepIcon} />
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. CALL TO ACTION (With Background Image) */}
      <div style={styles.ctaSection}>
        <div style={styles.overlay}></div>
        <div style={styles.heroContent}>
          <h2 style={styles.ctaTitle}>Ready to take the next step?</h2>
          <p style={{ fontSize: '20px', color: '#e0e0e0', maxWidth: '600px', margin: '0 auto' }}>
            Join thousands of users who are already advancing their careers and building incredible teams on our platform.
          </p>
          <div style={styles.buttonGroup}>
            <Link to="/register" style={styles.btnPrimary}>Create an Account</Link>
            <Link to="/jobs" style={styles.btnSecondary}>Browse Jobs Now</Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;