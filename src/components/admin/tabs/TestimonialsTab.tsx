import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, AlertCircle, Star } from 'lucide-react';
import { Testimonial } from '../../../types/index.ts';
import { api } from '../../../services/api.ts';

export const TestimonialsTab: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    client_name: '',
    business_name: '',
    client_type: 'Restaurant / Bar',
    quote: '',
    rating: 5,
    highlight: 'Crystal clarity & reliability',
    verified_client: true,
    published: true
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminTestimonials();
      setTestimonials(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.saveTestimonial(formData);
      setSuccess('Testimonial saved successfully!');
      setIsModalOpen(false);
      fetchTestimonials();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this testimonial permanently?')) return;
    try {
      await api.deleteTestimonial(id);
      setSuccess('Testimonial deleted');
      fetchTestimonials();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete testimonial');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
            Commercial Client Endorsements
          </h2>
          <p className="text-xs text-slate-500">
            Manage reviews and ratings from hospitality managers, butcheries, and event caterers.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              client_name: '',
              business_name: '',
              client_type: 'Restaurant / Bar',
              quote: '',
              rating: 5,
              highlight: '',
              verified_client: true,
              published: true
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Review</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm font-['Outfit']">{t.client_name}</h4>
                  <p className="text-xs text-slate-500">
                    {t.business_name} • <span className="text-cyan-700 font-semibold">{t.client_type}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingId(t.id);
                      setFormData(t);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-cyan-600 rounded-lg hover:bg-slate-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1 my-2">
                {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-xs text-slate-700 italic">"{t.quote}"</p>
            </div>

            {t.highlight && (
              <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-cyan-800">
                Key takeaway: {t.highlight}
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-['Outfit'] text-base">
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={formData.client_name || ''}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Venue</label>
                  <input
                    type="text"
                    required
                    value={formData.business_name || ''}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quote / Review</label>
                <textarea
                  rows={3}
                  required
                  value={formData.quote || ''}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.client_type}
                    onChange={(e) => setFormData({ ...formData, client_type: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                  >
                    <option value="Restaurant / Bar">Restaurant / Bar</option>
                    <option value="Event Caterer">Event Caterer</option>
                    <option value="Meat Processor / Butchery">Meat Processor / Butchery</option>
                    <option value="Wholesale Distributor">Wholesale Distributor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating || 5}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                  />
                </div>
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
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
