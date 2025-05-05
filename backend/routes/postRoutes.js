const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const { createPost, getMyPosts, deletePost } = require('../controllers/postController');

router.post('/', protect, createPost);
router.get('/', protect, getMyPosts);
router.delete('/:id', protect, deletePost);

module.exports = router;
