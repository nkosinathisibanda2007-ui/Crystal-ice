import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Check, X, RefreshCw, AlertCircle, Trash2 } from 'lucide-react';
import { AdminUser, SystemRole } from '../../../types/index.ts';
import { api } from '../../../services/api.ts';

interface UsersTabProps {
  currentUser: AdminUser;
}

export const UsersTab: React.FC<UsersTabProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // New user form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff' as SystemRole
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.createAdminUser(formData);
      setSuccess(`User ${formData.name} created successfully!`);
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', role: 'staff' });
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    }
  };

  const handleRoleChange = async (userId: string, newRole: SystemRole) => {
    setError(null);
    try {
      await api.updateUserRole(userId, newRole);
      setSuccess(`Role updated to ${newRole}`);
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
    }
  };

  const handleToggleActive = async (userId: string) => {
    if (userId === currentUser.id) {
      setError('You cannot deactivate your own account.');
      return;
    }
    setError(null);
    try {
      await api.toggleUserActive(userId);
      setSuccess('User status updated');
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-600" />
            System Roles & User Management
          </h2>
          <p className="text-xs text-slate-500">
            Control access across Admin, Operations Staff, and Content Editors with role-based authorization.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add System User</span>
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
              <th className="p-3.5">Name</th>
              <th className="p-3.5">Email / Username</th>
              <th className="p-3.5">System Role</th>
              <th className="p-3.5">Account Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => {
              const isSelf = u.id === currentUser.id;
              return (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{u.name}</span>
                      {isSelf && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-100 text-cyan-800 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">{u.email}</td>
                  <td className="p-3.5">
                    <select
                      value={u.role}
                      disabled={isSelf}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as SystemRole)}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="admin">Admin (Full Access)</option>
                      <option value="staff">Staff (Orders, Quotes, Dispatch)</option>
                      <option value="editor">Editor (Catalog & Content)</option>
                    </select>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        u.active !== false
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {u.active !== false ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      disabled={isSelf}
                      onClick={() => handleToggleActive(u.id)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 disabled:text-slate-300 transition-colors"
                    >
                      {u.active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-['Outfit'] text-base">
                Create System User
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Takudzwa Moyo"
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email / Username</label>
                <input
                  type="text"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. tmoyo@crystalice.co.zw"
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as SystemRole })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                >
                  <option value="admin">Administrator (Complete access + user management)</option>
                  <option value="staff">Staff (Orders, Quotes, Dispatch execution)</option>
                  <option value="editor">Editor (Product Catalog & Website Content)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
