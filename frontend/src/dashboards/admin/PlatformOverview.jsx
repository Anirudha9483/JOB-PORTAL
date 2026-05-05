import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

const PlatformOverview = () => {
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState({ totalUsers: 0, totalCompanies: 0, totalJobs: 0, totalApplications: 0 });
  const [industryData, setIndustryData] = useState([]);
  const [applicationsData, setApplicationsData] = useState([]);

  // Refined SaaS Color Palette
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setKpiData(response.data.kpiData);
        setIndustryData(response.data.industryData);
        setApplicationsData(response.data.applicationsData);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // --- PREMIUM CSS INJECTION (Entrance Animations) ---
  const fadeInKeyframes = `
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  // --- PREMIUM STYLES ---
  const styles = {
    container: { animation: 'fadeUp 0.6s ease-out forwards', fontFamily: "'Plus Jakarta Sans', sans-serif" },
    
    // KPI Grid
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' },
    
    // Beautiful Gradient KPI Cards
    kpiCard: (gradFrom, gradTo) => ({ 
      backgroundColor: '#fff', 
      padding: '30px 25px', 
      borderRadius: '20px', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)', 
      border: '1px solid rgba(255,255,255,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '20px', 
      transition: 'all 0.3s ease',
      backgroundImage: `linear-gradient(135deg, ${gradFrom} 0%, #ffffff 100%)`,
      cursor: 'default'
    }),
    
    kpiIconBox: (color) => ({ 
      width: '65px', height: '65px', borderRadius: '16px', backgroundColor: '#fff', color: color, 
      display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
    }),
    
    kpiValue: { fontSize: '36px', fontWeight: '900', color: '#0f172a', margin: '0', letterSpacing: '-1px' },
    kpiLabel: { color: '#64748b', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' },
    
    // Chart Layout
    chartGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' },
    chartContainer: { 
      backgroundColor: 'white', padding: '35px', borderRadius: '24px', 
      boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', 
      height: '450px', display: 'flex', flexDirection: 'column' 
    },
    chartTitle: { margin: '0 0 5px 0', color: '#0f172a', fontSize: '20px', fontWeight: '800' },
    chartSub: { margin: '0 0 25px 0', color: '#64748b', fontSize: '14px' }
  };

  // Custom Tooltip for Charts to make them look expensive
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', padding: '15px 20px', borderRadius: '12px', border: 'none', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '5px 0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.color}}></span>
              <span style={{color: '#cbd5e1'}}>{entry.name}:</span> 
              <strong style={{color: '#fff'}}>{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px 50px', color: '#64748b' }}>
      <div style={{fontSize: '40px', marginBottom: '15px', animation: 'spin 2s linear infinite'}}>⚙️</div>
      <h2 style={{color: '#0f172a'}}>Compiling Analytics</h2>
      <p>Crunching the latest database numbers...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <style>{fadeInKeyframes}</style>
      
      {/* --- KPI CARDS (Now with Glass/Gradient Effects) --- */}
      <div style={styles.grid}>
        <div 
          style={styles.kpiCard('#f0f9ff', '#ffffff')} 
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={styles.kpiIconBox('#0ea5e9')}>👥</div>
          <div>
            <h2 style={styles.kpiValue}>{kpiData.totalUsers.toLocaleString()}</h2>
            <div style={styles.kpiLabel}>Total Candidates</div>
          </div>
        </div>

        <div 
          style={styles.kpiCard('#fef2f2', '#ffffff')} 
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={styles.kpiIconBox('#ef4444')}>🏢</div>
          <div>
            <h2 style={styles.kpiValue}>{kpiData.totalCompanies.toLocaleString()}</h2>
            <div style={styles.kpiLabel}>Partner Companies</div>
          </div>
        </div>

        <div 
          style={styles.kpiCard('#f0fdf4', '#ffffff')} 
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={styles.kpiIconBox('#10b981')}>💼</div>
          <div>
            <h2 style={styles.kpiValue}>{kpiData.totalJobs.toLocaleString()}</h2>
            <div style={styles.kpiLabel}>Active Job Posts</div>
          </div>
        </div>

        <div 
          style={styles.kpiCard('#f5f3ff', '#ffffff')} 
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={styles.kpiIconBox('#8b5cf6')}>📥</div>
          <div>
            <h2 style={styles.kpiValue}>{kpiData.totalApplications.toLocaleString()}</h2>
            <div style={styles.kpiLabel}>Applications Submitted</div>
          </div>
        </div>
      </div>

      {/* --- CHARTS SECTION --- */}
      <div style={styles.chartGrid}>
        
        {/* BAR CHART */}
        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>Hiring Pipeline Velocity</h3>
          <p style={styles.chartSub}>Tracking applications vs successful hires.</p>
          
          <div style={{flex: 1, width: '100%', height: '100%'}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationsData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '30px', fontSize: '14px', fontWeight: 600, color: '#334155'}} />
                <Bar dataKey="applications" fill="#3b82f6" name="Total Applications" radius={[6, 6, 0, 0]} barSize={45} />
                <Bar dataKey="accepted" fill="#10b981" name="Hired Candidates" radius={[6, 6, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>Sector Distribution</h3>
          <p style={styles.chartSub}>Breakdown of jobs by industry category.</p>
          
          <div style={{flex: 1, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={industryData} 
                  cx="50%" cy="50%" 
                  innerRadius={80} 
                  outerRadius={120} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{fontSize: '14px', fontWeight: 500, color: '#334155'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlatformOverview;