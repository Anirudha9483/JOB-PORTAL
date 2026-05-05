import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = ({ styles, handleLogout }) => {
  return (
    <>
      <Link to="/" style={styles.link}>Home</Link>
      <Link to="/admin/dashboard" style={styles.link}> Admin Panel</Link>
      <Link to="/admin/analytics" style={styles.link}>Analytics</Link>
      <button onClick={handleLogout} style={styles.buttonLogout}>Logout</button>
    </>
  );
};

export default AdminNavbar;