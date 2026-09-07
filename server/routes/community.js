const express = require('express');

const router = express.Router();

const CommunityServer = require('../models/CommunityServer');
const CommunityMessage = require('../models/CommunityMessage');
const CommunityDM = require('../models/CommunityDM');
const UserProfile = require('../models/UserProfile');
const CommunityBlock = require('../models/CommunityBlock');

const VALID_ROLES = [
  'farmer',
  'student_researcher',
  'company',
  'landowner',
  'transport'
];

/* ============================================================
   HELPERS
   ============================================================ */

function makeId(prefix) {
  return (
    prefix +
    '_' +
    Date.now() +
    '_' +
    Math.random().toString(36).substring(2, 8)
  );
}

/*
 * Stable private conversation ID.
 *
 * IMPORTANT:
 * serverId is NEVER part of this ID.
 *
 * Therefore:
 *
 * Server A
 * Server B
 * Server deleted
 *
 * User 1 <---- private DM ----> User 2
 *
 * All belong to the same private conversation.
 */
function makeConversationId(userA, userB) {
  return [String(userA), String(userB)]
    .sort()
    .join('__');
}

/*
 * Safely format deleted messages.
 */
function formatDeletedMessage(message) {
  if (!message) {
    return message;
  }

  if (message.deleted) {
    return {
      ...message,
      text: 'Message deleted',
      deleted: true
    };
  }

  return message;
}

/*
 * Persistent identity used for blocking.
 *
 * Farmer / landowner / transport identify with CNIC.
 * Student / company identify with email.
 *
 * This makes a block survive even if the blocked
 * person deletes their account and signs up again,
 * as long as they use the same CNIC / email.
 */
function getBlockIdentifier(profile) {
  if (!profile) {
    return null;
  }

  if (
    profile.role === 'student_researcher' ||
    profile.role === 'company'
  ) {
    return profile.email
      ? String(profile.email).trim().toLowerCase()
      : null;
  }

  return profile.cnic
    ? String(profile.cnic).trim()
    : null;
}

/*
 * Returns true if receiverId has blocked the sender,
 * either directly (same account) or by CNIC/email
 * (sender signed up again with a new account).
 */
async function buildHiddenMessageChecker(userId, messages) {
  const activeBlocks = await CommunityBlock.find({
    blockerId: userId,
  }).lean();

  const blockedAtByUserId = new Map();
  const blockedAtByIdentifier = new Map();

  activeBlocks.forEach((block) => {
    if (block.blockedUserId) {
      blockedAtByUserId.set(block.blockedUserId, block.createdAt);
    }

    if (block.blockedIdentifier) {
      blockedAtByIdentifier.set(block.blockedIdentifier, block.createdAt);
    }
  });

  const senderIds = Array.from(
    new Set(messages.map((message) => message.senderId).filter(Boolean))
  );

  const senderProfiles = senderIds.length
    ? await UserProfile.find({ userId: { $in: senderIds } }).lean()
    : [];

  const identifierBySenderId = new Map();

  senderProfiles.forEach((profile) => {
    identifierBySenderId.set(profile.userId, getBlockIdentifier(profile));
  });

  return (message) => {
    if (message.systemType) {
      return message.systemFor !== userId;
    }

    const blockedAtById = blockedAtByUserId.get(message.senderId);

    if (blockedAtById && message.createdAt >= blockedAtById) {
      return true;
    }

    const identifier = identifierBySenderId.get(message.senderId);

    if (identifier) {
      const blockedAtByIdentity = blockedAtByIdentifier.get(identifier);

      if (blockedAtByIdentity && message.createdAt >= blockedAtByIdentity) {
        return true;
      }
    }

    return false;
  };
}

/*
 * Query that finds BOTH:
 *
 * 1. New messages using conversationId
 * 2. Older messages which only have senderId/receiverId
 *
 * This is important so existing DMs don't disappear.
 */
function buildConversationQuery(userId, otherUserId) {
  const conversationId = makeConversationId(
    userId,
    otherUserId
  );

  return {
    $or: [
      {
        conversationId
      },
      {
        senderId: userId,
        receiverId: otherUserId
      },
      {
        senderId: otherUserId,
        receiverId: userId
      }
    ]
  };
}

/* ============================================================
   GET ALL ACTIVE SERVERS FOR A ROLE
   ============================================================ */

router.get('/servers/:role', async (req, res) => {
  try {
    const { role } = req.params;

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        message: 'Invalid community role'
      });
    }

    const servers = await CommunityServer.find({
      role,
      isDeleted: {
        $ne: true
      }
    })
      .sort({ createdAt: -1 })
      .lean();

    const result = servers.map((server) => ({
      serverId: server.serverId,
      name: server.name,
      description: server.description || '',
      role: server.role,
      ownerId: server.ownerId,
      ownerName: server.ownerName,
      createdAt: server.createdAt,

      members: Array.isArray(server.members)
        ? server.members
        : [],

      memberCount: Array.isArray(server.members)
        ? server.members.length
        : 0,

      isDeleted: false
    }));

    return res.json(result);
  } catch (error) {
    console.error(
      'Get community servers error:',
      error
    );

    return res.status(500).json({
      message: 'Failed to load community servers'
    });
  }
});

/* ============================================================
   CREATE SERVER
   ============================================================ */

