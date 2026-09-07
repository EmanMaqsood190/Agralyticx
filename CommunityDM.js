const mongoose = require('mongoose');

/*
 * ============================================================
 * COMMUNITY / PRIVATE DM MODEL
 * ============================================================
 *
 * Important:
 *
 * Private conversations are NOT dependent on a server.
 *
 * conversationId is generated from the two user IDs:
 *
 *     userA + userB
 *
 * and does NOT contain serverId.
 *
 * Therefore:
 *
 *     Server deleted
 *          ↓
 *     Private DM remains
 *          ↓
 *     Users can continue chatting
 *
 * serverId is kept only as optional historical/legacy
 * information for DMs that originally started from a server.
 */

const communityDMSchema = new mongoose.Schema(
  {
    /* ========================================================
       UNIQUE MESSAGE ID
       ======================================================== */

    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    /* ========================================================
       STABLE PRIVATE CONVERSATION
       ======================================================== */

    /*
     * Stable conversation identifier.
     *
     * IMPORTANT:
     * serverId is intentionally NOT part of this value.
     *
     * Example:
     *
     * User A = 123
     * User B = 456
     *
     * conversationId:
     *     123__456
     *
     * Whether the users originally met through Server A,
     * Server B, or no server at all, the conversation remains
     * the same.
     */
    conversationId: {
      type: String,
      required: false,
      index: true,
      trim: true
    },

    /*
     * The two users participating in this conversation.
     *
     * This is useful for global DM discovery and makes the
     * conversation independent of any server.
     *
     * Old records may not contain this field because of
     * backwards compatibility.
     */
    participants: {
      type: [String],
      default: []
    },

    /* ========================================================
       LEGACY / HISTORICAL SERVER REFERENCE
       ======================================================== */

    /*
     * Optional.
     *
     * This does NOT control whether the DM exists.
     *
     * It only remembers the server from which the DM was
     * originally started, when applicable.
     */
    serverId: {
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
       RECEIVER
       ======================================================== */

    receiverId: {
      type: String,
      required: true,
      index: true
    },

    receiverName: {
      type: String,
      required: true
    },

    receiverRole: {
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
       READ / UNREAD
       ======================================================== */

    /*
     * false = receiver has not opened/read this message.
     *
     * This is used for the red unread notification dot.
     */
    seen: {
      type: Boolean,
      default: false,
      index: true
    },

    /* ========================================================
       MESSAGE EDITING
       ======================================================== */

    /*
     * true when the sender edits their own message.
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
       MESSAGE DELETION
       ======================================================== */

    /*
     * Global message deletion.
     *
     * This is used when the sender deletes their own message.
     *
     * The message remains in the database so the conversation
     * history stays consistent, but the frontend displays:
     *
     *     Message deleted
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
       USER-SPECIFIC DELETION
       ======================================================== */

    /*
     * Delete-for-me.
     *
     * If User A deletes a message/conversation:
     *
     *     deletedFor = ['UserA']
     *
     * User A no longer sees it.
     *
     * User B can still see it.
     *
     * This is especially important for:
     *
     *     Delete personal DM for me
     *     Delete conversation for me
     */
    deletedFor: {
      type: [String],
      default: []
    }
  },
  {
    /*
     * Keep compatibility with older MongoDB documents that may
     * contain fields not explicitly defined above.
     */
    strict: false,

    /*
     * Automatically maintain MongoDB updatedAt while preserving
     * the existing manually supplied createdAt.
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
 * Main global conversation lookup.
 *
 * This is the most important index because DMs are now
 * independent from servers.
 */
communityDMSchema.index({
  conversationId: 1,
  createdAt: 1
});

/*
 * Allows quick discovery of all messages between two users,
 * including compatibility with older records.
 */
communityDMSchema.index({
  senderId: 1,
  receiverId: 1,
  createdAt: 1
});

/*
 * Reverse direction lookup.
 */
communityDMSchema.index({
  receiverId: 1,
  senderId: 1,
  createdAt: 1
});

/*
 * Unread message lookup.
 *
 * Used by:
 *
 *     GET /unread-dms/:userId
 */
communityDMSchema.index({
  receiverId: 1,
  seen: 1,
  createdAt: -1
});

/*
 * Helps ignore messages that the current user deleted
 * from their own side.
 */
communityDMSchema.index({
  receiverId: 1,
  deletedFor: 1,
  createdAt: -1
});

/*
 * Useful when retrieving all messages in a conversation
 * that have not been deleted for a particular user.
 */
communityDMSchema.index({
  conversationId: 1,
  deletedFor: 1,
  createdAt: 1
});

/*
 * Server reference is intentionally indexed separately.
 *
 * This is ONLY for old/server-originated DM compatibility.
 * It does not make the conversation server-dependent.
 */
communityDMSchema.index({
  serverId: 1,
  createdAt: 1
});

/* ============================================================
   EXPORT
   ============================================================ */

module.exports = mongoose.model(
  'CommunityDM',
  communityDMSchema
);
