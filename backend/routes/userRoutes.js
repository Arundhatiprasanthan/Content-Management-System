const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/', authorize('Admin'), getUsers);

module.exports = router;
