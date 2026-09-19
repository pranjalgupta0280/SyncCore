import React, { useState } from 'react';
import { useTeam } from '../context/TeamContext';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Users,
  PieChart,
  Calendar,
  Activity,
  Info,
} from 'lucide-react';

// Fallback Dummy Datasets (Used when real workspace data is empty or no team is selected)
const DUMMY_TIMELINE_DATA = [
  { time: 'Mon', completed: 4, created: 6 },
  { time: 'Tue', completed: 8, created: 7 },
  { time: 'Wed', completed: 14, created: 10 },
  { time: 'Thu', completed: 11, created: 12 },
  { time: 'Fri', completed: 19, created: 15 },
  { time: 'Sat', completed: 22, created: 18 },
  { time: 'Sun', completed: 28, created: 20 },
];

const DUMMY_MEMBER_BAR_DATA = [
  { name: 'Alex Rivera', assigned: 12, completed: 10, color: '#10b981' },
  { name: 'Sarah Chen', assigned: 15, completed: 14, color: '#6366f1' },
  { name: 'David Kim', assigned: 9, completed: 7, color: '#f59e0b' },
  { name: 'Elena Rostova', assigned: 14, completed: 12, color: '#ec4899' },
];

const DUMMY_WEEKLY_DATA = [
  { week: 'Week 1', completed: 14, target: 15 },
  { week: 'Week 2', completed: 22, target: 20 },
  { week: 'Week 3', completed: 18, target: 20 },
  { week: 'Week 4', completed: 29, target: 25 },
  { week: 'Week 5', completed: 34, target: 30 },
  { week: 'Week 6', completed: 40, target: 35 },
];

