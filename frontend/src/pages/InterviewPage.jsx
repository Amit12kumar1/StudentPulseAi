import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Send,
  RotateCcw,
  BookOpen,
  Award,
  ChevronDown,
  Compass,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

const TARGET_ROLES = [
  'Java Developer',
  'Python Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Software Engineer'
];

const CATEGORIES = [
  'Technical Interview',
  'Programming',
  'DSA',
  'Database',
  'OOP',
  'Project Discussion',
  'HR Interview',
  'Communication Skills'
];

const InterviewPage = () => {
  const [selectedRole, setSelectedRole] = useState('Java Developer');
  const [category, setCategory] = useState('Technical Interview');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchQuestions = async () => {
    setLoading(true);
    setEvaluation(null);
    setStudentAnswer('');
    setShowHint(false);
    try {
      const res = await api.post('/interview/generate', {
        target_role: selectedRole,
        category: category,
        difficulty: difficulty
      });
      setQuestions(res.data);
      if (res.data.length > 0) {
        setSelectedQuestion(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to generate interview questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/interview/history');
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load interview history:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchHistory();
  }, [selectedRole, category, difficulty]);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!studentAnswer.trim() || !selectedQuestion) return;
    setEvaluating(true);
    try {
      const res = await api.post('/interview/evaluate', {
        target_role: selectedRole,
        category: category,
        difficulty: difficulty,
        question: selectedQuestion.question,
        student_answer: studentAnswer
      });
      setEvaluation(res.data);
      fetchHistory();
    } catch (err) {
      console.error("Evaluation failed:", err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Guided Technical Interview Prep</span>
          </div>
          <h2 className="text-xl font-bold text-white">Interview Preparation Simulator</h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Practice answering real technical and architectural questions. Submissions are objectively evaluated on conceptual depth, keywords, and structural clarity.
          </p>
        </div>

        {/* Responsible AI Disclaimer */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 max-w-xs flex-shrink-0">
          <p className="leading-snug">
            <strong>Notice:</strong> AI evaluations provide formative guidance only and do not constitute an official employer placement guarantee.
          </p>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target Job Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            {TARGET_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Interview Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Difficulty Level</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="Beginner">Beginner (Foundations)</option>
            <option value="Intermediate">Intermediate (Real World)</option>
            <option value="Advanced">Advanced (Scale & System Design)</option>
          </select>
        </div>
      </div>

      {/* Question Selector Carousel */}
      {questions.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {questions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedQuestion(q);
                setEvaluation(null);
                setStudentAnswer('');
                setShowHint(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedQuestion?.id === q.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Question {idx + 1}
            </button>
          ))}
        </div>
      )}

      {/* Main Interview Card */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Generating questions for {selectedRole}...
        </div>
      ) : selectedQuestion ? (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          {/* Question Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">{selectedQuestion.category} â€¢ {selectedQuestion.difficulty}</span>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-brand-400 hover:underline flex items-center space-x-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Hint' : 'View Concept Hint'}</span>
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {selectedQuestion.question}
            </h3>
          </div>

          {/* Hint Card */}
          {showHint && (
            <div className="p-3.5 rounded-xl bg-brand-950/30 border border-brand-800/40 text-xs text-brand-300">
              <strong>Key Topics to Touch:</strong> {selectedQuestion.hint}
            </div>
          )}

          {/* Answer Submission Form */}
          <form onSubmit={handleEvaluate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Answer (Explain concepts, code architecture, and tradeoffs)
              </label>
              <textarea
                rows={5}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type your response as you would speak it in a technical interview round..."
                required
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500 font-sans leading-relaxed"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Aim for 30+ words with specific terminology</span>
                <span>Word count: {studentAnswer.trim() ? studentAnswer.trim().split(/\s+/).length : 0}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={evaluating || !studentAnswer.trim()}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-brand-600 to-teal-600 hover:opacity-95 text-white font-semibold text-xs shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{evaluating ? 'Evaluating via Rubric...' : 'Submit Answer for AI Review'}</span>
            </button>
          </form>

          {/* Feedback & Rubric Evaluation */}
          {evaluation && (
            <div className="pt-6 border-t border-slate-800 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                    {evaluation.score}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Objective Rubric Score</span>
                    <span className="text-[10px] text-slate-400 block">Out of 100 possible points</span>
                  </div>
                </div>
                {evaluation.is_fallback && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    Deterministic Rubric
                  </span>
                )}
              </div>

              {/* Feedback Summary */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white block mb-1">Evaluator Feedback:</span>
                {evaluation.feedback}
              </div>

              {/* Strengths & Missing Concepts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs">
                  <span className="font-bold text-emerald-400 flex items-center space-x-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Identified Strengths</span>
                  </span>
                  <p className="text-slate-300">{evaluation.strengths}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs">
                  <span className="font-bold text-amber-400 flex items-center space-x-1 mb-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Missing Concepts / Refinements</span>
                  </span>
                  <p className="text-slate-300">{evaluation.missing_concepts}</p>
                </div>
              </div>

              {/* Model Improved Answer */}
              {evaluation.improved_answer && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="font-bold text-brand-400 block">Model Improved Response:</span>
                  <p className="text-slate-300 leading-relaxed">{evaluation.improved_answer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* Past Practice History */}
      {history.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-3">Your Interview Practice Sessions</h3>
          <div className="space-y-3">
            {history.map((s) => (
              <div key={s.session_id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{s.target_role} ({s.category})</span>
                  <span className="text-[10px] text-slate-400">{new Date(s.created_at).toLocaleDateString()}</span>
                </div>
                {s.responses.map((r) => (
                  <div key={r.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-200">Q: {r.question}</p>
                      <span className="font-bold text-teal-400">{r.score}/100</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">Feedback: {r.feedback}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;

