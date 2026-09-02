import React, { useState } from 'react';
import { useTeam } from '../context/TeamContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { getSocket } from '../services/socket';
import {
  Kanban,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  Users,
  ShieldAlert,
  User,
} from 'lucide-react';

const STATUS_COLUMNS = ['To Do', 'In Progress', 'Completed'];

const PRIORITY_BADGES = {
  Urgent: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  High: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

export default function TaskBoard() {
  const { user } = useAuth();
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
  const [subtaskAssignee, setSubtaskAssignee] = useState(''); // Single Primary Assignee
  const [subtaskCollaborators, setSubtaskCollaborators] = useState([]); // Multiple Members Working
  const [subtaskDeadline, setSubtaskDeadline] = useState('');
  const [permissionError, setPermissionError] = useState('');

  const subtasks = activeProject?.subtasks || [];
  const teamMembers = activeTeam?.members || [];

  // Check if current user is Team Admin
  const isTeamAdmin =
    activeTeam &&
    (activeTeam.admin?._id === user?._id ||
      teamMembers.some(
        (m) => m.user?._id === user?._id && m.role === 'Admin'
      ));

  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    if (!isTeamAdmin) {
      setPermissionError('Only Team Admins can create project containers.');
      setTimeout(() => setPermissionError(''), 4500);
      setShowAddProjectModal(false);
      return;
    }

    try {
      await createProject(projectTitle.trim(), projectDesc.trim(), null);
      setProjectTitle('');
      setProjectDesc('');
      setShowAddProjectModal(false);
    } catch (err) {
      setPermissionError(err.response?.data?.message || 'Failed to create project');
      setTimeout(() => setPermissionError(''), 4500);
    }
  };

  const handleToggleCollaborator = (userId) => {
    if (subtaskCollaborators.includes(userId)) {
      setSubtaskCollaborators(subtaskCollaborators.filter((id) => id !== userId));
    } else {
      setSubtaskCollaborators([...subtaskCollaborators, userId]);
    }
  };

  const handleAddSubtaskSubmit = async (e) => {
    e.preventDefault();
    if (!subtaskTitle.trim() || !activeProject) return;

    if (!isTeamAdmin) {
      setPermissionError('Only Team Admins can create tasks and subtasks.');
      setTimeout(() => setPermissionError(''), 4500);
      setShowAddSubtaskModal(false);
      return;
    }

    try {
      const res = await API.post(`/projects/${activeProject._id}/subtasks`, {
        title: subtaskTitle.trim(),
        priority: subtaskPriority,
        assignedTo: subtaskAssignee || null, // Single Assignee
        collaborators: subtaskCollaborators, // Multiple Members Working
        deadline: subtaskDeadline || null,
        status: 'To Do',
      });

      if (res.data.success) {
        await fetchProjects(activeTeam._id);
        await fetchAnalytics(activeTeam._id);

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
        setSubtaskCollaborators([]);
        setSubtaskDeadline('');
        setShowAddSubtaskModal(false);
      }
    } catch (err) {
      setPermissionError(
        err.response?.data?.message || 'Failed to create subtask'
      );
      setTimeout(() => setPermissionError(''), 4500);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    if (!activeProject) return;
    setPermissionError('');

    const userIdStr = user?._id?.toString();

    // Check permission: Must be Admin OR Primary Assignee OR Collaborator working on task
    const isAssignee =
      task.assignedTo &&
      (task.assignedTo._id || task.assignedTo).toString() === userIdStr;

    const isCollaborator =
      Array.isArray(task.collaborators) &&
      task.collaborators.some(
        (c) => (c._id || c).toString() === userIdStr
      );

    if (!isTeamAdmin && !isAssignee && !isCollaborator) {
      setPermissionError(
        `Permission Denied: Task status can only be updated by the Team Admin, Primary Assignee, or members working on this task.`
      );
      setTimeout(() => setPermissionError(''), 4500);
      return;
    }

    try {
      const res = await API.patch(
        `/projects/${activeProject._id}/subtasks/${task._id}`,
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
            taskData: { subtaskId: task._id, newStatus },
          });
        }
      }
    } catch (err) {
      setPermissionError(
        err.response?.data?.message || 'Failed to update subtask status'
      );
      setTimeout(() => setPermissionError(''), 4500);
    }
  };

  if (!activeTeam) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm bg-[#050505]">
        Select a team workspace to view Kanban tasks.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505] overflow-hidden">
      {/* Kanban Header & Project Selector */}
      <div className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-[#0A0A0A]/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Kanban className="w-5 h-5 text-emerald-400" />
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
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                    : 'bg-[#141414] text-slate-400 hover:text-slate-200'
                }`}
              >
                {proj.title}
              </button>
            ))}
          </div>

          {/* New Project Button (Admin Only) */}
          {isTeamAdmin && (
            <button
              onClick={() => setShowAddProjectModal(true)}
              className="flex items-center gap-1 text-xs text-emerald-400 hover:bg-emerald-500/10 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          )}
        </div>

        {/* Add Subtask Button (Admin Only) */}
        {activeProject && isTeamAdmin && (
          <button
            onClick={() => setShowAddSubtaskModal(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subtask</span>
          </button>
        )}
      </div>

      {/* Permission Warning Banner */}
      {permissionError && (
        <div className="bg-rose-500/20 border-b border-rose-500/30 px-6 py-2 text-xs text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>{permissionError}</span>
          </div>
        </div>
      )}

      {/* Board Columns */}
      {!activeProject ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs gap-3 bg-[#050505]">
          <FolderPlus className="w-10 h-10 text-slate-600" />
          <p>No project workspace selected. {isTeamAdmin ? 'Create a project to start tracking tasks!' : 'Waiting for Team Admin to create projects.'}</p>
          {isTeamAdmin && (
            <button
              onClick={() => setShowAddProjectModal(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-500 transition-colors"
            >
              Create First Project
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1 p-6 grid grid-cols-3 gap-6 overflow-x-auto">
          {STATUS_COLUMNS.map((status) => {
            const columnTasks = subtasks.filter((t) => t.status === status);
            return (
              <div
                key={status}
                className="bg-[#0C0C0E] border border-white/10 rounded-2xl p-4 flex flex-col h-full"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {status}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {columnTasks.map((task) => {
                    const userIdStr = user?._id?.toString();

                    const isAssignee =
                      task.assignedTo &&
                      (task.assignedTo._id || task.assignedTo).toString() === userIdStr;

                    const collaborators = Array.isArray(task.collaborators)
                      ? task.collaborators.filter(Boolean)
                      : [];

                    const isCollaborator = collaborators.some(
                      (c) => (c._id || c).toString() === userIdStr
                    );

                    const canEditStatus = isTeamAdmin || isAssignee || isCollaborator;

                    return (
                      <div
                        key={task._id}
                        className="bg-[#141416] border border-white/10 hover:border-emerald-500/30 rounded-xl p-3.5 shadow-md space-y-3 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
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

                        {/* Members Info */}
                        <div className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-white/5">
                          {/* Primary Assignee */}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500">Assignee:</span>
                            {task.assignedTo ? (
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white uppercase shrink-0"
                                  style={{
                                    backgroundColor:
                                      task.assignedTo.avatarColor || '#10b981',
                                  }}
                                >
                                  {task.assignedTo.name?.[0] || 'U'}
                                </div>
                                <span className="text-slate-200 font-medium">
                                  {task.assignedTo.name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-500 italic text-[10px]">Unassigned</span>
                            )}
                          </div>

                          {/* Collaborators Working on Task */}
                          {collaborators.length > 0 && (
                            <div className="flex items-center justify-between pt-0.5">
                              <span className="text-[10px] text-slate-500">Working:</span>
                              <div className="flex items-center -space-x-1 overflow-hidden">
                                {collaborators.map((collab, idx) => (
                                  <div
                                    key={collab._id || idx}
                                    title={collab.name || 'Collaborator'}
                                    className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white uppercase shrink-0 border border-slate-900 shadow"
                                    style={{
                                      backgroundColor:
                                        collab.avatarColor || '#10b981',
                                    }}
                                  >
                                    {collab.name?.[0] || 'U'}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Footer: Status Change */}
                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <span className="text-[10px] text-slate-500">Status:</span>
                          <select
                            value={task.status}
                            disabled={!canEditStatus}
                            title={
                              canEditStatus
                                ? 'Update Task Status'
                                : 'Only Team Admin, Primary Assignee, or members working on task can change status'
                            }
                            onChange={(e) => handleStatusChange(task, e.target.value)}
                            className={`bg-[#0A0A0A] text-[10px] border rounded-lg px-2 py-1 focus:outline-none transition-colors ${
                              canEditStatus
                                ? 'text-slate-200 border-white/10 hover:border-emerald-500/50 cursor-pointer'
                                : 'text-slate-500 border-zinc-800 opacity-60 cursor-not-allowed'
                            }`}
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
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
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 h-20"
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
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
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Single Primary Assignee Dropdown */}
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Primary Assignee (Single user)
                </label>
                <select
                  value={subtaskAssignee}
                  onChange={(e) => setSubtaskAssignee(e.target.value)}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map((m) => (
                    <option key={m.user?._id} value={m.user?._id}>
                      {m.user?.name} (@{m.user?.username})
                    </option>
                  ))}
                </select>
              </div>

              {/* Multiple Collaborators / Members Working Checklist */}
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Members Working on Task (Multiple Collaborators)
                </label>
                <div className="max-h-28 overflow-y-auto bg-[#050505] border border-white/10 rounded-xl p-2 space-y-1">
                  {teamMembers.length === 0 ? (
                    <p className="text-[11px] text-slate-500 p-1">No members in workspace.</p>
                  ) : (
                    teamMembers.map((m) => {
                      const isChecked = subtaskCollaborators.includes(m.user?._id);
                      return (
                        <label
                          key={m.user?._id}
                          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#1A1A1A] cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCollaborator(m.user?._id)}
                            className="rounded accent-emerald-600"
                          />
                          <span className="text-slate-200">{m.user?.name}</span>
                          <span className="text-[10px] text-emerald-400">
                            (@{m.user?.username})
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    Priority
                  </label>
                  <select
                    value={subtaskPriority}
                    onChange={(e) => setSubtaskPriority(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={subtaskDeadline}
                    onChange={(e) => setSubtaskDeadline(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl"
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
