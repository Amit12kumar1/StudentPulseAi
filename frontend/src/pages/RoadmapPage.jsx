import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Milestone,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

const RoadmapPage = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || '';
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = async () => {
    try {
      const url = roleParam ? `/roadmap?role=${encodeURIComponent(roleParam)}` : '/roadmap';
      const res = await api.get(url);
      setRoadmap(res.data);
    } catch (err) {
      console.error("Failed to load roadmap:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [roleParam]);

  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      await api.put(`/roadmap/tasks/${taskId}`, { status: nextStatus });
      fetchRoadmap();
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Structuring personalized learning roadmap...
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-400">
        No active roadmap found. Please run a skill gap analysis to generate one.
      </div>
    );
  }

  // Group tasks by phase
  const groupedTasks = (roadmap.tasks || []).reduce((acc, task) => {
    if (!acc[task.phase]) acc[task.phase] = [];
    acc[task.phase].push(task);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold mb-1">
            <Milestone className="w-3.5 h-3.5" />
            <span>Target Role: {roadmap.target_role}</span>
          </div>
          <h2 className="text-xl font-bold text-white">{roadmap.title}</h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Targeted milestones mapped directly to the skills you need to acquire. Complete tasks to elevate your career readiness score.
          </p>
        </div>

        {/* Progress Card */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-4 flex-shrink-0">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Milestones Done</span>
            <span className="text-2xl font-extrabold text-white">
              {roadmap.completed_tasks} / {roadmap.total_tasks}
            </span>
          </div>
          <div className="w-24">
            <div className="flex justify-between text-[10px] text-brand-400 font-mono mb-1">
              <span>Progress</span>
              <span>{roadmap.progress_percentage}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${roadmap.progress_percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Phase Timeline */}
      <div className="space-y-6">
        {Object.entries(groupedTasks).map(([phaseName, tasks], pIdx) => (
          <div key={phaseName} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-lg bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-bold text-xs">
                  {pIdx + 1}
                </span>
                <h3 className="text-sm font-bold text-white">{phaseName}</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {tasks.filter(t => t.status === 'Completed').length}/{tasks.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => {
                const isCompleted = task.status === 'Completed';
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isCompleted
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => handleToggleTaskStatus(task.id, task.status)}
                        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors flex-shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'border border-slate-700 hover:border-brand-500 bg-slate-900'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-xs font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {task.title}
                          </h4>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            task.priority === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {task.description}
                        </p>

                        {/* Verified Resources Links */}
                        {task.resources && task.resources.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {task.resources.map((res, rIdx) => (
                              <a
                                key={rIdx}
                                href={res.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-brand-400 hover:text-brand-300 hover:border-brand-500/40 transition-colors"
                              >
                                <BookOpen className="w-3 h-3" />
                                <span>{res.title}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-center flex-shrink-0">
                      <span className="text-[11px] text-slate-400 flex items-center space-x-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{task.duration_weeks} wks</span>
                      </span>
                      <button
                        onClick={() => handleToggleTaskStatus(task.id, task.status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          isCompleted
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm'
                        }`}
                      >
                        {isCompleted ? 'Mark Pending' : 'Mark Completed'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapPage;

