import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ExternalLink,
  Search,
  Filter,
  Award,
  Video,
  FileCode,
  GraduationCap
} from 'lucide-react';
import api from '../services/api';

const typeIcons = {
  Documentation: BookOpen,
  Tutorial: FileCode,
  Practice: GraduationCap,
  Video: Video
};

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get('/resources');
        setResources(res.data);
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const types = ['All', ...Array.from(new Set(resources.map(r => r.resource_type)))];

  const filtered = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.skill_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || r.resource_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curated Learning Directory</span>
          </div>
          <h2 className="text-xl font-bold text-white">Verified Learning Resources</h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Curated and verified documentation, official tutorials, and coding practice platforms to close specific technical gaps.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by skill (e.g. Java, FastAPI, SQL, React)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === type
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading curated resources...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          No resources found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((res) => {
            const Icon = typeIcons[res.resource_type] || BookOpen;
            return (
              <div
                key={res.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="p-1.5 rounded-lg bg-slate-800 text-brand-400">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="text-[10px] text-teal-400 font-mono font-semibold uppercase tracking-wider block">
                          {res.skill_name} â€¢ {res.resource_type}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{res.title}</h4>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono flex-shrink-0">
                      {res.difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                    {res.url.replace('https://', '')}
                  </span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-400 border border-brand-500/30 text-xs font-semibold transition-colors"
                  >
                    <span>Visit Resource</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;