router.post('/servers', async (req, res) => {
  try {
    const {
      name,
      description
    } = req.body;

    const owner =
      req.body.owner ||
      req.body.creator;

    if (
      !name ||
      typeof name !== 'string' ||
      !name.trim()
    ) {
      return res.status(400).json({
        message: 'Server name is required'
      });
    }

    if (
      !owner ||
      (!owner.id && !owner.userId) ||
      !owner.name ||
      !owner.role
    ) {
      console.error(
        'Create server validation failed. Received owner:',
        owner
      );

      return res.status(400).json({
        message: 'Creator information is required'
      });
    }

    const ownerId =
      owner.id ||
      owner.userId;

    if (!VALID_ROLES.includes(owner.role)) {
      return res.status(400).json({
        message: 'Invalid creator role'
      });
    }

    const serverId = makeId('srv');

    const now =
      new Date().toISOString();

    const server =
      await CommunityServer.create({
        serverId,

        name:
          name.trim(),

        description:
          typeof description === 'string'
            ? description.trim()
            : '',

        role:
          owner.role,

        ownerId,

        ownerName:
          owner.name,

        createdAt:
          now,

        isDeleted:
          false,

        deletedAt:
          undefined,

        members: [
          {
            userId:
              ownerId,

            name:
              owner.name,

            role:
              owner.role,

            avatar:
              owner.avatar || '',

            joinedAt:
              now
          }
        ]
      });

    console.log(
      `Community server created successfully: ${server.name} (${server.serverId})`
    );

    return res.status(201).json({
      success: true,

      message:
        'Community server created successfully',

      server
    });
  } catch (error) {
    console.error(
      'Create community server error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to create community server',

      error:
        process.env.NODE_ENV === 'production'
          ? undefined
          : error.message
    });
  }
});

// ============================================================
// BLOCK USER
// ============================================================

// Block another user
router.post('/blocks/:blockedUserId', async (req, res) => {
  try {
    const { blockedUserId } = req.params;
    const { userId } = req.body;

    if (!userId || !blockedUserId) {
      return res.status(400).json({
        message: 'userId and blockedUserId are required.',
      });
    }

    if (userId === blockedUserId) {
      return res.status(400).json({
        message: 'You cannot block yourself.',
      });
    }

    const existingBlock = await CommunityBlock.findOne({
      blockerId: userId,
      blockedUserId,
    });

    if (existingBlock) {
      return res.status(200).json({
        message: 'User is already blocked.',
        blocked: true,
      });
    }

    const blockedProfile = await UserProfile.findOne({
      userId: blockedUserId,
    }).lean();

    const blockedIdentifier = getBlockIdentifier(blockedProfile);

    const block = await CommunityBlock.create({
      id: `block_${userId}_${blockedUserId}`,
      blockerId: userId,
      blockedUserId,
      blockedIdentifier: blockedIdentifier || undefined,
      createdAt: new Date().toISOString(),
    });

    const blockerProfile = await UserProfile.findOne({
      userId,
    }).lean();

    await CommunityDM.create({
      id: makeId('sysmsg'),
      conversationId: makeConversationId(userId, blockedUserId),
      senderId: userId,
      senderName: blockerProfile?.name || 'You',
      senderRole: blockerProfile?.role || 'farmer',
      receiverId: blockedUserId,
      receiverName: blockedProfile?.name || 'User',
      receiverRole: blockedProfile?.role || 'farmer',
      text: 'You blocked this user. You will not receive their messages until you unblock them.',
      systemType: 'block',
      systemFor: userId,
      seen: true,
      edited: false,
      deleted: false,
      deletedFor: [],
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      message: 'User blocked successfully.',
      blocked: true,
      block,
    });
  } catch (error) {
    console.error('Block user error:', error);

    return res.status(500).json({
      message: 'Failed to block user.',
    });
  }
});

// Unblock a user
router.delete('/blocks/:blockedUserId', async (req, res) => {
  try {
    const { blockedUserId } = req.params;
    const { userId } = req.body;

    if (!userId || !blockedUserId) {
      return res.status(400).json({
        message: 'userId and blockedUserId are required.',
      });
    }

    await CommunityBlock.deleteOne({
      blockerId: userId,
      blockedUserId,
    });

    const [blockerProfile, unblockedProfile] = await Promise.all([
      UserProfile.findOne({ userId }).lean(),
      UserProfile.findOne({ userId: blockedUserId }).lean(),
    ]);

    await CommunityDM.create({
      id: makeId('sysmsg'),
      conversationId: makeConversationId(userId, blockedUserId),
      senderId: userId,
      senderName: blockerProfile?.name || 'You',
      senderRole: blockerProfile?.role || 'farmer',
      receiverId: blockedUserId,
      receiverName: unblockedProfile?.name || 'User',
      receiverRole: unblockedProfile?.role || 'farmer',
      text: 'You unblocked this user.',
      systemType: 'unblock',
      systemFor: userId,
      seen: true,
      edited: false,
      deleted: false,
      deletedFor: [],
      createdAt: new Date().toISOString(),
    });

    return res.status(200).json({
      message: 'User unblocked successfully.',
      blocked: false,
    });
  } catch (error) {
    console.error('Unblock user error:', error);

    return res.status(500).json({
      message: 'Failed to unblock user.',
    });
  }
});


// Get users blocked by current user
router.get('/blocks/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const blocks = await CommunityBlock.find({
      blockerId: userId,
    }).lean();

    return res.json({
      blockedUsers: blocks.map((block) => block.blockedUserId),
    });
  } catch (error) {
    console.error('Get blocked users error:', error);

    return res.status(500).json({
      message: 'Failed to load blocked users.',
    });
  }
});

/* ============================================================
   GET SERVER DETAILS
   ============================================================ */

router.get(
  '/servers/:serverId/details',
  async (req, res) => {
    try {
      const server =
        await CommunityServer.findOne({
          serverId:
            req.params.serverId
        }).lean();

      if (!server) {
        return res.status(404).json({
          message:
            'Server not found'
        });
      }

      return res.json({
        serverId:
          server.serverId,

        name:
          server.name,

        description:
          server.description || '',

        role:
          server.role,

        ownerId:
          server.ownerId,

        ownerName:
          server.ownerName,

        createdAt:
          server.createdAt,

        members:
          Array.isArray(server.members)
            ? server.members
            : [],

        memberCount:
          Array.isArray(server.members)
            ? server.members.length
            : 0,

        isDeleted:
          server.isDeleted === true,

        deletedAt:
          server.deletedAt || null
      });
    } catch (error) {
      console.error(
        'Get server details error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to load server details'
      });
    }
  }
);

/* ============================================================
   EDIT SERVER DETAILS
   OWNER ONLY
   ============================================================ */

