import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, AlertCircle, Sparkles, Building2, Bell } from 'lucide-react';
import { ProcessStep, PortfolioItem, NewsItem } from '../../../types/index.ts';
import { api } from '../../../services/api.ts';

export const ProcessPortfolioNewsTab: React.FC = () => {
  const [subTab, setSubTab] = useState<'process' | 'portfolio' | 'news'>('process');

  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modals
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Partial<ProcessStep> | null>(null);

  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Partial<PortfolioItem> | null>(null);

  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [steps, portfolio, news] = await Promise.all([
        api.getAdminProcessSteps(),
        api.getAdminPortfolioItems(),
        api.getAdminNewsItems()
      ]);
      setProcessSteps(steps);
      setPortfolioItems(portfolio);
      setNewsItems(news);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Process Handlers
  const handleSaveProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProcess) return;
    try {
      await api.saveProcessStep(editingProcess);
      setSuccess('Process step saved!');
      setIsProcessModalOpen(false);
      fetchAll();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save process step');
    }
  };

  const handleDeleteProcess = async (id: string) => {
    if (!window.confirm('Delete this process step?')) return;
    try {
      await api.deleteProcessStep(id);
      fetchAll();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Portfolio Handlers
  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPortfolio) return;
    try {
      await api.savePortfolioItem(editingPortfolio);
      setSuccess('Portfolio item saved!');
      setIsPortfolioModalOpen(false);
      fetchAll();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save portfolio item');
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!window.confirm('Delete this portfolio contract record?')) return;
    try {
      await api.deletePortfolioItem(id);
      fetchAll();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // News Handlers
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;
    try {
      await api.saveNewsItem(editingNews);
      setSuccess('Announcement published!');
      setIsNewsModalOpen(false);
      fetchAll();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to publish announcement');
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.deleteNewsItem(id);
      fetchAll();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
            Operations & Media Content
          </h2>
          <p className="text-xs text-slate-500">
            Maintain production standards, commercial contracts, and official operational alerts.
          </p>
        </div>

        {/* Subtab switcher */}
        <div className="inline-flex bg-slate-200/80 p-1 rounded-xl gap-1 text-xs font-bold">
          <button
            onClick={() => setSubTab('process')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              subTab === 'process' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Process Steps ({processSteps.length})
          </button>
          <button
            onClick={() => setSubTab('portfolio')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              subTab === 'portfolio' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Portfolio ({portfolioItems.length})
          </button>
          <button
            onClick={() => setSubTab('news')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              subTab === 'news' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            News & Alerts ({newsItems.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* 1. PROCESS STEPS */}
      {subTab === 'process' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingProcess({
                  title: '',
                  description: '',
                  step_number: processSteps.length + 1,
                  icon: 'Droplets',
                  published: true
                });
                setIsProcessModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Step</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {processSteps.map((step) => (
              <div
                key={step.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 text-xs font-black flex items-center justify-center">
                      {step.step_number}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 pl-8">{step.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setEditingProcess(step);
                      setIsProcessModalOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-cyan-600 rounded-lg hover:bg-slate-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProcess(step.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PORTFOLIO ITEMS */}
      {subTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingPortfolio({
                  client_name: '',
                  category: 'Hotel & Hospitality',
                  description: '',
                  volume_supplied: '500kg / week',
                  featured: true,
                  published: true
                });
                setIsPortfolioModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Contract Portfolio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cyan-600" />
                    <h4 className="font-bold text-slate-900 text-sm">{item.client_name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-600">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{item.description}</p>
                  <div className="text-xs font-bold text-cyan-700">
                    Volume: {item.volume_supplied}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setEditingPortfolio(item);
                      setIsPortfolioModalOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-cyan-600 rounded-lg hover:bg-slate-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePortfolio(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. NEWS ITEMS */}
      {subTab === 'news' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingNews({
                  title: '',
                  category: 'Operational Alert',
                  summary: '',
                  date: new Date().toISOString().split('T')[0],
                  published: true
                });
                setIsNewsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Post Announcement</span>
            </button>
          </div>

          <div className="space-y-3">
            {newsItems.map((news) => (
              <div
                key={news.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                      {news.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{news.title}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">{news.date}</span>
                  </div>
                  <p className="text-xs text-slate-600">{news.summary}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setEditingNews(news);
                      setIsNewsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-cyan-600 rounded-lg hover:bg-slate-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNews(news.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROCESS MODAL */}
      {isProcessModalOpen && editingProcess && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Process Step</h3>
            <form onSubmit={handleSaveProcess} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Step Title</label>
                <input
                  type="text"
                  required
                  value={editingProcess.title || ''}
                  onChange={(e) => setEditingProcess({ ...editingProcess, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingProcess.description || ''}
                  onChange={(e) => setEditingProcess({ ...editingProcess, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Step Number</label>
                <input
                  type="number"
                  value={editingProcess.step_number || 1}
                  onChange={(e) => setEditingProcess({ ...editingProcess, step_number: parseInt(e.target.value) || 1 })}
                  className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProcessModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-cyan-600 text-white rounded-xl font-bold">
                  Save Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PORTFOLIO MODAL */}
      {isPortfolioModalOpen && editingPortfolio && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Commercial Contract</h3>
            <form onSubmit={handleSavePortfolio} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Client / Brand Name</label>
                <input
                  type="text"
                  required
                  value={editingPortfolio.client_name || ''}
                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, client_name: e.target.value })}
                  className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <input
                  type="text"
                  value={editingPortfolio.category || ''}
                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, category: e.target.value })}
                  className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingPortfolio.description || ''}
                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Volume Supplied</label>
                <input
                  type="text"
                  value={editingPortfolio.volume_supplied || ''}
                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, volume_supplied: e.target.value })}
                  className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPortfolioModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-cyan-600 text-white rounded-xl font-bold">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEWS MODAL */}
      {isNewsModalOpen && editingNews && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Operational Announcement</h3>
            <form onSubmit={handleSaveNews} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={editingNews.title || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={editingNews.category}
                  onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300"
                >
                  <option value="Operational Alert">Operational Alert</option>
                  <option value="Capacity Expansion">Capacity Expansion</option>
                  <option value="Supply Notice">Supply Notice</option>
                  <option value="Holiday Hours">Holiday Hours</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Summary</label>
                <textarea
                  rows={3}
                  required
                  value={editingNews.summary || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-cyan-600 text-white rounded-xl font-bold">
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
