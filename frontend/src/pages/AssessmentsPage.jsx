import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  HelpCircle,
  Award,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import api from '../services/api';

const CATEGORIES = [
  'Programming Skills',
  'Data Structures and Algorithms',
  'Database Management',
  'Web Development',
  'Software Engineering',
  'Artificial Intelligence / Machine Learning',
  'Communication Skills',
  'Problem-Solving'
];

const AssessmentsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { question_id: selected_option }
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pastResults, setPastResults] = useState([]);

  const fetchQuestions = async (cat) => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    try {
      const res = await api.get(`/assessments/questions?category=${encodeURIComponent(cat)}`);
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPastResults = async () => {
    try {
      const res = await api.get('/assessments/results');
      setPastResults(res.data);
    } catch (err) {
      console.error("Failed to load past assessment results:", err);
    }
  };

  useEffect(() => {
    fetchQuestions(selectedCategory);
    fetchPastResults();
  }, [selectedCategory]);

  const handleSelectOption = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length === 0) {
      alert("Please answer at least one question before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        category: selectedCategory,
        answers: Object.entries(answers).map(([qId, ans]) => ({
          question_id: parseInt(qId),
          selected_answer: ans
        }))
      };
      const res = await api.post('/assessments/submit', payload);
      setResult(res.data);
      fetchPastResults();
    } catch (err) {
      console.error("Assessment submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-semibold mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Knowledge Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white">Technical Skill Assessments</h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Test your competencies through verified MCQs. Scores earned here directly update your capability profile and are distinguished from self-reported claims.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Assessment Container */}
      {result ? (
        /* Results View */
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Assessment Completed: {result.category}
            </span>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              Score: {result.score} / {result.total_questions} ({result.percentage}%)
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
              Your verified scores have been logged to your student capability profile.
            </p>
          </div>

          {/* Skill Tag Breakdown */}
          {result.breakdown?.skill_breakdown && (
            <div className="max-w-lg mx-auto bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Skill-wise Performance
              </span>
              {Object.entries(result.breakdown.skill_breakdown).map(([skill, data]) => (
                <div key={skill} className="flex items-center justify-between text-xs">
                  <span className="text-white font-medium">{skill}</span>
                  <span className={`font-semibold ${data.percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {data.correct}/{data.total} ({data.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center space-x-3 pt-2">
            <button
              onClick={() => fetchQuestions(selectedCategory)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Assessment</span>
            </button>
            <a
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <span>View Dashboard Updates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading questions for {selectedCategory}...
        </div>
      ) : questions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          No questions currently available for this category.
        </div>
      ) : (
        /* Quiz Interface */
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
                {currentQ.difficulty}
              </span>
              <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 text-[10px]">
                {currentQ.skill_tag}
              </span>
            </div>
            <span className="text-slate-400 font-mono">
              Answered: {answeredCount}/{questions.length}
            </span>
          </div>

          {/* Question Text */}
          <div className="py-2">
            <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
              {currentQ.question_text}
            </p>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = answers[currentQ.id] === opt;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(currentQ.id, opt)}
                  className={`w-full p-4 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-violet-600/20 border-violet-500 text-white shadow-sm shadow-violet-500/10'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Quiz Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40"
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-violet-600/20 disabled:opacity-50 flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Calculating Result...' : 'Submit Assessment'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Past Assessment History */}
      {pastResults.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-3">Your Assessment History</h3>
          <div className="space-y-2">
            {pastResults.map((pr) => (
              <div key={pr.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">{pr.category}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Completed: {new Date(pr.completed_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${pr.percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {pr.score}/{pr.total_questions} ({pr.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentsPage;