router.patch(
  '/servers/:serverId',
  async (req, res) => {
    try {
      const {
        userId,
        name,
        description
      } = req.body;

      const {
        serverId
      } = req.params;

      if (!userId) {
        return res.status(400).json({
          message:
            'User ID is required'
        });
      }

      const server =
        await CommunityServer.findOne({
          serverId
        });

      if (!server) {
        return res.status(404).json({
          message:
            'Server not found'
        });
      }

      if (server.isDeleted) {
        return res.status(410).json({
          message:
            'This server has been deleted'
        });
      }

      if (server.ownerId !== userId) {
        return res.status(403).json({
          message:
            'Only the server owner can edit this server'
        });
      }

      if (
        name !== undefined &&
        (
          typeof name !== 'string' ||
          !name.trim()
        )
      ) {
        return res.status(400).json({
          message:
            'Server name cannot be empty'
        });
      }

      if (name !== undefined) {
        server.name =
          name.trim();
      }

      if (description !== undefined) {
        server.description =
          typeof description === 'string'
            ? description.trim()
            : '';
      }

      await server.save();

      return res.json({
        success: true,

        message:
          'Server details updated successfully',

        server
      });
    } catch (error) {
      console.error(
        'Edit server error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to update server'
      });
    }
  }
);

/* ============================================================
   DELETE SERVER
   OWNER ONLY
   ============================================================ */

/*
 * SOFT DELETE ONLY.
 *
 * IMPORTANT:
 * We NEVER delete:
 *
 * CommunityDM
 * CommunityDM.deleteMany(...)
 *
 * Private messages remain completely independent
 * from server lifetime.
 */
router.delete(
  '/servers/:serverId',
  async (req, res) => {
    try {
      const {
        userId
      } = req.body;

      const {
        serverId
      } = req.params;

      if (!userId) {
        return res.status(400).json({
          message:
            'User ID is required'
        });
      }

      const server =
        await CommunityServer.findOne({
          serverId
        });

      if (!server) {
        return res.status(404).json({
          message:
            'Server not found'
        });
      }

      if (server.ownerId !== userId) {
        return res.status(403).json({
          message:
            'Only the server owner can delete this server'
        });
      }

      if (server.isDeleted) {
        return res.json({
          success: true,

          message:
            'Server has already been deleted',

          serverId
        });
      }

      const deletedAt =
        new Date().toISOString();

      server.isDeleted =
        true;

      server.deletedAt =
        deletedAt;

      await server.save();

      /*
       * DO NOT delete messages.
       * DO NOT delete DMs.
       *
       * The server is simply closed.
       */

      return res.json({
        success: true,

        message:
          'Server deleted successfully',

        serverId:
          server.serverId
      });
    } catch (error) {
      console.error(
        'Delete server error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to delete server'
      });
    }
  }
);

/* ============================================================
   JOIN SERVER
   ============================================================ */

router.post(
  '/servers/:serverId/join',
  async (req, res) => {
    try {
      const { user } =
        req.body;

      if (
        !user ||
        (!user.id && !user.userId) ||
        !user.name ||
        !user.role
      ) {
        return res.status(400).json({
          message:
            'User information is required'
        });
      }

      const userId =
        user.id ||
        user.userId;

      const server =
        await CommunityServer.findOne({
          serverId:
            req.params.serverId
        });

      if (!server) {
        return res.status(404).json({
          message:
            'Server not found'
        });
      }

      if (server.isDeleted) {
        return res.status(410).json({
          message:
            'This server has been deleted'
        });
      }

      if (server.role !== user.role) {
        return res.status(403).json({
          message:
            'You can only join servers for your own role'
        });
      }

      if (!Array.isArray(server.members)) {
        server.members = [];
      }

      const alreadyMember =
        server.members.some(
          (member) =>
            member.userId === userId
        );

      if (!alreadyMember) {
        server.members.push({
          userId,

          name:
            user.name,

          role:
            user.role,

          avatar:
            user.avatar || '',

          joinedAt:
            new Date().toISOString()
        });

        await server.save();
      }

      return res.json({
        success: true,

        message:
          alreadyMember
            ? 'Already a member'
            : 'Successfully joined server',

        server
      });
    } catch (error) {
      console.error(
        'Join community server error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to join server',

        error:
          process.env.NODE_ENV === 'production'
            ? undefined
            : error.message
      });
    }
  }
);

/* ============================================================
   LEAVE SERVER
   ============================================================ */

router.post(
  '/servers/:serverId/leave',
  async (req, res) => {
    try {
      const {
        userId
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          message:
            'User ID is required'
        });
      }

      const server =
        await CommunityServer.findOne({
          serverId:
            req.params.serverId
        });

      if (!server) {
        return res.status(404).json({
          message:
            'Server not found'
        });
      }

      if (server.isDeleted) {
        return res.status(410).json({
          message:
            'This server has been deleted'
        });
      }

      if (server.ownerId === userId) {
        return res.status(400).json({
          message:
            'Server owner cannot leave their own server'
        });
      }

      server.members =
        Array.isArray(server.members)
          ? server.members.filter(
              (member) =>
                member.userId !== userId
            )
          : [];

      await server.save();

      return res.json({
        success: true
      });
    } catch (error) {
      console.error(
        'Leave community server error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to leave server'
      });
    }
  }
);

/* ============================================================
   GET SERVER MEMBERS
   ============================================================ */

router.get(
  '/servers/:serverId/members',
  async (req, res) => {
    try {
      const server =
        await CommunityServer.findOne({
          serverId:
            req.params.serverId
        }).lean();

      if (!server) {
        return res.status(404).json({
          message:
            'Server not found'
        });
      }

      if (server.isDeleted) {
        return res.status(410).json({
          message:
            'This server has been deleted'
        });
      }

      return res.json(
        Array.isArray(server.members)
          ? server.members
          : []
      );
    } catch (error) {
      console.error(
        'Get server members error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to load server members'
      });
    }
  }
);

/* ============================================================
   GET SERVER CHAT
   ============================================================ */

