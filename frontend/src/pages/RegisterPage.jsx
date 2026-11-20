import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  Lock,
  Mail,
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  Compass,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

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

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    degree: 'B.Tech / B.E. Computer Science',
    semester: 'Semester 6',
    graduation_year: 2026,
    career_interest: 'Java Developer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register({
        ...formData,
        graduation_year: parseInt(formData.graduation_year) || 2026
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative selection:bg-brand-500 selection:text-white">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10 text-center mb-6">
        <Link to="/" className="inline-flex items-center space-x-2 group mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-teal-500 to-violet-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">StudentPulse AI</span>
        </Link>
        <h2 className="text-xl font-bold text-white tracking-tight">Create your student success profile</h2>
        <p className="text-xs text-slate-400">Byte Force â€¢ Evidence â†’ Insight â†’ Action</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4">
        <div className="bg-slate-900/90 py-8 px-6 sm:px-10 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm">
          {error && (
            <div className="mb-6 p-3.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Alex Developer"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">College Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@college.edu"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password (Min. 6 chars)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            {/* College & Degree */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">College / University</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="e.g. State Institute of Tech"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Degree / Course</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="B.Tech Computer Science"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Semester & Graduation Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Semester / Year</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500"
                >
                  <option value="Semester 1">Semester 1 (Year 1)</option>
                  <option value="Semester 2">Semester 2 (Year 1)</option>
                  <option value="Semester 3">Semester 3 (Year 2)</option>
                  <option value="Semester 4">Semester 4 (Year 2)</option>
                  <option value="Semester 5">Semester 5 (Year 3)</option>
                  <option value="Semester 6">Semester 6 (Year 3)</option>
                  <option value="Semester 7">Semester 7 (Year 4)</option>
                  <option value="Semester 8">Semester 8 (Year 4)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Graduation Year</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    name="graduation_year"
                    value={formData.graduation_year}
                    onChange={handleChange}
                    min={2024}
                    max={2030}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Career Interest */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Career Goal</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Compass className="w-4 h-4" />
                </div>
                <select
                  name="career_interest"
                  value={formData.career_interest}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500"
                >
                  {TARGET_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-brand-600 via-teal-600 to-brand-600 hover:opacity-95 text-white font-semibold text-xs shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span>Setting Up Your Student Portal...</span>
              ) : (
                <>
                  <span>Create Account & Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-brand-400 font-semibold hover:underline">
              Log in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

