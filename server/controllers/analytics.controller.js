const mongoose = require('mongoose');
const Project = require('../models/Project');

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
 * @desc    Get team analytics & metrics via MongoDB Aggregation Pipelines
 * @route   GET /api/teams/:teamId/stats
 * @access  Private (Team Member)
 */
const getTeamAnalytics = async (req, res, next) => {
  try {
    const teamId = new mongoose.Types.ObjectId(req.params.teamId);
    const currentDate = new Date();

    // 1. Calculate overall subtask completion metrics
    const completionStats = await Project.aggregate([
      { $match: { teamId } },
      { $unwind: { path: '$subtasks', preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: null,
          totalSubtasks: { $sum: 1 },
          completedSubtasks: {
            $sum: { $cond: [{ $eq: ['$subtasks.status', 'Completed'] }, 1, 0] },
          },
          inProgressSubtasks: {
            $sum: { $cond: [{ $eq: ['$subtasks.status', 'In Progress'] }, 1, 0] },
          },
          todoSubtasks: {
            $sum: { $cond: [{ $eq: ['$subtasks.status', 'To Do'] }, 1, 0] },
          },
          overdueSubtasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$subtasks.status', 'Completed'] },
                    { $ne: ['$subtasks.deadline', null] },
                    { $lt: ['$subtasks.deadline', currentDate] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalSubtasks: 1,
          completedSubtasks: 1,
          inProgressSubtasks: 1,
          todoSubtasks: 1,
          overdueSubtasks: 1,
          completionRate: {
            $cond: [
              { $gt: ['$totalSubtasks', 0] },
              {
                $multiply: [
                  { $divide: ['$completedSubtasks', '$totalSubtasks'] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
    ]);

    // 2. Member workload distribution (primary assignees + collaborators)
    const memberWorkload = await Project.aggregate([
      { $match: { teamId } },
      { $unwind: '$subtasks' },
      {
        $project: {
          status: '$subtasks.status',
          deadline: '$subtasks.deadline',
          allAssigned: {
            $setUnion: [
              { $cond: [{ $ne: ['$subtasks.assignedTo', null] }, ['$subtasks.assignedTo'], []] },
              { $ifNull: ['$subtasks.collaborators', []] },
            ],
          },
        },
      },
      { $unwind: '$allAssigned' },
      {
        $group: {
          _id: '$allAssigned',
          totalAssigned: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $ne: ['$status', 'Completed'] }, 1, 0] },
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$status', 'Completed'] },
                    { $ne: ['$deadline', null] },
                    { $lt: ['$deadline', currentDate] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          userId: '$_id',
          name: '$userDetails.name',
          username: '$userDetails.username',
          email: '$userDetails.email',
          avatarColor: '$userDetails.avatarColor',
          totalAssigned: 1,
          completed: 1,
          pending: 1,
          overdue: 1,
          completionPercentage: {
            $cond: [
              { $gt: ['$totalAssigned', 0] },
              {
                $multiply: [
                  { $divide: ['$completed', '$totalAssigned'] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
    ]);

    const stats = completionStats[0] || {
      totalSubtasks: 0,
      completedSubtasks: 0,
      inProgressSubtasks: 0,
      todoSubtasks: 0,
      overdueSubtasks: 0,
      completionRate: 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        summary: stats,
        memberWorkload,
      },
    });
  } catch (error) {
    handleError(error, res, next);
  }
};

/**
 * @desc    Get personal user analytics in a team workspace
 * @route   GET /api/teams/:teamId/my-stats
 * @access  Private (Team Member)
 */
const getMyAnalytics = async (req, res, next) => {
  try {
    const teamId = new mongoose.Types.ObjectId(req.params.teamId);
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const currentDate = new Date();

    const myStats = await Project.aggregate([
      { $match: { teamId } },
      { $unwind: '$subtasks' },
      {
        $match: {
          $or: [
            { 'subtasks.assignedTo': userId },
            { 'subtasks.collaborators': userId },
          ],
        },
      },
      {
        $group: {
          _id: null,
          totalAssigned: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$subtasks.status', 'Completed'] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$subtasks.status', 'In Progress'] }, 1, 0] },
          },
          todo: {
            $sum: { $cond: [{ $eq: ['$subtasks.status', 'To Do'] }, 1, 0] },
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$subtasks.status', 'Completed'] },
                    { $ne: ['$subtasks.deadline', null] },
                    { $lt: ['$subtasks.deadline', currentDate] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalAssigned: 1,
          completed: 1,
          inProgress: 1,
          todo: 1,
          overdue: 1,
          completionPercentage: {
            $cond: [
              { $gt: ['$totalAssigned', 0] },
              {
                $multiply: [
                  { $divide: ['$completed', '$totalAssigned'] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: myStats[0] || {
        totalAssigned: 0,
        completed: 0,
        inProgress: 0,
        todo: 0,
        overdue: 0,
        completionPercentage: 0,
      },
    });
  } catch (error) {
    handleError(error, res, next);
  }
};

module.exports = {
  getTeamAnalytics,
  getMyAnalytics,
};
