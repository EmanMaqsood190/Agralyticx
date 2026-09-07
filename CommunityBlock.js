const mongoose = require('mongoose');

const communityBlockSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    blockerId: {
      type: String,
      required: true,
      index: true,
    },

    blockedUserId: {
      type: String,
      required: true,
      index: true,
    },

    blockedIdentifier: {
      type: String,
      index: true,
    },

    createdAt: {
      type: String,
      required: true,
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

communityBlockSchema.index(
  { blockerId: 1, blockedUserId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  'CommunityBlock',
  communityBlockSchema
);