import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CorporateLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Company'); // Default to Company
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setUser } = useAuth(); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ isAuthenticated: true, ...user }));

      setUser({ isAuthenticated: true, role: user.role, email: user.email, id: user.id });

      if (user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/company/dashboard');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    wrapper: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f0f4f8' },
    
    // Using a different, more corporate image for distinction
    imageSection: { flex: 1, backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)' },
    imageContent: { position: 'relative', zIndex: 2, color: 'white', maxWidth: '500px', textAlign: 'center' },
    
    formSection: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', padding: '20px', position: 'relative' },
    card: { width: '100%', maxWidth: '420px', padding: '40px' },
    logoPlaceholder: { width: '60px', height: '60px', backgroundColor: '#f1f5f9', color: '#0f172a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '20px' },
    title: { margin: '0 0 10px 0', color: '#0f172a', fontSize: '32px', fontWeight: 'bold' },
    subTitle: { margin: '0 0 30px 0', color: '#64748b', fontSize: '16px' },
    
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155', fontSize: '14px' },
    input: { width: '100%', padding: '14px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s' },
    select: { width: '100%', padding: '14px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '15px', boxSizing: 'border-box', outline: 'none', cursor: 'pointer' },
    
    button: { width: '100%', padding: '15px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px', boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)', transition: '0.3s' },
    error: { color: '#b91c1c', backgroundColor: '#fee2e2', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px', textAlign: 'center', border: '1px solid #fca5a5' },
    topLink: { position: 'absolute', top: '30px', right: '40px', fontSize: '14px', color: '#64748b', fontWeight: 'bold' }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.imageSection}>
        <div style={styles.overlay}></div>
        <div style={styles.imageContent}>
          <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', fontWeight: 'bold' }}>Corporate Portal</h1>
          <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#e2e8f0' }}>
            Manage your company profile, post new job listings, and find top-tier talent to grow your business.
          </p>
        </div>
      </div>

      <div style={styles.formSection}>
        <div style={styles.topLink}>
          Looking for jobs? <Link to="/login" style={{color: '#007BFF', textDecoration: 'none'}}>Candidate Login</Link>
        </div>

        <div style={styles.card}>
          <div style={styles.logoPlaceholder}>🏢</div>
          <h2 style={styles.title}>Partner Login</h2>
          <p style={styles.subTitle}>Access your corporate or administrative account.</p>
          
          {error && <div style={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleLogin}>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Account Authorization</label>
              <select style={styles.select} value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Company">🏢 Company </option>
                <option value="Admin">🛡️ System Administrator</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Work Email</label>
              <input 
                type="email" style={styles.input} placeholder="admin@company.com" 
                value={email} onChange={(e) => setEmail(e.target.value)} 
                onFocus={(e) => e.target.style.borderColor = '#0f172a'} onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" style={styles.input} placeholder="••••••••" 
                value={password} onChange={(e) => setPassword(e.target.value)} 
                onFocus={(e) => e.target.style.borderColor = '#0f172a'} onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Verifying...' : 'Secure Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CorporateLogin;