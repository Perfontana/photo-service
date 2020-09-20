const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
module.exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
module.exports.login = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return next(new ErrorResponse('Please provide a phone and password.', 400));
  }

  const user = await User.findOne({ phone }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Get user info
// @route     GET /api/v1/auth/me
// @access    Private
module.exports.getMe = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};
