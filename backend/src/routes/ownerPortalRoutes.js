const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { getMyProperties, getMyProfile } = require('../controllers/ownerPortalController');

router.use(requireAuth, requireRole('OWNER', 'ADMIN', 'SUPER_ADMIN'));

router.get('/properties', getMyProperties);
router.get('/me', getMyProfile);

module.exports = router;
