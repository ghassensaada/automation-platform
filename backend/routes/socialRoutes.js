const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {
  connectPlatform,
  getConnections,
  disconnectPlatform
} = require('../controllers/socialController');

router.post('/connect', protect, connectPlatform);
router.get('/', protect, getConnections);
router.delete('/:platform', protect, disconnectPlatform);

module.exports = router;
