import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTeam } from '../context/TeamContext';
import { useTheme } from '../context/ThemeContext';
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
  Sun,
  Moon,
} from 'lucide-react';

export default function Sidebar({ onOpenMemberModal, onOpenTeamModal }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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

  const isLight = theme === 'light';

  return (
    <div className={`w-64 h-screen border-r flex flex-col justify-between shrink-0 select-none transition-colors ${
      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#080808]/95 border-white/10 text-white'
    }`}>
      <div>
        {/* Workspace Brand / Team Selector */}
        <div className={`p-4 border-b relative ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-600/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className={`font-bold text-base tracking-tight leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  SyncCore
                </h1>
                <span className="text-[10px] text-emerald-500 font-medium tracking-wide uppercase">
                  Enterprise Platform
                </span>
              </div>
            </div>
          </div>

          {/* Active Team Dropdown Button */}
          <div className="mt-3 relative">
            <button
              onClick={() => setShowTeamDropdown(!showTeamDropdown)}
              className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-semibold border transition-all ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200' : 'bg-[#121212] hover:bg-[#181818] text-slate-200 border-white/10'
              }`}
            >
              <span className="truncate">{activeTeam?.name || 'Select Team'}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showTeamDropdown && (
              <div className={`absolute top-full left-0 w-full mt-1 border rounded-xl shadow-2xl z-50 p-1 ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#0D0D0D] border-white/10'
              }`}>
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
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-medium'
                          : isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:bg-[#181818]'
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
                  className={`w-full text-left px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center gap-1.5 font-medium border-t mt-1 ${
                    isLight ? 'border-slate-100 hover:bg-emerald-50' : 'border-white/5 hover:bg-emerald-950/40'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create New Workspace
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`px-3 py-3 space-y-1 border-b ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
          <button
            onClick={() => {
              setActiveTab('chat');
              setActiveDmUser(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'chat' && !activeDmUser
                ? isLight ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200' : 'bg-[#181818] text-emerald-400 border border-emerald-500/30 shadow-inner'
                : isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-[#121212] hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Team Channels</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'tasks'
                ? isLight ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200' : 'bg-[#181818] text-emerald-400 border border-emerald-500/30 shadow-inner'
                : isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-[#121212] hover:text-slate-200'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Kanban Board</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'analytics'
                ? isLight ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200' : 'bg-[#181818] text-emerald-400 border border-emerald-500/30 shadow-inner'
                : isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-[#121212] hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Performance Metrics</span>
          </button>
        </div>

        {/* Public Channels */}
        <div className="px-3 py-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
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
                  ? 'text-emerald-500 font-semibold bg-emerald-500/10'
                  : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-[#121212]'
              }`}
            >
              <Hash className="w-3.5 h-3.5 text-emerald-500" />
              <span>general</span>
            </button>
          </div>
        </div>

        {/* Direct Messages (1-on-1 DMs) */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
            <span>Direct Messages</span>
            <button
              onClick={onOpenMemberModal}
              title="Add Member to Team"
              className="text-slate-400 hover:text-emerald-500 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {dmMembers.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic px-2 py-1">
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
                        ? isLight ? 'bg-emerald-100 text-emerald-800 font-medium' : 'bg-[#181818] text-emerald-300 font-medium border border-emerald-500/20'
                        : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-[#121212]'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0"
                      style={{ backgroundColor: m.user?.avatarColor || '#10b981' }}
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

      {/* User Profile Pill, Theme Toggle & Logout */}
      <div className={`p-3 border-t flex items-center justify-between ${
        isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-[#0A0A0A]'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow"
            style={{ backgroundColor: user?.avatarColor || '#10b981' }}
          >
            {user?.name?.[0] || 'U'}
          </div>
          <div className="truncate">
            <p className={`text-xs font-semibold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{user?.name}</p>
            <p className="text-[10px] text-emerald-500 truncate">@{user?.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            title={isLight ? 'Switch to Pitch Black Dark Mode' : 'Switch to Light Mode'}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight ? 'text-amber-600 hover:bg-amber-100' : 'text-amber-400 hover:bg-amber-400/10'
            }`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

