import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTeam } from '../context/TeamContext';
import {
  Hash,
  MessageSquare,
  Kanban,
  BarChart3,
  UserPlus,
  Plus,
  LogOut,
  Users,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({ onOpenMemberModal, onOpenTeamModal }) {
  const { user, logout } = useAuth();
  const {
    teams,
    activeTeam,
    setActiveTeam,
    activeTab,
    setActiveTab,
    activeDmUser,
    setActiveDmUser,
  } = useTeam();

  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  const teamMembers = activeTeam?.members || [];
  // Filter out self for DM list
  const dmMembers = teamMembers.filter(
    (m) => m.user?._id?.toString() !== user?._id?.toString()
  );

  return (
    <div className="w-64 h-screen bg-[#0B0F19]/90 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Workspace Brand / Team Selector */}
        <div className="p-4 border-b border-white/10 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-white text-base tracking-tight leading-none">
                  SyncCore
                </h1>
                <span className="text-[10px] text-indigo-400 font-medium tracking-wide uppercase">
                  Enterprise Platform
                </span>
              </div>
            </div>
          </div>

          {/* Active Team Dropdown Button */}
          <div className="mt-3 relative">
            <button
              onClick={() => setShowTeamDropdown(!showTeamDropdown)}
              className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-200 px-3 py-2 rounded-xl flex items-center justify-between text-xs font-semibold border border-white/5 transition-all"
            >
              <span className="truncate">{activeTeam?.name || 'Select Team'}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showTeamDropdown && (
              <div className="absolute top-full left-0 w-full mt-1 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 p-1">
                <div className="max-h-40 overflow-y-auto space-y-0.5">
                  {teams.map((t) => (
                    <button
                      key={t._id}
                      onClick={() => {
                        setActiveTeam(t);
                        setShowTeamDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg truncate transition-colors ${
                        activeTeam?._id === t._id
                          ? 'bg-indigo-600/30 text-indigo-300 font-medium'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setShowTeamDropdown(false);
                    onOpenTeamModal();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-indigo-400 hover:bg-indigo-950/40 rounded-lg flex items-center gap-1.5 font-medium border-t border-white/5 mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create New Workspace
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-3 py-3 space-y-1 border-b border-white/5">
          <button
            onClick={() => {
              setActiveTab('chat');
              setActiveDmUser(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'chat' && !activeDmUser
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Team Channels</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'tasks'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Kanban Board</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Performance Metrics</span>
          </button>
        </div>

        {/* Public Channels */}
        <div className="px-3 py-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
            <span>Channels</span>
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setActiveTab('chat');
                setActiveDmUser(null);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                activeTab === 'chat' && !activeDmUser
                  ? 'text-indigo-400 font-semibold bg-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <Hash className="w-3.5 h-3.5 text-indigo-400" />
              <span>general</span>
            </button>
          </div>
        </div>

        {/* Direct Messages (1-on-1 DMs) */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
            <span>Direct Messages</span>
            <button
              onClick={onOpenMemberModal}
              title="Add Member to Team"
              className="text-slate-400 hover:text-indigo-400 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {dmMembers.length === 0 ? (
              <p className="text-[11px] text-slate-600 italic px-2 py-1">
                No colleagues added yet.
              </p>
            ) : (
              dmMembers.map((m) => {
                const isSelected = activeDmUser?._id === m.user?._id;
                return (
                  <button
                    key={m.user?._id}
                    onClick={() => {
                      setActiveTab('chat');
                      setActiveDmUser(m.user);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      isSelected
                        ? 'bg-indigo-600/20 text-indigo-300 font-medium border border-indigo-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0"
                      style={{ backgroundColor: m.user?.avatarColor || '#6366f1' }}
                    >
                      {m.user?.name?.[0] || 'U'}
                    </div>
                    <span className="truncate">@{m.user?.username || m.user?.name}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* User Profile Pill & Logout */}
      <div className="p-3 border-t border-white/10 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow"
            style={{ backgroundColor: user?.avatarColor || '#6366f1' }}
          >
            {user?.name?.[0] || 'U'}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-indigo-400 truncate">@{user?.username}</p>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign Out"
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
