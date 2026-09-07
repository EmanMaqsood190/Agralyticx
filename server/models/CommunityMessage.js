const mongoose = require('mongoose');

/*
 * ============================================================
 * COMMUNITY SERVER MESSAGE MODEL
 * ============================================================
 *
 * This model is ONLY for server/group chat messages.
 *
 * Private DMs are stored separately in CommunityDM.
 *
 * Message lifecycle:
 *
 *     Normal message
 *          ↓
 *     Owner edits
 *          ↓
 *     edited = true
 *
 *     OR
 *
 *     Owner deletes own message
 *          ↓
 *     deleted = true
 *          ↓
 *     "Message deleted"
 *
 * Users can also delete the entire server chat history
 * from THEIR OWN side without affecting other members.
 */

/* ============================================================
   SCHEMA
   ============================================================ */

const communityMessageSchema = new mongoose.Schema(
  {
    /* ========================================================
       MESSAGE ID
       ======================================================== */

    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    /* ========================================================
       SERVER
       ======================================================== */

    serverId: {
      type: String,
      required: true,
      index: true
    },

    /*
     * Kept for compatibility with older community messages.
     *
     * New functionality uses serverId.
     */
    communityId: {
      type: String,
      required: false,
      index: true
    },

    /* ========================================================
       SENDER
       ======================================================== */

    senderId: {
      type: String,
      required: true,
      index: true
    },

    senderName: {
      type: String,
      required: true
    },

    senderRole: {
      type: String,
      required: true
    },

    /* ========================================================
       MESSAGE CONTENT
       ======================================================== */

    text: {
      type: String,
      required: true,
      trim: true
    },

    createdAt: {
      type: String,
      required: true,
      index: true
    },

    /* ========================================================
       EDIT STATUS
       ======================================================== */

    /*
     * true when the sender has edited their own message.
     */
    edited: {
      type: Boolean,
      default: false
    },

    editedAt: {
      type: String,
      required: false
    },

    /* ========================================================
       GLOBAL MESSAGE DELETION
       ======================================================== */

    /*
     * This means the actual message was deleted by its sender.
     *
     * IMPORTANT:
     *
     * This is different from deletedFor.
     *
     * deleted:
     *     Message is deleted for EVERYONE.
     *
     * deletedFor:
     *     Message/history is hidden only for specific users.
     */
    deleted: {
      type: Boolean,
      default: false,
      index: true
    },

    deletedAt: {
      type: String,
      required: false
    },

    /* ========================================================
       USER-SPECIFIC HISTORY DELETION
       ======================================================== */

    /*
     * Used for:
     *
     *     "Delete server chat history for me"
     *
     * Example:
     *
     * User A deletes their server history.
     *
     * deletedFor:
     *     ["userA"]
     *
     * User A:
     *     Cannot see these messages anymore.
     *
     * User B:
     *     Can still see the messages.
     *
     * User C:
     *     Can still see the messages.
     *
     * This does NOT delete the messages globally.
     */
    deletedFor: {
      type: [String],
      default: []
    }
  },

  {
    /*
     * Preserve compatibility with existing MongoDB documents
     * that may contain additional fields.
     */
    strict: false,

    /*
     * Automatically maintain updatedAt when a message is
     * edited/deleted.
     *
     * Existing manually supplied createdAt is preserved.
     */
    timestamps: {
      createdAt: false,
      updatedAt: true
    }
  }
);

/* ============================================================
   INDEXES
   ============================================================ */

/*
 * Main server chat loading.
 *
 * GET:
 *     /servers/:serverId/messages
 */
communityMessageSchema.index({
  serverId: 1,
  createdAt: 1
});

/*
 * Useful for sender-specific operations such as:
 *
 *     Edit own message
 *     Delete own message
 */
communityMessageSchema.index({
  serverId: 1,
  senderId: 1,
  createdAt: 1
});

/*
 * Delete-for-me history filtering.
 *
 * Query pattern:
 *
 * {
 *   serverId,
 *   deletedFor: { $nin: [userId] }
 * }
 */
communityMessageSchema.index({
  serverId: 1,
  deletedFor: 1,
  createdAt: 1
});

/*
 * Quickly find deleted messages in a server.
 */
communityMessageSchema.index({
  serverId: 1,
  deleted: 1,
  createdAt: 1
});

/*
 * Compatibility lookup for old communityId records.
 */
communityMessageSchema.index({
  communityId: 1,
  createdAt: 1
});

/* ============================================================
   EXPORT
   ============================================================ */

module.exports = mongoose.model(
  'CommunityMessage',
  communityMessageSchema
);
