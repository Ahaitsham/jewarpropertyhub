const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { listOwners, getOwner, createOwner, updateOwner } = require('../controllers/ownerController');

router.use(requireAdmin);

router.get('/', listOwners);
router.post('/', createOwner);
router.get('/:id', getOwner);
router.put('/:id', updateOwner);

module.exports = router;