router.get(
  '/servers/:serverId/messages',
  async (req, res) => {
    try {
      const {
        userId
      } = req.query;

      const server =
        await CommunityServer.findOne({
          serverId:
            req.params.serverId
        }).lean();

      if (!server) {
        return res.status(404).json({
          message:
            'Server not found'
        });
      }

      if (server.isDeleted) {
        return res.status(410).json({
          message:
            'This server has been deleted',

          serverDeleted:
            true
        });
      }

      const query = {
        serverId:
          req.params.serverId
      };

      if (userId) {
        query.deletedFor = {
          $nin: [userId]
        };
      }

      const messages =
        await CommunityMessage.find(query)
          .sort({
            createdAt: 1
          })
          .lean();

      return res.json(
        messages.map(
          formatDeletedMessage
        )
      );
    } catch (error) {
      console.error(
        'Get server messages error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to load server messages'
      });
    }
  }
);

/* ============================================================
   SEND SERVER CHAT MESSAGE
   ============================================================ */

router.post(
  '/servers/:serverId/messages',
  async (req, res) => {
    try {
      const {
        sender,
        text
      } = req.body;

      if (
        !sender ||
        (!sender.id && !sender.userId) ||
        !sender.name ||
        !sender.role
      ) {
        return res.status(400).json({
          message:
            'Sender information is required'
        });
      }

      const senderId =
        sender.id ||
        sender.userId;

      if (
        !text ||
        !text.trim()
      ) {
        return res.status(400).json({
          message:
            'Message text is required'
        });
      }

      const server =
        await CommunityServer.findOne({
          serverId:
            req.params.serverId
        });

      if (!server) {
        return res.status(404).json({
          message:
            'Server not found'
        });
      }

      if (server.isDeleted) {
        return res.status(410).json({
          message:
            'This server has been deleted. New messages are disabled.'
        });
      }

      const members =
        Array.isArray(server.members)
          ? server.members
          : [];

      const isMember =
        members.some(
          (member) =>
            member.userId === senderId
        );

      if (!isMember) {
        return res.status(403).json({
          message:
            'You must join the server before sending messages'
        });
      }

      const msg =
        await CommunityMessage.create({
          id:
            makeId('cm'),

          serverId:
            req.params.serverId,

          senderId,

          senderName:
            sender.name,

          senderRole:
            sender.role,

          text:
            text.trim(),

          createdAt:
            new Date().toISOString(),

          edited:
            false,

          deleted:
            false,

          deletedFor:
            []
        });

      return res.status(201).json({
        success: true,
        message: msg
      });
    } catch (error) {
      console.error(
        'Send community message error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to send community message',

        error:
          process.env.NODE_ENV === 'production'
            ? undefined
            : error.message
      });
    }
  }
);

/* ============================================================
   EDIT OWN SERVER MESSAGE
   ============================================================ */

router.patch(
  '/servers/:serverId/messages/:messageId',
  async (req, res) => {
    try {
      const {
        userId,
        text
      } = req.body;

      const {
        serverId,
        messageId
      } = req.params;

      if (!userId) {
        return res.status(400).json({
          message:
            'User ID is required'
        });
      }

      if (
        !text ||
        typeof text !== 'string' ||
        !text.trim()
      ) {
        return res.status(400).json({
          message:
            'Message text is required'
        });
      }

      const server =
        await CommunityServer.findOne({
          serverId
        }).lean();

      if (!server) {
        return res.status(404).json({
          message:
            'Server not found'
        });
      }

      if (server.isDeleted) {
        return res.status(410).json({
          message:
            'This server has been deleted'
        });
      }

      const message =
        await CommunityMessage.findOne({
          id:
            messageId,

          serverId
        });

      if (!message) {
        return res.status(404).json({
          message:
            'Message not found'
        });
      }

      if (message.senderId !== userId) {
        return res.status(403).json({
          message:
            'You can only edit your own message'
        });
      }

      if (message.deleted) {
        return res.status(400).json({
          message:
            'Deleted messages cannot be edited'
        });
      }

      message.text =
        text.trim();

      message.edited =
        true;

      message.editedAt =
        new Date().toISOString();

      await message.save();

      return res.json({
        success: true,
        message
      });
    } catch (error) {
      console.error(
        'Edit server message error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to edit message'
      });
    }
  }
);

/* ============================================================
   DELETE OWN SERVER MESSAGE
   ============================================================ */

router.delete(
  '/servers/:serverId/messages/:messageId',
  async (req, res) => {
    try {
      const {
        userId
      } = req.body;

      const {
        serverId,
        messageId
      } = req.params;

      if (!userId) {
        return res.status(400).json({
          message:
            'User ID is required'
        });
      }

      const message =
        await CommunityMessage.findOne({
          id:
            messageId,

          serverId
        });

      if (!message) {
        return res.status(404).json({
          message:
            'Message not found'
        });
      }

      if (message.senderId !== userId) {
        return res.status(403).json({
          message:
            'You can only delete your own message'
        });
      }

      message.deleted =
        true;

      message.deletedAt =
        new Date().toISOString();

      message.text =
        'Message deleted';

      await message.save();

      return res.json({
        success: true,
        message
      });
    } catch (error) {
      console.error(
        'Delete server message error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to delete message'
      });
    }
  }
);

/* ============================================================
   DELETE SERVER CHAT HISTORY FOR CURRENT USER
   ============================================================ */

router.delete(
  '/servers/:serverId/messages/history/me',
  async (req, res) => {
    try {
      const {
        userId
      } = req.body;

      const {
        serverId
      } = req.params;

      if (!userId) {
        return res.status(400).json({
          message:
            'User ID is required'
        });
      }

      const server =
        await CommunityServer.findOne({
          serverId
        }).lean();

      if (!server) {
        return res.status(404).json({
          message:
            'Server not found'
        });
      }

      await CommunityMessage.updateMany(
        {
          serverId,

          deletedFor: {
            $nin: [userId]
          }
        },

        {
          $addToSet: {
            deletedFor:
              userId
          }
        }
      );

      return res.json({
        success: true,

        message:
          'Server chat history deleted for you'
      });
    } catch (error) {
      console.error(
        'Delete server chat history error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to delete server chat history'
      });
    }
  }
);

