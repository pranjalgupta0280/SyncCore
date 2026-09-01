const express = require('express');
const router = express.Router({ mergeParams: true });
const { getTeamAnalytics, getMyAnalytics } = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/auth.middleware');
const { isTeamMember } = require('../middlewares/rbac.middleware');

router.use(protect);

router.get('/teams/:teamId/stats', isTeamMember, getTeamAnalytics);
router.get('/teams/:teamId/my-stats', isTeamMember, getMyAnalytics);

module.exports = router;
