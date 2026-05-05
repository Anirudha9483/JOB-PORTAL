import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API Call
    console.log("Contact Request:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const styles = {
    wrapper: { backgroundColor: '#f0f4f8', minHeight: '100vh', padding: '60px 20px', fontFamily: "'Segoe UI', sans-serif" },
    container: { maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px', backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' },
    
    // Left side: Info
    infoSection: { 
      padding: '60px', 
      backgroundImage: 'url("https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1000&q=80")', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      position: 'relative', 
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 30, 80, 0.85)', zIndex: 1 },
    infoContent: { position: 'relative', zIndex: 2 },
    
    // Right side: Form
    formSection: { padding: '60px' },
    title: { fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' },
    subTitle: { color: '#64748b', fontSize: '16px', marginBottom: '40px' },
    
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '700', color: '#334155', fontSize: '14px' },
    input: { width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontSize: '15px', outline: 'none' },
    textarea: { width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontSize: '15px', minHeight: '120px', outline: 'none' },
    
    btn: { width: '100%', padding: '16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', boxShadow: '0 4px 15px rgba(0,123,255,0.3)' },
    success: { backgroundColor: '#dcfce7', color: '#15803d', padding: '15px', borderRadius: '10px', marginBottom: '20px', fontWeight: 'bold', textAlign: 'center' }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        
        {/* LEFT SIDE: VISUAL INFO */}
        <div style={styles.infoSection}>
          <div style={styles.overlay}></div>
          <div style={styles.infoContent}>
            <h2 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '20px' }}>Let's talk about your future.</h2>
            <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '40px' }}>Our support team is available 24/7 to help you navigate your career or finding talent.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '24px' }}>📍</span>
                <div>
                  <strong style={{ display: 'block' }}>Global Headquarters</strong>
                  <span style={{ opacity: 0.7 }}>BKC, Mumbai, Maharashtra</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '24px' }}>✉️</span>
                <div>
                  <strong style={{ display: 'block' }}>Direct Support</strong>
                  <span style={{ opacity: 0.7 }}>support@jobportal.com</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '24px' }}>📞</span>
                <div>
                  <strong style={{ display: 'block' }}>Call Center</strong>
                  <span style={{ opacity: 0.7 }}>+91 98765 43210</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: CONTACT FORM */}
        <div style={styles.formSection}>
          <h1 style={styles.title}>Get in touch</h1>
          <p style={styles.subTitle}>Fill out the form and we'll get back to you within 24 hours.</p>

          {submitted && <div style={styles.success}>✅ Message sent! We will contact you soon.</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input 
                type="text" 
                required 
                style={styles.input} 
                placeholder="Prathmesh" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                required 
                style={styles.input} 
                placeholder="name@email.com" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Subject</label>
              <select 
                style={styles.input} 
                value={formData.subject} 
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              >
                <option value="">Select a topic</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Employer Inquiry">Employer Inquiry</option>
                <option value="Career Advice">Career Advice</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Message</label>
              <textarea 
                required 
                style={styles.textarea} 
                placeholder="How can we help you?" 
                value={formData.message} 
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            <button 
              type="submit" 
              style={styles.btn}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007BFF'}
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;