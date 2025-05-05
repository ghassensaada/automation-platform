const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const { getAllUsers } = require('../controllers/userController');

router.get('/me', protect, (req, res) => {
  res.json({ message: 'Authenticated ✅', user: req.user });
});

router.get('/', protect, isAdmin, getAllUsers);

module.exports = router;