export default function AnalyticsPanel() {
  const { activeTeam, analytics } = useTeam();
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const realSummary = analytics?.summary;
  const realMemberWorkload = analytics?.memberWorkload || [];

  // Always use fallback dummy data if no team selected or no member workload yet
  const isUsingDummyData = !activeTeam || !realSummary || realMemberWorkload.length === 0;

  const summary = isUsingDummyData
    ? {
        totalSubtasks: 51,
        completedSubtasks: 43,
        inProgressSubtasks: 8,
        todoSubtasks: 0,
        overdueSubtasks: 2,
        completionRate: 84,
      }
    : realSummary;

  const barData = isUsingDummyData
    ? DUMMY_MEMBER_BAR_DATA
    : realMemberWorkload.map((mw) => ({
        name: mw.name,
        assigned: mw.totalAssigned,
        completed: mw.completed,
        color: mw.avatarColor || '#10b981',
      }));

  const timelineData = DUMMY_TIMELINE_DATA;
  const weeklyData = DUMMY_WEEKLY_DATA;

  // Max scale calculations for SVG graphs
  const maxTimelineTasks = Math.max(...timelineData.map((d) => Math.max(d.completed, d.created)), 1);
  const maxBarVal = Math.max(...barData.map((b) => Math.max(b.assigned, b.completed)), 1);
  const maxWeeklyVal = Math.max(...weeklyData.map((w) => Math.max(w.completed, w.target)), 1);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505] overflow-y-auto p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span>Team Performance & Workload Analytics</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time efficiency metrics & team productivity trends
          </p>
        </div>

        {isUsingDummyData && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
            <Info className="w-3.5 h-3.5" />
            <span>Sample Demo Data (Populates automatically with live team data)</span>
          </div>
        )}
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Card 1: Completion Rate */}
        <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
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
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Completed */}
        <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
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
        <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
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
        <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
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

      {/* Graph 1: Combined Performance Line Graph (Time vs Tasks) */}
      <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Combined Team Performance (Time vs Task Completion Volume)
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Completed Tasks
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" /> Total Created
            </span>
          </div>
        </div>

        {/* SVG Line Chart */}
        <div className="relative h-64 w-full pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200">
            <defs>
              <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 50, 100, 150].map((yVal, idx) => (
              <line
                key={idx}
                x1="40"
                y1={yVal}
                x2="690"
                y2={yVal}
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="4 4"
              />
            ))}

            {/* Points & Curves logic */}
            {(() => {
              const pointsCompleted = timelineData.map((d, i) => {
                const x = 40 + i * (650 / (timelineData.length - 1));
                const y = 170 - (d.completed / maxTimelineTasks) * 140;
                return { x, y, data: d };
              });

              const pointsCreated = timelineData.map((d, i) => {
                const x = 40 + i * (650 / (timelineData.length - 1));
                const y = 170 - (d.created / maxTimelineTasks) * 140;
                return { x, y, data: d };
              });

              const pathCompleted = pointsCompleted
                .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
                .join(' ');

              const pathCreated = pointsCreated
                .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
                .join(' ');

              const areaPathCompleted = `${pathCompleted} L ${
                pointsCompleted[pointsCompleted.length - 1].x
              } 170 L 40 170 Z`;

              return (
                <>
                  <path d={areaPathCompleted} fill="url(#emeraldGradient)" />
                  <path
                    d={pathCreated}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                  />
                  <path
                    d={pathCompleted}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Render Dots & Tooltips */}
                  {pointsCompleted.map((p, i) => (
                    <g key={i}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="5"
                        fill="#10b981"
                        className="cursor-pointer transition-transform hover:scale-150"
                        onMouseEnter={() => setHoveredPoint({ x: p.x, y: p.y, label: p.data.time, completed: p.data.completed, created: p.data.created })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      {/* X Axis Label */}
                      <text
                        x={p.x}
                        y="190"
                        fill="#94a3b8"
                        fontSize="11"
                        textAnchor="middle"
                      >
                        {p.data.time}
                      </text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>

          {/* Floating Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute z-30 bg-slate-900 border border-emerald-500/40 p-2.5 rounded-xl shadow-2xl text-xs text-white pointer-events-none transform -translate-x-1/2 -translate-y-full"
              style={{ left: `${(hoveredPoint.x / 700) * 100}%`, top: `${(hoveredPoint.y / 200) * 100}%` }}
            >
              <p className="font-bold text-emerald-400 mb-1">{hoveredPoint.label}</p>
              <p>Completed: <strong>{hoveredPoint.completed}</strong> tasks</p>
              <p className="text-indigo-300">Created: <strong>{hoveredPoint.created}</strong> tasks</p>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Combined Member Bar Chart + Week-Wise Task Completion */}
      <div className="grid grid-cols-2 gap-6">
        {/* Graph 2: Combined Bar Graph (Member Workload & Efficiency) */}
        <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Member Workload Comparison</h3>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block" /> Assigned
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Completed
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {barData.map((b, idx) => {
              const assignedPct = Math.round((b.assigned / maxBarVal) * 100);
              const completedPct = Math.round((b.completed / maxBarVal) * 100);

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: b.color }}
                      />
                      {b.name}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      <strong className="text-emerald-400">{b.completed}</strong> / {b.assigned} Done
                    </span>
                  </div>

                  {/* Dual Bar Comparison */}
                  <div className="space-y-1">
                    <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-600 transition-all duration-500 rounded-full"
                        style={{ width: `${assignedPct}%` }}
                      />
                    </div>
                    <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                        style={{ width: `${completedPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Graph 3: Week-Wise Task Completion Graph */}
        <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Week-Wise Task Completion Trends</h3>
            </div>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
              6-Week Cycle
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {weeklyData.map((w, idx) => {
              const heightPct = Math.round((w.completed / maxWeeklyVal) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {w.completed} tasks
                  </span>
                  <div className="w-full bg-[#18181C] rounded-t-xl overflow-hidden h-40 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-indigo-500 rounded-t-xl transition-all duration-500 group-hover:from-emerald-400 group-hover:to-indigo-400"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">{w.week}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
