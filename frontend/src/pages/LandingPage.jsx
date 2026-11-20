import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  GitCompare,
  Milestone,
  FileCheck2,
  Briefcase,
  Layers,
  Award,
  BarChart3,
  BrainCircuit,
  Target,
  ExternalLink
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36 border-b border-slate-900">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-teal-500/10 to-violet-600/20 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Byte Force Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-8 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span className="font-semibold text-white tracking-wide uppercase text-[10px]">Team Byte Force</span>
            <span className="text-slate-400">|</span>
            <span className="text-brand-400 font-medium">Evidence â†’ Insight â†’ Action</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
            Discover Your Skills.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-teal-300 to-violet-400">
              Identify Your Gaps.
            </span>{' '}
            Build Your Future.
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            The intelligent student success platform that turns your academic projects and verified assessments into actionable career roadmaps. No fake metrics, no guessworkâ€”just verifiable growth for engineering students.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-teal-600 to-brand-600 hover:opacity-95 text-white font-semibold text-base shadow-xl shadow-brand-600/25 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white font-semibold text-base border border-slate-800 transition-all flex items-center justify-center"
            >
              Student Sign In
            </Link>
          </div>

          {/* Core Philosophy Banner */}
          <div id="philosophy" className="mt-16 pt-10 border-t border-slate-900 max-w-4xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              Our Core Architecture Philosophy
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-sm mb-3 border border-brand-500/20">
                  01
                </div>
                <h4 className="text-base font-bold text-white mb-1">EVIDENCE</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Record self-reported skills, projects, certifications, and pass verified MCQ technical assessments.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-sm mb-3 border border-teal-500/20">
                  02
                </div>
                <h4 className="text-base font-bold text-white mb-1">INSIGHT</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Deterministic role comparison engine & Google Gemini AI analyze exactly which skills are strong, missing, or need work.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold text-sm mb-3 border border-violet-500/20">
                  03
                </div>
                <h4 className="text-base font-bold text-white mb-1">ACTION</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate milestone roadmaps, build recommended projects, and practice mock interviews with transparent scoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-900/40 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">Guided Pathway</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">How StudentPulse AI Works</p>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              A transparent, step-by-step framework to bridge the gap between college coursework and industry expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: 'Step 1',
                title: 'Build Student Profile',
                desc: 'Add your college, degree, semester, technical skills, projects, and career aspiration.',
                icon: Layers,
                color: 'text-brand-400'
              },
              {
                step: 'Step 2',
                title: 'Verify Skills via Tests',
                desc: 'Take structured assessments across 8 domains to convert claims into verified badges.',
                icon: FileCheck2,
                color: 'text-teal-400'
              },
              {
                step: 'Step 3',
                title: 'Run AI Skill Gap Analysis',
                desc: 'Select a target role (e.g. Java, Python, Full Stack) and see exact priority deficiencies.',
                icon: GitCompare,
                color: 'text-violet-400'
              },
              {
                step: 'Step 4',
                title: 'Execute & Practice',
                desc: 'Follow your 4-phase learning roadmap, build suggested projects, and ace mock interviews.',
                icon: Target,
                color: 'text-emerald-400'
              }
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono text-slate-400">{s.step}</span>
                    <Icon className={`w-6 h-6 ${s.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-24 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">Comprehensive Platform</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Engineered for Real Engineering Careers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-5 border border-brand-500/20">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Explainable AI & Rule Fallbacks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deterministic comparison guarantees accurate skill mapping even without an API key, augmented by Google Gemini for tailored explanations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 border border-teal-500/20">
                <Milestone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Adaptive 4-Phase Roadmaps</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get step-by-step milestones covering core fundamentals, frameworks, projects, and interview preparation with verified learning resources.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-5 border border-violet-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Interview Simulator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Practice technical, DSA, database, and system design questions. Receive objective feedback, strengths, missing concepts, and model answers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Readiness Callout */}
      <section id="readiness" className="py-20 bg-gradient-to-b from-slate-900/60 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-2 block">
                Byte Force â€¢ Student Success Initiative
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to Accelerate Your Tech Career?
              </h2>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto mb-8">
                Join students who are actively assessing their technical competencies, closing skill gaps, and preparing for competitive placements.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white font-semibold text-sm shadow-xl shadow-brand-600/30 transition-all"
              >
                <span>Create Your Free Student Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-10 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white">StudentPulse AI</span> â€” Team Byte Force
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            <span className="font-mono text-slate-400 text-[11px]">Core: Evidence â†’ Insight â†’ Action</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

