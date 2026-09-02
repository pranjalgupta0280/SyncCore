const Project = require('../models/Project');
const Team = require('../models/Team');

const handleError = (error, res, next) => {
  if (typeof next === 'function') {
    return next(error);
  }
  return res.status(500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    error: error.message,
  });
};

/**
 * Helper to check if a user is a Team Admin (creator or Admin role member)
 */
const checkIsTeamAdmin = async (teamId, userId) => {
  const team = await Team.findById(teamId);
  if (!team) return false;
  const userIdStr = userId.toString();
  return (
    team.admin.toString() === userIdStr ||
    team.members.some(
      (m) => m.user.toString() === userIdStr && m.role === 'Admin'
    )
  );
};

/**
 * @desc    Create a project container (Admin Only)
 * @route   POST /api/teams/:teamId/projects
 * @access  Private (Team Admin Only)
 */
const createProject = async (req, res, next) => {
  try {
    const { title, description, deadline } = req.body;
    const { teamId } = req.params;

    // Admin Permission Guard
    const isAdmin = await checkIsTeamAdmin(teamId, req.user._id);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only Team Admins can create new project containers.',
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a project title',
      });
    }

    const project = await Project.create({
      teamId,
      title,
      description: description || '',
      deadline: deadline || null,
      createdBy: req.user._id,
      subtasks: [],
    });

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email username avatarColor')
      .populate('subtasks.assignedTo', 'name email username avatarColor')
      .populate('subtasks.collaborators', 'name email username avatarColor');

    return res.status(201).json({
      success: true,
      data: populatedProject,
    });
  } catch (error) {
    handleError(error, res, next);
  }
};

/**
 * @desc    Get all projects for a team
 * @route   GET /api/teams/:teamId/projects
 * @access  Private (Team Member)
 */
const getProjects = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    const projects = await Project.find({ teamId })
      .populate('createdBy', 'name email username avatarColor')
      .populate('subtasks.assignedTo', 'name email username avatarColor')
      .populate('subtasks.collaborators', 'name email username avatarColor')
      .sort('-createdAt');

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    handleError(error, res, next);
  }
};

/**
 * @desc    Get single project details
 * @route   GET /api/projects/:projectId
 * @access  Private
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('createdBy', 'name email username avatarColor')
      .populate('subtasks.assignedTo', 'name email username avatarColor')
      .populate('subtasks.collaborators', 'name email username avatarColor');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project container not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    handleError(error, res, next);
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:projectId
 * @access  Private (Admin Only)
 */
const updateProject = async (req, res, next) => {
  try {
    const { title, description, deadline } = req.body;

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const isAdmin = await checkIsTeamAdmin(project.teamId, req.user._id);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only Team Admins can update project details.',
      });
    }

    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (deadline !== undefined) project.deadline = deadline;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email username avatarColor')
      .populate('subtasks.assignedTo', 'name email username avatarColor')
      .populate('subtasks.collaborators', 'name email username avatarColor');

    return res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    handleError(error, res, next);
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:projectId
 * @access  Private (Admin Only)
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const isAdmin = await checkIsTeamAdmin(project.teamId, req.user._id);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only Team Admins can delete projects.',
      });
    }

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    handleError(error, res, next);
  }
};

/**
 * @desc    Add subtask to project (Team Admin Only)
 * @route   POST /api/projects/:projectId/subtasks
 * @access  Private (Team Admin Only)
 */
const addSubtask = async (req, res, next) => {
  try {
    const { title, assignedTo, collaborators, priority, status, deadline } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project container not found',
      });
    }

    // Admin Permission Guard for Subtask Creation
    const isAdmin = await checkIsTeamAdmin(project.teamId, req.user._id);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only Team Admins can create tasks and subtasks.',
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a subtask title',
      });
    }

    const subtask = {
      title,
      assignedTo: assignedTo || null, // Single primary assignee
      collaborators: Array.isArray(collaborators) ? collaborators.filter(Boolean) : [], // Multiple members working on task
      priority: priority || 'Medium',
      status: status || 'To Do',
      deadline: deadline || null,
      completedAt: status === 'Completed' ? new Date() : null,
    };

    project.subtasks.push(subtask);
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email username avatarColor')
      .populate('subtasks.assignedTo', 'name email username avatarColor')
      .populate('subtasks.collaborators', 'name email username avatarColor');

    return res.status(201).json({
      success: true,
      message: 'Subtask added successfully',
      data: updatedProject,
    });
  } catch (error) {
    handleError(error, res, next);
  }
};

