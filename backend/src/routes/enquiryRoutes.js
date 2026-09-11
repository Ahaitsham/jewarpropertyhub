const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { createEnquiry, listEnquiries, updateEnquiry } = require('../controllers/enquiryController');

// Public
router.post('/', createEnquiry);

// Admin
router.get('/', requireAdmin, listEnquiries);
router.patch('/:id', requireAdmin, updateEnquiry);

module.exports = router;
