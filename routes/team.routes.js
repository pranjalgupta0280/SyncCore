const express = require('express');
const router = express.Router();
const {
  createTeam,
  getTeams,
  getTeamById,
  addMember,
  removeMember,
} = require('../controllers/team.controller');
const { protect } = require('../middlewares/auth.middleware');
const { isTeamAdmin, isTeamMember } = require('../middlewares/rbac.middleware');

router.use(protect); // All team routes require authentication

router.route('/')
  .post(createTeam)
  .get(getTeams);

router.route('/:teamId')
  .get(isTeamMember, getTeamById);

router.route('/:teamId/members')
  .post(isTeamAdmin, addMember);

router.route('/:teamId/members/:userId')
  .delete(isTeamAdmin, removeMember);

module.exports = router;
