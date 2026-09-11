const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { getStats } = require('../controllers/dashboardController');

router.get('/stats', requireAdmin, getStats);

module.exports = router;
