import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, AlertCircle, MapPin } from 'lucide-react';
import { DeliveryArea } from '../../../types/index.ts';
import { api } from '../../../services/api.ts';

export const DeliveryAreasTab: React.FC = () => {
  const [areas, setAreas] = useState<DeliveryArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DeliveryArea>>({
    name: '',
    tier: 'Inner Metro',
    min_order_bags: 10,
    delivery_fee: 5,
    cutoff_time: '14:00',
    active: true
  });

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminDeliveryAreas();
      setAreas(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch delivery areas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.saveDeliveryArea(formData);
      setSuccess('Delivery area saved successfully!');
      setIsModalOpen(false);
      fetchAreas();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save delivery area');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteDeliveryArea(id);
      setSuccess('Area deleted');
      fetchAreas();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete area');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-600" />
            Harare Delivery Zones & Logistics
          </h2>
          <p className="text-xs text-slate-500">
            Configure delivery coverage, dispatch fees, minimum bag thresholds, and cutoff times.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: '',
              tier: 'Outer Metro',
              min_order_bags: 15,
              delivery_fee: 10,
              cutoff_time: '12:00',
              active: true
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Area</span>
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

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Zone Name</th>
              <th className="p-3.5">Tier</th>
              <th className="p-3.5">Min Bags</th>
              <th className="p-3.5">Delivery Fee</th>
              <th className="p-3.5">Same-Day Cutoff</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {areas.map((area) => (
              <tr key={area.id} className="hover:bg-slate-50/50">
                <td className="p-3.5 font-bold text-slate-900">{area.name}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {area.tier}
                  </span>
                </td>
                <td className="p-3.5">{area.min_order_bags} bags</td>
                <td className="p-3.5 font-bold text-cyan-700">${area.delivery_fee}</td>
                <td className="p-3.5 font-mono">{area.cutoff_time}</td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      area.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {area.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditingId(area.id);
                        setFormData(area);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-cyan-600 rounded-lg hover:bg-slate-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(area.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-['Outfit'] text-base">
                {editingId ? 'Edit Delivery Area' : 'Add Delivery Area'}
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
                <label className="block font-semibold text-slate-700 mb-1">Area / Suburb Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Waterfalls, Harare CBD, Borrowdale"
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tier</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                  >
                    <option value="Inner Metro">Inner Metro</option>
                    <option value="Outer Metro">Outer Metro</option>
                    <option value="Express Corridor">Express Corridor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Order Bags</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.min_order_bags || 10}
                    onChange={(e) =>
                      setFormData({ ...formData, min_order_bags: parseInt(e.target.value) || 1 })
                    }
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Delivery Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.delivery_fee ?? 5}
                    onChange={(e) =>
                      setFormData({ ...formData, delivery_fee: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Same-Day Cutoff</label>
                  <input
                    type="text"
                    value={formData.cutoff_time || '14:00'}
                    onChange={(e) => setFormData({ ...formData, cutoff_time: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="area-active-check"
                  checked={formData.active !== false}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="area-active-check" className="font-semibold text-slate-700">
                  Active for Dispatch
                </label>
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
                  Save Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
