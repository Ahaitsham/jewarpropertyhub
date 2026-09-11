const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const {
  createSubmission,
  listSubmissions,
  updateSubmission,
} = require('../controllers/submissionController');

// Public — "List Your Property" form
router.post('/', createSubmission);

// Admin
router.get('/', requireAdmin, listSubmissions);
router.patch('/:id', requireAdmin, updateSubmission);

module.exports = router;
