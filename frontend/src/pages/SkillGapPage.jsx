import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitCompare,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Compass,
  Milestone,
  HelpCircle
} from 'lucide-react';
import api from '../services/api';

const TARGET_ROLES = [
  'Java Developer',
  'Python Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Analyst',
  'Data Scientist',
  'AI/ML Engineer',
  'Software Engineer'
];

const SkillGapPage = () => {
  const [selectedRole, setSelectedRole] = useState('Java Developer');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const navigate = useNavigate();

  const runAnalysis = async (role) => {
    setLoading(true);
    try {
      const res = await api.post('/analysis/skill-gap', { target_role: role });
      setAnalysis(res.data);
    } catch (err) {
      console.error("Skill gap analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis(selectedRole);
  }, [selectedRole]);

  const handleGenerateRoadmap = async () => {
    setGeneratingRoadmap(true);
    try {
      await api.post(`/roadmap/generate?target_role=${encodeURIComponent(selectedRole)}`);
      navigate(`/roadmap?role=${encodeURIComponent(selectedRole)}`);
    } catch (err) {
      console.error("Roadmap generation failed:", err);
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Deterministic Role Mapping</span>
          </div>
          <h2 className="text-xl font-bold text-white">AI-Powered Skill Gap Analysis</h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Compares your recorded and verified skills against industry benchmarks. High priority missing skills are highlighted to guide your personalized roadmap.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Select Target Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full sm:w-60 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-semibold focus:outline-none focus:border-brand-500"
          >
            {TARGET_ROLES.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Running deterministic skill gap engine for {selectedRole}...
        </div>
      ) : analysis && (
        <div className="space-y-6 animate-fadeIn">
          {/* Readiness Score & AI Insights Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                  AI Educational Synthesis
                </span>
                {analysis.is_fallback && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                    Deterministic Baseline
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {analysis.ai_insights}
              </p>
            </div>

            <div className="flex items-center space-x-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex-shrink-0">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Role Match</span>
                <span className="text-2xl font-extrabold text-teal-400">{analysis.readiness_percentage}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{analysis.total_required_skills} Skills Audited</span>
              </div>
              <button
                onClick={handleGenerateRoadmap}
                disabled={generatingRoadmap}
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand-600 to-teal-600 hover:opacity-95 text-white font-semibold text-xs shadow-md transition-all flex items-center space-x-1.5"
              >
                <Milestone className="w-3.5 h-3.5" />
                <span>{generatingRoadmap ? 'Generating...' : 'Generate Roadmap'}</span>
              </button>
            </div>
          </div>

          {/* 3 Categories: Strong, Needs Improvement, Missing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Missing Skills */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-rose-900/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm font-bold text-white">Missing Skills</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold">
                  {analysis.missing_skills.length}
                </span>
              </div>

              {analysis.missing_skills.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No completely missing skills.</p>
              ) : (
                <div className="space-y-2.5">
                  {analysis.missing_skills.map((s, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-rose-900/30 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{s.skill_name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-semibold">
                          {s.priority} Priority
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{s.gap_reason}</p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        Target requirement: {s.required_level}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Needs Improvement */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-amber-900/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Needs Improvement</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                  {analysis.improving_skills.length}
                </span>
              </div>

              {analysis.improving_skills.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No skills needing level upgrade.</p>
              ) : (
                <div className="space-y-2.5">
                  {analysis.improving_skills.map((s, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-amber-900/30 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{s.skill_name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
                          Current: {s.student_level}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{s.gap_reason}</p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        Required: {s.required_level}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Strong Skills */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-900/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Strong Skills</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                  {analysis.strong_skills.length}
                </span>
              </div>

              {analysis.strong_skills.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Take tests or update profile to record strong skills.</p>
              ) : (
                <div className="space-y-2.5">
                  {analysis.strong_skills.map((s, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/30 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{s.skill_name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                          {s.student_level || 'Verified'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{s.gap_reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGapPage;

