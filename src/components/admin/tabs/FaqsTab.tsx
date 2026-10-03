import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, AlertCircle } from 'lucide-react';
import { FAQItem } from '../../../types/index.ts';
import { api } from '../../../services/api.ts';

export const FaqsTab: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FAQItem>>({
    question: '',
    answer: '',
    category: 'Product Purity & Food Safety',
    sort_order: 1
  });

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminFAQs();
      setFaqs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.saveFAQ(formData);
      setSuccess('FAQ saved successfully!');
      setIsModalOpen(false);
      fetchFaqs();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save FAQ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this FAQ permanently?')) return;
    try {
      await api.deleteFAQ(id);
      setSuccess('FAQ deleted');
      fetchFaqs();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete FAQ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Outfit']">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">
            Provide clear information on water quality, delivery radius, orders, and commercial accounts.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              question: '',
              answer: '',
              category: 'Product Purity & Food Safety',
              sort_order: faqs.length + 1
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
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

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                  {faq.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{faq.question}</h4>
              </div>
              <p className="text-xs text-slate-600 pl-1">{faq.answer}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  setEditingId(faq.id);
                  setFormData(faq);
                  setIsModalOpen(true);
                }}
                className="p-1.5 text-slate-500 hover:text-cyan-600 rounded-lg hover:bg-slate-100"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-['Outfit'] text-base">
                {editingId ? 'Edit FAQ' : 'Add FAQ'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={formData.question || ''}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Answer</label>
                <textarea
                  rows={3}
                  required
                  value={formData.answer || ''}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                >
                  <option value="Product Purity & Food Safety">Product Purity & Food Safety</option>
                  <option value="Dispatch & Delivery Logistics">Dispatch & Delivery Logistics</option>
                  <option value="Commercial & Bulk Supply">Commercial & Bulk Supply</option>
                  <option value="Plant Location & Collection">Plant Location & Collection</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-sm"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