/* ============================================================
   GET UNREAD PRIVATE DMS
   ============================================================ */

/*
 * IMPORTANT:
 *
 * Unread state is based on:
 *
 * receiverId + senderId
 *
 * NOT serverId.
 *
 * Therefore an unread DM still shows even if
 * its original server has been deleted.
 */
router.get(
  '/unread-dms/:userId',
  async (req, res) => {
    try {
      const {
        userId
      } = req.params;

      if (!userId) {
        return res.status(400).json({
          message:
            'User ID is required'
        });
      }

      const unreadMessages =
        await CommunityDM.find({
          receiverId:
            userId,

          seen:
            false,

          deleted: {
            $ne: true
          },

          deletedFor: {
            $nin: [userId]
          }
        })
          .sort({
            createdAt: -1
          })
          .lean();

      const isHiddenFromViewer =
        await buildHiddenMessageChecker(
          userId,
          unreadMessages
        );

      const visibleUnreadMessages =
        unreadMessages.filter(
          (message) => !isHiddenFromViewer(message)
        );

      const unreadMap =
        new Map();

      visibleUnreadMessages.forEach(
        (message) => {
          const conversationId =
            message.conversationId ||
            makeConversationId(
              userId,
              message.senderId
            );

          /*
           * ALWAYS group by stable user-to-user
           * conversation.
           *
           * Never use serverId here.
           */
          const key =
            conversationId;

          if (!unreadMap.has(key)) {
            unreadMap.set(key, {
              userId:
                message.senderId,

              serverId:
                message.serverId || null,

              conversationId,

              senderName:
                message.senderName,

              senderRole:
                message.senderRole,

              latestMessageAt:
                message.createdAt
            });
          }
        }
      );

      return res.json({
        success: true,

        unread:
          Array.from(
            unreadMap.values()
          )
      });
    } catch (error) {
      console.error(
        'Get unread community DMs error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to load unread messages'
      });
    }
  }
);

/* ============================================================
   GET GLOBAL PRIVATE MESSAGE INBOX
   ============================================================ */

/*
 * This powers the separate/global
 * "Private Messages" section.
 *
 * It does NOT depend on any server.
 *
 * It finds conversations from:
 *
 * - new conversationId records
 * - old sender/receiver records
 *
 * It returns the latest visible message
 * from each conversation.
 */
router.get(
  '/dms/inbox/:userId',
  async (req, res) => {
    try {
      const {
        userId
      } = req.params;

      if (!userId) {
        return res.status(400).json({
          message:
            'User ID is required'
        });
      }

      const messages =
        await CommunityDM.find({
          $or: [
            {
              senderId:
                userId
            },

            {
              receiverId:
                userId
            }
          ],

          deleted: {
            $ne: true
          },

          deletedFor: {
            $nin: [userId]
          }
        })
          .sort({
            createdAt: -1
          })
          .lean();

      const isHiddenFromViewer =
        await buildHiddenMessageChecker(
          userId,
          messages
        );

      const conversations =
        new Map();

      messages.forEach(
        (message) => {
          const otherUserId =
            message.senderId === userId
              ? message.receiverId
              : message.senderId;

          if (!otherUserId) {
            return;
          }

          const conversationId =
            message.conversationId ||
            makeConversationId(
              userId,
              otherUserId
            );

          const hidden =
            isHiddenFromViewer(message);

          const isIncoming =
            message.receiverId === userId;

          const existing =
            conversations.get(
              conversationId
            );

          if (existing) {
            if (
              !existing.hasVisiblePreview &&
              !hidden
            ) {
              existing.lastMessage =
                message.text;

              existing.lastMessageAt =
                message.createdAt;

              existing.unread =
                isIncoming &&
                message.seen === false;

              existing.hasVisiblePreview =
                true;
            }

            return;
          }

          conversations.set(
            conversationId,
            {
              conversationId,

              userId:
                otherUserId,

              name:
                isIncoming
                  ? message.senderName
                  : message.receiverName,

              role:
                isIncoming
                  ? message.senderRole
                  : message.receiverRole,

              avatar:
                '',

              lastMessage:
                hidden ? '' : message.text,

              lastMessageAt:
                message.createdAt,

              serverId:
                message.serverId || null,

              unread:
                !hidden &&
                isIncoming &&
                message.seen === false,

              hasVisiblePreview:
                !hidden
            }
          );
        }
      );

      /*
       * Try to enrich conversation users
       * with their current profile.
       */
      const result =
        await Promise.all(
          Array.from(
            conversations.values()
          ).map(
            async (conversation) => {
              try {
                const profile =
                  await UserProfile.findOne({
                    userId:
                      conversation.userId
                  }).lean();

                if (profile) {
                  conversation.name =
                    profile.name ||
                    conversation.name;

                  conversation.role =
                    profile.role ||
                    conversation.role;

                  conversation.avatar =
                    profile.avatar ||
                    '';
                }
              } catch (profileError) {
                console.error(
                  'Private inbox profile lookup error:',
                  profileError
                );
              }

              return conversation;
            }
          )
        );

      return res.json({
        success: true,
        conversations: result
      });
    } catch (error) {
      console.error(
        'Get global DM inbox error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to load private messages'
      });
    }
  }
);

/* ============================================================
   MARK PRIVATE DM AS SEEN
   SERVER COMPATIBILITY ROUTE
   ============================================================ */

