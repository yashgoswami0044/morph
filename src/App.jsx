import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext.jsx';
import { Sidebar, Header, PageTransition } from './components/layout/index.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LeadQueue from './pages/LeadQueue.jsx';
import LeadDetail from './pages/LeadDetail.jsx';
import LeadCreation from './pages/LeadCreation.jsx';
import ReviewQueue from './pages/ReviewQueue.jsx';
import Analytics from './pages/Analytics.jsx';
import Settings from './pages/Settings.jsx';
import Escalations from './pages/Escalations.jsx';
import CatalogueManager from './pages/CatalogueManager.jsx';
import SiteVisitManager from './pages/SiteVisitManager.jsx';
import SalesProcess from './pages/SalesProcess.jsx';
import ProjectLifecycle from './pages/ProjectLifecycle.jsx';
import ReportingDashboard from './pages/ReportingDashboard.jsx';
import CommunicationHub from './pages/CommunicationHub.jsx';
import CloudTelephony from './pages/CloudTelephony.jsx';
import CalendarManagement from './pages/CalendarManagement.jsx';

const App = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center" style={{ background: 'var(--bg-main)' }}>
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-body">
        <Header />
        <main className="app-main">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="/leads" element={<PageTransition><LeadQueue /></PageTransition>} />
              <Route path="/leads/new" element={<PageTransition><LeadCreation /></PageTransition>} />
              <Route path="/leads/:id" element={<PageTransition><LeadDetail /></PageTransition>} />
              <Route path="/review" element={<PageTransition><ReviewQueue /></PageTransition>} />
              <Route path="/escalations" element={<PageTransition><Escalations /></PageTransition>} />
              <Route path="/catalogues" element={<PageTransition><CatalogueManager /></PageTransition>} />
              <Route path="/site-visits" element={<PageTransition><SiteVisitManager /></PageTransition>} />
              <Route path="/sales-process" element={<PageTransition><SalesProcess /></PageTransition>} />
              <Route path="/projects" element={<PageTransition><ProjectLifecycle /></PageTransition>} />
              <Route path="/reports" element={<PageTransition><ReportingDashboard /></PageTransition>} />
              <Route path="/communication" element={<PageTransition><CommunicationHub /></PageTransition>} />
              <Route path="/telephony" element={<PageTransition><CloudTelephony /></PageTransition>} />
              <Route path="/calendar" element={<PageTransition><CalendarManagement /></PageTransition>} />
              <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
              <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;
