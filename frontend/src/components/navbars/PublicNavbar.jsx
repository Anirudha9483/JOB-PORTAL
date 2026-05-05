import React from 'react';
import { Link } from 'react-router-dom';

const PublicNavbar = ({ styles }) => {
  return (
    <>
      <Link to="/" style={styles.link}>Home</Link>
      <Link to="/about" style={styles.link}>About Us</Link>
      <Link to="/jobs" style={styles.link}>Browse Jobs</Link>
      <Link to="/login" style={styles.buttonLogin}>Login</Link>
      <Link to="/register" style={styles.buttonRegister}>Register</Link>
    </>
  );
};

export default PublicNavbar;