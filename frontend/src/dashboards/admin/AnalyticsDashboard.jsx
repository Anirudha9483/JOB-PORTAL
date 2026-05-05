import React, { useState } from 'react';
import PlatformOverview from './PlatformOverview';
import AnalyticsUsers from './AnalyticsUsers';
import AnalyticsCompanies from './AnalyticsCompanies';

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // --- PREMIUM STYLES ---
  const styles = {
    layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" },
    
    // Dark "Command Center" Sidebar
    sidebar: { width: '280px', backgroundColor: '#0f172a', color: '#e2e8f0', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box' },
    sidebarTitle: { margin: '0 0 30px 10px', color: '#ffffff', fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px' },
    sidebarBtn: (isActive) => ({ 
      padding: '14px 20px', 
      backgroundColor: isActive ? '#1e293b' : 'transparent', 
      color: isActive ? '#38bdf8' : '#cbd5e1', 
      border: 'none', 
      borderRadius: '12px', 
      cursor: 'pointer', 
      textAlign: 'left', 
      fontSize: '15px', 
      fontWeight: isActive ? '700' : '600',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.2s ease'
    }),
    
    // Main Content
    content: { flex: 1, padding: '40px 50px', overflowX: 'auto' },
    pageHeader: { marginTop: 0, color: '#0f172a', fontSize: '32px', fontWeight: '800', marginBottom: '8px' },
    pageSub: { color: '#64748b', fontSize: '16px', marginBottom: '35px' }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <PlatformOverview />;
      case 'users': return <AnalyticsUsers />;
      case 'companies': return <AnalyticsCompanies />;
      default: return <PlatformOverview />;
    }
  };

  return (
    <div style={styles.layout}>
      
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>🛡️ Admin Control</h3>
        <button style={styles.sidebarBtn(activeTab === 'overview')} onClick={() => setActiveTab('overview')}>
          📊 Platform Analytics
        </button>
        <button style={styles.sidebarBtn(activeTab === 'users')} onClick={() => setActiveTab('users')}>
          👥 Manage Users
        </button>
        <button style={styles.sidebarBtn(activeTab === 'companies')} onClick={() => setActiveTab('companies')}>
          🏢 Manage Companies
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={styles.content}>
        <h1 style={styles.pageHeader}>Platform Analytics</h1>
        <p style={styles.pageSub}>Monitor system health, user growth, and application pipelines.</p>

        {renderContent()}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;