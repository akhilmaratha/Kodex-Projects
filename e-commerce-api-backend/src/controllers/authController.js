const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const User = require('../models/User');

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function sendAuthResponse(res, user) {
  const token = createToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}

const register = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }

  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });

  if (exists) {
    return next(new AppError('Email already in use', 400));
  }

  const user = await User.create({ name, email, password });
  sendAuthResponse(res, user);
});

const login = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  const matched = await user.checkPassword(password);

  if (!matched) {
    return next(new AppError('Invalid email or password', 401));
  }

  sendAuthResponse(res, user);
});

const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

module.exports = { register, login, getProfile };