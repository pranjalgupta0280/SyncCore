import React, { useState } from 'react';
import { useTeam } from '../context/TeamContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { UserPlus, Trash2, X, Shield, ShieldAlert, Check } from 'lucide-react';

export default function MemberModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { activeTeam, fetchTeams } = useTeam();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Member');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !activeTeam) return null;

  const members = activeTeam.members || [];
  const isAdmin =
    activeTeam.admin?._id === user?._id ||
    members.some((m) => m.user?._id === user?._id && m.role === 'Admin');

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await API.post(`/teams/${activeTeam._id}/members`, {
        username: username.trim(),
        role,
      });

      if (res.data.success) {
        setSuccessMsg(`User @${username.trim()} added successfully!`);
        setUsername('');
        await fetchTeams();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to add member to team');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (targetUserId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      const res = await API.delete(`/teams/${activeTeam._id}/members/${targetUserId}`);
      if (res.data.success) {
        await fetchTeams();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Team Member Management</h3>
            <p className="text-xs text-slate-400">
              Workspace: <strong className="text-indigo-400">{activeTeam.name}</strong>
            </p>
          </div>
        </div>

        {/* Add Member Form (Admin Only) */}
        {isAdmin ? (
          <form onSubmit={handleAddMember} className="space-y-3 bg-slate-950/60 border border-white/5 p-4 rounded-xl">
            <h4 className="text-xs font-semibold text-slate-200">Invite Colleague by Handle/ID</h4>

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg">
                {errorMsg}
              </p>
            )}

            {successMsg && (
              <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
                {successMsg}
              </p>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter handle e.g. alex_dev"
                className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors disabled:opacity-50"
              >
                Add Member
              </button>
            </div>
          </form>
        ) : (
          <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
            You have Member access. Only Team Admins can invite or remove colleagues.
          </p>
        )}

        {/* Member List */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Workspace Members ({members.length})
          </h4>

          <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
            {members.map((m) => {
              const isCreator = activeTeam.admin?._id === m.user?._id;
              return (
                <div
                  key={m.user?._id}
                  className="flex items-center justify-between bg-slate-800/50 border border-white/5 px-3 py-2 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase"
                      style={{ backgroundColor: m.user?.avatarColor || '#6366f1' }}
                    >
                      {m.user?.name?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{m.user?.name}</p>
                      <p className="text-[10px] text-indigo-400">@{m.user?.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                      {m.role}
                    </span>

                    {isAdmin && !isCreator && m.user?._id !== user?._id && (
                      <button
                        onClick={() => handleRemoveMember(m.user?._id)}
                        className="text-slate-400 hover:text-rose-400 p-1"
                        title="Remove Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
