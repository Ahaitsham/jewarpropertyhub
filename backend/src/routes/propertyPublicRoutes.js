const router = require('express').Router();
const {
  listProperties,
  getPropertyBySlug,
  getFeatured,
  getRecent,
} = require('../controllers/propertyPublicController');

router.get('/', listProperties);
router.get('/featured', getFeatured);
router.get('/recent', getRecent);
router.get('/:slug', getPropertyBySlug);

module.exports = router;
