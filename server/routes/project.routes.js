const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addSubtask,
  updateSubtask,
  deleteSubtask,
} = require('../controllers/project.controller');
const { protect } = require('../middlewares/auth.middleware');
const { isTeamMember } = require('../middlewares/rbac.middleware');

router.use(protect);

// Team-level project routes: /api/teams/:teamId/projects
router.route('/teams/:teamId/projects')
  .post(isTeamMember, createProject)
  .get(isTeamMember, getProjects);

// Direct project routes: /api/projects/:projectId
router.route('/projects/:projectId')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

// Subtask management routes
router.route('/projects/:projectId/subtasks')
  .post(addSubtask);

router.route('/projects/:projectId/subtasks/:subtaskId')
  .patch(updateSubtask)
  .delete(deleteSubtask);

module.exports = router;
