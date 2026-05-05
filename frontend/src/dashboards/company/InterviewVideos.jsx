import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InterviewVideos = () => {
  const [myVideos, setMyVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({ title: '', url: '' });
  const [loading, setLoading] = useState(true); // Added loading state
  const [isSubmitting, setIsSubmitting] = useState(false); // Added submitting state

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/videos/company', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setMyVideos(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleAddVideo = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/videos', newVideo, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setMyVideos([response.data.video, ...myVideos]);
      setNewVideo({ title: '', url: '' });
      alert('✅ Video added successfully to your library!');
    } catch (error) { 
      alert('Failed to add video. Please check the URL.'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to remove this video from your library?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/videos/${videoId}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setMyVideos(myVideos.filter(v => v._id !== videoId));
      } catch (error) { 
        alert('Failed to delete video.'); 
      }
    }
  };

  const getYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const styles = {
    pageHeader: { marginTop: 0, color: '#0f172a', fontSize: '32px', fontWeight: '800', marginBottom: '8px' },
    pageSub: { color: '#64748b', fontSize: '16px', marginBottom: '35px' },
    
    card: { backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', marginBottom: '40px' },
    input: { width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontSize: '15px', outline: 'none', transition: 'border 0.2s' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '700', color: '#334155', fontSize: '14px' },
    
    buttonPrimary: { padding: '14px 28px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', transition: '0.2s', boxShadow: '0 4px 10px rgba(0,123,255,0.2)' },
    
    emptyState: { textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '2px dashed #e2e8f0', color: '#64748b' }
  };

  return (
    <div>
      <h1 style={styles.pageHeader}>Preparation Resources</h1>
      <p style={styles.pageSub}>Upload videos to help candidates prepare for your interviews and company culture.</p>
      
      {/* ADD VIDEO FORM */}
      <div style={styles.card}>
        <h2 style={{ fontSize: '20px', marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>Add a New Video</h2>
        <form onSubmit={handleAddVideo}>
          <div style={{display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap'}}>
            <div style={{flex: '1 1 300px'}}>
              <label style={styles.label}>Video Title</label>
              <input 
                type="text" 
                required 
                style={styles.input} 
                value={newVideo.title} 
                onChange={(e) => setNewVideo({...newVideo, title: e.target.value})} 
                placeholder="e.g., Day in the Life at TechCorp" 
              />
            </div>
            <div style={{flex: '2 1 400px'}}>
              <label style={styles.label}>YouTube URL</label>
              <input 
                type="url" 
                required 
                style={styles.input} 
                value={newVideo.url} 
                onChange={(e) => setNewVideo({...newVideo, url: e.target.value})} 
                placeholder="https://www.youtube.com/watch?v=..." 
              />
            </div>
            <button 
              type="submit" 
              style={styles.buttonPrimary} 
              disabled={isSubmitting}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007BFF'}
            >
              {isSubmitting ? 'Saving...' : '➕ Add to Library'}
            </button>
          </div>
        </form>
      </div>

      {/* VIDEO GRID */}
      <div>
        <h3 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '20px' }}>Your Video Library</h3>
        
        {loading ? (
          <p style={{color: '#64748b'}}>Loading your videos...</p>
        ) : myVideos.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{fontSize: '48px', marginBottom: '15px'}}>🎬</div>
            <h3 style={{color: '#0f172a', margin: '0 0 10px 0'}}>No videos added yet</h3>
            <p style={{margin: 0}}>Use the form above to add your first YouTube video link.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
            {myVideos.map(v => {
              const videoId = getYouTubeID(v.url);
              return (
                <div 
                  key={v._id} 
                  style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)'; }}
                >
                  {/* THUMBNAIL */}
                  {videoId ? (
                    <div style={{ position: 'relative' }}>
                      <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} alt="Thumbnail" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>YouTube</div>
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '180px', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: 'bold' }}>No Thumbnail Found</div>
                  )}
                  
                  {/* CARD CONTENT */}
                  <div style={{ padding: '20px' }}>
                    <strong style={{ fontSize: '18px', color: '#0f172a', display: 'block', marginBottom: '20px', height: '45px', overflow: 'hidden', lineHeight: '1.3' }}>
                      {v.title}
                    </strong>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <a 
                        href={v.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ flex: 1, textAlign: 'center', padding: '12px', backgroundColor: '#eff6ff', color: '#007BFF', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', transition: '0.2s' }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#dbeafe'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#eff6ff'}
                      >
                        ▶ Watch Link
                      </a>
                      <button 
                        onClick={() => handleDeleteVideo(v._id)} 
                        style={{ flex: 1, padding: '12px', backgroundColor: '#fff', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', transition: '0.2s' }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#fff'}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewVideos;