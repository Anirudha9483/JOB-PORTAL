import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      // Role is strictly set to 'User' behind the scenes
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role: 'User' 
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ isAuthenticated: true, ...user }));

      setUser({ isAuthenticated: true, role: user.role, email: user.email, id: user.id });
      navigate('/user/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    wrapper: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f4f7f6' },
    imageSection: { flex: 1, backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 40, 90, 0.75)' },
    imageContent: { position: 'relative', zIndex: 2, color: 'white', maxWidth: '500px', textAlign: 'center' },
    formSection: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', padding: '20px', position: 'relative' },
    card: { width: '100%', maxWidth: '420px', padding: '40px' },
    logoPlaceholder: { width: '60px', height: '60px', backgroundColor: '#eef2f5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '20px' },
    title: { margin: '0 0 10px 0', color: '#111', fontSize: '32px', fontWeight: 'bold' },
    subTitle: { margin: '0 0 30px 0', color: '#666', fontSize: '16px' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444', fontSize: '14px' },
    input: { width: '100%', padding: '14px 15px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fdfdfd', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s' },
    button: { width: '100%', padding: '15px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px', boxShadow: '0 4px 10px rgba(0,123,255,0.3)', transition: '0.3s' },
    error: { color: '#721c24', backgroundColor: '#f8d7da', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px', textAlign: 'center', border: '1px solid #f5c6cb' },
    linkText: { textAlign: 'center', marginTop: '25px', fontSize: '15px', color: '#666' },
    topLink: { position: 'absolute', top: '30px', right: '40px', fontSize: '14px', color: '#666', fontWeight: 'bold' }
  };

  return (
    <div style={styles.wrapper}>
      
      {/* BRAND IMAGE */}
      <div style={styles.imageSection}>
        <div style={styles.overlay}></div>
        <div style={styles.imageContent}>
          <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', fontWeight: 'bold' }}>Welcome Back!</h1>
          <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#e0e0e0' }}>
            Log in to access your customized dashboard, track your applications, and discover your next great opportunity.
          </p>
        </div>
      </div>

      {/* LOGIN FORM */}
      <div style={styles.formSection}>
        
        {/* Quick link for company to find their specific portal */}
        <div style={styles.topLink}>
          Company or Admin? <Link to="/corporate-login" style={{color: '#007BFF', textDecoration: 'none'}}>Login Here</Link>
        </div>

        <div style={styles.card}>
          <div style={styles.logoPlaceholder}>🚀</div>
          <h2 style={styles.title}>Candidate Login</h2>
          <p style={styles.subTitle}>Please enter your details to continue.</p>
          
          {error && <div style={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleLogin}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" style={styles.input} placeholder="name@example.com" 
                value={email} onChange={(e) => setEmail(e.target.value)} 
                onFocus={(e) => e.target.style.borderColor = '#007BFF'} onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" style={styles.input} placeholder="••••••••" 
                value={password} onChange={(e) => setPassword(e.target.value)} 
                onFocus={(e) => e.target.style.borderColor = '#007BFF'} onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>

          <p style={styles.linkText}>
            Don't have an account yet? <br/>
            <Link to="/register" style={{ color: '#007BFF', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginTop: '10px' }}>
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;