router.post(
  '/servers/:serverId/dm/:otherUserId/seen',
  async (req, res) => {
    try {
      const {
        serverId,
        otherUserId
      } = req.params;

      const {
        userId
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          message:
            'Your user ID is required'
        });
      }

      if (
        userId === otherUserId
      ) {
        return res.status(400).json({
          message:
            'Invalid private conversation'
        });
      }

      const server =
        await CommunityServer.findOne({
          serverId
        }).lean();

      if (server) {
        const members =
          Array.isArray(server.members)
            ? server.members
            : [];

        const currentUserIsMember =
          members.some(
            (member) =>
              member.userId === userId
          );

        const otherUserIsMember =
          members.some(
            (member) =>
              member.userId === otherUserId
          );

        if (
          !currentUserIsMember ||
          !otherUserIsMember
        ) {
          return res.status(403).json({
            message:
              'Both users must be members of this server'
          });
        }
      }

      const result =
        await CommunityDM.updateMany(
          {
            senderId:
              otherUserId,

            receiverId:
              userId,

            seen:
              false
          },

          {
            $set: {
              seen:
                true
            }
          }
        );

      return res.json({
        success: true,

        markedSeen:
          result.modifiedCount
      });
    } catch (error) {
      console.error(
        'Mark community DMs as seen error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to mark private messages as seen'
      });
    }
  }
);

/* ============================================================
   GLOBAL MARK PRIVATE DM AS SEEN
   ============================================================ */

router.post(
  '/dms/:otherUserId/seen',
  async (req, res) => {
    try {
      const {
        otherUserId
      } = req.params;

      const {
        userId
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          message:
            'Your user ID is required'
        });
      }

      if (
        userId === otherUserId
      ) {
        return res.status(400).json({
          message:
            'Invalid private conversation'
        });
      }

      /*
       * Do NOT only use conversationId.
       *
       * This also marks old DMs, which may not
       * have conversationId.
       */
      const result =
        await CommunityDM.updateMany(
          {
            senderId:
              otherUserId,

            receiverId:
              userId,

            seen:
              false
          },

          {
            $set: {
              seen:
                true
            }
          }
        );

      return res.json({
        success: true,

        markedSeen:
          result.modifiedCount
      });
    } catch (error) {
      console.error(
        'Mark global DM as seen error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to mark private messages as seen'
      });
    }
  }
);

/* ============================================================
   GET PRIVATE DM - SERVER COMPATIBILITY ROUTE
   ============================================================ */

router.get(
  '/servers/:serverId/dm/:otherUserId',
  async (req, res) => {
    try {
      const {
        serverId,
        otherUserId
      } = req.params;

      const {
        userId
      } = req.query;

      if (!userId) {
        return res.status(400).json({
          message:
            'Your user ID is required'
        });
      }

      const server =
        await CommunityServer.findOne({
          serverId
        }).lean();

      /*
       * If server exists and is active,
       * old membership rules still apply.
       *
       * If deleted, existing DMs remain accessible.
       */
      if (
        server &&
        !server.isDeleted
      ) {
        const members =
          Array.isArray(server.members)
            ? server.members
            : [];

        const currentUserIsMember =
          members.some(
            (member) =>
              member.userId === userId
          );

        const otherUserIsMember =
          members.some(
            (member) =>
              member.userId === otherUserId
          );

        if (
          !currentUserIsMember ||
          !otherUserIsMember
        ) {
          return res.status(403).json({
            message:
              'Both users must be members of this server'
          });
        }
      }

      const messages =
        await CommunityDM.find({
          $or: [
            {
              conversationId:
                makeConversationId(
                  userId,
                  otherUserId
                )
            },

            {
              serverId,

              $or: [
                {
                  senderId:
                    userId,

                  receiverId:
                    otherUserId
                },

                {
                  senderId:
                    otherUserId,

                  receiverId:
                    userId
                }
              ]
            }
          ],

          deletedFor: {
            $nin: [userId]
          }
        })
          .sort({
            createdAt: 1
          })
          .lean();

      const isHiddenFromViewer =
        await buildHiddenMessageChecker(
          userId,
          messages
        );

      const visibleMessages =
        messages.filter(
          (message) => !isHiddenFromViewer(message)
        );

      return res.json(
        visibleMessages.map(
          formatDeletedMessage
        )
      );
    } catch (error) {
      console.error(
        'Get community DM error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to load private messages'
      });
    }
  }
);

/* ============================================================
   GET GLOBAL PRIVATE DM
   ============================================================ */

router.get(
  '/dms/:otherUserId',
  async (req, res) => {
    try {
      const {
        otherUserId
      } = req.params;

      const {
        userId
      } = req.query;

      if (!userId) {
        return res.status(400).json({
          message:
            'Your user ID is required'
        });
      }

      if (
        userId === otherUserId
      ) {
        return res.status(400).json({
          message:
            'Invalid private conversation'
        });
      }

      /*
       * Global conversation.
       *
       * Works even if the server that originally
       * created the conversation no longer exists.
       */
      const messages =
        await CommunityDM.find({
          ...buildConversationQuery(
            userId,
            otherUserId
          ),

          deletedFor: {
            $nin: [userId]
          }
        })
          .sort({
            createdAt: 1
          })
          .lean();

      const isHiddenFromViewer =
        await buildHiddenMessageChecker(
          userId,
          messages
        );

      const visibleMessages =
        messages.filter(
          (message) => !isHiddenFromViewer(message)
        );

      return res.json(
        visibleMessages.map(
          formatDeletedMessage
        )
      );
    } catch (error) {
      console.error(
        'Get global DM error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to load private messages'
      });
    }
  }
);

/* ============================================================
   SEND PRIVATE DM - SERVER COMPATIBILITY ROUTE
   ============================================================ */

