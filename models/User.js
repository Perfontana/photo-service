const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  secondName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    maxlength: [11, 'Phone number must be 11 digits long.'],
    minlength: [11, 'Phone number must be 11 digits long.'],
    match: [/^\d*$/],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be longer than 6 characters.'],
    select: false,
    match: [
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#!_-])/,
      'Password must contain lowercase character, uppercase character, digit and special character: !, _, - or #',
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
