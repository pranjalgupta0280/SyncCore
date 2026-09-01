const Project = require('../models/Project');

/**
 * @desc    Create a project container
 * @route   POST /api/teams/:teamId/projects
 * @access  Private (Team Member)
 */
const createProject = async (req, res, next) => {
  try {
    const { title, description, deadline } = req.body;
    const { teamId } = req.params;

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
      .populate('subtasks.assignedTo', 'name email username avatarColor');

    return res.status(201).json({
      success: true,
      data: populatedProject,
    });
  } catch (error) {
    next(error);
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
      .sort('-createdAt');

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
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
      .populate('subtasks.assignedTo', 'name email username avatarColor');

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
    next(error);
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:projectId
 * @access  Private
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

    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (deadline !== undefined) project.deadline = deadline;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email username avatarColor')
      .populate('subtasks.assignedTo', 'name email username avatarColor');

    return res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:projectId
 * @access  Private
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

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add subtask to project
 * @route   POST /api/projects/:projectId/subtasks
 * @access  Private
 */
const addSubtask = async (req, res, next) => {
  try {
    const { title, assignedTo, priority, status, deadline } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project container not found',
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
      assignedTo: assignedTo || null,
      priority: priority || 'Medium',
      status: status || 'To Do',
      deadline: deadline || null,
      completedAt: status === 'Completed' ? new Date() : null,
    };

    project.subtasks.push(subtask);
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email username avatarColor')
      .populate('subtasks.assignedTo', 'name email username avatarColor');

    return res.status(201).json({
      success: true,
      message: 'Subtask added successfully',
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update subtask status, assignment, or priority
 * @route   PATCH /api/projects/:projectId/subtasks/:subtaskId
 * @access  Private
 */
const updateSubtask = async (req, res, next) => {
  try {
    const { projectId, subtaskId } = req.params;
    const { title, assignedTo, priority, status, deadline } = req.body;

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

    if (title !== undefined) subtask.title = title;
    if (assignedTo !== undefined) subtask.assignedTo = assignedTo || null;
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
      .populate('subtasks.assignedTo', 'name email username avatarColor');

    return res.status(200).json({
      success: true,
      message: 'Subtask updated successfully',
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete subtask
 * @route   DELETE /api/projects/:projectId/subtasks/:subtaskId
 * @access  Private
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

    project.subtasks.pull({ _id: subtaskId });
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email username avatarColor')
      .populate('subtasks.assignedTo', 'name email username avatarColor');

    return res.status(200).json({
      success: true,
      message: 'Subtask deleted successfully',
      data: updatedProject,
    });
  } catch (error) {
    next(error);
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
