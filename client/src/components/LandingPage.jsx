import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  MessageSquare,
  BarChart3,
  Kanban,
  Zap,
  Shield,
  Layers,
  Code2,
  Database,
  Network,
  Cpu,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lock,
  ChevronRight,
  Users,
  Key,
  Activity,
  Terminal
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onLogin }) {
  const [activeTab, setActiveTab] = useState('features'); // 'features' | 'admin-user' | 'architecture' | 'uniqueness'
  const [activeRole, setActiveRole] = useState('admin'); // 'admin' | 'user'
  const [activeFlowchart, setActiveFlowchart] = useState('auth'); // 'auth' | 'rbac' | 'mongo'

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0A0D14]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('features')}>
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              SyncCore <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">v2.0</span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('features')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'features' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'hover:text-white hover:bg-white/5'
            }`}
          >
            Features & Showcase
          </button>
          <button
            onClick={() => setActiveTab('admin-user')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'admin-user' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'hover:text-white hover:bg-white/5'
            }`}
          >
            Admin vs User Guide
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'architecture' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'hover:text-white hover:bg-white/5'
            }`}
          >
            Technical & Flowcharts
          </button>
          <button
            onClick={() => setActiveTab('uniqueness')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'uniqueness' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'hover:text-white hover:bg-white/5'
            }`}
          >
            Why SyncCore?
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onLogin}
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
          >
            Log in
          </button>
          <button
            onClick={onGetStarted}
            className="text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-4 py-2 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 font-bold"
          >
            Launch App
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative pt-12 pb-14 px-6 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wide uppercase text-[10px] font-bold">Real-Time Team Platform & Architecture Portal</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Real-Time Team Workspace & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Interactive Architecture Guide
          </span>
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          SyncCore combines Socket.io instant messaging, multi-member Kanban task delegation, pitch-black glassmorphic UI, and live MongoDB aggregation pipelines into an ultra-fast collaborative platform.
        </p>

        {/* Quick Tab Switcher Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('features')}
            className={`text-xs px-4 py-2 rounded-xl border transition-all ${
              activeTab === 'features'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Features & Live Preview
          </button>
          <button
            onClick={() => setActiveTab('admin-user')}
            className={`text-xs px-4 py-2 rounded-xl border transition-all ${
              activeTab === 'admin-user'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            🛡️ Admin vs User Guide
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`text-xs px-4 py-2 rounded-xl border transition-all ${
              activeTab === 'architecture'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            📐 System Flowcharts & Tech
          </button>
          <button
            onClick={() => setActiveTab('uniqueness')}
            className={`text-xs px-4 py-2 rounded-xl border transition-all ${
              activeTab === 'uniqueness'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            💎 Uniqueness & Value
          </button>
        </div>
      </header>

      {/* Main Tab Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {/* TAB 1: FEATURES & SHOWCASE */}
        {activeTab === 'features' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Visual Live Interactive Showcase */}
            <div className="bg-[#0B0F17] rounded-2xl border border-white/10 p-5 sm:p-7 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Live Workspace Showcase</h2>
                    <p className="text-[11px] text-slate-400">Real-time socket sync & multi-collaborator board</p>
                  </div>
                </div>
                <button
                  onClick={onGetStarted}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition-all"
                >
                  Enter Workspace
                </button>
              </div>

              {/* Mock Dashboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Real-time Chat Mock */}
                <div className="bg-[#121824] rounded-xl border border-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> #general channel
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">LIVE SOCKET</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <span className="font-bold text-emerald-400">@alex_admin:</span>
                      <p className="text-slate-300">Pushed the MongoDB aggregation pipeline fixes!</p>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <span className="font-bold text-cyan-400">@dev_sarah:</span>
                      <p className="text-slate-300">Awesome! Verification tests passed with 100% status update guards.</p>
                    </div>
                  </div>
                </div>

                {/* Multi-Member Kanban Mock */}
                <div className="bg-[#121824] rounded-xl border border-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Kanban className="w-3.5 h-3.5 text-amber-400" /> Task Delegation
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">RBAC GUARD</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1.5 text-[11px]">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>Auth Handshake Refactor</span>
                      <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded">Urgent</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Primary: @alex_admin</p>
                    <div className="flex items-center gap-1 pt-1">
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded">+ @dev_sarah</span>
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 rounded">+ @tech_lead</span>
                    </div>
                  </div>
                </div>

                {/* MongoDB Aggregation Analytics Mock */}
                <div className="bg-[#121824] rounded-xl border border-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-cyan-400" /> Live Analytics
                    </span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono">MONGO PIPELINE</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Workspace Completion:</span>
                      <span className="font-bold text-emerald-400">92.4%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[92%]" />
                    </div>
                    <p className="text-[10px] text-slate-400 pt-1">Computed via Mongo `$project` & `$divide` stages.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-[#0D111A] p-5 rounded-xl border border-white/10 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Real-Time Channels & DMs</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sub-50ms Socket.io WebSocket rooms for team `#general` channels and private 1-on-1 direct messaging.
                </p>
              </div>

              <div className="bg-[#0D111A] p-5 rounded-xl border border-white/10 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Kanban className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Kanban Subtask Board</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Organize subtasks with priority tags (Low, Medium, High, Urgent), deadlines, and single primary assignee + collaborator list.
                </p>
              </div>

              <div className="bg-[#0D111A] p-5 rounded-xl border border-white/10 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Strict RBAC Guards</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Only Admins can create tasks. Only assigned members or Admins can update status, keeping project data secure.
                </p>
              </div>

              <div className="bg-[#0D111A] p-5 rounded-xl border border-white/10 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Database className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Database Aggregation Metrics</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Native MongoDB Atlas aggregation pipelines calculate team velocity, member workload, and completion rates in real time.
                </p>
              </div>

              <div className="bg-[#0D111A] p-5 rounded-xl border border-white/10 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Base64 Image Lightbox</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instant inline canvas compressed image sharing with click-to-zoom Lightbox modal preview.
                </p>
              </div>

              <div className="bg-[#0D111A] p-5 rounded-xl border border-white/10 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Pitch-Black Glassmorphism</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Engineered with `#050505` obsidian backdrop, neon emerald highlights, and zero non-essential UI overhead.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADMIN VS USER WORKFLOW GUIDE */}
        {activeTab === 'admin-user' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Role Switcher */}
            <div className="flex items-center justify-center gap-3 bg-[#0D111A] p-2 rounded-xl border border-white/10 max-w-md mx-auto">
              <button
                onClick={() => setActiveRole('admin')}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeRole === 'admin'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Team Admin Workflow
              </button>
              <button
                onClick={() => setActiveRole('user')}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeRole === 'user'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" /> Team Member / User Guide
              </button>
            </div>

            {/* Role Content Card */}
            {activeRole === 'admin' ? (
              <div className="bg-[#0B0F17] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Administrator Capabilities & Guide</h2>
                    <p className="text-xs text-slate-400">Workspace governance, member management & task creation</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-[#121824] p-4 rounded-xl border border-white/5 space-y-2">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <ChevronRight className="w-4 h-4" /> 1. Creating Workspace & Inviting Members
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      Admins create team workspaces and invite members directly using `@username` handles. Only admins can modify team membership or promote members.
                    </p>
                  </div>

                  <div className="bg-[#121824] p-4 rounded-xl border border-white/5 space-y-2">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <ChevronRight className="w-4 h-4" /> 2. Creating Projects & Subtasks
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      Admins create projects and subtasks, defining title, priority, deadline, single primary assignee, and multiple collaborating team members.
                    </p>
                  </div>

                  <div className="bg-[#121824] p-4 rounded-xl border border-white/5 space-y-2">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <ChevronRight className="w-4 h-4" /> 3. Full Task Override Rights
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      Admins have global permission to alter task status (`To Do`, `In Progress`, `Completed`), reassign assignees, or delete outdated subtasks.
                    </p>
                  </div>

                  <div className="bg-[#121824] p-4 rounded-xl border border-white/5 space-y-2">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <ChevronRight className="w-4 h-4" /> 4. Real-time Oversight & Analytics
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      Monitor team velocity, completion ratios, and uncompleted overdue subtasks computed directly via MongoDB Atlas aggregation pipelines.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#0B0F17] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Team Member / User Capabilities & Guide</h2>
                    <p className="text-xs text-slate-400">Collaborative execution, status updates & real-time chat</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-[#121824] p-4 rounded-xl border border-white/5 space-y-2">
                    <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <ChevronRight className="w-4 h-4" /> 1. Real-Time Chat & Image Attachments
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      Chat seamlessly in `#general` or start private DMs with team members. Send compressed image attachments with Lightbox zoom previews.
                    </p>
                  </div>

                  <div className="bg-[#121824] p-4 rounded-xl border border-white/5 space-y-2">
                    <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <ChevronRight className="w-4 h-4" /> 2. Updating Assigned Subtask Status
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      If you are the Primary Assignee or listed as a Collaborator, you can transition task status from `To Do` to `In Progress` or `Completed`.
                    </p>
                  </div>

                  <div className="bg-[#121824] p-4 rounded-xl border border-white/5 space-y-2">
                    <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <ChevronRight className="w-4 h-4" /> 3. RBAC Status Protection Notice
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      If you try to edit a task you are not assigned to, SyncCore safely disables the selector and shows a clear security permission toast.
                    </p>
                  </div>

                  <div className="bg-[#121824] p-4 rounded-xl border border-white/5 space-y-2">
                    <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <ChevronRight className="w-4 h-4" /> 4. Personal Workload View
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      Track your individual efficiency rating and active subtask load directly on the workspace dashboard.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Access Rights Matrix Table */}
            <div className="bg-[#0B0F17] rounded-xl border border-white/10 p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Role Permission Access Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="py-2.5 px-4 font-semibold">Action / Capability</th>
                      <th className="py-2.5 px-4 font-semibold text-emerald-400">Admin Role</th>
                      <th className="py-2.5 px-4 font-semibold text-cyan-400">Assignee / Collaborator</th>
                      <th className="py-2.5 px-4 font-semibold text-rose-400">Unassigned Member</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    <tr>
                      <td className="py-2.5 px-4">Create Projects & Tasks</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">✓ Allowed</td>
                      <td className="py-2.5 px-4 text-rose-400 font-semibold">✗ Forbidden</td>
                      <td className="py-2.5 px-4 text-rose-400 font-semibold">✗ Forbidden</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">Invite Member by Handle (@user)</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">✓ Allowed</td>
                      <td className="py-2.5 px-4 text-rose-400 font-semibold">✗ Forbidden</td>
                      <td className="py-2.5 px-4 text-rose-400 font-semibold">✗ Forbidden</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">Update Subtask Status</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">✓ Allowed</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">✓ Allowed</td>
                      <td className="py-2.5 px-4 text-rose-400 font-semibold">✗ Restricted</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">Real-Time Messaging & Attachments</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">✓ Allowed</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">✓ Allowed</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">✓ Allowed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TECHNICAL ARCHITECTURE & FLOWCHARTS */}
        {activeTab === 'architecture' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Tech Stack Header */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#0B0F17] p-4 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Frontend Engine</span>
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5"><Code2 className="w-4 h-4" /> React 18 + Vite</p>
              </div>
              <div className="bg-[#0B0F17] p-4 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Backend Runtime</span>
                <p className="text-xs font-bold text-cyan-400 flex items-center gap-1.5"><Cpu className="w-4 h-4" /> Node.js + Express 5</p>
              </div>
              <div className="bg-[#0B0F17] p-4 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Real-time Sockets</span>
                <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5"><Network className="w-4 h-4" /> Socket.io v4</p>
              </div>
              <div className="bg-[#0B0F17] p-4 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Database & Metrics</span>
                <p className="text-xs font-bold text-indigo-400 flex items-center gap-1.5"><Database className="w-4 h-4" /> MongoDB Atlas</p>
              </div>
            </div>

            {/* Interactive Flowchart Selector */}
            <div className="bg-[#0B0F17] rounded-2xl border border-white/10 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">System Flowcharts & Logic Diagrams</h2>
                    <p className="text-[11px] text-slate-400">Interactive architectural flow diagram visualizer</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/10 text-xs">
                  <button
                    onClick={() => setActiveFlowchart('auth')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                      activeFlowchart === 'auth' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    1. Socket & Auth
                  </button>
                  <button
                    onClick={() => setActiveFlowchart('rbac')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                      activeFlowchart === 'rbac' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    2. Task RBAC Guard
                  </button>
                  <button
                    onClick={() => setActiveFlowchart('mongo')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                      activeFlowchart === 'mongo' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    3. Mongo Aggregation
                  </button>
                </div>
              </div>

              {/* Diagram Render Card */}
              {activeFlowchart === 'auth' && (
                <div className="bg-[#05070D] p-5 rounded-xl border border-white/10 space-y-4 font-mono text-xs text-slate-300 overflow-x-auto">
                  <div className="text-emerald-400 font-bold pb-1">[ FLOWCHART 1: AUTHENTICATION & SOCKET HANDSHAKE ]</div>
                  <pre className="text-[11px] leading-relaxed text-emerald-300/90 whitespace-pre">
{` [ Client User ]                [ Server Express ]               [ Socket.io Server ]
        |                               |                                |
        |--- 1. POST /api/auth/login -->|                                |
        |    (Email & Password)         |                                |
        |                               |-- Verify Bcrypt Hash           |
        |<-- 2. Return JWT Token -------|                                |
        |                                                                |
        |--- 3. Connect Socket with auth.token ------------------------->|
        |                                                                |-- Verify JWT Token
        |                                                                |-- Join User Room (user._id)
        |<-- 4. Socket Connected ("authenticated") ----------------------|`}
                  </pre>
                </div>
              )}

              {activeFlowchart === 'rbac' && (
                <div className="bg-[#05070D] p-5 rounded-xl border border-white/10 space-y-4 font-mono text-xs text-slate-300 overflow-x-auto">
                  <div className="text-cyan-400 font-bold pb-1">[ FLOWCHART 2: TASK RBAC PERMISSION GUARD ]</div>
                  <pre className="text-[11px] leading-relaxed text-cyan-300/90 whitespace-pre">
{` User attempts to PATCH /api/projects/:projectId/subtasks/:subtaskId
                               |
                               v
                     [ Fetch Subtask & Team ]
                               |
                               v
              Is User Workspace Admin OR Primary Assignee OR Collaborator?
                               |
                   +-----------+-----------+
                   |                       |
                  YES                      NO
                   |                       |
                   v                       v
         [ Update Subtask Status ]    [ Return 403 Forbidden ]
         [ Emit WebSocket Event ]     [ Show Permission Toast ]
         [ Return 200 OK Success ]`}
                  </pre>
                </div>
              )}

              {activeFlowchart === 'mongo' && (
                <div className="bg-[#05070D] p-5 rounded-xl border border-white/10 space-y-4 font-mono text-xs text-slate-300 overflow-x-auto">
                  <div className="text-amber-400 font-bold pb-1">[ FLOWCHART 3: MONGO DB AGGREGATION ANALYTICS PIPELINE ]</div>
                  <pre className="text-[11px] leading-relaxed text-amber-300/90 whitespace-pre">
{` [ GET /api/analytics/teams/:teamId/stats ]
                      |
                      v
       +---------------------------------------------+
       | Pipeline Stage 1: $match team projects      |
       +----------------------+----------------------+
                              |
                              v
       +---------------------------------------------+
       | Pipeline Stage 2: $unwind subtasks array   |
       +----------------------+----------------------+
                              |
                              v
       +---------------------------------------------+
       | Pipeline Stage 3: $group & compute metrics  |
       | - Completion Rate ($cond completed / total) |
       | - Member Workload ($setUnion assignee/collab)|
       +----------------------+----------------------+
                              |
                              v
                [ Return JSON Analytics Stats ]`}
                  </pre>
                </div>
              )}
            </div>

            {/* Note about TXT file */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-emerald-300">Complete Flowcharts & Documentation File Available</p>
                  <p className="text-slate-400 text-[11px]">The complete technical breakdown is also saved in `PROJECT_EXPLANATION_AND_FLOWCHARTS.txt` in the root repository.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WHY SYNCORE IS UNIQUE */}
        {activeTab === 'uniqueness' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-[#0B0F17] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Why SyncCore is Unique & Strategic</h2>
                  <p className="text-xs text-slate-400">Key differentiators separating SyncCore from generic task tools</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="bg-[#121824] p-5 rounded-xl border border-white/5 space-y-2">
                  <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Pitch-Black Speed & Zero Clutter
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Designed from the ground up for high-velocity developer teams. Pitch-black obsidian aesthetic (`#050505`) eliminates distraction while keeping UI performance ultra-smooth.
                  </p>
                </div>

                <div className="bg-[#121824] p-5 rounded-xl border border-white/5 space-y-2">
                  <h3 className="font-bold text-cyan-400 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" /> Multi-Member Collaborative Subtasks
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Unlike standard tools limited to a single assignee, SyncCore supports one primary owner alongside multiple active team collaborators on every subtask.
                  </p>
                </div>

                <div className="bg-[#121824] p-5 rounded-xl border border-white/5 space-y-2">
                  <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                    <Database className="w-4 h-4" /> DB-Native Pipeline Analytics
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Analytics are computed directly inside MongoDB Atlas using optimized aggregation pipelines (`$match`, `$unwind`, `$group`), avoiding heavy server memory overhead.
                  </p>
                </div>

                <div className="bg-[#121824] p-5 rounded-xl border border-white/5 space-y-2">
                  <h3 className="font-bold text-rose-400 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Enforced RBAC Data Integrity
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Strict role-based backend authorization guards guarantee that only workspace Admins and assigned team members can modify task execution states.
                  </p>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button
                  onClick={onGetStarted}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 text-xs transition-all inline-flex items-center gap-2"
                >
                  Start Using SyncCore Workspace
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070A10] py-8 px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-[10px]">
            S
          </div>
          <span className="font-bold text-white">SyncCore</span>
          <span className="text-[10px] text-slate-500 font-mono">v2.0 Platform</span>
        </div>

        <div className="flex items-center gap-6 text-[11px]">
          <button onClick={() => setActiveTab('features')} className="hover:text-white transition-colors">Features</button>
          <button onClick={() => setActiveTab('admin-user')} className="hover:text-white transition-colors">Admin & User Guide</button>
          <button onClick={() => setActiveTab('architecture')} className="hover:text-white transition-colors">Architecture & Flowcharts</button>
          <button onClick={() => setActiveTab('uniqueness')} className="hover:text-white transition-colors">Uniqueness</button>
        </div>

        <p className="text-[11px] text-slate-500">© 2026 SyncCore Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
