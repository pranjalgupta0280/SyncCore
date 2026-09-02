import React, { useState } from 'react';
import { useTeam } from '../context/TeamContext';
import API from '../services/api';
import { getSocket } from '../services/socket';
import {
  Kanban,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  User,
  Calendar,
} from 'lucide-react';

const STATUS_COLUMNS = ['To Do', 'In Progress', 'Completed'];

const PRIORITY_BADGES = {
  Urgent: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  High: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

export default function TaskBoard() {
  const {
    activeTeam,
    projects,
    activeProject,
    setActiveProject,
    fetchProjects,
    fetchAnalytics,
    createProject,
  } = useTeam();

  const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  // New Project Form
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  // New Subtask Form
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [subtaskPriority, setSubtaskPriority] = useState('Medium');
  const [subtaskAssignee, setSubtaskAssignee] = useState('');
  const [subtaskDeadline, setSubtaskDeadline] = useState('');

  const subtasks = activeProject?.subtasks || [];
  const teamMembers = activeTeam?.members || [];

  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;
    await createProject(projectTitle.trim(), projectDesc.trim(), null);
    setProjectTitle('');
    setProjectDesc('');
    setShowAddProjectModal(false);
  };

  const handleAddSubtaskSubmit = async (e) => {
    e.preventDefault();
    if (!subtaskTitle.trim() || !activeProject) return;

    try {
      const res = await API.post(`/projects/${activeProject._id}/subtasks`, {
        title: subtaskTitle.trim(),
        priority: subtaskPriority,
        assignedTo: subtaskAssignee || null,
        deadline: subtaskDeadline || null,
        status: 'To Do',
      });

      if (res.data.success) {
        await fetchProjects(activeTeam._id);
        await fetchAnalytics(activeTeam._id);

        // Broadcast task update via Socket.io
        const socket = getSocket();
        if (socket && activeTeam) {
          socket.emit('task_update', {
            teamId: activeTeam._id,
            projectId: activeProject._id,
            taskAction: 'created',
            taskData: { title: subtaskTitle },
          });
        }

        setSubtaskTitle('');
        setSubtaskPriority('Medium');
        setSubtaskAssignee('');
        setSubtaskDeadline('');
        setShowAddSubtaskModal(false);
      }
    } catch (err) {
      console.error('Failed to add subtask', err);
    }
  };

  const handleStatusChange = async (subtaskId, newStatus) => {
    if (!activeProject) return;
    try {
      const res = await API.patch(
        `/projects/${activeProject._id}/subtasks/${subtaskId}`,
        { status: newStatus }
      );

      if (res.data.success) {
        await fetchProjects(activeTeam._id);
        await fetchAnalytics(activeTeam._id);

        const socket = getSocket();
        if (socket && activeTeam) {
          socket.emit('task_update', {
            teamId: activeTeam._id,
            projectId: activeProject._id,
            taskAction: 'status_change',
            taskData: { subtaskId, newStatus },
          });
        }
      }
    } catch (err) {
      console.error('Failed to update subtask status', err);
    }
  };

  if (!activeTeam) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
        Select a team workspace to view Kanban tasks.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0F19] overflow-hidden">
      {/* Kanban Header & Project Selector */}
      <div className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-slate-950/40 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Kanban className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Project Workspaces</h2>
          </div>

          {/* Project Tabs */}
          <div className="flex items-center gap-1.5 max-w-md overflow-x-auto">
            {projects.map((proj) => (
              <button
                key={proj._id}
                onClick={() => setActiveProject(proj)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  activeProject?._id === proj._id
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                {proj.title}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddProjectModal(true)}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:bg-indigo-500/10 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>

        {activeProject && (
          <button
            onClick={() => setShowAddSubtaskModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subtask</span>
          </button>
        )}
      </div>

      {/* Board Columns */}
      {!activeProject ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs gap-3">
          <FolderPlus className="w-10 h-10 text-slate-600" />
          <p>No project workspace selected. Create a project to start tracking tasks!</p>
          <button
            onClick={() => setShowAddProjectModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-indigo-500 transition-colors"
          >
            Create First Project
          </button>
        </div>
      ) : (
        <div className="flex-1 p-6 grid grid-cols-3 gap-6 overflow-x-auto">
          {STATUS_COLUMNS.map((status) => {
            const columnTasks = subtasks.filter((t) => t.status === status);
            return (
              <div
                key={status}
                className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col h-full"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {status}
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {columnTasks.map((task) => (
                    <div
                      key={task._id}
                      className="bg-slate-800/70 border border-white/10 hover:border-indigo-500/30 rounded-xl p-3.5 shadow-md space-y-3 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                          {task.title}
                        </p>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                            PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.Medium
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        {/* Assignee Avatar */}
                        {task.assignedTo ? (
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white uppercase shrink-0"
                              style={{
                                backgroundColor:
                                  task.assignedTo.avatarColor || '#6366f1',
                              }}
                            >
                              {task.assignedTo.name?.[0]}
                            </div>
                            <span className="truncate max-w-[90px]">
                              {task.assignedTo.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned</span>
                        )}

                        {/* Status Change Selector */}
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task._id, e.target.value)
                          }
                          className="bg-slate-900 text-slate-300 text-[10px] border border-white/10 rounded-lg px-2 py-1 focus:outline-none"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Create New Project Container</h3>
            <form onSubmit={handleCreateProjectSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Q3 Engineering Roadmap"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Description
                </label>
                <textarea
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Brief summary of milestones..."
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 h-20"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subtask Modal */}
      {showAddSubtaskModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add New Subtask</h3>
            <form onSubmit={handleAddSubtaskSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Subtask Title *
                </label>
                <input
                  type="text"
                  required
                  value={subtaskTitle}
                  onChange={(e) => setSubtaskTitle(e.target.value)}
                  placeholder="e.g. Implement Socket Auth middleware"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    Priority
                  </label>
                  <select
                    value={subtaskPriority}
                    onChange={(e) => setSubtaskPriority(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    Assignee
                  </label>
                  <select
                    value={subtaskAssignee}
                    onChange={(e) => setSubtaskAssignee(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map((m) => (
                      <option key={m.user?._id} value={m.user?._id}>
                        {m.user?.name} (@{m.user?.username})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={subtaskDeadline}
                  onChange={(e) => setSubtaskDeadline(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubtaskModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                >
                  Add Subtask
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
