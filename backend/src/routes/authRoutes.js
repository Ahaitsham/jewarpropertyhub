const router = require('express').Router();
const { login, signup, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/login', login);
router.post('/signup', signup);
router.get('/me', requireAuth, me);

module.exports = router;
