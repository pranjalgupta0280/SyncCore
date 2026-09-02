import React from 'react';
import { useTeam } from '../context/TeamContext';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Users,
  PieChart,
} from 'lucide-react';

export default function AnalyticsPanel() {
  const { activeTeam, analytics } = useTeam();

  if (!activeTeam) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
        Select a team workspace to view performance metrics.
      </div>
    );
  }

  const summary = analytics?.summary || {
    totalSubtasks: 0,
    completedSubtasks: 0,
    inProgressSubtasks: 0,
    todoSubtasks: 0,
    overdueSubtasks: 0,
    completionRate: 0,
  };

  const memberWorkload = analytics?.memberWorkload || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0F19] overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <span>Team Performance & Workload Analytics</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time efficiency metrics powered by MongoDB Aggregation Pipelines
          </p>
        </div>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Card 1: Completion Rate */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Completion Rate
            </p>
            <p className="text-2xl font-black text-white">
              {Math.round(summary.completionRate || 0)}%
            </p>
            <p className="text-[10px] text-slate-500">
              {summary.completedSubtasks} of {summary.totalSubtasks} tasks done
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Completed */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Completed Tasks
            </p>
            <p className="text-2xl font-black text-emerald-400">
              {summary.completedSubtasks}
            </p>
            <p className="text-[10px] text-slate-500">Successfully finalized</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              In Progress
            </p>
            <p className="text-2xl font-black text-amber-400">
              {summary.inProgressSubtasks}
            </p>
            <p className="text-[10px] text-slate-500">Active development</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <PieChart className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Overdue Subtasks */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Overdue Tasks
            </p>
            <p className="text-2xl font-black text-rose-400">
              {summary.overdueSubtasks}
            </p>
            <p className="text-[10px] text-slate-500">Passed deadline</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Member Workload Distribution Table */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Member Workload & Efficiency Distribution</span>
          </h3>
          <span className="text-xs text-slate-400">
            {memberWorkload.length} Active Assigned Members
          </span>
        </div>

        {memberWorkload.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No member workload data computed yet. Assign subtasks in the Kanban board to track individual efficiency!
          </div>
        ) : (
          <div className="space-y-3">
            {memberWorkload.map((mw) => (
              <div
                key={mw.userId}
                className="bg-slate-800/50 border border-white/5 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase"
                      style={{ backgroundColor: mw.avatarColor || '#6366f1' }}
                    >
                      {mw.name?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{mw.name}</p>
                      <p className="text-[10px] text-indigo-400">@{mw.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-slate-300">
                      Assigned: <strong className="text-white">{mw.totalAssigned}</strong>
                    </span>
                    <span className="text-emerald-400">
                      Done: <strong>{mw.completed}</strong>
                    </span>
                    <span className="text-rose-400">
                      Overdue: <strong>{mw.overdue}</strong>
                    </span>
                    <span className="font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                      {Math.round(mw.completionPercentage || 0)}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, mw.completionPercentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
