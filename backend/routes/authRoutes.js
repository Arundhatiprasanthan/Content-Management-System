const express = require('express');
<<<<<<< HEAD
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
=======

const router = express.Router();

const {
  register,
  login,
  getMe
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);

router.post('/login', login);

router.get('/me', protect, getMe);

module.exports = router;

>>>>>>> f059735edb73d4364da5640286019e5c284910c3
