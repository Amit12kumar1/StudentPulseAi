import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  Filter,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Award
} from 'lucide-react';
import api from '../services/api';

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkill, setNewSkill] = useState({
    skill_name: '',
    category: 'Programming',
    self_reported_level: 'Intermediate'
  });

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills/my-skills');
      setSkills(res.data);
    } catch (err) {
      console.error("Failed to fetch skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.skill_name.trim()) return;
    try {
      await api.post('/skills/my-skills', newSkill);
      setShowAddModal(false);
      setNewSkill({ skill_name: '', category: 'Programming', self_reported_level: 'Intermediate' });
      fetchSkills();
    } catch (err) {
      console.error("Error adding skill:", err);
    }
  };

  const handleUpdateLevel = async (id, level) => {
    try {
      await api.put(`/skills/my-skills/${id}`, { self_reported_level: level });
      fetchSkills();
    } catch (err) {
      console.error("Error updating skill level:", err);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.delete(`/skills/my-skills/${id}`);
      fetchSkills();
    } catch (err) {
      console.error("Error deleting skill:", err);
    }
  };

  const categories = ['All', ...Array.from(new Set(skills.map(s => s.category)))];
  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Loading verified competencies...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Evidence Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Dual Indicator Standard</span>
          </div>
          <h2 className="text-xl font-bold text-white">Skills & Competency Verification</h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            StudentPulse AI strictly separates <strong>self-reported proficiency</strong> from <strong>verified assessment performance</strong>. To turn self-reported skills into certified badges, complete the corresponding technical assessments.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Skill</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">No skills recorded in this category</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Log your languages and frameworks, or take a skill assessment to automatically record verified proficiencies.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium inline-flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((s) => (
            <div key={s.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">{s.category}</span>
                    <h4 className="text-base font-bold text-white mt-0.5">{s.skill_name}</h4>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(s.id)}
                    className="text-slate-400 hover:text-rose-400 p-1"
                    title="Remove skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {/* Self-reported Level */}
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1">Self-Reported Level</span>
                    <select
                      value={s.self_reported_level}
                      onChange={(e) => handleUpdateLevel(s.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    >
                      <option value="Beginner">Beginner (Concept Only)</option>
                      <option value="Intermediate">Intermediate (Project Use)</option>
                      <option value="Advanced">Advanced (Production Scale)</option>
                    </select>
                  </div>

                  {/* Verified Indicator */}
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Verification Status</span>
                    {s.assessment_score !== null ? (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified ({s.assessment_score}%)</span>
                        </span>
                        <Link
                          to="/assessments"
                          className="text-[10px] text-brand-400 hover:underline font-semibold"
                        >
                          Retake
                        </Link>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Unverified</span>
                        <Link
                          to="/assessments"
                          className="px-2 py-0.5 rounded bg-brand-600/20 hover:bg-brand-600/30 text-brand-400 border border-brand-500/30 text-[10px] font-semibold transition-colors"
                        >
                          Take Test
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
                Updated: {new Date(s.updated_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Add Custom Technical Skill</h3>
            <form onSubmit={handleAddSkill} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, Kubernetes, Redis, TypeScript"
                  value={newSkill.skill_name}
                  onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Database">Database</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="Tools">Tools</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Self-Reported Level</label>
                <select
                  value={newSkill.self_reported_level}
                  onChange={(e) => setNewSkill({ ...newSkill, self_reported_level: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsPage;

