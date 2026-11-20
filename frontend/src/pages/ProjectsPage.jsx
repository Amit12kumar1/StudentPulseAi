import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Sparkles,
  CheckCircle2,
  Layers,
  ArrowRight,
  Plus,
  Compass,
  Code2,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import api from '../services/api';

const TARGET_ROLES = [
  'Java Developer',
  'Python Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Analyst',
  'AI/ML Engineer',
  'Software Engineer'
];

const ProjectsPage = () => {
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [addedTitles, setAddedTitles] = useState({});
  const [message, setMessage] = useState('');

  const fetchRecommendations = async (role) => {
    setLoading(true);
    try {
      const res = await api.get(`/resources/projects?role=${encodeURIComponent(role)}`);
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error("Failed to fetch project recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(selectedRole);
  }, [selectedRole]);

  const handleAdoptProject = async (project) => {
    try {
      await api.post('/projects', {
        title: project.title,
        description: project.description,
        technologies: project.technologies.join(', '),
        status: 'In Progress'
      });
      setAddedTitles(prev => ({ ...prev, [project.title]: true }));
      setMessage(`"${project.title}" has been saved to your Student Profile!`);
      setTimeout(() => setMessage(''), 3500);
    } catch (err) {
      console.error("Failed to adopt project:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-semibold mb-1">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Applied Portfolio Builder</span>
          </div>
          <h2 className="text-xl font-bold text-white">AI-Recommended Industry Projects</h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Targeted capstones designed to help you demonstrate missing competencies to recruiters with complete architectural implementation roadmaps.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Role Filter</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full sm:w-60 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-semibold focus:outline-none focus:border-violet-500"
          >
            {TARGET_ROLES.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Synthesizing role-aligned project recommendations...
        </div>
      ) : recommendations.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          No project blueprints found for this role.
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((proj, idx) => {
            const isExpanded = expandedIndex === idx;
            const isAdded = addedTitles[proj.title];
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 transition-all hover:border-slate-700 space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        {proj.difficulty_level}
                      </span>
                      <h3 className="text-base font-bold text-white">{proj.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleAdoptProject(proj)}
                      disabled={isAdded}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors ${
                        isAdded
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Saved to Profile</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Adopt Project</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                      title={isExpanded ? 'Collapse' : 'Expand Blueprint'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mr-1">Stack:</span>
                  {proj.technologies.map((t, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-teal-400">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Expanded Details: Problem, Steps, Features, Outcome */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-800 space-y-4 animate-fadeIn">
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Problem Statement
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{proj.problem_statement}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Features */}
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Core Features to Implement
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {proj.features.map((f, fIdx) => (
                            <li key={fIdx} className="flex items-start space-x-2">
                              <span className="text-brand-400 font-bold">â€¢</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Implementation Steps */}
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Suggested Architectural Steps
                        </span>
                        <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside">
                          {proj.implementation_steps.map((st, sIdx) => (
                            <li key={sIdx} className="leading-relaxed">{st}</li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-800/30 text-xs text-violet-300 flex items-center justify-between">
                      <span><strong>Expected Outcome:</strong> {proj.expected_outcome}</span>
                      <span className="text-[10px] font-mono text-slate-400">Skills Developed: {proj.skills_developed.join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;