/**
 * @desc    Update subtask status, assignment, or priority
 * @route   PATCH /api/projects/:projectId/subtasks/:subtaskId
 * @access  Private (Status updates restricted to Team Admin, Primary Assignee, or Collaborators)
 */
const updateSubtask = async (req, res, next) => {
  try {
    const { projectId, subtaskId } = req.params;
    const { title, assignedTo, collaborators, priority, status, deadline } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project container not found',
      });
    }

    const subtask = project.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: 'Subtask not found',
      });
    }

    const userIdStr = req.user._id.toString();
    const isAdmin = await checkIsTeamAdmin(project.teamId, req.user._id);

    const isAssignee =
      subtask.assignedTo &&
      (subtask.assignedTo._id || subtask.assignedTo).toString() === userIdStr;

    const isCollaborator =
      subtask.collaborators &&
      subtask.collaborators.some(
        (collabId) => (collabId._id || collabId).toString() === userIdStr
      );

    // Permission Guard: Only Admin, Assignee, or Collaborators can update status
    if (status !== undefined && status !== subtask.status) {
      if (!isAdmin && !isAssignee && !isCollaborator) {
        return res.status(403).json({
          success: false,
          message:
            'Access denied: Task status can only be updated by the Team Admin, primary assignee, or assigned collaborators on this task.',
        });
      }
    }

    // Permission Guard: Only Admin can reassign members or change subtask title/priority
    if (
      (title !== undefined || assignedTo !== undefined || collaborators !== undefined || priority !== undefined) &&
      !isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only Team Admins can edit task details, priority, or reassign members.',
      });
    }

    if (title !== undefined) subtask.title = title;
    if (assignedTo !== undefined) subtask.assignedTo = assignedTo || null;
    if (collaborators !== undefined) {
      subtask.collaborators = Array.isArray(collaborators)
        ? collaborators.filter(Boolean)
        : [];
    }

    if (priority !== undefined) subtask.priority = priority;
    if (deadline !== undefined) subtask.deadline = deadline;

    if (status !== undefined) {
      if (status === 'Completed' && subtask.status !== 'Completed') {
        subtask.completedAt = new Date();
      } else if (status !== 'Completed' && subtask.status === 'Completed') {
        subtask.completedAt = null;
      }
      subtask.status = status;
    }

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email username avatarColor')
      .populate('subtasks.assignedTo', 'name email username avatarColor')
      .populate('subtasks.collaborators', 'name email username avatarColor');

    return res.status(200).json({
      success: true,
      message: 'Subtask updated successfully',
      data: updatedProject,
    });
  } catch (error) {
    handleError(error, res, next);
  }
};

/**
 * @desc    Delete subtask (Admin Only)
 * @route   DELETE /api/projects/:projectId/subtasks/:subtaskId
 * @access  Private (Admin Only)
 */
const deleteSubtask = async (req, res, next) => {
  try {
    const { projectId, subtaskId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project container not found',
      });
    }

    const isAdmin = await checkIsTeamAdmin(project.teamId, req.user._id);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only Team Admins can delete subtasks.',
      });
    }

    project.subtasks.pull({ _id: subtaskId });
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email username avatarColor')
      .populate('subtasks.assignedTo', 'name email username avatarColor')
      .populate('subtasks.collaborators', 'name email username avatarColor');

    return res.status(200).json({
      success: true,
      message: 'Subtask deleted successfully',
      data: updatedProject,
    });
  } catch (error) {
    handleError(error, res, next);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addSubtask,
  updateSubtask,
  deleteSubtask,
};
