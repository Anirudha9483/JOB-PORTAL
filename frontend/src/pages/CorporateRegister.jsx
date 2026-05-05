import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const CorporateRegister = () => {
  const [formData, setFormData] = useState({
    companyName: '',
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

    if (!formData.email || !formData.password || !formData.contactNumber || !formData.companyName) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        role: 'Company', // Hardcoded
        companyName: formData.companyName,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contactNumber
      };

      const response = await axios.post('http://localhost:5000/api/auth/register', payload);
      
      alert(response.data.message || '🏢 Company Registration successful! Please log in.');
      navigate('/corporate-login'); 

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    wrapper: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f0f4f8', position: 'relative' },
    
    topRightLink: { position: 'absolute', top: '30px', right: '40px', fontSize: '14px', color: '#64748b', zIndex: 10, fontWeight: 'bold' },
    loginBtn: { color: '#0f172a', textDecoration: 'none', border: '1px solid #0f172a', padding: '8px 20px', borderRadius: '20px', marginLeft: '10px', transition: '0.3s' },

    imageSection: { flex: 1, backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)' },
    imageContent: { position: 'relative', zIndex: 2, color: 'white', maxWidth: '500px', textAlign: 'center' },
    
    formSection: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', padding: '40px 20px' },
    card: { width: '100%', maxWidth: '420px', marginTop: '40px' },
    logoPlaceholder: { width: '60px', height: '60px', backgroundColor: '#f1f5f9', color: '#0f172a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '20px' },
    title: { margin: '0 0 10px 0', color: '#0f172a', fontSize: '32px', fontWeight: 'bold' },
    subTitle: { margin: '0 0 30px 0', color: '#64748b', fontSize: '16px' },
    
    formGroup: { marginBottom: '18px' },
    label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155', fontSize: '14px' },
    input: { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s' },
    
    button: { width: '100%', padding: '15px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px', boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)', transition: '0.3s' },
    error: { color: '#b91c1c', backgroundColor: '#fee2e2', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px', textAlign: 'center', border: '1px solid #fca5a5' },
    linkText: { textAlign: 'center', marginTop: '25px', fontSize: '15px', color: '#64748b' }
  };

  return (
    <div style={styles.wrapper}>
      
      <div style={styles.topRightLink}>
        Looking for jobs? 
        <Link to="/register" style={styles.loginBtn} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#0f172a'; e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0f172a'; }}>
          Candidate Signup
        </Link>
      </div>

      <div style={styles.imageSection}>
        <div style={styles.overlay}></div>
        <div style={styles.imageContent}>
          <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', fontWeight: 'bold' }}>Partner With Us</h1>
          <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#e2e8f0' }}>
            Register your company to post unlimited job listings and discover top-tier talent.
          </p>
        </div>
      </div>

      <div style={styles.formSection}>
        <div style={styles.card}>
          
          <div style={styles.logoPlaceholder}>🏢</div>

          <h2 style={styles.title}>Company Signup</h2>
          <p style={styles.subTitle}>Create an employer account to start hiring.</p>
          
          {error && <div style={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleRegister}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Company Name</label>
              <input 
                type="text" name="companyName" style={styles.input} placeholder="TechCorp Inc." 
                value={formData.companyName} onChange={handleChange} 
                onFocus={(e) => e.target.style.borderColor = '#0f172a'} onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Work Email Address</label>
              <input 
                type="email" name="email" style={styles.input} placeholder="hr@company.com" 
                value={formData.email} onChange={handleChange} 
                onFocus={(e) => e.target.style.borderColor = '#0f172a'} onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Company Contact Number</label>
              <input 
                type="tel" name="contactNumber" style={styles.input} placeholder="+1 800 555 1234" 
                value={formData.contactNumber} onChange={handleChange} 
                onFocus={(e) => e.target.style.borderColor = '#0f172a'} onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Secure Password</label>
              <input 
                type="password" name="password" style={styles.input} placeholder="Create a strong password" 
                value={formData.password} onChange={handleChange} 
                onFocus={(e) => e.target.style.borderColor = '#0f172a'} onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Registering...' : 'Create Employer Account'}
            </button>
          </form>

          <p style={styles.linkText}>
            Already a partner? <Link to="/corporate-login" style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 'bold' }}>Sign In</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default CorporateRegister;