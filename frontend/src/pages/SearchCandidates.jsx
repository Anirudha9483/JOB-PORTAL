import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // --- FETCH CANDIDATES FROM DATABASE ---
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/candidates', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // --- FILTERING LOGIC ---
  const filteredCandidates = candidates.filter(candidate => {
    const searchString = `${candidate.name} ${candidate.skills?.join(' ')} ${candidate.bio} ${candidate.education}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // --- PREMIUM UI STYLES ---
  const styles = {
    wrapper: { backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    
    // Modern Hero Header with Image Overlay
    hero: { 
      backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      padding: '80px 20px',
      textAlign: 'center',
      color: 'white',
      marginBottom: '40px'
    },
    heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 1 },
    heroContent: { position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' },
    title: { fontSize: '42px', fontWeight: '800', marginBottom: '15px', letterSpacing: '-1px' },
    
    // Floating Search Bar
    searchBox: { 
      backgroundColor: 'white', 
      padding: '10px 15px', 
      borderRadius: '12px', 
      display: 'flex', 
      alignItems: 'center', 
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      marginTop: '30px',
      border: '1px solid #e2e8f0'
    },
    input: { flex: 1, padding: '15px', border: 'none', outline: 'none', fontSize: '16px', color: '#334155' },
    searchIcon: { fontSize: '20px', margin: '0 10px', color: '#94a3b8' },

    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px 20px' },
    
    // Grid & Cards
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' },
    card: { 
      backgroundColor: 'white', 
      borderRadius: '16px', 
      padding: '30px', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)', 
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    cardAccent: { position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#007BFF' },
    
    // Profile Header
    profileHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' },
    avatar: { width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' },
    name: { fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 },
    
    // Badges
    badgeContainer: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' },
    badge: { padding: '5px 12px', backgroundColor: '#eff6ff', borderRadius: '20px', fontSize: '12px', color: '#007BFF', fontWeight: 'bold' },
    
    // Expanded Content
    expandedContent: { marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', animation: 'fadeIn 0.4s ease' },
    label: { fontSize: '13px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'block' },
    text: { fontSize: '15px', color: '#334155', lineHeight: '1.6', marginBottom: '15px' },

    // Buttons
    btnGroup: { display: 'flex', gap: '12px', marginTop: '25px' },
    mainBtn: { flex: 2, padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', transition: '0.2s' },
    secBtn: { flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' },
    disabledBtn: { backgroundColor: '#f8fafc', color: '#cbd5e1', cursor: 'not-allowed' }
  };

  return (
    <div style={styles.wrapper}>
      {/* HERO SECTION */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Discover the Future of Your Team</h1>
          <p style={{fontSize: '18px', opacity: 0.8}}>Access our curated global network of specialized talent.</p>
          
          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>
            <input 
              type="text" 
              style={styles.input} 
              placeholder="Search by tech stack (MERN), education, or candidate name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={styles.container}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '100px'}}>
             <h2 style={{color: '#64748b'}}>🔄 Accessing Secure Database...</h2>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <h3 style={{ color: '#0f172a' }}>{filteredCandidates.length} Professionals Matching</h3>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Real-time update from MongoDB</span>
            </div>

            <div style={styles.grid}>
              {filteredCandidates.map(candidate => {
                const isExpanded = expandedId === candidate._id;
                const initials = candidate.name ? candidate.name[0].toUpperCase() : 'U';

                return (
                  <div 
                    key={candidate._id} 
                    style={{...styles.card, transform: isExpanded ? 'scale(1.02)' : 'scale(1)'}}
                  >
                    <div style={styles.cardAccent}></div>
                    
                    <div style={styles.profileHeader}>
                      {/* Dynamic Avatar */}
                      <img 
                        src={`https://ui-avatars.com/api/?name=${candidate.name}&background=random&color=fff&bold=true`} 
                        style={styles.avatar} 
                        alt="Profile"
                      />
                      <div>
                        <h2 style={styles.name}>{candidate.name}</h2>
                        <span style={{fontSize: '13px', color: '#64748b'}}>Verified Professional</span>
                      </div>
                    </div>

                    <div style={{ color: '#475569', fontSize: '14px', marginBottom: '10px' }}>
                      📍 {candidate.education || 'Location Pending'}
                    </div>

                    <div style={styles.badgeContainer}>
                      {candidate.skills && candidate.skills.length > 0 && candidate.skills[0] !== "" ? (
                        candidate.skills[0].split(',').map((skill, index) => (
                          index < 4 && <span key={index} style={styles.badge}>{skill.trim()}</span>
                        ))
                      ) : <span style={{color: '#cbd5e1'}}>No skills listed</span>}
                    </div>

                    {isExpanded && (
                      <div style={styles.expandedContent}>
                        <span style={styles.label}>Professional Bio</span>
                        <p style={styles.text}>{candidate.bio || "No summary provided."}</p>
                        
                        <span style={styles.label}>Work Experience</span>
                        <p style={styles.text}>{candidate.experience || "Available upon request."}</p>
                        
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <a href={`mailto:${candidate.email}`} style={{color: '#007BFF', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'}}>✉️ Direct Email</a>
                            {candidate.portfolioUrl && <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer" style={{color: '#007BFF', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'}}>🔗 Portfolio</a>}
                        </div>
                      </div>
                    )}

                    <div style={styles.btnGroup}>
                      <button style={styles.secBtn} onClick={() => toggleExpand(candidate._id)}>
                        {isExpanded ? 'Collapse' : 'Details'}
                      </button>

                      {/* {candidate.resume ? (
                        <a 
                          href={`http://localhost:5000/uploads/${candidate.resume}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{...styles.mainBtn, textDecoration: 'none', textAlign: 'center'}}
                        >
                          📄 Resume
                        </a>
                      ) : (
                        <button style={{...styles.mainBtn, ...styles.disabledBtn}} disabled>No CV</button>
                      )} */}

                      {candidate.resume ? (
  <a 
    href={candidate.resume.startsWith('http') 
      ? candidate.resume 
      : `http://localhost:5000/uploads/${candidate.resume.split(/[\\/]/).pop()}`} 
    target="_blank" 
    rel="noopener noreferrer" 
    style={{...styles.mainBtn, textDecoration: 'none', textAlign: 'center'}}
  >
    📄 Resume
  </a>
) : (
  <button style={{...styles.mainBtn, ...styles.disabledBtn}} disabled>No CV</button>
)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchCandidates;