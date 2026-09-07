const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },

  name: String,

  email: String,

  phone: String,

  password: String,

  role: String,

  language: String,

  gender: {
    type: String,
    enum: [
      'male',
      'female',
      'prefer_not_to_say'
    ]
  },

  avatar: String,

  createdAt: String

}, {
  strict: false
});

module.exports =
  mongoose.model(
    'UserProfile',
    userProfileSchema
  );