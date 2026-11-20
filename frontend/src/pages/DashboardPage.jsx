import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import {
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  FolderGit2,
  FileCheck2,
  Milestone,
  Target,
  Clock,
  Compass,
  Layers
} from 'lucide-react';
import api from '../services/api';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setData(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-mono">Aggregating evidence & computing readiness metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span>{error || 'Unable to load readiness summary.'}</span>
      </div>
    );
  }

  const {
    student_name,
    target_role,
    profile_completion_percentage,
    career_readiness_score,
    total_skills,
    verified_skills,
    assessments_completed,
    average_assessment_score,
    projects_count,
    roadmap_progress_percentage,
    radar_data,
    recent_activities,
    recommended_next_action
  } = data;

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Readiness Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-navy-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Target Role: {target_role}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome, {student_name}!
          </h2>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Your career readiness score is dynamically calculated from verified technical assessments, self-reported competencies, and completed portfolio projects.
          </p>
        </div>

        {/* Readiness Meter Card */}
        <div className="flex items-center space-x-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex-shrink-0">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-teal-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${career_readiness_score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-extrabold text-sm text-white">{career_readiness_score}%</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Career Readiness</span>
            <span className="text-xs text-teal-400 font-semibold">
              {career_readiness_score >= 70 ? 'Industry Ready' : (career_readiness_score >= 40 ? 'Progressing Well' : 'Early Foundation')}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Calculated from saved student data</p>
          </div>
        </div>
      </div>

      {/* Recommended Next Action Banner */}
      {recommended_next_action && (
        <div className="p-4 rounded-xl bg-brand-950/40 border border-brand-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0 border border-brand-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">Recommended Next Step</span>
              </div>
              <h4 className="text-sm font-bold text-white">{recommended_next_action.title}</h4>
              <p className="text-xs text-slate-400">{recommended_next_action.description}</p>
            </div>
          </div>
          <Link
            to={recommended_next_action.action_url}
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 flex-shrink-0"
          >
            <span>{recommended_next_action.action_text}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Completion */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Profile Completion</span>
            <Layers className="w-4 h-4 text-brand-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{profile_completion_percentage}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
            <div
              className="bg-brand-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${profile_completion_percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Total Skills & Verified Badge */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Recorded Skills</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{total_skills}</span>
            <span className="text-xs text-teal-400 font-semibold font-mono">({verified_skills} verified)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {verified_skills > 0 ? `${verified_skills} validated via technical MCQ` : 'No verified assessments yet'}
          </p>
        </div>

        {/* Assessment Average Score */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Avg. Assessment Score</span>
            <FileCheck2 className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{average_assessment_score}%</span>
            <span className="text-xs text-slate-400">({assessments_completed} tests)</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
            <div
              className="bg-violet-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${average_assessment_score}%` }}
            ></div>
          </div>
        </div>

        {/* Roadmap Progress */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Roadmap Completion</span>
            <Milestone className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{roadmap_progress_percentage}%</span>
            <span className="text-xs text-slate-400">({projects_count} projects)</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${roadmap_progress_percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Chart & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart: Skill Profile */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Verified Capability Radar</span>
                <span className="text-[10px] font-normal text-slate-400">(Technical & Professional Domains)</span>
              </h3>
              <p className="text-xs text-slate-400">Visual breakdown across key computing competencies.</p>
            </div>
            <Link to="/skills" className="text-xs text-brand-400 hover:underline font-semibold flex items-center space-x-1">
              <span>Manage Skills</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radar_data}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 10 }} />
                <Radar
                  name="Proficiency"
                  dataKey="score"
                  stroke="#0e87eb"
                  fill="#0e87eb"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-brand-400" />
                <span>Recent Audit Trail</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Verified Logs</span>
            </div>

            {recent_activities.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <p>No recent activity recorded.</p>
                <Link to="/assessments" className="text-brand-400 hover:underline font-semibold block">
                  Take a test to log evidence
                </Link>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
                {recent_activities.map((act) => (
                  <div key={act.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-brand-400">{act.activity_type}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(act.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-snug">{act.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 text-center">
            <Link
              to="/analysis"
              className="w-full py-2 px-3 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 text-xs font-semibold border border-brand-500/30 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>Run Role Skill Gap Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

