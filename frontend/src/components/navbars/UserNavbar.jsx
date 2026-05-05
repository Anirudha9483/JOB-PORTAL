// import React from 'react';
// import { Link } from 'react-router-dom';

// const UserNavbar = ({ styles, handleLogout }) => {
//   return (
//     <>
//       <Link to="/" style={styles.link}>Home</Link>
//       <Link to="/jobs" style={styles.link}>Browse Jobs</Link>
//       <Link to="/user/recommended" style={styles.link}> Recommended</Link>
//       <Link to="/user/profile" style={styles.link}>     My Profile</Link>
//       <Link to="/user/dashboard" style={styles.link}>My Dashboard</Link>
//       <button onClick={handleLogout} style={styles.buttonLogout}>Logout</button>
//     </>
//   );
// };

// export default UserNavbar;

import React from 'react';
import { Link } from 'react-router-dom';

const UserNavbar = ({ styles, handleLogout }) => {
  return (
    <>
      <Link to="/" style={styles.link}> Home</Link>
      <Link to="/jobs" style={styles.link}> Jobs</Link>
      <Link to="/user/recommended" style={styles.link}> Recommended</Link>
      <Link to="/about" style={styles.link}> About</Link>
      <Link to="/contact" style={styles.link}>Contact</Link>
      
      {/* Primary Action Pages */}
      <Link to="/user/take-test" style={styles.link}> Take Test</Link>
      <Link to="/user/interviews" style={styles.link}> Interview</Link>
      <Link to="/user/applied-jobs" style={styles.link}> Applied Jobs</Link>
      
      {/* Replaced Dashboard with Career Analytics */}
      <Link to="/user/dashboard" style={{...styles.link, color: '#007BFF', fontWeight: 'bold'}}> Analytics</Link>
      <Link to="/user/profile" style={styles.link}>👤 Profile</Link>
      
      <button onClick={handleLogout} style={styles.buttonLogout}>Logout</button>
    </>
  );
};

export default UserNavbar;