import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Plus,
  Trash2,
  ExternalLink,
  Edit2,
  Save,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Sparkles
} from 'lucide-react';
import api from '../services/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  // Modals for adding skill and adding project
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ skill_name: '', category: 'Technical', self_reported_level: 'Intermediate' });

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    github_url: '',
    live_url: '',
    status: 'Completed'
  });

  const fetchData = async () => {
    try {
      const [profRes, skillRes, projRes] = await Promise.all([
        api.get('/profile'),
        api.get('/skills/my-skills'),
        api.get('/projects')
      ]);
      setProfile(profRes.data);
      setEditForm(profRes.data);
      setSkills(skillRes.data);
      setProjects(projRes.data);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setMessage({ type: 'error', text: 'Error loading student profile.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/profile', editForm);
      setProfile(res.data);
      setIsEditingProfile(false);
      setMessage({ type: 'success', text: 'Student profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3500);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.skill_name.trim()) return;
    try {
      await api.post('/skills/my-skills', newSkill);
      setShowSkillModal(false);
      setNewSkill({ skill_name: '', category: 'Technical', self_reported_level: 'Intermediate' });
      fetchData();
      setMessage({ type: 'success', text: 'Skill added to profile!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add skill.' });
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.delete(`/skills/my-skills/${id}`);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete skill.' });
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.description.trim()) return;
    try {
      await api.post('/projects', newProject);
      setShowProjectModal(false);
      setNewProject({
        title: '',
        description: '',
        technologies: '',
        github_url: '',
        live_url: '',
        status: 'Completed'
      });
      fetchData();
      setMessage({ type: 'success', text: 'Project added to student profile!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add project.' });
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete project.' });
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Loading unified capability profile...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {message.text && (
        <div
          className={`p-3.5 rounded-lg text-xs flex items-center space-x-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Basic Academic Info Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center border border-brand-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Basic Information & Academics</h2>
              <p className="text-xs text-slate-400">Verified identity and university background</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            {isEditingProfile ? <span>Cancel</span> : <><Edit2 className="w-3.5 h-3.5" /><span>Edit Profile</span></>}
          </button>
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">College / University</label>
                <input
                  type="text"
                  value={editForm.college || ''}
                  onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Degree / Course</label>
                <input
                  type="text"
                  value={editForm.degree || ''}
                  onChange={(e) => setEditForm({ ...editForm, degree: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Current Semester</label>
                <input
                  type="text"
                  value={editForm.semester || ''}
                  onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Graduation Year</label>
                <input
                  type="number"
                  value={editForm.graduation_year || 2026}
                  onChange={(e) => setEditForm({ ...editForm, graduation_year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="+1 555-0123"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Professional Bio / Summary</label>
              <textarea
                rows={3}
                value={editForm.bio || ''}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Share your technical interests, problem-solving mindset, and placement ambitions..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Updates</span>
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Full Name</span>
              <p className="text-xs font-bold text-white mt-0.5">{profile?.name || 'Not provided'}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Email</span>
              <p className="text-xs font-medium text-slate-300 mt-0.5">{profile?.email}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">College</span>
              <p className="text-xs font-bold text-white mt-0.5">{profile?.college || 'Not specified'}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Degree</span>
              <p className="text-xs font-medium text-slate-300 mt-0.5">{profile?.degree || 'Engineering'}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Semester / Year</span>
              <p className="text-xs font-medium text-slate-300 mt-0.5">{profile?.semester} (Class of {profile?.graduation_year})</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Target Career Role</span>
              <p className="text-xs font-bold text-brand-400 mt-0.5">{profile?.career_interest}</p>
            </div>
          </div>
        )}
      </div>

      {/* Technical & Professional Skills Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Skills & Competency Evidence</h2>
              <p className="text-xs text-slate-400">Self-reported claims vs. verified assessment performance</p>
            </div>
          </div>
          <button
            onClick={() => setShowSkillModal(true)}
            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>

        {skills.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
            No technical skills logged yet. Add your programming languages and frameworks.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {skills.map((s) => (
              <div key={s.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-white">{s.skill_name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {s.self_reported_level}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center space-x-2">
                    {s.assessment_score !== null ? (
                      <span className="text-[10px] font-semibold text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified: {s.assessment_score}%</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Self-Reported Only</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSkill(s.id)}
                  className="text-slate-400 hover:text-rose-400 p-1"
                  title="Remove skill"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Project Experience</h2>
              <p className="text-xs text-slate-400">Portfolio work demonstrating applied technical capabilities</p>
            </div>
          </div>
          <button
            onClick={() => setShowProjectModal(true)}
            className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
            No projects added yet. Showcase your technical projects to demonstrate practical skills.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">{p.title}</h4>
                      <span className="inline-block mt-0.5 text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                        {p.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{p.description}</p>
                  <p className="text-[11px] text-teal-400 font-mono mt-2">
                    Stack: {p.technologies}
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-3 mt-3 border-t border-slate-800/80 text-xs">
                  {p.github_url && (
                    <a
                      href={p.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-300 hover:text-white flex items-center space-x-1 font-medium"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {p.live_url && (
                    <a
                      href={p.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-400 hover:underline flex items-center space-x-1 font-medium"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Add Skill to Profile</h3>
            <form onSubmit={handleAddSkill} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. Core Java, Python, React.js, SQL"
                  value={newSkill.skill_name}
                  onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Self-Reported Proficiency</label>
                <select
                  value={newSkill.self_reported_level}
                  onChange={(e) => setNewSkill({ ...newSkill, self_reported_level: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Beginner">Beginner (Foundational)</option>
                  <option value="Intermediate">Intermediate (Project Application)</option>
                  <option value="Advanced">Advanced (Production & Edge Cases)</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Add Student Project</h3>
            <form onSubmit={handleAddProject} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Task Scheduler"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description & Problem Solved</label>
                <textarea
                  rows={2}
                  placeholder="Explain the architectural problem your project addresses..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Technologies Used</label>
                <input
                  type="text"
                  placeholder="e.g. Java, Spring Boot, PostgreSQL, Docker"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newProject.github_url}
                    onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://demo.example.com"
                    value={newProject.live_url}
                    onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

