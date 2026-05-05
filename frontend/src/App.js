import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// --- IMPORTS ---
import Navbar from './components/Navbar'; 
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import CorporateLogin from './pages/CorporateLogin';
import Register from './pages/Register';
import CorporateRegister from './pages/CorporateRegister';
import About from './pages/About';
import Contact from './pages/Contact';
import JobListing from './pages/JobListing';

// User Pages
import UserDashboard from './dashboards/user/UserDashboard';
import Profile from './pages/Profile';
import RecommendedJobs from './pages/RecommendedJobs';
import AppliedJobs from './pages/AppliedJobs';
import InterviewPage from './pages/InterviewPage'; 
import TakeTestPage from './pages/TakeTestPage';
import ApplicationTest from './pages/ApplicationTest';
import PracticeTest from './pages/PracticeTest';

// Company Pages
import CompanyDashboard from './dashboards/company/CompanyDashboard';
import PostJob from './dashboards/company/PostJob';
import SearchCandidates from './pages/SearchCandidates';

// Admin Pages
import AdminDashboard from './dashboards/admin/AdminDashboard';
import AnalyticsDashboard from './dashboards/admin/AnalyticsDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* NAVBAR GOES HERE SO IT SHOWS ON EVERY PAGE */}
        <Navbar /> 

        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/corporate-login" element={<CorporateLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/corporate-register" element={<CorporateRegister />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/jobs" element={<JobListing />} />

          {/* --- Protected User Routes --- */}
          <Route element={<ProtectedRoute allowedRoles={['User']} />}>
             <Route path="/user/dashboard" element={<UserDashboard />} />
             <Route path="/user/profile" element={<Profile />} />
             <Route path="/user/recommended" element={<RecommendedJobs />} />
             <Route path="/user/interviews" element={<InterviewPage />} />
             <Route path="/user/take-test" element={<TakeTestPage />} />
             <Route path="/user/applied-jobs" element={<AppliedJobs />} />
             
             {/* THE TWO TEST ROUTES FOR USERS */}
             <Route path="/user/application-test/:applicationId" element={<ApplicationTest />} />
             <Route path="/user/practice-test/:testId" element={<PracticeTest />} />
          </Route>

          {/* --- Protected Company Routes --- */}
          <Route element={<ProtectedRoute allowedRoles={['Company']} />}>
             <Route path="/company/dashboard" element={<CompanyDashboard />} />
             <Route path="/company/post-job" element={<PostJob />} />
             <Route path="/company/candidates" element={<SearchCandidates />} />
             
             {/* THE TEST PREVIEW ROUTE FOR COMPANIES */}
             <Route path="/company/test-preview/:testId" element={<PracticeTest />} />
          </Route>

          {/* --- Protected Admin Routes --- */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
             <Route path="/admin/dashboard" element={<AdminDashboard />} />
             <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
          </Route>
        </Routes>

        <Footer />  
      </Router>
    </AuthProvider>
  );
}

export default App;