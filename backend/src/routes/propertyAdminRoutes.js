const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  listAdminProperties,
  getAdminProperty,
  createProperty,
  updateProperty,
  updateStatus,
  archiveProperty,
  addActivityNote,
} = require('../controllers/propertyAdminController');
const {
  uploadMedia,
  deleteMedia,
  reorderMedia,
  setCover,
} = require('../controllers/mediaController');

router.use(requireAdmin);

router.get('/', listAdminProperties);
router.post('/', createProperty);
router.get('/:id', getAdminProperty);
router.put('/:id', updateProperty);
router.patch('/:id/status', updateStatus);
router.delete('/:id', archiveProperty); // soft delete -> ARCHIVED
router.post('/:id/activity', addActivityNote);

router.post('/:id/media', upload.array('files', 20), uploadMedia);
router.delete('/:id/media/:mediaId', deleteMedia);
router.patch('/:id/media/reorder', reorderMedia);
router.patch('/:id/media/:mediaId/cover', setCover);

module.exports = router;