router.post(
  '/servers/:serverId/dm/:otherUserId',
  async (req, res) => {
    try {
      const {
        sender,
        text
      } = req.body;

      const {
        serverId,
        otherUserId
      } = req.params;

      if (
        !sender ||
        (!sender.id &&
          !sender.userId) ||
        !sender.name ||
        !sender.role
      ) {
        return res.status(400).json({
          message:
            'Sender information is required'
        });
      }

      const senderId =
        sender.id ||
        sender.userId;

      if (
        !text ||
        !text.trim()
      ) {
        return res.status(400).json({
          message:
            'Message text is required'
        });
      }

      if (
        senderId === otherUserId
      ) {
        return res.status(400).json({
          message:
            'You cannot send a private message to yourself'
        });
      }

      const server =
        await CommunityServer.findOne({
          serverId
        });

      if (!server) {
        return res.status(404).json({
          message:
            'Server not found'
        });
      }

      if (server.isDeleted) {
        return res.status(410).json({
          message:
            'This server has been deleted. Use the private messages section to continue your conversation.'
        });
      }

      const members =
        Array.isArray(server.members)
          ? server.members
          : [];

      const senderMember =
        members.find(
          (member) =>
            member.userId === senderId
        );

      const receiverMember =
        members.find(
          (member) =>
            member.userId === otherUserId
        );

      if (
        !senderMember ||
        !receiverMember
      ) {
        return res.status(403).json({
          message:
            'Both users must be members of this server'
        });
      }

      const receiverProfile =
        await UserProfile.findOne({
          userId:
            otherUserId
        }).lean();

      const receiverName =
        receiverMember.name ||
        (
          receiverProfile
            ? receiverProfile.name
            : ''
        );

      const receiverRole =
        receiverMember.role ||
        (
          receiverProfile
            ? receiverProfile.role
            : ''
        );

      const conversationId =
        makeConversationId(
          senderId,
          otherUserId
        );

      const msg =
        await CommunityDM.create({
          id:
            makeId('dm'),

          /*
           * Historical context only.
           * Conversation does NOT depend on serverId.
           */
          serverId,

          conversationId,

          senderId,

          senderName:
            sender.name,

          senderRole:
            sender.role,

          receiverId:
            otherUserId,

          receiverName,

          receiverRole,

          text:
            text.trim(),

          seen:
            false,

          edited:
            false,

          deleted:
            false,

          deletedFor:
            [],

          createdAt:
            new Date().toISOString()
        });

      return res.status(201).json({
        success: true,
        message: msg
      });
    } catch (error) {
      console.error(
        'Send community DM error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to send private message',

        error:
          process.env.NODE_ENV === 'production'
            ? undefined
            : error.message
      });
    }
  }
);

/* ============================================================
   SEND GLOBAL PRIVATE DM
   ============================================================ */

router.post(
  '/dms/:otherUserId',
  async (req, res) => {
    try {
      const {
        sender,
        text
      } = req.body;

      const {
        otherUserId
      } = req.params;

      if (
        !sender ||
        (!sender.id &&
          !sender.userId) ||
        !sender.name ||
        !sender.role
      ) {
        return res.status(400).json({
          message:
            'Sender information is required'
        });
      }

      const senderId =
        sender.id ||
        sender.userId;

      if (
        !text ||
        !text.trim()
      ) {
        return res.status(400).json({
          message:
            'Message text is required'
        });
      }

      if (
        senderId === otherUserId
      ) {
        return res.status(400).json({
          message:
            'You cannot send a private message to yourself'
        });
      }

      const receiverProfile =
        await UserProfile.findOne({
          userId:
            otherUserId
        }).lean();

      if (!receiverProfile) {
        return res.status(404).json({
          message:
            'Receiver not found'
        });
      }

      const receiverName =
        receiverProfile.name ||
        'User';

      const receiverRole =
        receiverProfile.role ||
        'student_researcher';

      const conversationId =
        makeConversationId(
          senderId,
          otherUserId
        );

      const msg =
        await CommunityDM.create({
          id:
            makeId('dm'),

          /*
           * No server dependency.
           */
          conversationId,

          senderId,

          senderName:
            sender.name,

          senderRole:
            sender.role,

          receiverId:
            otherUserId,

          receiverName,

          receiverRole,

          text:
            text.trim(),

          seen:
            false,

          edited:
            false,

          deleted:
            false,

          deletedFor:
            [],

          createdAt:
            new Date().toISOString()
        });

      return res.status(201).json({
        success: true,
        message: msg
      });
    } catch (error) {
      console.error(
        'Send global DM error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to send private message',

        error:
          process.env.NODE_ENV === 'production'
            ? undefined
            : error.message
      });
    }
  }
);

/* ============================================================
   EDIT OWN SERVER DM
   ============================================================ */

/*
 * Compatibility route only.
 *
 * IMPORTANT FIX:
 *
 * The old query was:
 *
 * id + (serverId OR ANY conversationId)
 *
 * That could edit a completely unrelated DM.
 *
 * Now it requires:
 *
 * id + serverId + senderId
 *
 * so it can never edit another conversation.
 */
router.patch(
  '/servers/:serverId/dm/:messageId',
  async (req, res) => {
    try {
      const {
        userId,
        text
      } = req.body;

      const {
        serverId,
        messageId
      } = req.params;

      if (!userId) {
        return res.status(400).json({
          message:
            'User ID is required'
        });
      }

      if (
        !text ||
        typeof text !== 'string' ||
        !text.trim()
      ) {
        return res.status(400).json({
          message:
            'Message text is required'
        });
      }

      const message =
        await CommunityDM.findOne({
          id:
            messageId,

          serverId,

          senderId:
            userId
        });

      if (!message) {
        return res.status(404).json({
          message:
            'Private message not found'
        });
      }

      if (message.deleted) {
        return res.status(400).json({
          message:
            'Deleted messages cannot be edited'
        });
      }

      message.text =
        text.trim();

      message.edited =
        true;

      message.editedAt =
        new Date().toISOString();

      await message.save();

      return res.json({
        success: true,
        message
      });
    } catch (error) {
      console.error(
        'Edit server DM error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to edit private message'
      });
    }
  }
);

/* ============================================================
   EDIT GLOBAL OWN DM
   ============================================================ */

router.patch(
  '/dms/message/:messageId',
  async (req, res) => {
    try {
      const {
        userId,
        text
      } = req.body;

      const {
        messageId
      } = req.params;

      if (!userId) {
        return res.status(400).json({
          message:
            'User ID is required'
        });
      }

      if (
        !text ||
        typeof text !== 'string' ||
        !text.trim()
      ) {
        return res.status(400).json({
          message:
            'Message text is required'
        });
      }

      const message =
        await CommunityDM.findOne({
          id:
            messageId
        });

      if (!message) {
        return res.status(404).json({
          message:
            'Private message not found'
        });
      }

      if (
        message.senderId !== userId
      ) {
        return res.status(403).json({
          message:
            'You can only edit your own message'
        });
      }

      if (message.deleted) {
        return res.status(400).json({
          message:
            'Deleted messages cannot be edited'
        });
      }

      message.text =
        text.trim();

      message.edited =
        true;

      message.editedAt =
        new Date().toISOString();

      await message.save();

      return res.json({
        success: true,
        message
      });
    } catch (error) {
      console.error(
        'Edit global DM error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to edit private message'
      });
    }
  }
);

