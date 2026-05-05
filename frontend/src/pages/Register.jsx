import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password || !formData.contactNumber || !formData.name) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        role: 'User', // Hardcoded safely behind the scenes
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contactNumber
      };

      const response = await axios.post('http://localhost:5000/api/auth/register', payload);
      
      alert(response.data.message || '🎉 Registration successful! Please log in.');
      navigate('/login'); 

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    wrapper: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f4f7f6', position: 'relative' },
    
    // Top Right Link
    topRightLink: { position: 'absolute', top: '30px', right: '40px', fontSize: '14px', color: '#555', zIndex: 10, fontWeight: 'bold' },
    loginBtn: { color: '#007BFF', textDecoration: 'none', border: '1px solid #007BFF', padding: '8px 20px', borderRadius: '20px', marginLeft: '10px', transition: '0.3s' },

    // Left Pane
    imageSection: { flex: 1, backgroundImage: 'url("https://images.unsplash.com/photo-1521737711867-e3cb130dd22a?auto=format&fit=crop&w=1920&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 30, 80, 0.85)' },
    imageContent: { position: 'relative', zIndex: 2, color: 'white', maxWidth: '500px' },
    
    // Social Proof
    socialProofBox: { display: 'flex', alignItems: 'center', marginTop: '40px', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '10px 20px', borderRadius: '30px', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.2)', width: 'max-content' },
    avatarImg: { width: '45px', height: '45px', borderRadius: '50%', border: '3px solid #fff', objectFit: 'cover' },
    
    // Right Pane
    formSection: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', padding: '40px 20px' },
    card: { width: '100%', maxWidth: '420px', marginTop: '40px' },
    title: { margin: '0 0 10px 0', color: '#111', fontSize: '32px', fontWeight: 'bold' },
    subTitle: { margin: '0 0 30px 0', color: '#666', fontSize: '16px' },
    
    formGroup: { marginBottom: '18px' },
    label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#444', fontSize: '14px' },
    input: { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fdfdfd', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s' },
    
    button: { width: '100%', padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px', boxShadow: '0 4px 10px rgba(40,167,69,0.3)', transition: '0.3s' },
    error: { color: '#721c24', backgroundColor: '#f8d7da', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px', textAlign: 'center', border: '1px solid #f5c6cb' },
    linkText: { textAlign: 'center', marginTop: '25px', fontSize: '15px', color: '#666' }
  };

  return (
    <div style={styles.wrapper}>
      
      <div style={styles.topRightLink}>
        Company? 
        <Link to="/corporate-register" style={styles.loginBtn} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#007BFF'; e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#007BFF'; }}>
          Post Jobs
        </Link>
      </div>

      <div style={styles.imageSection}>
        <div style={styles.overlay}></div>
        <div style={styles.imageContent}>
          <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Join Our Community</h1>
          <p style={{ fontSize: '20px', lineHeight: '1.6', color: '#e0e0e0' }}>
            Looking for your dream job? Your journey starts here. 
          </p>

          <div style={styles.socialProofBox}>
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User 1" style={styles.avatarImg} />
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User 2" style={{...styles.avatarImg, marginLeft: '-15px'}} />
            <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="User 3" style={{...styles.avatarImg, marginLeft: '-15px'}} />
            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User 4" style={{...styles.avatarImg, marginLeft: '-15px'}} />
            <span style={{ marginLeft: '15px', fontSize: '15px', fontWeight: 'bold' }}>Trusted by 50,000+ Users</span>
          </div>
        </div>
      </div>

      <div style={styles.formSection}>
        <div style={styles.card}>
          
          <img src="https://cdn-icons-png.flaticon.com/512/2950/2950037.png" alt="App Logo" style={{ width: '55px', marginBottom: '20px' }} />

          <h2 style={styles.title}>Candidate Signup</h2>
          <p style={styles.subTitle}>Create an account to apply for jobs.</p>
          
          {error && <div style={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleRegister}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input 
                type="text" name="name" style={styles.input} placeholder="John Doe" 
                value={formData.name} onChange={handleChange} 
                onFocus={(e) => e.target.style.borderColor = '#007BFF'} onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" name="email" style={styles.input} placeholder="you@example.com" 
                value={formData.email} onChange={handleChange} 
                onFocus={(e) => e.target.style.borderColor = '#007BFF'} onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Contact Number</label>
              <input 
                type="tel" name="contactNumber" style={styles.input} placeholder="+1 234 567 890" 
                value={formData.contactNumber} onChange={handleChange} 
                onFocus={(e) => e.target.style.borderColor = '#007BFF'} onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" name="password" style={styles.input} placeholder="Create a strong password" 
                value={formData.password} onChange={handleChange} 
                onFocus={(e) => e.target.style.borderColor = '#007BFF'} onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>

          <p style={styles.linkText}>
            Already have an account? <Link to="/login" style={{ color: '#007BFF', textDecoration: 'none', fontWeight: 'bold' }}>Sign In</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;