import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InterviewPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [appRes, vidRes] = await Promise.all([
          axios.get('http://localhost:5000/api/applications/user', { headers }),
          axios.get('http://localhost:5000/api/videos', { headers })
        ]);
        setInterviews(appRes.data.filter(a => a.status === 'Interview Scheduled'));
        setVideos(vidRes.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.companyId?.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to extract YouTube ID for thumbnails
  const getYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const styles = {
    layout: { padding: '40px', backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" },
    header: { 
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
      padding: '50px', 
      borderRadius: '24px', 
      color: 'white', 
      marginBottom: '40px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    },
    sectionTitle: { fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
    
    // Interview Card
    iCard: { 
      backgroundColor: '#fff', 
      padding: '25px', 
      borderRadius: '16px', 
      borderLeft: '6px solid #16a34a', 
      marginBottom: '15px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
    },
    
    // Video Grid
    videoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
    vCard: { 
      backgroundColor: '#fff', 
      borderRadius: '16px', 
      overflow: 'hidden', 
      transition: 'transform 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      cursor: 'pointer'
    },
    thumbnail: { width: '100%', height: '180px', backgroundColor: '#000', objectFit: 'cover' },
    
    searchBar: {
      width: '100%',
      padding: '12px 20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      marginBottom: '30px',
      fontSize: '16px',
      outline: 'none'
    }
  };

  if (loading) return <div style={{padding: '100px', textAlign: 'center'}}><h2>Loading your prep center...</h2></div>;

  return (
    <div style={styles.layout}>
      
      {/* 1. HERO HEADER */}
      <div style={styles.header}>
        <h1 style={{fontSize: '42px', margin: '0 0 10px 0'}}>Interview Ready.</h1>
        <p style={{fontSize: '18px', opacity: 0.8}}>Manage your schedule and sharpen your skills with employer resources.</p>
      </div>

      {/* 2. UPCOMING INTERVIEWS */}
      <section style={{marginBottom: '60px'}}>
        <h2 style={styles.sectionTitle}><span>📅</span> Confirmed Schedule</h2>
        {interviews.length === 0 ? (
          <div style={{padding: '40px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '16px', color: '#64748b'}}>
            No interviews scheduled yet. Keep applying!
          </div>
        ) : (
          interviews.map(i => (
            <div key={i._id} style={styles.iCard}>
              <div>
                <span style={{backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold'}}>CONFIRMED</span>
                <h3 style={{margin: '10px 0 5px 0', fontSize: '20px'}}>{i.jobId?.title}</h3>
                <p style={{color: '#64748b', margin: 0}}><strong>{i.companyId?.companyName}</strong> • {new Date(i.interviewDate).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}</p>
              </div>
              <a 
                href={i.interviewLink} 
                target="_blank" 
                rel="noreferrer" 
                style={{backgroundColor: '#16a34a', color: '#fff', padding: '12px 25px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(22,163,74,0.3)'}}
              >
                Join Meeting
              </a>
            </div>
          ))
        )}
      </section>

      {/* 3. PREP VIDEOS */}
      <section>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2 style={{...styles.sectionTitle, marginBottom: 0}}><span>🎥</span> Preparation Library</h2>
            <div style={{fontSize: '14px', color: '#64748b', fontWeight: 'bold'}}>{filteredVideos.length} Videos Available</div>
        </div>

        <input 
            type="text" 
            placeholder="Search by company or topic..." 
            style={styles.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div style={styles.videoGrid}>
          {filteredVideos.map(v => {
            const videoId = getYouTubeID(v.url);
            return (
              <div 
                key={v._id} 
                style={styles.vCard}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {videoId ? (
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} 
                    alt="Thumbnail" 
                    style={styles.thumbnail} 
                  />
                ) : (
                  <div style={{...styles.thumbnail, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#334155'}}>
                    No Thumbnail
                  </div>
                )}
                <div style={{padding: '20px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px'}}>
                    <img 
                        src={`https://ui-avatars.com/api/?name=${v.companyId?.companyName}&background=random&color=fff`} 
                        style={{width: '24px', height: '24px', borderRadius: '50%'}} 
                        alt="logo"
                    />
                    <span style={{fontSize: '12px', fontWeight: '700', color: '#007BFF'}}>{v.companyId?.companyName}</span>
                  </div>
                  <strong style={{fontSize: '17px', color: '#1e293b', display: 'block', height: '50px', overflow: 'hidden'}}>{v.title}</strong>
                  <a 
                    href={v.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{marginTop: '15px', display: 'block', textAlign: 'center', backgroundColor: '#ef4444', color: '#fff', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'}}
                  >
                    ▶ Watch Training
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default InterviewPage;