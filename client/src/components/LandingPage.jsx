import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  MessageSquare,
  BarChart3,
  Kanban,
  Zap,
  Globe,
  Shield,
  Layers,
  Code2,
  Cloud,
  Lock,
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onLogin }) {
  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#0F172A] font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-[#FDFDFC]/80 backdrop-blur-md border-b border-slate-100 px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            SyncCore
          </span>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-600">
          <a href="#features" className="hover:text-emerald-700 transition-colors">
            Features
          </a>
          <a href="#testimonials" className="hover:text-emerald-700 transition-colors">
            Testimonials
          </a>
          <a href="#pricing" className="hover:text-emerald-700 transition-colors">
            Pricing
          </a>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLogin}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 transition-colors"
          >
            Log in
          </button>
          <button
            onClick={onGetStarted}
            className="text-xs font-semibold text-white bg-[#2E5B42] hover:bg-[#234734] px-4 py-2 rounded-lg shadow-sm shadow-emerald-900/10 transition-all flex items-center gap-1.5"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 max-w-6xl mx-auto text-center space-y-8 relative">
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="tracking-wide uppercase text-[10px]">SYNCCORE 2.0 IS LIVE</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Synchronize Your Team's{' '}
          <span className="text-[#2E5B42]">Potential</span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
          The ultra-fast, minimalist workspace designed for high-performance teams.
          Seamlessly integrate chat, projects, and analytics without the clutter.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onGetStarted}
            className="bg-[#2E5B42] hover:bg-[#234734] text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2 group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={onGetStarted}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold px-5 py-3 rounded-xl transition-all flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current text-slate-700" />
            <span>Watch Demo</span>
          </button>
        </div>

        {/* Hero Product UI Screenshot Mockup */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="rounded-2xl p-2 bg-gradient-to-b from-slate-200/60 to-slate-100/30 border border-slate-200/80 shadow-2xl relative overflow-hidden">
            {/* Dashboard Visual Frame */}
            <div className="bg-[#0B0F19] rounded-xl p-4 sm:p-6 text-left space-y-4 text-white shadow-inner">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                    S
                  </div>
                  <span className="text-xs font-semibold">Home Page - Q3 Planning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-slate-800 text-[10px] text-slate-400 px-3 py-1 rounded-full border border-white/5">
                    Invite Members +
                  </div>
                </div>
              </div>

              {/* Kanban Mock Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                {/* Backlog */}
                <div className="bg-slate-900/70 p-3 rounded-xl border border-white/5 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Backlog</span>
                  <div className="bg-slate-800 p-2.5 rounded-lg border border-white/5 text-xs space-y-1">
                    <p className="font-semibold text-slate-200">Onboarding Flow Update</p>
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full inline-block">Frontend</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-lg border border-white/5 text-xs space-y-1">
                    <p className="font-semibold text-slate-200">API Integration Test</p>
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full inline-block">Backend</span>
                  </div>
                </div>

                {/* To Do */}
                <div className="bg-slate-900/70 p-3 rounded-xl border border-white/5 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">To Do</span>
                  <div className="bg-slate-800 p-2.5 rounded-lg border border-white/5 text-xs space-y-1">
                    <p className="font-semibold text-slate-200">API Integration Test</p>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full inline-block">Medium Priority</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-lg border border-white/5 text-xs space-y-1">
                    <p className="font-semibold text-slate-200">UI Styleguide Revamp</p>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full inline-block">Design</span>
                  </div>
                </div>

                {/* In Progress */}
                <div className="bg-slate-900/70 p-3 rounded-xl border border-white/5 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">In Progress</span>
                  <div className="bg-slate-800 p-2.5 rounded-lg border border-white/5 text-xs space-y-1">
                    <p className="font-semibold text-slate-200">Marketing Campaign</p>
                    <span className="text-[9px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full inline-block">Urgent</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-lg border border-white/5 text-xs space-y-1">
                    <p className="font-semibold text-slate-200">Database Optimization</p>
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full inline-block">Backend</span>
                  </div>
                </div>

                {/* Performance Metrics Panel */}
                <div className="bg-slate-900/70 p-3 rounded-xl border border-white/5 space-y-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Performance Metrics</span>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400">Sprint Progress</p>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-3/4" />
                    </div>
                  </div>
                  <div className="space-y-1 pt-1">
                    <p className="text-[10px] text-slate-400">Team Productivity</p>
                    <p className="text-xl font-bold text-emerald-400">94.8%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Logos */}
      <section className="py-10 bg-slate-50/80 border-y border-slate-100 text-center">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-6">
          TRUSTED BY INNOVATIVE TEAMS WORLDWIDE
        </p>
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 md:gap-16 font-semibold text-slate-400 text-sm tracking-wide">
          <span>AcmeCorp</span>
          <span className="italic font-serif">GlobalTech</span>
          <span className="tracking-widest uppercase">NEXUS</span>
          <span className="flex items-center gap-1">◇ DataFlow</span>
          <span className="font-serif">Vanguard</span>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Everything you need. Nothing you don't.
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
            We stripped away the noise so your team can focus on what matters: shipping great work.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Contextual Chat */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Contextual Chat</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Keep discussions organized by project or team. Threaded replies and deep integrations mean you never lose track of a decision.
              </p>
            </div>
          </div>

          {/* Card 2: Velocity Insights */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Velocity Insights</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time metrics on team throughput and project health computed natively via MongoDB pipelines.
              </p>
            </div>
            {/* Visual Bar Chart Graphic */}
            <div className="h-16 flex items-end gap-2 pt-2">
              <div className="w-1/4 h-1/2 bg-emerald-300 rounded-t-md" />
              <div className="w-1/4 h-3/4 bg-emerald-400 rounded-t-md" />
              <div className="w-1/4 h-2/3 bg-emerald-300 rounded-t-md" />
              <div className="w-1/4 h-full bg-emerald-600 rounded-t-md" />
            </div>
          </div>

          {/* Card 3: Agile Boards */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
              <Kanban className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Agile Boards</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drag, drop, and deploy. Powerful boards with custom priority tags that adapt to your workflow.
              </p>
            </div>
          </div>

          {/* Card 4: Connect Everything */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Connect Everything</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                SyncCore plays nice with your existing stack. GitHub, Figma, Slack—bring it all into one unified command center.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                <Cloud className="w-4 h-4" />
              </div>
              <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                <Lock className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-[#FDFDFC] py-8 px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center text-white font-bold text-[10px]">
            S
          </div>
          <span className="font-bold text-slate-900">SyncCore</span>
        </div>

        <div className="flex items-center gap-6 text-[11px]">
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
        </div>

        <p className="text-[11px]">© 2026 SyncCore Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