/* ============================================================
   DELETE OWN SERVER DM
   ============================================================ */

router.delete(
  '/servers/:serverId/dm/message/:messageId',
  async (req, res) => {
    try {
      const {
        userId
      } = req.body;

      const {
        serverId,
        messageId
      } = req.params;

      if (!userId) {
        return res.status(400).json({
          message:
            'User ID is required'
        });
      }

      const message =
        await CommunityDM.findOne({
          id:
            messageId,

          serverId,

          senderId:
            userId
        });

      if (!message) {
        return res.status(404).json({
          message:
            'Private message not found'
        });
      }

      message.deleted =
        true;

      message.deletedAt =
        new Date().toISOString();

      message.text =
        'Message deleted';

      await message.save();

      return res.json({
        success: true,
        message
      });
    } catch (error) {
      console.error(
        'Delete server DM error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to delete private message'
      });
    }
  }
);

/* ============================================================
   DELETE GLOBAL OWN DM
   ============================================================ */

router.delete(
  '/dms/message/:messageId',
  async (req, res) => {
    try {
      const {
        userId
      } = req.body;

      const {
        messageId
      } = req.params;

      if (!userId) {
        return res.status(400).json({
          message:
            'User ID is required'
        });
      }

      const message =
        await CommunityDM.findOne({
          id:
            messageId
        });

      if (!message) {
        return res.status(404).json({
          message:
            'Private message not found'
        });
      }

      if (
        message.senderId !== userId
      ) {
        return res.status(403).json({
          message:
            'You can only delete your own message'
        });
      }

      message.deleted =
        true;

      message.deletedAt =
        new Date().toISOString();

      message.text =
        'Message deleted';

      await message.save();

      return res.json({
        success: true,
        message
      });
    } catch (error) {
      console.error(
        'Delete global DM error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to delete private message'
      });
    }
  }
);

/* ============================================================
   DELETE PERSONAL DM CONVERSATION FOR ME
   ============================================================ */

/*
 * This does NOT delete the conversation from MongoDB.
 *
 * It only hides the existing messages for this user.
 *
 * The other person keeps their messages.
 *
 * A future new message can make the conversation
 * appear again in the inbox.
 */
router.delete(
  '/dms/:otherUserId/me',
  async (req, res) => {
    try {
      const {
        otherUserId
      } = req.params;

      const {
        userId
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          message:
            'User ID is required'
        });
      }

      if (
        userId === otherUserId
      ) {
        return res.status(400).json({
          message:
            'Invalid private conversation'
        });
      }

      const result =
        await CommunityDM.updateMany(
          {
            ...buildConversationQuery(
              userId,
              otherUserId
            ),

            deletedFor: {
              $nin: [userId]
            }
          },

          {
            $addToSet: {
              deletedFor:
                userId
            }
          }
        );

      return res.json({
        success: true,

        deletedMessages:
          result.modifiedCount,

        message:
          'Private conversation deleted for you'
      });
    } catch (error) {
      console.error(
        'Delete DM conversation for me error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to delete private conversation'
      });
    }
  }
);

/* ============================================================
   LEGACY SERVER-SCOPED DM DELETE FOR ME
   ============================================================ */

router.delete(
  '/servers/:serverId/dm/:otherUserId/me',
  async (req, res) => {
    try {
      const {
        serverId,
        otherUserId
      } = req.params;

      const {
        userId
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          message:
            'User ID is required'
        });
      }

      const conversationId =
        makeConversationId(
          userId,
          otherUserId
        );

      await CommunityDM.updateMany(
        {
          $or: [
            {
              conversationId
            },

            {
              serverId,

              $or: [
                {
                  senderId:
                    userId,

                  receiverId:
                    otherUserId
                },

                {
                  senderId:
                    otherUserId,

                  receiverId:
                    userId
                }
              ]
            }
          ],

          deletedFor: {
            $nin: [userId]
          }
        },

        {
          $addToSet: {
            deletedFor:
              userId
          }
        }
      );

      return res.json({
        success: true,

        message:
          'Private conversation deleted for you'
      });
    } catch (error) {
      console.error(
        'Delete legacy DM conversation error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to delete private conversation'
      });
    }
  }
);

/* ============================================================
   OLD ROUTE COMPATIBILITY
   ============================================================ */

router.get(
  '/:communityId',
  async (req, res) => {
    try {
      const messages =
        await CommunityMessage.find({
          serverId:
            req.params.communityId
        })
          .sort({
            createdAt: 1
          });

      return res.json(
        messages.map(
          formatDeletedMessage
        )
      );
    } catch (error) {
      console.error(
        'Legacy community messages error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to load community messages'
      });
    }
  }
);

router.get(
  '/:communityId/members',
  async (req, res) => {
    try {
      const server =
        await CommunityServer.findOne({
          serverId:
            req.params.communityId
        }).lean();

      if (server) {
        return res.json(
          Array.isArray(
            server.members
          )
            ? server.members
            : []
        );
      }

      const users =
        await UserProfile.find({
          role:
            req.params.communityId
        }).lean();

      return res.json(
        users.map((u) => ({
          userId:
            u.userId,

          name:
            u.name,

          role:
            u.role,

          avatar:
            u.avatar || '',

          joinedAt:
            u.createdAt,

          status:
            'online'
        }))
      );
    } catch (error) {
      console.error(
        'Legacy community members error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to load community members'
      });
    }
  }
);

/* ============================================================
   EXPORT
   ============================================================ */

module.exports = router;
