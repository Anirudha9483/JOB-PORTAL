import React from 'react';
import { Link } from 'react-router-dom';

const CompanyNavbar = ({ styles, handleLogout }) => {
  
  // --- HOVER EFFECT HELPERS ---
  const handleLinkOver = (e) => { e.target.style.color = '#007BFF'; };
  const handleLinkOut = (e) => { e.target.style.color = '#444'; }; // Matches the default text color

  return (
    <>
      <Link 
        to="/" 
        style={styles.link}
        onMouseOver={handleLinkOver}
        onMouseOut={handleLinkOut}
      >
        Home
      </Link>
      
      <Link 
        to="/jobs" 
        style={styles.link}
        onMouseOver={handleLinkOver}
        onMouseOut={handleLinkOut}
      >
        Job Market
      </Link>
      
      <Link 
        to="/company/candidates" 
        style={styles.link}
        onMouseOver={handleLinkOver}
        onMouseOut={handleLinkOut}
      >
         Find Talent
      </Link>

      {/* HIGHLIGHTED DASHBOARD LINK */}
      <Link 
        to="/company/dashboard" 
        style={{
          ...styles.link, 
          backgroundColor: '#eef2f5', // Soft blue/gray background
          padding: '8px 18px', 
          borderRadius: '20px', 
          color: '#007BFF',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease'
        }}
        onMouseOver={(e) => { e.target.style.backgroundColor = '#e2e8f0'; }}
        onMouseOut={(e) => { e.target.style.backgroundColor = '#eef2f5'; }}
      >
        Company Panel
      </Link>

      {/* LOGOUT BUTTON WITH HOVER INVERT */}
      <button 
        onClick={handleLogout} 
        style={styles.buttonLogout}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#dc3545'; e.currentTarget.style.color = '#fff'; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffebee'; e.currentTarget.style.color = '#dc3545'; }}
      >
        Logout
      </button>
    </>
  );
};

export default CompanyNavbar;