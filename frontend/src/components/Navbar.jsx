import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import PublicNavbar from './navbars/PublicNavbar';
import UserNavbar from './navbars/UserNavbar';
import CompanyNavbar from './navbars/CompanyNavbar';
import AdminNavbar from './navbars/AdminNavbar';

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // --- NEW: SMART SCROLL STATE ---
  const [isVisible, setIsVisible] = useState(true);

  // --- NEW: SCROLL TRACKING LOGIC ---
  useEffect(() => {
    let prevScrollPos = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      
      // The navbar is visible IF we scroll UP, OR if we are at the very top of the page
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 50;

      setIsVisible(visible);
      prevScrollPos = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup the event listener when component unmounts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser({ isAuthenticated: false, role: null, email: null, id: null });
    navigate('/');
  };

  // --- UPGRADED PREMIUM STYLES ---
  const styles = {
    // Frosted Glass Sticky Navbar WITH Smart Hide/Show
    nav: { 
      position: 'sticky', 
      // This is the magic! If visible, top is 0. If hidden, it slides up out of view (-100px)
      top: isVisible ? '0' : '-100px', 
      transition: 'top 0.4s ease-in-out', // Smooth sliding animation
      zIndex: 1000, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 5%', 
      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
      backdropFilter: 'blur(10px)', 
      borderBottom: '1px solid rgba(0,0,0,0.05)', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    
    logo: { 
      fontSize: '26px', 
      fontWeight: '900', 
      textDecoration: 'none', 
      color: '#007BFF',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      letterSpacing: '-0.5px'
    },
    
    linkContainer: { 
      display: 'flex', 
      gap: '25px', 
      alignItems: 'center' 
    },
    
    link: { 
      color: '#444', 
      textDecoration: 'none', 
      fontSize: '16px', 
      fontWeight: '600',
      transition: 'color 0.3s ease'
    },
    
    buttonLogin: { 
      backgroundColor: 'transparent', 
      color: '#007BFF', 
      textDecoration: 'none', 
      padding: '10px 24px', 
      borderRadius: '30px', 
      fontWeight: 'bold', 
      border: '2px solid #007BFF',
      transition: 'all 0.3s ease'
    },
    buttonRegister: { 
      backgroundColor: '#007BFF', 
      color: 'white', 
      textDecoration: 'none', 
      padding: '12px 26px', 
      borderRadius: '30px', 
      fontWeight: 'bold', 
      border: 'none',
      boxShadow: '0 4px 15px rgba(0,123,255,0.3)',
      transition: 'all 0.3s ease'
    },
    buttonLogout: { 
      backgroundColor: '#ffebee', 
      color: '#dc3545', 
      border: '1px solid #ffcdd2', 
      padding: '10px 24px', 
      borderRadius: '30px', 
      cursor: 'pointer', 
      fontWeight: 'bold',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <span style={{ fontSize: '30px' }}>🚀</span> JobPortal
      </Link>

      <div style={styles.linkContainer}>
        {!user.isAuthenticated && <PublicNavbar styles={styles} />}

        {user.isAuthenticated && user.role === 'User' && (
          <UserNavbar styles={styles} handleLogout={handleLogout} />
        )}

        {user.isAuthenticated && user.role === 'Company' && (
          <CompanyNavbar styles={styles} handleLogout={handleLogout} />
        )}

        {user.isAuthenticated && user.role === 'Admin' && (
          <AdminNavbar styles={styles} handleLogout={handleLogout} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;