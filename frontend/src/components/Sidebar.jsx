import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  CheckCircle2,
  FileCheck2,
  GitCompare,
  Milestone,
  FolderGit2,
  Sparkles,
  BookOpen,
  LogOut,
  ChevronRight,
  Activity,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Student Profile', path: '/profile', icon: UserCheck },
  { name: 'Skills & Evidence', path: '/skills', icon: CheckCircle2 },
  { name: 'Skill Assessments', path: '/assessments', icon: FileCheck2 },
  { name: 'AI Skill Gap Analysis', path: '/analysis', icon: GitCompare, badge: 'Core' },
  { name: 'Personalized Roadmap', path: '/roadmap', icon: Milestone },
  { name: 'Project Recommendations', path: '/projects', icon: FolderGit2 },
  { name: 'Interview Preparation', path: '/interview', icon: Sparkles },
  { name: 'Verified Resources', path: '/resources', icon: BookOpen },
];

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-teal-500 to-violet-600 flex items-center justify-center shadow-md shadow-brand-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-extrabold text-base tracking-tight text-white">StudentPulse</span>
                <span className="px-1 text-[9px] font-bold uppercase rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">Byte Force</p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              âœ•
            </button>
          )}
        </div>

        {/* Philosophy Badge */}
        <div className="px-4 py-3 mx-4 my-3 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center space-x-2 text-[11px] text-slate-400">
          <Award className="w-4 h-4 text-brand-400 flex-shrink-0" />
          <span className="font-mono text-slate-300">Evidence â†’ Insight â†’ Action</span>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Card & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-700 to-teal-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 border border-slate-700">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Student'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'student@byteforce.edu'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

