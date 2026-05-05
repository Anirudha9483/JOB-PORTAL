import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // --- STYLES ---
  const styles = {
    footer: { 
      backgroundColor: '#0a192f', // Deep professional navy blue
      color: '#8892b0', // Soft blue-gray text
      paddingTop: '80px', 
      paddingBottom: '20px', 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" 
    },
    container: { 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '0 20px', 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
      gap: '40px', 
      borderBottom: '1px solid rgba(255,255,255,0.1)', 
      paddingBottom: '50px' 
    },
    
    // Brand Section
    brandTitle: { 
      fontSize: '26px', 
      fontWeight: '900', 
      color: '#fff', 
      marginBottom: '20px', 
      textDecoration: 'none', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      letterSpacing: '-0.5px'
    },
    description: { lineHeight: '1.8', fontSize: '15px', marginBottom: '20px' },
    contactText: { fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    
    // Columns
    columnTitle: { fontSize: '18px', marginBottom: '25px', color: '#ccd6f6', fontWeight: 'bold' },
    list: { listStyle: 'none', padding: 0, margin: 0 },
    listItem: { marginBottom: '12px' },
    link: { color: '#8892b0', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' },
    
    // Newsletter Section
    newsletterInput: { 
      width: '100%', padding: '12px 15px', borderRadius: '6px', border: 'none', 
      backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none', marginBottom: '10px', fontSize: '14px' 
    },
    newsletterBtn: { 
      width: '100%', padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', 
      borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: '0.3s' 
    },

    // Socials
    socialGroup: { display: 'flex', gap: '15px', marginTop: '20px' },
    socialIcon: { 
      display: 'flex', justifyContent: 'center', alignItems: 'center', width: '36px', height: '36px', 
      backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%', color: '#fff', textDecoration: 'none', 
      fontSize: '16px', transition: '0.3s' 
    },

    // Bottom Bar
    bottomBar: { 
      maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'flex', 
      justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', color: '#8892b0', fontSize: '14px' 
    },
    legalLinks: { display: 'flex', gap: '20px' }
  };

  // Hover helper functions for inline styles
  const handleMouseOver = (e) => { e.target.style.color = '#007BFF'; };
  const handleMouseOut = (e) => { e.target.style.color = '#8892b0'; };
  
  const handleBtnOver = (e) => { e.target.style.backgroundColor = '#0056b3'; };
  const handleBtnOut = (e) => { e.target.style.backgroundColor = '#007BFF'; };

  const handleIconOver = (e) => { e.target.style.backgroundColor = '#007BFF'; e.target.style.transform = 'translateY(-3px)'; };
  const handleIconOut = (e) => { e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.target.style.transform = 'translateY(0)'; };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        
        {/* COLUMN 1: BRAND & CONTACT */}
        <div>
          <Link to="/" style={styles.brandTitle}>
            <span>🚀</span> JobPortal
          </Link>
          <p style={styles.description}>
            Connecting top talent with the world's most innovative companies. Your dream career starts right here.
          </p>
          <div>
            <div style={styles.contactText}>📧 support@jobportal.com</div>
            <div style={styles.contactText}>📞 +91 98765 43210</div>
            <div style={styles.contactText}>🏢 Mumbai, Maharashtra, India</div>
          </div>
        </div>

        {/* COLUMN 2: QUICK LINKS */}
        <div>
          <h4 style={styles.columnTitle}>Platform</h4>
          <ul style={styles.list}>
            <li style={styles.listItem}><Link to="/" style={styles.link} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Home</Link></li>
            <li style={styles.listItem}><Link to="/about" style={styles.link} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>About Us</Link></li>
            <li style={styles.listItem}><Link to="/jobs" style={styles.link} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Browse Jobs</Link></li>
            <li style={styles.listItem}><Link to="/login" style={styles.link} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Post a Job</Link></li>
          </ul>
        </div>

        {/* COLUMN 3: RESOURCES */}
        <div>
          <h4 style={styles.columnTitle}>Resources</h4>
          <ul style={styles.list}>
            <li style={styles.listItem}><Link to="/register" style={styles.link} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Create Candidate Account</Link></li>
            <li style={styles.listItem}><Link to="/register" style={styles.link} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Register Company</Link></li>
            <li style={styles.listItem}><Link to="/login" style={styles.link} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Take Skill Assessments</Link></li>
            <li style={styles.listItem}><Link to="/admin/dashboard" style={styles.link} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Admin Portal</Link></li>
          </ul>
        </div>

        {/* COLUMN 4: NEWSLETTER & SOCIALS */}
        <div>
          <h4 style={styles.columnTitle}>Stay Updated</h4>
          <p style={{...styles.description, fontSize: '14px', marginBottom: '15px'}}>
            Subscribe to our newsletter to get the latest job alerts and career advice.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed successfully!"); }}>
            <input type="email" placeholder="Enter your email..." required style={styles.newsletterInput} />
            <button type="submit" style={styles.newsletterBtn} onMouseOver={handleBtnOver} onMouseOut={handleBtnOut}>
              Subscribe Now
            </button>
          </form>
          
          <div style={styles.socialGroup}>
            <a href="#" style={styles.socialIcon} onMouseOver={handleIconOver} onMouseOut={handleIconOut}>💼</a>
            <a href="#" style={styles.socialIcon} onMouseOver={handleIconOver} onMouseOut={handleIconOut}>🐦</a>
            <a href="#" style={styles.socialIcon} onMouseOver={handleIconOver} onMouseOut={handleIconOut}>📸</a>
            <a href="#" style={styles.socialIcon} onMouseOver={handleIconOver} onMouseOut={handleIconOut}>📘</a>
          </div>
        </div>

      </div>

      {/* COPYRIGHT BOTTOM BAR */}
      <div style={styles.bottomBar}>
        <div>&copy; {new Date().getFullYear()} JobPortal Inc. All rights reserved.</div>
        <div style={styles.legalLinks}>
          <Link to="/" style={styles.link} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Privacy Policy</Link>
          <Link to="/" style={styles.link} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Terms of Service</Link>
          <Link to="/" style={styles.link} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;