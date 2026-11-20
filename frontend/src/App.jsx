import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Dashboard Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SkillsPage from './pages/SkillsPage';
import AssessmentsPage from './pages/AssessmentsPage';
import SkillGapPage from './pages/SkillGapPage';
import RoadmapPage from './pages/RoadmapPage';
import ProjectsPage from './pages/ProjectsPage';
import InterviewPage from './pages/InterviewPage';
import ResourcesPage from './pages/ResourcesPage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-2"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/assessments" element={<AssessmentsPage />} />
            <Route path="/analysis" element={<SkillGapPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

