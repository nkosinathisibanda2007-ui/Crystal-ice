import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Check, X, RefreshCw, AlertCircle, Trash2, KeyRound, AlertTriangle, ShieldCheck } from 'lucide-react';
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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmRestartBootstrap, setConfirmRestartBootstrap] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin' as SystemRole
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminUsers();
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch administrator accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAddAdmin = (defaultRole: SystemRole = 'admin') => {
    setFormData({ name: '', email: '', password: '', role: defaultRole });
    setShowAddModal(true);
    setError(null);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);
    try {
      await api.createAdminUser(formData);
      setSuccess(`Administrator account "${formData.name}" created successfully!`);
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', role: 'admin' });
      await fetchUsers();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to create administrator account');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: SystemRole) => {
    setError(null);
    try {
      await api.updateUserRole(userId, newRole);
      setSuccess(`System role updated to ${newRole}`);
      await fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update system role');
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
      setSuccess('User status updated successfully');
      await fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to toggle status');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (userId === currentUser.id) {
      setError('You cannot delete your own account.');
      return;
    }
    setError(null);
    try {
      await api.deleteAdminUser(userId);
      setSuccess(`Administrator "${userName}" deleted successfully.`);
      setConfirmDeleteId(null);
      await fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleRestartBootstrap = async () => {
    setError(null);
    setIsProcessing(true);
    try {
      await api.restartAdminBootstrap();
      setSuccess('Admin bootstrap successfully restarted! You will now be redirected to the initial master setup.');
      setTimeout(() => {
        localStorage.removeItem('arcticpure_admin_token');
        localStorage.removeItem('arcticpure_admin_user');
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to restart admin bootstrap');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Administrators & System User Accounts
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Seamlessly add additional administrators, manage operations staff, and control permissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenAddAdmin('admin')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0265B5] hover:bg-[#005599] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Additional Admin</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2.5">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs font-bold text-slate-700">
            Active Accounts ({users.length})
          </div>
          <button
            onClick={fetchUsers}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Name</th>
              <th className="p-3.5">Email / Username</th>
              <th className="p-3.5">System Role</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => {
              const isSelf = u.id === currentUser.id;
              const isConfirmingDelete = confirmDeleteId === u.id;
              return (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{u.name}</span>
                      {isSelf && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-100 text-cyan-800 rounded-full">
                          Current Session
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
                      <option value="admin">Administrator (Full Access)</option>
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
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={isSelf}
                        onClick={() => handleToggleActive(u.id)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 disabled:text-slate-300 transition-colors px-2 py-1 rounded hover:bg-slate-100"
                      >
                        {u.active !== false ? 'Deactivate' : 'Activate'}
                      </button>

                      {!isSelf && (
                        isConfirmingDelete ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="px-2 py-1 bg-rose-600 text-white font-bold text-[11px] rounded hover:bg-rose-700"
                            >
                              Confirm Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 bg-slate-200 text-slate-700 font-bold text-[11px] rounded hover:bg-slate-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(u.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Delete Administrator"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Admin Bootstrap Restart Utility Card */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <KeyRound className="w-4 h-4 text-amber-700" />
            <span>Restart Admin Bootstrap Utility</span>
          </div>
          <p className="text-[11px] text-amber-800 mt-1 max-w-xl">
            Restarting bootstrap clears all current administrator accounts and restarts the initial master administrator onboarding screen.
          </p>
        </div>

        <div>
          {confirmRestartBootstrap ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleRestartBootstrap}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                {isProcessing ? 'Restarting...' : 'Yes, Restart Bootstrap'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmRestartBootstrap(false)}
                className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmRestartBootstrap(true)}
              className="px-3.5 py-2 bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-bold text-xs rounded-xl transition-colors"
            >
              Restart Admin Bootstrap
            </button>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 font-['Outfit'] text-base">
                  Add Administrator / Staff User
                </h3>
                <p className="text-[11px] text-slate-500">
                  Provision new system credentials directly from inside the admin panel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-100"
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
                  placeholder="e.g. Tendai Chikore"
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#0265B5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email / Username</label>
                <input
                  type="text"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. tendai@crystalice.co.zw"
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#0265B5] focus:outline-none"
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
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#0265B5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as SystemRole })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#0265B5] focus:outline-none font-semibold"
                >
                  <option value="admin">Administrator (Complete access + add/manage other admins)</option>
                  <option value="staff">Operations Staff (Orders, Quotes, Dispatch execution)</option>
                  <option value="editor">Content Editor (Product Catalog & Website Content)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 bg-[#0265B5] hover:bg-[#005599] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Creating...' : 'Create Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
