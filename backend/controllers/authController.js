<<<<<<< HEAD
const User = require('../models/User');

/**
 * Helper to send JWT token in response
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage || '',
      bio: user.bio || '',
      createdAt: user.createdAt
    }
  });
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role, bio, profileImage } = req.body;
=======
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = mongoose.models.User || require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'lumen_secret',
    {
      expiresIn: '7d'
    }
  );
};

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
>>>>>>> f059735edb73d4364da5640286019e5c284910c3

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
<<<<<<< HEAD
        message: 'Please provide name, email, and password'
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Reader',
      bio: bio || '',
      profileImage: profileImage || ''
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
=======
        message: 'Name, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Do not allow users to register themselves as Admin
    const userRole =
      role && ['Reader', 'Author'].includes(role)
        ? role
        : 'Reader';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Register error:', error);

    res.status(500).json({
      success: false,
      message: 'Registration failed',
>>>>>>> f059735edb73d4364da5640286019e5c284910c3
      error: error.message
    });
  }
};

<<<<<<< HEAD
/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
=======
// Login
>>>>>>> f059735edb73d4364da5640286019e5c284910c3
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
<<<<<<< HEAD
        message: 'Please provide email and password'
      });
    }

    // Find user by email and select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
=======
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });
>>>>>>> f059735edb73d4364da5640286019e5c284910c3

    if (!user) {
      return res.status(401).json({
        success: false,
<<<<<<< HEAD
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
=======
        message: 'Invalid email or password'
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: 'Login failed',
>>>>>>> f059735edb73d4364da5640286019e5c284910c3
      error: error.message
    });
  }
};

<<<<<<< HEAD
/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Public / Auth
 */
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user._id);
=======
// Get currently logged-in user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

>>>>>>> f059735edb73d4364da5640286019e5c284910c3
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
<<<<<<< HEAD
      data: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || '',
        bio: user.bio || '',
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving current user profile',
      error: error.message
=======
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user'
>>>>>>> f059735edb73d4364da5640286019e5c284910c3
    });
  }
};

module.exports = {
  register,
  login,
<<<<<<< HEAD
  logout,
  getMe
};
=======
  getMe
};

>>>>>>> f059735edb73d4364da5640286019e5c284910c3
