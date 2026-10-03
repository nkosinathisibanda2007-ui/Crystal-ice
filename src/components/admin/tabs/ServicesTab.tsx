import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, AlertCircle } from 'lucide-react';
import { Service } from '../../../types/index.ts';
import { api } from '../../../services/api.ts';

export const ServicesTab: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Edit / Add modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    description: '',
    pricing_model: 'Per kg / Per unit',
    turnaround_time: '24-48 Hours',
    capacity_info: '10-15 Tonnes / Day',
    published: true,
    features: ['High-throughput blast cooling', 'Temperature guaranteed']
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminServices();
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.saveService(formData);
      setSuccess(`Service saved successfully!`);
      setIsModalOpen(false);
      fetchServices();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this service permanently?')) return;
    try {
      await api.deleteService(id);
      setSuccess('Service deleted');
      fetchServices();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete service');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Outfit']">Industrial Services</h2>
          <p className="text-xs text-slate-500">
            Manage commercial blast freezing, cold vault rental, and production capabilities.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: '',
              description: '',
              pricing_model: 'Custom Contract',
              turnaround_time: 'Immediate',
              capacity_info: '15 Tonnes',
              published: true,
              features: []
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
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
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 relative"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 font-['Outfit'] text-base">
                  {service.name}
                </h3>
                <span className="text-xs font-semibold text-cyan-700 block">
                  {service.pricing_model}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingId(service.id);
                    setFormData(service);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 text-slate-500 hover:text-cyan-600 rounded-lg hover:bg-slate-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600">{service.description}</p>

            <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div>
                <strong>Capacity:</strong> {service.capacity_info}
              </div>
              <div>
                <strong>Turnaround:</strong> {service.turnaround_time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-['Outfit'] text-base">
                {editingId ? 'Edit Service' : 'Add New Service'}
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
                <label className="block font-semibold text-slate-700 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rapid Core Blast Freezing"
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pricing Model</label>
                  <input
                    type="text"
                    value={formData.pricing_model || ''}
                    onChange={(e) => setFormData({ ...formData, pricing_model: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Capacity Info</label>
                  <input
                    type="text"
                    value={formData.capacity_info || ''}
                    onChange={(e) => setFormData({ ...formData, capacity_info: e.target.value })}
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
