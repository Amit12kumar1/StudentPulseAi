import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, ChevronRight, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-teal-500 to-violet-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  StudentPulse
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block -mt-1">
                By Byte Force
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#philosophy" className="hover:text-brand-400 transition-colors">Philosophy</a>
            <a href="#how-it-works" className="hover:text-brand-400 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-brand-400 transition-colors">Features</a>
            <a href="#readiness" className="hover:text-brand-400 transition-colors">Career Readiness</a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center space-x-2"
                >
                  <User className="w-4 h-4 text-brand-400" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white shadow-lg shadow-brand-600/25 transition-all flex items-center space-x-1.5 group"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

