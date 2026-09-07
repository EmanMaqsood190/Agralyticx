const mongoose = require('mongoose');

const communityServerSchema = new mongoose.Schema(
  {
    serverId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: '',
      trim: true
    },

    role: {
      type: String,
      required: true,
      enum: [
        'farmer',
        'student_researcher',
        'company',
        'landowner',
        'transport'
      ],
      index: true
    },

    ownerId: {
      type: String,
      required: true,
      index: true
    },

    ownerName: {
      type: String,
      required: true
    },

    createdAt: {
      type: String,
      required: true
    },

    /* ========================================================
       SERVER STATUS
       ======================================================== */

    /*
     * Soft delete is used instead of immediately removing
     * the MongoDB document.
     *
     * This allows the server to be closed while keeping
     * private DM data completely independent.
     */
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },

    deletedAt: {
      type: String,
      required: false
    },

    /* ========================================================
       MEMBERS
       ======================================================== */

    members: [
      {
        userId: {
          type: String,
          required: true
        },

        name: {
          type: String,
          required: true
        },

        role: {
          type: String,
          required: true
        },

        avatar: {
          type: String,
          default: ''
        },

        joinedAt: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    strict: false
  }
);

/* ============================================================
   INDEXES
   ============================================================ */

communityServerSchema.index({
  role: 1,
  isDeleted: 1,
  createdAt: -1
});

communityServerSchema.index({
  ownerId: 1,
  isDeleted: 1
});

module.exports = mongoose.model(
  'CommunityServer',
  communityServerSchema
);
