import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, Sparkles, Bell, HelpCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const routeTitles = {
  '/dashboard': 'Career Readiness Dashboard',
  '/profile': 'Student Capability Profile',
  '/skills': 'Skills & Competency Verification',
  '/assessments': 'Technical Skill Assessments',
  '/analysis': 'AI Skill Gap Analysis',
  '/roadmap': 'Personalized Learning Roadmap',
  '/projects': 'AI Recommended Industry Projects',
  '/interview': 'AI Interview Preparation Simulator',
  '/resources': 'Verified Learning Resources Library'
};

const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState({ ai_status: 'Checking...', status: 'ok' });
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await api.get('/health');
        setHealthStatus(res.data);
      } catch (err) {
        setHealthStatus({ ai_status: 'Deterministic Rule Engine Active', status: 'fallback' });
      }
    };
    fetchHealth();
  }, []);

  const pageTitle = routeTitles[location.pathname] || 'StudentPulse AI';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">{pageTitle}</h1>
              <p className="hidden sm:block text-xs text-slate-400">Byte Force â€¢ Evidence â†’ Insight â†’ Action</p>
            </div>
          </div>

          {/* Right Top Status & Actions */}
          <div className="flex items-center space-x-3">
            {/* AI Status Pill */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400 font-mono text-[11px]">{healthStatus.ai_status}</span>
            </div>

            {/* Quick Link to Assessment */}
            <Link
              to="/assessments"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-400 border border-brand-500/30 text-xs font-semibold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Verify Skills</span>
            </Link>

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-teal-600 flex items-center justify-center text-white text-xs font-bold border border-slate-700">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>StudentPulse AI Platform â€¢ Developed by <strong>Byte Force</strong></span>
          <span className="text-slate-400 font-mono text-[11px]">Core Principle: Evidence â†’ Insight â†’ Action</span>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;

