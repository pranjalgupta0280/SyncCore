const Team = require('../models/Team');
const User = require('../models/User');
const Project = require('../models/Project');

/**
 * @desc    Create a new Team workspace
 * @route   POST /api/teams
 * @access  Private
 */
const createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a team workspace name',
      });
    }

    const team = await Team.create({
      name,
      description: description || '',
      admin: req.user._id,
      members: [
        {
          user: req.user._id,
          role: 'Admin',
          joinedAt: new Date(),
        },
      ],
    });

    const populatedTeam = await Team.findById(team._id)
      .populate('admin', 'name email username avatarColor')
      .populate('members.user', 'name email username avatarColor');

    return res.status(201).json({
      success: true,
      data: populatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's teams
 * @route   GET /api/teams
 * @access  Private
 */
const getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({
      $or: [
        { admin: req.user._id },
        { 'members.user': req.user._id },
      ],
    })
      .populate('admin', 'name email username avatarColor')
      .populate('members.user', 'name email username avatarColor')
      .sort('-createdAt');

    return res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single team by ID
 * @route   GET /api/teams/:teamId
 * @access  Private (Team Member)
 */
const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate('admin', 'name email username avatarColor')
      .populate('members.user', 'name email username avatarColor');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team workspace not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add member to team by User ID / Username
 * @route   POST /api/teams/:teamId/members
 * @access  Private (Team Admin)
 */
const addMember = async (req, res, next) => {
  try {
    const { username, userId, role } = req.body;
    const team = req.team; // Attached by isTeamAdmin middleware

    if (!username && !userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a username or userId to add member',
      });
    }

    let targetUser;
    if (userId) {
      targetUser = await User.findById(userId);
    } else {
      targetUser = await User.findOne({ username: username.toLowerCase() });
    }

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: `User not found with ${userId ? 'ID' : 'username'}: ${userId || username}`,
      });
    }

    // Check if user is already a member
    const alreadyMember = team.members.some(
      (m) => m.user.toString() === targetUser._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this team workspace',
      });
    }

    team.members.push({
      user: targetUser._id,
      role: role && ['Admin', 'Member'].includes(role) ? role : 'Member',
      joinedAt: new Date(),
    });

    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate('admin', 'name email username avatarColor')
      .populate('members.user', 'name email username avatarColor');

    return res.status(200).json({
      success: true,
      message: `User @${targetUser.username} successfully added to team`,
      data: updatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove member from team and unassign their tasks
 * @route   DELETE /api/teams/:teamId/members/:userId
 * @access  Private (Team Admin)
 */
const removeMember = async (req, res, next) => {
  try {
    const { teamId, userId } = req.params;
    const team = req.team; // Attached by isTeamAdmin middleware

    // Cannot remove team creator / primary admin
    if (team.admin.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove the primary Team Creator / Admin from the workspace',
      });
    }

    // Filter out user from members array
    const initialCount = team.members.length;
    team.members = team.members.filter(
      (m) => m.user.toString() !== userId
    );

    if (team.members.length === initialCount) {
      return res.status(404).json({
        success: false,
        message: 'User was not found in team members list',
      });
    }

    await team.save();

    // Clean up active task assignments: unassign subtasks assigned to removed user
    const teamProjects = await Project.find({ teamId: team._id });
    for (let project of teamProjects) {
      let updated = false;
      project.subtasks.forEach((subtask) => {
        if (
          subtask.assignedTo &&
          subtask.assignedTo.toString() === userId
        ) {
          subtask.assignedTo = null;
          updated = true;
        }
      });
      if (updated) {
        await project.save();
      }
    }

    const updatedTeam = await Team.findById(team._id)
      .populate('admin', 'name email username avatarColor')
      .populate('members.user', 'name email username avatarColor');

    return res.status(200).json({
      success: true,
      message: 'Member removed from team and their subtask assignments cleared',
      data: updatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeamById,
  addMember,
  removeMember,
};
