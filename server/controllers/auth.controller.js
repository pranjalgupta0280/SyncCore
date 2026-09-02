const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'synccore_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

/**
 * Helper to handle errors safely regardless of whether `next` callback is passed
 */
const handleError = (error, res, next) => {
  if (typeof next === 'function') {
    return next(error);
  }
  let statusCode = 500;
  if (error.code === 11000) {
    statusCode = 400;
    const field = Object.keys(error.keyValue)[0];
    error.message = `Duplicate value entered for ${field} field. Please use another value.`;
  }
  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    error: error.message,
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, username, and password',
      });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Email address is already registered',
      });
    }

    // Check if unique username / ID handle already exists
    const usernameExists = await User.findOne({ username: username.toLowerCase() });
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: 'Username / User ID handle is already taken. Please choose another.',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password,
    });

    if (user) {
      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatarColor: user.avatarColor,
          token: generateToken(user._id),
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data provided',
      });
    }
  } catch (error) {
    handleError(error, res, next);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { login, password } = req.body; // login can be email or username

    if (!login || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/username and password',
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: login.toLowerCase() },
        { username: login.toLowerCase() },
      ],
    }).select('+password');

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatarColor: user.avatarColor,
          token: generateToken(user._id),
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials (email/username or password incorrect)',
      });
    }
  } catch (error) {
    handleError(error, res, next);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    handleError(error, res, next);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
