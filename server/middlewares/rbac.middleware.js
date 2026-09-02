const Team = require('../models/Team');

/**
 * RBAC & Team Membership Middleware:
 * Inspects req.params.teamId or req.body.teamId to check user permissions.
 */

// Check if req.user is an Admin of the specified Team
const isTeamAdmin = async (req, res, next) => {
  try {
    const teamId = req.params.teamId || req.body.teamId;
    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: 'Team ID is required for access validation',
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team workspace not found',
      });
    }

    // Admin condition: team.admin matches user ID OR user is listed as 'Admin' in members
    const isAdmin =
      team.admin.toString() === req.user._id.toString() ||
      team.members.some(
        (m) => m.user.toString() === req.user._id.toString() && m.role === 'Admin'
      );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin privileges required for this action',
      });
    }

    req.team = team; // attach team object to request
    next();
  } catch (error) {
    next(error);
  }
};

// Check if req.user is a Member or Admin of the specified Team
const isTeamMember = async (req, res, next) => {
  try {
    const teamId = req.params.teamId || req.body.teamId;
    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: 'Team ID is required for access validation',
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team workspace not found',
      });
    }

    const isMember =
      team.admin.toString() === req.user._id.toString() ||
      team.members.some(
        (m) => m.user.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not a member of this team workspace',
      });
    }

    req.team = team;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isTeamAdmin, isTeamMember };
