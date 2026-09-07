import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
ArrowLeft,
ChevronRight,
Menu,
Plus,
Search,
Send,
Users,
X,
MessageCircle,
Server as ServerIcon,
Lock,
Sparkles,
MoreVertical,
Pencil,
Trash2,
Settings,
LogOut,
Check,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import type { UserRole } from '../../types';

type CommunityServer = {
serverId: string;
name: string;
description: string;
role: UserRole;
ownerId: string;
ownerName: string;
createdAt: string;
members: CommunityMember[];
isDeleted?: boolean;
deletedAt?: string;
};

type CommunityMember = {
userId: string;
name: string;
role: UserRole;
avatar?: string;
joinedAt: string;
status?: 'online' | 'offline';
};

type CommunityMessage = {
id: string;
serverId: string;
senderId: string;
senderName: string;
senderRole: UserRole;
text: string;
createdAt: string;
edited?: boolean;
editedAt?: string;
deleted?: boolean;
deletedAt?: string;
deletedFor?: string[];
};

type CommunityDM = {
id: string;
serverId?: string;
conversationId?: string;
senderId: string;
senderName: string;
senderRole: UserRole;
receiverId: string;
receiverName: string;
receiverRole: UserRole;
text: string;
createdAt: string;
seen?: boolean;
edited?: boolean;
editedAt?: string;
deleted?: boolean;
deletedAt?: string;
deletedFor?: string[];
};

type UnreadDM = {
userId: string;
serverId?: string | null;
conversationId?: string;
senderName: string;
senderRole: UserRole;
latestMessageAt: string;
};

type PrivateConversation = {
conversationId: string;
userId: string;
name: string;
role: UserRole;
avatar?: string;
latestMessage?: string;
latestMessageAt?: string;
unreadCount?: number;
};

type ViewMode =
| 'home'
| 'create'
| 'servers'
| 'server'
| 'dm'
| 'dms';

const API_BASE = `${window.location.protocol}//${window.location.hostname}:5000/api/community`;

const roleColors: Record<UserRole, string> = {
farmer: '#4CAF50',
student_researcher: '#EC6FA4',
company: '#6C8FF5',
landowner: '#E5B94E',
transport: '#F28C52',
};

const roleIcons: Record<UserRole, string> = {
farmer: '🌾',
student_researcher: '🎓',
company: '🏢',
landowner: '🏡',
transport: '🚚',
};

const getRoleLabels = (t: any): Record<UserRole, string> => ({
farmer: t.ccRoleFarmer,
student_researcher: t.ccRoleStudent,
company: t.ccRoleCompany,
landowner: t.ccRoleLandowner,
transport: t.ccRoleTransport,
});

const getRoleDescriptions = (t: any): Record<UserRole, string> => ({
farmer: t.ccDescFarmer,
student_researcher: t.ccDescStudent,
company: t.ccDescCompany,
landowner: t.ccDescLandowner,
transport: t.ccDescTransport,
});

const formatDate = (value: string) => {
try {
return new Date(value).toLocaleTimeString([], {
hour: '2-digit',
minute: '2-digit',
});
} catch {
return '';
}
};

const formatFullDate = (value: string) => {
try {
return new Date(value).toLocaleDateString([], {
day: 'numeric',
month: 'short',
year: 'numeric',
});
} catch {
return '';
}
};

const avatar = (
name: string,
image?: string,
size = 'w-10 h-10',
color = '#2E7D32'
) => {
if (image) {
return (
<img
src={image}
alt=""
className={`${size} rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0`}
/>
);
}

return (
<div
className={`${size} rounded-full flex items-center justify-center font-extrabold text-sm border-2 border-white shadow-sm flex-shrink-0`}
style={{
background: `${color}18`,
color,
}}
>
{name?.charAt(0)?.toUpperCase() || '?'} </div>
);
};

export const CommunityChat: React.FC = () => {
const { user } = useAuth();
const { t } = useLanguage();

const roleLabels = getRoleLabels(t);
const roleDescriptions = getRoleDescriptions(t);

const currentRole = user?.role || 'student_researcher';

const currentUserId =
user?.userId ||
user?.id ||
user?._id ||
'';

const [view, setView] = useState<ViewMode>('home');

const [servers, setServers] = useState<CommunityServer[]>([]);
const [joinedServers, setJoinedServers] = useState<CommunityServer[]>([]);

const [selectedServer, setSelectedServer] =
useState<CommunityServer | null>(null);

const [selectedMember, setSelectedMember] =
useState<CommunityMember | null>(null);

const [messages, setMessages] = useState<CommunityMessage[]>([]);
const [dmMessages, setDmMessages] = useState<CommunityDM[]>([]);

const [unreadDMs, setUnreadDMs] = useState<UnreadDM[]>([]);
const [privateConversations, setPrivateConversations] = useState<
PrivateConversation[]

> ([]);

const [loadingServers, setLoadingServers] = useState(false);
const [loadingMessages, setLoadingMessages] = useState(false);
const [loadingDM, setLoadingDM] = useState(false);
const [loadingDMInbox, setLoadingDMInbox] = useState(false);

const [serverSearch, setServerSearch] = useState('');
const [messageText, setMessageText] = useState('');
const [dmText, setDmText] = useState('');

const [createName, setCreateName] = useState('');
const [createDescription, setCreateDescription] = useState('');

const [showMobileMenu, setShowMobileMenu] = useState(false);
const [showMembersMobile, setShowMembersMobile] = useState(false);

const [showServerMenu, setShowServerMenu] = useState(false);
const [showDMMenu, setShowDMMenu] = useState(false);

const [showEditServer, setShowEditServer] = useState(false);
const [editServerName, setEditServerName] = useState('');
const [editServerDescription, setEditServerDescription] = useState('');

const [editingServerMessageId, setEditingServerMessageId] =
useState<string | null>(null);

const [editingDMId, setEditingDMId] = useState<string | null>(null);

const [editingText, setEditingText] = useState('');

const [error, setError] = useState('');
type ConfirmDialog =
  | {
      type: 'deleteServer';
    }
  | {
      type: 'deleteServerMessage';
      message: CommunityMessage;
    }
  | {
      type: 'deleteServerHistory';
    }
  | {
      type: 'deleteDMMessage';
      message: CommunityDM;
    }
  | {
      type: 'deleteDMConversation';
    }
  | null;

const [confirmDialog, setConfirmDialog] =
  useState<ConfirmDialog>(null);

const chatBottomRef = useRef<HTMLDivElement>(null);
const dmBottomRef = useRef<HTMLDivElement>(null);

const roleName = roleLabels[currentRole];
const roleColor = roleColors[currentRole];
const roleIcon = roleIcons[currentRole];

/* =========================================================
FETCH SERVERS
========================================================== */

const fetchServers = async () => {
if (!currentRole) return;


try {
  setLoadingServers(true);
  setError('');

  const response = await fetch(
    `${API_BASE}/servers/${currentRole}`
  );

  if (!response.ok) {
    throw new Error('Unable to load communities.');
  }

  const data = await response.json();

  const allServers: CommunityServer[] = Array.isArray(data)
    ? data
    : data.servers || [];

  const activeServers = allServers.filter(
    server => !server.isDeleted
  );

  setServers(activeServers);

  setJoinedServers(
    activeServers.filter(server =>
      server.members?.some(
        member => member.userId === currentUserId
      )
    )
  );
} catch (err) {
  console.error('Community server loading error:', err);
  setError(
    'Unable to load communities. Please check the backend.'
  );
} finally {
  setLoadingServers(false);
}


};

useEffect(() => {
fetchServers();
}, [currentRole, currentUserId]);

/* =========================================================
GLOBAL PRIVATE MESSAGE INBOX
========================================================== */

const fetchPrivateConversations = async () => {
if (!currentUserId) return;


try {
  setLoadingDMInbox(true);

  const response = await fetch(
    `${API_BASE}/dms/inbox/${encodeURIComponent(
      currentUserId
    )}`
  );

  if (!response.ok) {
    throw new Error(
      'Unable to load private messages.'
    );
  }

  const data = await response.json();

  const conversations: any[] = Array.isArray(data)
    ? data
    : data.conversations ||
      data.messages ||
      [];

  const normalizedConversations =
    conversations
      .map((conversation: any) => ({
        ...conversation,

        conversationId:
          conversation.conversationId ||
          conversation.userId ||
          conversation.otherUserId,

        userId:
          conversation.userId ||
          conversation.otherUserId ||
          conversation.senderId ||
          conversation.receiverId ||
          '',

        name:
          conversation.name ||
          conversation.otherUserName ||
          conversation.senderName ||
          conversation.receiverName ||
          'User',

        role:
          conversation.role ||
          conversation.otherUserRole ||
          conversation.senderRole ||
          conversation.receiverRole ||
          'student_researcher',

        avatar:
          conversation.avatar ||
          conversation.otherUserAvatar ||
          '',
      }))
      .filter(
        (conversation: PrivateConversation) =>
          conversation.userId &&
          conversation.userId !== currentUserId
      );

  setPrivateConversations(
    normalizedConversations
  );
} catch (err) {
  console.error(
    'Private message inbox error:',
    err
  );
} finally {
  setLoadingDMInbox(false);
}


};

useEffect(() => {
if (!currentUserId) return;


fetchPrivateConversations();

const interval = window.setInterval(() => {
  fetchPrivateConversations();
}, 2500);

return () => window.clearInterval(interval);


}, [currentUserId]);

/* =========================================================
UNREAD PRIVATE MESSAGES
========================================================== */

const fetchUnreadDMs = async () => {
if (!currentUserId) return;


try {
  const response = await fetch(
    `${API_BASE}/unread-dms/${encodeURIComponent(
      currentUserId
    )}`
  );

  if (!response.ok) {
    throw new Error(
      'Unable to load unread private messages.'
    );
  }

  const data = await response.json();

  const rawUnread = Array.isArray(data?.unread)
    ? data.unread
    : Array.isArray(data)
    ? data
    : [];

  const normalizedUnread: UnreadDM[] =
    rawUnread
      .map((item: any) => ({
        userId:
          item.userId ||
          item.senderId ||
          item.receiverId ||
          '',

        serverId:
          item.serverId || null,

        conversationId:
          item.conversationId,

        senderName:
          item.senderName ||
          item.name ||
          'User',

        senderRole:
          item.senderRole ||
          item.role ||
          'student_researcher',

        latestMessageAt:
          item.latestMessageAt ||
          item.createdAt ||
          new Date().toISOString(),
      }))
      .filter(
        (item: UnreadDM) =>
          item.userId &&
          item.userId !== currentUserId
      );

  const uniqueUnread = Array.from(
    new Map(
      normalizedUnread.map(item => [
        item.userId,
        item,
      ])
    ).values()
  );

  setUnreadDMs(uniqueUnread);
} catch (err) {
  console.error(
    'Unread DM loading error:',
    err
  );
}


};

useEffect(() => {
if (!currentUserId) return;


fetchUnreadDMs();

const interval = window.setInterval(() => {
  fetchUnreadDMs();
}, 2500);

return () => window.clearInterval(interval);


}, [currentUserId]);

/* =========================================================
CHECK UNREAD DM
========================================================== */

const hasUnreadDM = (userId: string) => {
return unreadDMs.some(
unread => unread.userId === userId
);
};

/* =========================================================
MARK GLOBAL DM AS SEEN
========================================================== */

const markDMAsSeen = async (
otherUserId: string
) => {
if (!currentUserId || !otherUserId) return;


setUnreadDMs(prev =>
  prev.filter(
    unread => unread.userId !== otherUserId
  )
);

try {
  const response = await fetch(
    `${API_BASE}/dms/${encodeURIComponent(
      otherUserId
    )}/seen`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: currentUserId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      'Unable to mark private messages as seen.'
    );
  }

  await fetchPrivateConversations();
} catch (err) {
  console.error(
    'Mark DM as seen error:',
    err
  );

  await fetchUnreadDMs();
}


};

/* =========================================================
SERVER MESSAGES
========================================================== */

const fetchServerMessages = async (
serverId: string
) => {
try {
setLoadingMessages(true);


  const response = await fetch(
    `${API_BASE}/servers/${serverId}/messages?userId=${encodeURIComponent(
      currentUserId
    )}`
  );

  if (!response.ok) {
    throw new Error(
      'Unable to load messages.'
    );
  }

  const data = await response.json();

  setMessages(
    Array.isArray(data)
      ? data
      : data.messages || []
  );
} catch (err) {
  console.error(
    'Message loading error:',
    err
  );
} finally {
  setLoadingMessages(false);
}


};

const fetchServerDetails = async (
serverId: string
) => {
try {
const response = await fetch(
`${API_BASE}/servers/${serverId}/details`
);


  if (!response.ok) {
    throw new Error(
      'Unable to load server details.'
    );
  }

  const data = await response.json();
  const server = data.server || data;

  if (!server || server.isDeleted) {
    setSelectedServer(null);
    setMessages([]);
    setView('servers');
    setError(
      'This community has been deleted and is no longer available.'
    );
    return;
  }

  setSelectedServer(server);

  await fetchServerMessages(
    server.serverId
  );
} catch (err) {
  console.error(
    'Server details error:',
    err
  );

  setError(
    'Unable to open this community.'
  );
}


};

const openServer = async (
server: CommunityServer
) => {
if (!server || server.isDeleted) {
setError(
'This community has been deleted and is no longer available.'
);
return;
}


setSelectedMember(null);
setShowMembersMobile(false);
setShowServerMenu(false);
setShowDMMenu(false);
setView('server');

await fetchServerDetails(
  server.serverId
);


};

/* =========================================================
JOIN SERVER
========================================================== */

const joinServer = async (
server: CommunityServer
) => {
if (!server || server.isDeleted) {
setError(
'This community has been deleted and is no longer available.'
);
return;
}


try {
  setError('');

  const response = await fetch(
    `${API_BASE}/servers/${server.serverId}/join`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          id: currentUserId,
          userId: currentUserId,
          name: user?.name || 'User',
          role: currentRole,
          avatar: user?.avatar || '',
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Unable to join server.'
    );
  }

  await fetchServers();

  const updatedServer =
    data.server || server;

  await openServer(updatedServer);
} catch (err: any) {
  console.error(
    'Join server error:',
    err
  );

  setError(
    err?.message ||
      'Unable to join this community.'
  );
}


};

/* =========================================================
CREATE SERVER
========================================================== */

const createServer = async (
event: React.FormEvent
) => {
event.preventDefault();


const name = createName.trim();
const description =
  createDescription.trim();

if (!name) return;

try {
  setError('');

  const response = await fetch(
    `${API_BASE}/servers`,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        role: currentRole,
        owner: {
          id: currentUserId,
          userId: currentUserId,
          name: user?.name || 'User',
          role: currentRole,
          avatar: user?.avatar || '',
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Unable to create server.'
    );
  }

  setCreateName('');
  setCreateDescription('');

  const newServer =
    data.server || data;

  await fetchServers();
  await openServer(newServer);
} catch (err: any) {
  console.error(
    'Create server error:',
    err
  );

  setError(
    err?.message ||
      'Unable to create community.'
  );
}


};

/* =========================================================
EDIT SERVER
========================================================== */

const openEditServer = () => {
if (!selectedServer) return;


setEditServerName(
  selectedServer.name
);

setEditServerDescription(
  selectedServer.description || ''
);

setShowEditServer(true);
setShowServerMenu(false);


};

const saveServerDetails = async (
event: React.FormEvent
) => {
event.preventDefault();


if (!selectedServer) return;

const name =
  editServerName.trim();

const description =
  editServerDescription.trim();

if (!name) return;

try {
  setError('');

  const response = await fetch(
    `${API_BASE}/servers/${selectedServer.serverId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        userId: currentUserId,
        name,
        description,
      }),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Unable to update server details.'
    );
  }

  const updatedServer =
    data.server || {
      ...selectedServer,
      name,
      description,
    };

  setSelectedServer(
    updatedServer
  );

  setServers(prev =>
    prev.map(server =>
      server.serverId ===
      updatedServer.serverId
        ? updatedServer
        : server
    )
  );

  setJoinedServers(prev =>
    prev.map(server =>
      server.serverId ===
      updatedServer.serverId
        ? updatedServer
        : server
    )
  );

  setShowEditServer(false);
} catch (err: any) {
  console.error(
    'Edit server error:',
    err
  );

  setError(
    err?.message ||
      'Unable to update server details.'
  );
}


};

/* =========================================================
DELETE SERVER
========================================================== */

const deleteServer = async () => {
  if (!selectedServer) return;

  setShowServerMenu(false);

  setConfirmDialog({
    type: 'deleteServer',
  });
};

const performDeleteServer = async () => {
  if (!selectedServer) return;

  try {
    setError('');

    const response = await fetch(
      `${API_BASE}/servers/${selectedServer.serverId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Unable to delete server.'
      );
    }

    setServers(prev =>
      prev.filter(
        server =>
          server.serverId !==
          selectedServer.serverId
      )
    );

    setJoinedServers(prev =>
      prev.filter(
        server =>
          server.serverId !==
          selectedServer.serverId
      )
    );

    setSelectedServer(null);
    setMessages([]);
    setShowServerMenu(false);

    setView('servers');

    await fetchPrivateConversations();
    await fetchUnreadDMs();
  } catch (err: any) {
    console.error(
      'Delete server error:',
      err
    );

    setError(
      err?.message ||
        'Unable to delete this server.'
    );
  }
};

/* =========================================================
SEND SERVER MESSAGE
========================================================== */

const sendServerMessage = async (
event: React.FormEvent
) => {
event.preventDefault();


if (!selectedServer) return;

if (selectedServer.isDeleted) {
  setError(
    'This server has been deleted. New messages are no longer allowed.'
  );
  return;
}

const text =
  messageText.trim();

if (!text) return;

try {
  const response = await fetch(
    `${API_BASE}/servers/${selectedServer.serverId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        sender: {
          id: currentUserId,
          userId: currentUserId,
          name: user?.name || 'User',
          role: currentRole,
          avatar: user?.avatar || '',
        },
        text,
      }),
    }
  );
 const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Unable to send message.'
    );
  }

  const newMessage =
    data.message || data;

  setMessages(prev => [
    ...prev,
    newMessage,
  ]);

  setMessageText('');
} catch (err: any) {
  console.error(
    'Send message error:',
    err
  );

  setError(
    err?.message ||
      'Unable to send message.'
  );
}


};

/* =========================================================
EDIT SERVER MESSAGE
========================================================== */

const startEditServerMessage = (
message: CommunityMessage
) => {
if (
message.senderId !==
currentUserId
)
return;


if (message.deleted) return;

setEditingServerMessageId(
  message.id
);

setEditingText(
  message.text
);


};

const cancelEditServerMessage = () => {
setEditingServerMessageId(null);
setEditingText('');
};

const saveServerMessageEdit =
async (
messageId: string
) => {
if (!selectedServer) return;


  if (selectedServer.isDeleted) {
    setError(
      'This server has been deleted.'
    );
    return;
  }

  const text =
    editingText.trim();

  if (!text) return;

  try {
    const response = await fetch(
      `${API_BASE}/servers/${selectedServer.serverId}/messages/${messageId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          userId:
            currentUserId,
          text,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Unable to edit message.'
      );
    }

    const updatedMessage =
      data.message ||
      data || {
        id: messageId,
        text,
        edited: true,
      };

    setMessages(prev =>
      prev.map(message =>
        message.id ===
        messageId
          ? {
              ...message,
              ...updatedMessage,
              text,
              edited: true,
            }
          : message
      )
    );

    cancelEditServerMessage();
  } catch (err: any) {
    console.error(
      'Edit server message error:',
      err
    );

    setError(
      err?.message ||
        'Unable to edit message.'
    );
  }
};


/* =========================================================
DELETE SERVER MESSAGE
========================================================== */

const deleteServerMessage = async (
  message: CommunityMessage
) => {
  if (!selectedServer) return;

  if (selectedServer.isDeleted) {
    setError(
      'This server has been deleted.'
    );
    return;
  }

  if (
    message.senderId !==
    currentUserId
  ) {
    return;
  }

  setConfirmDialog({
    type: 'deleteServerMessage',
    message,
  });
};

const performDeleteServerMessage = async (
  message: CommunityMessage
) => {
  if (!selectedServer) return;

  try {
    const response = await fetch(
      `${API_BASE}/servers/${selectedServer.serverId}/messages/${message.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Unable to delete message.'
      );
    }

    setMessages(prev =>
      prev.map(item =>
        item.id === message.id
          ? {
              ...item,
              text: 'Message deleted',
              deleted: true,
            }
          : item
      )
    );
  } catch (err: any) {
    console.error(
      'Delete server message error:',
      err
    );

    setError(
      err?.message ||
        'Unable to delete message.'
    );
  }
};

/* =========================================================
DELETE MY SERVER HISTORY
========================================================== */

const deleteMyServerHistory =
  async () => {
    if (!selectedServer) return;

    setShowServerMenu(false);

    setConfirmDialog({
      type: 'deleteServerHistory',
    });
  };

const performDeleteMyServerHistory =
  async () => {
    if (!selectedServer) return;

    try {
      const response = await fetch(
        `${API_BASE}/servers/${selectedServer.serverId}/messages/history/me`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            userId: currentUserId,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Unable to delete your chat history.'
        );
      }

      setMessages([]);
      setShowServerMenu(false);
    } catch (err: any) {
      console.error(
        'Delete server history error:',
        err
      );

      setError(
        err?.message ||
          'Unable to delete your chat history.'
      );
    }
  };


/* =========================================================
PRIVATE DM
========================================================== */

const openDM = async (
member: CommunityMember
) => {
if (
member.userId ===
currentUserId
)
return;


setSelectedMember(member);
setView('dm');
setDmMessages([]);
setShowMembersMobile(false);
setShowMobileMenu(false);
setShowDMMenu(false);

await markDMAsSeen(
  member.userId
);

await fetchDM(
  member.userId
);


};

const openGlobalConversation =
async (
conversation: PrivateConversation
) => {
const member: CommunityMember =
{
userId:
conversation.userId,


      name:
        conversation.name,

      role:
        conversation.role,

      avatar:
        conversation.avatar,

      joinedAt: '',

      status: 'online',
    };

  setSelectedServer(null);
  setSelectedMember(member);
  setView('dm');
  setDmMessages([]);
  setShowMobileMenu(false);
  setShowDMMenu(false);

  await markDMAsSeen(
    member.userId
  );

  await fetchDM(
    member.userId
  );
};


const fetchDM = async (
otherUserId: string
) => {
try {
setLoadingDM(true);


  const response = await fetch(
    `${API_BASE}/dms/${encodeURIComponent(
      otherUserId
    )}?userId=${encodeURIComponent(
      currentUserId
    )}`
  );

  if (!response.ok) {
    throw new Error(
      'Unable to load private messages.'
    );
  }

  const data =
    await response.json();

  setDmMessages(
    Array.isArray(data)
      ? data
      : data.messages || []
  );
} catch (err) {
  console.error(
    'DM loading error:',
    err
  );
} finally {
  setLoadingDM(false);
}


};

const sendDM = async (
event: React.FormEvent
) => {
event.preventDefault();


if (!selectedMember) return;

const text =
  dmText.trim();

if (!text) return;

try {
  const response = await fetch(
    `${API_BASE}/dms/${encodeURIComponent(
      selectedMember.userId
    )}`,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        sender: {
          id: currentUserId,
          userId: currentUserId,
          name:
            user?.name ||
            'User',
          role:
            currentRole,
          avatar:
            user?.avatar ||
            '',
        },

        receiver: {
          id:
            selectedMember.userId,
          userId:
            selectedMember.userId,
          name:
            selectedMember.name,
          role:
            selectedMember.role,
          avatar:
            selectedMember.avatar ||
            '',
        },

        text,

        serverId:
          selectedServer?.serverId ||
          undefined,
      }),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Unable to send private message.'
    );
  }

  const newMessage =
    data.message ||
    data;

  setDmMessages(prev => [
    ...prev,
    newMessage,
  ]);

  setDmText('');

  await fetchPrivateConversations();
} catch (err: any) {
  console.error(
    'Send DM error:',
    err
  );

  setError(
    err?.message ||
      'Unable to send private message.'
  );
}


};

/* =========================================================
EDIT DM
========================================================== */

const startEditDM = (
message: CommunityDM
) => {
if (
message.senderId !==
currentUserId
)
return;


if (message.deleted) return;

setEditingDMId(
  message.id
);

setEditingText(
  message.text
);


};

const cancelEditDM = () => {
setEditingDMId(null);
setEditingText('');
};

const saveDMEdit = async (
messageId: string
) => {
const text =
editingText.trim();


if (!text) return;

if (!selectedMember) return;

try {
  const response = await fetch(
    `${API_BASE}/dms/messages/${messageId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        userId:
          currentUserId,
        text,
      }),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Unable to edit private message.'
    );
  }

  const updatedMessage =
    data.message ||
    data;

  setDmMessages(prev =>
    prev.map(message =>
      message.id ===
      messageId
        ? {
            ...message,
            ...updatedMessage,
            text,
            edited: true,
          }
        : message
    )
  );

  cancelEditDM();

  await fetchPrivateConversations();
} catch (err: any) {
  console.error(
    'Edit DM error:',
    err
  );

  setError(
    err?.message ||
      'Unable to edit private message.'
  );
}


};

/* =========================================================
DELETE DM MESSAGE
========================================================== */

const deleteDMMessage = async (
  message: CommunityDM
) => {
  if (
    message.senderId !==
    currentUserId
  ) {
    return;
  }

  setConfirmDialog({
    type: 'deleteDMMessage',
    message,
  });
};

const performDeleteDMMessage = async (
  message: CommunityDM
) => {
  try {
    const response = await fetch(
      `${API_BASE}/dms/messages/${message.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Unable to delete private message.'
      );
    }

    setDmMessages(prev =>
      prev.map(item =>
        item.id === message.id
          ? {
              ...item,
              text: 'Message deleted',
              deleted: true,
            }
          : item
      )
    );

    await fetchPrivateConversations();
  } catch (err: any) {
    console.error(
      'Delete DM error:',
      err
    );

    setError(
      err?.message ||
        'Unable to delete private message.'
    );
  }
};


/* =========================================================
DELETE DM CONVERSATION FOR ME
========================================================== */

const deleteMyDMConversation =
  async () => {
    if (!selectedMember) return;

    setShowDMMenu(false);

    setConfirmDialog({
      type: 'deleteDMConversation',
    });
  };

const performDeleteMyDMConversation =
  async () => {
    if (!selectedMember) return;

    try {
      const response = await fetch(
        `${API_BASE}/dms/${encodeURIComponent(
          selectedMember.userId
        )}/delete-for-me`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            userId: currentUserId,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Unable to delete conversation.'
        );
      }

      setDmMessages([]);
      setShowDMMenu(false);

      setPrivateConversations(
        prev =>
          prev.filter(
            conversation =>
              conversation.userId !==
              selectedMember.userId
          )
      );

      setUnreadDMs(prev =>
        prev.filter(
          unread =>
            unread.userId !==
            selectedMember.userId
        )
      );

      setView('dms');
      setSelectedMember(null);
    } catch (err: any) {
      console.error(
        'Delete DM conversation error:',
        err
      );

      setError(
        err?.message ||
          'Unable to delete conversation.'
      );
    }
  };

const handleConfirmDelete = async () => {
  const action = confirmDialog;

  if (!action) return;

  setConfirmDialog(null);

  if (action.type === 'deleteServer') {
    await performDeleteServer();
    return;
  }

  if (
    action.type ===
    'deleteServerMessage'
  ) {
    await performDeleteServerMessage(
      action.message
    );
    return;
  }

  if (
    action.type ===
    'deleteServerHistory'
  ) {
    await performDeleteMyServerHistory();
    return;
  }

  if (
    action.type ===
    'deleteDMMessage'
  ) {
    await performDeleteDMMessage(
      action.message
    );
    return;
  }

  if (
    action.type ===
    'deleteDMConversation'
  ) {
    await performDeleteMyDMConversation();
  }
};
/* =========================================================
NAVIGATION
========================================================== */

const goHome = () => {
setView('home');
setSelectedServer(null);
setSelectedMember(null);
setShowServerMenu(false);
setShowDMMenu(false);
setShowMembersMobile(false);
setShowMobileMenu(false);
};

const goServers = () => {
setView('servers');
setSelectedServer(null);
setSelectedMember(null);
setShowServerMenu(false);
setShowDMMenu(false);
setShowMembersMobile(false);
};

const goServer = () => {
if (!selectedServer) {
goServers();
return;
}


setView('server');
setSelectedMember(null);
setShowDMMenu(false);


};

const goPrivateMessages = () => {
setView('dms');
setSelectedMember(null);
setSelectedServer(null);
setShowDMMenu(false);
setShowServerMenu(false);
};

/* =========================================================
DERIVED VALUES
========================================================== */

const isOwnerOfSelectedServer =
!!selectedServer &&
String(
selectedServer.ownerId
) === String(currentUserId);

const isMemberOfSelectedServer =
!!selectedServer &&
selectedServer.members?.some(
member =>
String(member.userId) ===
String(currentUserId)
);

const filteredServers =
useMemo(() => {
const query =
serverSearch
.trim()
.toLowerCase();


  if (!query) return servers;

  return servers.filter(
    server =>
      server.name
        .toLowerCase()
        .includes(query) ||
      server.description
        ?.toLowerCase()
        .includes(query) ||
      server.ownerName
        ?.toLowerCase()
        .includes(query)
  );
}, [
  servers,
  serverSearch,
]);


/* =========================================================
SCROLL
========================================================== */

useEffect(() => {
if (view !== 'server') return;


chatBottomRef.current?.scrollIntoView({
  behavior: 'smooth',
});


}, [
messages,
view,
]);

useEffect(() => {
if (view !== 'dm') return;


dmBottomRef.current?.scrollIntoView({
  behavior: 'smooth',
});


}, [
dmMessages,
view,
]);

/* =========================================================
ACTIVE DM POLLING
========================================================== */

useEffect(() => {
if (
view !== 'dm' ||
!selectedMember ||
!currentUserId
) {
return;
}


const otherUserId =
  selectedMember.userId;

const interval =
  window.setInterval(() => {
    fetchDM(otherUserId);
    fetchUnreadDMs();
    fetchPrivateConversations();
  }, 2500);

return () =>
  window.clearInterval(
    interval
  );


}, [
view,
selectedMember?.userId,
currentUserId,
]);

/* =========================================================
HOME
========================================================== */

return ( <div className="h-full min-h-0 w-full bg-transparent text-[#344139]"> <div className="h-full min-h-0 flex flex-col">


    {/* =====================================================
        TOP MOBILE BAR
    ====================================================== */}

    <div className="lg:hidden flex-shrink-0 px-4 py-3 border-b border-[#E2EAE2] bg-white/80 backdrop-blur-xl relative z-[100]">
      <div className="flex items-center justify-between">

        <button
          onClick={goHome}
          className="flex items-center gap-2"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{
              background:
                `${roleColor}14`,
            }}
          >
            {roleIcon}
          </div>

          <div className="text-left">
            <p className="font-black text-sm text-[#29352E]">
              {t.community}
            </p>

            <p className="text-[9px] text-[#89938D]">
              {roleName}
            </p>
          </div>
        </button>

        <button
          onClick={() =>
            setShowMobileMenu(
              value => !value
            )
          }
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#F4F7F4]"
        >
          <Menu className="w-5 h-5 text-[#59665E]" />
        </button>
      </div>

      {showMobileMenu && (
        <div className="absolute left-4 right-4 top-[68px] z-[99999] rounded-2xl bg-white border border-[#E1E9E1] shadow-[0_20px_60px_rgba(30,50,35,0.15)] p-2">

          <button
            onClick={() => {
              goHome();
              setShowMobileMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#F5F8F5] text-sm font-bold text-left"
          >
            <MessageCircle className="w-4 h-4" />
            {t.ccHome}
          </button>

          <button
            onClick={() => {
              goServers();
              setShowMobileMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#F5F8F5] text-sm font-bold text-left"
          >
            <ServerIcon className="w-4 h-4" />
            {t.ccServersLabel}
          </button>

          <button
            onClick={() => {
              goPrivateMessages();
              setShowMobileMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#F5F8F5] text-sm font-bold text-left"
          >
            <MessageCircle className="w-4 h-4" />
            {t.ccPrivateMessages}

            {unreadDMs.length > 0 && (
              <span className="ml-auto w-2.5 h-2.5 rounded-full bg-red-500" />
            )}
          </button>
        </div>
      )}
    </div>

    <div className="flex flex-1 min-h-0">

      {/* =================================================
          DESKTOP SIDEBAR
      ================================================== */}

      <aside className="hidden lg:flex w-[245px] flex-shrink-0 flex-col border-r border-[#E2EAE2] bg-white/70 backdrop-blur-xl">

        <div className="p-5 border-b border-[#E7ECE7]">
          <button
            onClick={goHome}
            className="w-full flex items-center gap-3 text-left"
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
              style={{
                background:
                  `${roleColor}15`,
              }}
            >
              {roleIcon}
            </div>

            <div className="min-w-0">
              <p className="font-black text-[#29352E] truncate">
                {t.community}
              </p>

              <p className="text-[10px] text-[#89938D] mt-0.5 truncate">
                {roleName}
              </p>
            </div>
          </button>
        </div>

        <div className="p-3 space-y-1">

          <button
            onClick={goHome}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-left transition ${
              view === 'home'
                ? 'bg-[#EEF7EE] text-[#2E7D32]'
                : 'text-[#68746D] hover:bg-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            {t.ccHome}
          </button>
          <button
            onClick={goServers}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-left transition ${
              view === 'servers' ||
              view === 'server'
                ? 'bg-[#EEF7EE] text-[#2E7D32]'
                : 'text-[#68746D] hover:bg-white'
            }`}
          >
            <ServerIcon className="w-4 h-4" />
            {t.ccServersLabel}

            <span className="ml-auto text-[9px] font-black text-[#A0AAA4]">
              {servers.length}
            </span>
          </button>

          <button
            onClick={goPrivateMessages}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-left transition ${
              view === 'dms' ||
              (view === 'dm' &&
                !selectedServer)
                ? 'bg-[#EEF7EE] text-[#2E7D32]'
                : 'text-[#68746D] hover:bg-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />

            <span>
              {t.ccPrivateMessages}
            </span>

            {unreadDMs.length > 0 && (
              <span className="ml-auto flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-[9px] font-black text-red-500">
                  {unreadDMs.length}
                </span>
              </span>
            )}
          </button>
        </div>

        <div className="mt-auto p-4">
          <div
            className="rounded-2xl p-4"
            style={{
              background:
                `${roleColor}09`,
              border:
                `1px solid ${roleColor}18`,
            }}
          >
            <div className="flex items-center gap-3">
              {avatar(
                user?.name ||
                  'You',
                user?.avatar,
                'w-9 h-9',
                roleColor
              )}

              <div className="min-w-0">
                <p className="text-xs font-black text-[#39453E] truncate">
                  {user?.name ||
                    'You'}
                </p>

                <p className="text-[9px] text-[#89938D] truncate mt-0.5">
                  {roleName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* =================================================
          MAIN
      ================================================== */}

      <main className="flex-1 min-w-0 min-h-0 overflow-hidden">

        {/* =================================================
            HOME
        ================================================== */}

        {view === 'home' && (
          <div className="h-full overflow-y-auto px-4 py-5 sm:px-7 sm:py-7 lg:px-9 lg:py-9">

            <div className="max-w-6xl mx-auto">

              <div
                className="rounded-[30px] p-6 sm:p-8 lg:p-10 border"
                style={{
                  background:
                    `linear-gradient(135deg, ${roleColor}12, rgba(255,255,255,0.82))`,
                  borderColor:
                    `${roleColor}20`,
                }}
              >

                <div className="flex flex-col lg:flex-row lg:items-center gap-8">

                  <div className="flex-1">

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/75 border border-[#E5EBE5] text-[9px] uppercase tracking-[0.16em] font-black text-[#7E8982]">
                      <Sparkles className="w-3 h-3" />
                      {t.ccBadge}
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#29352E] mt-5 leading-tight">
                      {t.ccHeroLine1}
                      <br />
                      {t.ccHeroLine2}
                      <br />
                      {t.ccHeroLine3}
                    </h1>

                    <p className="text-sm sm:text-base text-[#718078] leading-7 mt-5 max-w-xl">
                      {t.ccHeroParagraph}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mt-7">

                      <button
                        onClick={goServers}
                        className="px-5 py-3.5 rounded-2xl text-white text-sm font-black flex items-center justify-center gap-2 shadow-sm hover:brightness-[0.98] transition"
                        style={{
                          background:
                            roleColor,
                        }}
                      >
                        <ServerIcon className="w-4 h-4" />
                        {t.ccExploreServers}
                      </button>

                      <button
                        onClick={goPrivateMessages}
                        className="px-5 py-3.5 rounded-2xl bg-white border border-[#DDE7DE] text-sm font-black text-[#4B5850] flex items-center justify-center gap-2 hover:bg-[#F7FAF7] transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {t.ccPrivateMessages}

                        {unreadDMs.length > 0 && (
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="lg:w-[330px]">
                    <div className="rounded-[26px] bg-white/75 border border-white/80 shadow-[0_18px_50px_rgba(40,70,45,0.08)] p-6">

                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                        style={{
                          background:
                            `${roleColor}14`,
                        }}
                      >
                        {roleIcon}
                      </div>

                      <p className="text-[9px] uppercase tracking-[0.16em] font-black text-[#98A29C] mt-5">
                        {t.ccYourCommunity}
                      </p>

                      <h2 className="font-black text-xl text-[#354139] mt-1">
                        {roleName}
                      </h2>

                      <p className="text-xs text-[#7A867F] leading-5 mt-2">
                        {roleDescriptions[
                          currentRole
                        ]}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mt-5">

                        <div className="rounded-2xl bg-[#F7F9F7] p-3">
                          <p className="text-xl font-black text-[#354139]">
                            {servers.length}
                          </p>

                          <p className="text-[9px] text-[#89938D] mt-1">
                            {t.ccServersLabel}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[#F7F9F7] p-3">
                          <p className="text-xl font-black text-[#354139]">
                            {privateConversations.length}
                          </p>

                          <p className="text-[9px] text-[#89938D] mt-1">
                            {t.ccConversations}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-5">

                <button
                  onClick={goServers}
                  className="text-left rounded-[22px] bg-white/85 border border-[#E1E9E1] p-5 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(49,82,54,0.08)] transition"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#EEF7EE] flex items-center justify-center">
                    <ServerIcon className="w-5 h-5 text-[#2E7D32]" />
                  </div>

                  <h3 className="font-black text-[#354139] mt-4">
                    {t.ccFindServer}
                  </h3>

                  <p className="text-xs text-[#89938D] leading-5 mt-1">
                    {t.ccFindServerDesc}
                  </p>
                </button>

                <button
                  onClick={() =>
                    setView('create')
                  }
                  className="text-left rounded-[22px] bg-white/85 border border-[#E1E9E1] p-5 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(49,82,54,0.08)] transition"
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{
                      background:
                        `${roleColor}14`,
                    }}
                  >
                    <Plus
                      className="w-5 h-5"
                      style={{
                        color:
                          roleColor,
                      }}
                    />
                  </div>

                  <h3 className="font-black text-[#354139] mt-4">
                    {t.ccCreateServerCard}
                  </h3>

                  <p className="text-xs text-[#89938D] leading-5 mt-1">
                    {t.ccCreateServerCardDesc}
                  </p>
                </button>

                <button
                  onClick={
                    goPrivateMessages
                  }
                  className="text-left rounded-[22px] bg-white/85 border border-[#E1E9E1] p-5 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(49,82,54,0.08)] transition"
                >
                  <div className="relative w-11 h-11 rounded-2xl bg-[#F5F8F5] flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#68746D]" />

                    {unreadDMs.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white" />
                    )}
                  </div>

                  <h3 className="font-black text-[#354139] mt-4">
                    {t.ccPrivateMessages}
                  </h3>

                  <p className="text-xs text-[#89938D] leading-5 mt-1">
                    {t.ccPrivateMessagesCardDesc}
                  </p>
                </button>

              </div>
            </div>
          </div>
        )}

        {/* =================================================
            CREATE SERVER
        ================================================== */}

        {view === 'create' && (
          <div className="h-full overflow-y-auto px-4 py-5 sm:px-7 sm:py-7 lg:px-9 lg:py-9">

            <div className="max-w-2xl mx-auto">

              <button
                onClick={goHome}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#738078] hover:text-[#2E7D32] transition"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.community}
              </button>

              <div className="mt-5">
                <div className="flex items-center gap-3">

                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                    style={{
                      background:
                        `${roleColor}14`,
                    }}
                  >
                    {roleIcon}
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] font-black text-[#89938D]">
                      {t.ccNewCommunity}
                    </p>

                    <h1 className="text-2xl sm:text-3xl font-black text-[#29352E] mt-1">
                      {t.ccCreateYourServer}
                    </h1>
                  </div>
                </div>

                <p className="text-sm text-[#7A867F] mt-3 leading-6">
                  {t.ccCreateServerIntro.replace('{role}', roleName.toLowerCase())}
                </p>
              </div>

              <form
                onSubmit={createServer}
                className="mt-6 rounded-[26px] bg-white/90 border border-[#E1E9E1] p-5 sm:p-7 shadow-[0_15px_45px_rgba(30,50,35,0.05)]"
              >

                <label className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#59655E]">
                  {t.ccServerNameLabel}
                </label>

                <input
                  required
                  value={createName}
                  onChange={e =>
                    setCreateName(
                      e.target.value
                    )
                  }
                  placeholder={t.ccServerNamePlaceholder}
                  className="w-full mt-2 px-4 py-3.5 rounded-2xl border border-[#DDE7DE] bg-[#FBFCFB] text-sm text-[#344139] placeholder:text-[#A1AAA4] outline-none focus:bg-white transition"
                />

                <label className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#59655E] mt-5">
                  {t.ccDescriptionLabel}
                </label>

                <textarea
                  value={
                    createDescription
                  }
                  onChange={e =>
                    setCreateDescription(
                      e.target.value
                    )
                  }
                  placeholder={t.ccDescriptionPlaceholder}
                  rows={4}
                  className="w-full mt-2 px-4 py-3.5 rounded-2xl border border-[#DDE7DE] bg-[#FBFCFB] text-sm text-[#344139] placeholder:text-[#A1AAA4] outline-none resize-none focus:bg-white transition"
                />

                <div
                  className="mt-4 rounded-2xl p-4"
                  style={{
                    background:
                      `${roleColor}09`,
                    border:
                      `1px solid ${roleColor}20`,
                  }}
                >
                  <div className="flex items-start gap-3">

                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          `${roleColor}15`,
                      }}
                    >
                      {roleIcon}
                    </div>

                    <div>
                      <p className="text-xs font-black text-[#39453E]">
                        {t.ccWhoCanJoin}
                      </p>

                      <p className="text-xs text-[#7A867F] mt-1 leading-5">
                        {t.ccWhoCanJoinDesc.replace('{role}', roleName.toLowerCase())}
                      </p>
                    </div>

                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    !createName.trim()
                  }
                  className="w-full mt-5 py-3.5 rounded-2xl text-white text-sm font-black disabled:opacity-40 hover:brightness-[0.98] transition shadow-sm"
                  style={{
                    background:
                      `linear-gradient(135deg, ${roleColor}, ${roleColor}D9)`,
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    {t.ccCreateServerBtn}
                  </span>
                </button>

              </form>
            </div>
          </div>
        )}

        {/* =================================================
            SERVER LIST
        ================================================== */}

        {view === 'servers' && (
          <div className="h-full overflow-y-auto px-4 py-5 sm:px-7 sm:py-6 lg:px-8 lg:py-7">

            <div className="max-w-6xl mx-auto">

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

                <div>
                  <button
                    onClick={goHome}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#738078] hover:text-[#2E7D32] transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t.community}
                  </button>

                  <div className="flex items-center gap-3 mt-4">

                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                      style={{
                        background:
                          `${roleColor}14`,
                      }}
                    >
                      {roleIcon}
                    </div>

                    <div>
                      <h1 className="text-2xl sm:text-3xl font-black text-[#29352E]">
                        {t.ccEnterServer}
                      </h1>

                      <p className="text-xs sm:text-sm text-[#7A867F] mt-1">
                        {t.ccCommunitiesAvailable
                          .replace('{count}', String(servers.length))
                          .replace('{role}', roleName.toLowerCase())}
                      </p>
                    </div>

                  </div>
                </div>

                <button
                  onClick={() =>
                    setView('create')
                  }
                  className="px-5 py-3 rounded-2xl text-white text-sm font-black flex items-center justify-center gap-2 shadow-sm hover:brightness-[0.98] transition"
                  style={{
                    background:
                      roleColor,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  {t.ccCreateYourServer}
                </button>

              </div>

              <div className="relative mt-6">

                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A29C]" />

                <input
                  value={
                    serverSearch
                  }
                  onChange={e =>
                    setServerSearch(
                      e.target.value
                    )
                  }
                  placeholder={t.ccSearchServersPlaceholder.replace('{role}', roleName.toLowerCase())}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#DDE7DE] bg-white/90 text-sm outline-none focus:border-[#A7C5AA] transition"
                />
              </div>

              {loadingServers ? (
                <div className="py-20 text-center">

                  <div
                    className="w-10 h-10 rounded-full border-2 border-transparent mx-auto animate-spin"
                    style={{
                      borderTopColor:
                        roleColor,
                      borderRightColor:
                        `${roleColor}35`,
                    }}
                  />

                  <p className="text-sm text-[#89938D] mt-4">
                    {t.ccLoadingCommunities}
                  </p>

                </div>
              ) : filteredServers.length === 0 ? (
                <div className="py-20 text-center">

                  <div
                    className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl"
                    style={{
                      background:
                        `${roleColor}12`,
                    }}
                  >
                    {roleIcon}
                  </div>

                  <h2 className="font-black text-xl text-[#354139] mt-5">
                    {t.ccNoServersFound}
                  </h2>

                  <p className="text-sm text-[#89938D] mt-2">
                    {t.ccBeFirstToCreate.replace('{role}', roleName.toLowerCase())}
                  </p>

                  <button
                    onClick={() =>
                      setView('create')
                    }
                    className="mt-5 px-5 py-3 rounded-2xl text-white text-sm font-black"
                    style={{
                      background:
                        roleColor,
                    }}
                  >
                    {t.ccCreateYourServer}
                  </button>

                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">

                  {filteredServers.map(
                    server => {
                      const joined =
                        server.members?.some(
                          member =>
                            member.userId ===
                            currentUserId
                        );

                      return (
                        <div
                          key={
                            server.serverId
                          }
                          className="group flex flex-col rounded-[22px] bg-white/92 border border-[#E1E9E1] p-5 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(49,82,54,0.09)] transition-all duration-200"
                        >

                          <div className="flex items-start gap-3.5">

                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                              style={{
                                background:
                                  `${roleColor}14`,
                              }}
                            >
                              {roleIcon}
                            </div>

                            <div className="min-w-0 flex-1">

                              <h2 className="font-black text-[#344139] truncate">
                                {server.name}
                              </h2>

                              <p className="text-[10px] text-[#929C96] mt-1 truncate">
                                Created by{' '}
                                {
                                  server.ownerName
                                }
                              </p>

                            </div>

                          </div>

                          <p className="text-sm text-[#68746D] leading-6 mt-4 min-h-[66px]">
                            {server.description ||
                              'A community for agricultural collaboration.'}
                          </p>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#EDF1ED]">

                            <div className="flex items-center gap-2 text-[11px] font-bold text-[#818C85]">
                              <Users className="w-4 h-4" />

                              {server.members?.length ||
                                0}{' '}

                              {server.members?.length ===
                              1
                                ? 'member'
                                : 'members'}
                            </div>

                            <span className="text-[10px] text-[#A0A9A4]">
                              {formatFullDate(
                                server.createdAt
                              )}
                            </span>

                          </div>

                          <button
                            onClick={() =>
                              joined
                                ? openServer(
                                    server
                                  )
                                : joinServer(
                                    server
                                  )
                            }
                            className="w-full mt-4 py-3 rounded-xl text-sm font-black transition"
                            style={
                              joined
                                ? {
                                    background:
                                      '#EEF7EE',
                                    color:
                                      '#2E7D32',
                                  }
                                : {
                                    background:
                                      roleColor,
                                    color:
                                      '#FFFFFF',
                                  }
                            }
                          >
                            {joined
                              ? 'Open Server'
                              : 'Join Server'}
                          </button>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>
          </div>
        )}

        {/* =================================================
            PRIVATE MESSAGES LIST
        ================================================== */}

        {view === 'dms' && (
          <div className="h-full overflow-y-auto px-4 py-5 sm:px-7 sm:py-6 lg:px-9 lg:py-7">

            <div className="max-w-4xl mx-auto">

              <button
                onClick={goHome}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#738078] hover:text-[#2E7D32] transition"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.community}
              </button>

              <div className="flex items-center gap-3 mt-5">

                <div className="w-12 h-12 rounded-2xl bg-[#EEF7EE] flex items-center justify-center text-[#2E7D32]">
                  <MessageCircle className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-black text-[#2E7D32]">
                    {t.ccPrivateLabel}
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-black text-[#29352E] mt-1">
                    {t.ccPrivateMessages}
                  </h1>
                </div>

              </div>

              <p className="text-sm text-[#7A867F] mt-3 leading-6 max-w-2xl">
                {t.ccPrivateMessagesDesc}
              </p>

              <div className="mt-6 rounded-[24px] bg-white/90 border border-[#E1E9E1] overflow-hidden">

                {loadingDMInbox &&
                privateConversations.length === 0 ? (
                  <div className="py-16 text-center text-sm text-[#89938D]">
                    {t.ccLoadingPrivateMessages}
                  </div>
                ) : privateConversations.length ===
                  0 ? (
                  <div className="py-16 text-center px-6">

                    <div className="w-14 h-14 rounded-2xl bg-[#F5F8F5] mx-auto flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-[#98A29C]" />
                    </div>

                    <h2 className="font-black text-lg text-[#354139] mt-4">
                      {t.ccNoPrivateConversations}
                    </h2>

                    <p className="text-sm text-[#89938D] mt-2">
                      {t.ccNoPrivateConversationsDesc}
                    </p>

                  </div>
                ) : (
                  <div className="divide-y divide-[#EDF1ED]">

                    {privateConversations.map(
                      conversation => {
                        const unread =
                          hasUnreadDM(
                            conversation.userId
                          );

                        return (
                          <button
                            key={
                              conversation.conversationId
                            }
                            onClick={() =>
                              openGlobalConversation(
                                conversation
                              )
                            }
                            className="w-full flex items-center gap-4 px-4 sm:px-5 py-4 text-left hover:bg-[#F8FAF8] transition"
                          >

                            <div className="relative flex-shrink-0">

                              {avatar(
                                conversation.name,
                                conversation.avatar,
                                'w-12 h-12',
                                roleColors[
                                  conversation.role
                                ] ||
                                  roleColor
                              )}

                              {unread && (
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white shadow-[0_2px_6px_rgba(239,68,68,0.35)]" />
                              )}

                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex items-center gap-2">

                                <p
                                  className={`text-sm truncate ${
                                    unread
                                      ? 'font-black text-[#28352E]'
                                      : 'font-bold text-[#3B4740]'
                                  }`}
                                >
                                  {
                                    conversation.name
                                  }
                                </p>

                                <span
                                  className="text-[8px] px-2 py-0.5 rounded-full font-black flex-shrink-0"
                                  style={{
                                    background:
                                      `${
                                        roleColors[
                                          conversation.role
                                        ] ||
                                        roleColor
                                      }13`,
                                    color:
                                      roleColors[
                                        conversation.role
                                      ] ||
                                      roleColor,
                                  }}
                                >
                                  {
                                    roleLabels[
                                      conversation.role
                                    ]
                                  }
                                </span>

                              </div>

                              <p
                                className={`text-xs truncate mt-1 ${
                                  unread
                                    ? 'font-bold text-[#59665E]'
                                    : 'text-[#89938D]'
                                }`}
                              >
                                {
                                  conversation.latestMessage ||
                                  'Private conversation'
                                }
                              </p>

                            </div>

                            <div className="flex flex-col items-end gap-1 flex-shrink-0">

                              {conversation.latestMessageAt && (
                                <span className="text-[9px] text-[#A0AAA4]">
                                  {formatDate(
                                    conversation.latestMessageAt
                                  )}
                                </span>
                              )}

                              <ChevronRight className="w-4 h-4 text-[#B0B9B3]" />

                            </div>

                          </button>
                        );
                      }
                    )}

                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* =================================================
            SERVER CHAT
        ================================================== */}

        {view === 'server' &&
          selectedServer && (
            <div className="flex flex-col h-full min-h-0">

              {/* SERVER HEADER */}

              <header className="relative z-[1000] flex-shrink-0 px-4 sm:px-6 lg:px-7 py-3.5 border-b border-[#E2EAE2] bg-white/90 backdrop-blur-xl">

                <div className="flex items-center gap-3">

                  <button
                    onClick={
                      goServers
                    }
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#F0F5F0] transition flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#526058]" />
                  </button>

                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      background:
                        `${roleColor}15`,
                    }}
                  >
                    {roleIcon}
                  </div>

                  <div className="min-w-0">
                    <h1 className="font-black text-[#2D3932] truncate">
                      {
                        selectedServer.name
                      }
                    </h1>

                    <p className="text-[10px] sm:text-xs text-[#7F8983] truncate mt-0.5 max-w-[420px]">
                      {
                        selectedServer.description ||
                        t.ccOneCommunityConversation
                      }
                    </p>
                  </div>

                  <div className="ml-auto flex items-center gap-2 relative z-[10000]">

                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F5F8F5] text-[10px] font-bold text-[#7D8880]">
                      <Users className="w-3.5 h-3.5" />
                      {
                        selectedServer.members?.length ||
                        0
                      }
                    </div>

                    {isOwnerOfSelectedServer && (
                      <div className="relative z-[99999]">

                        <button
                          type="button"
                          onClick={() =>
                            setShowServerMenu(
                              value =>
                                !value
                            )
                          }
                          className="relative z-[100000] w-9 h-9 rounded-xl flex items-center justify-center bg-[#F4F7F4] hover:bg-[#EAF1EA] transition"
                          title={t.ccEditServer}
                          aria-label={t.ccEditServer}
                        >
                          <MoreVertical className="w-4 h-4 text-[#59665E]" />
                        </button>

                        {showServerMenu && (
                          <div className="absolute right-0 top-11 z-[999999] w-56 rounded-2xl border border-[#E1E9E1] bg-white shadow-[0_20px_60px_rgba(30,50,35,0.20)] p-1.5">

                            <button
                              type="button"
                              onClick={
                                openEditServer
                              }
                              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#26332B] text-left hover:bg-[#F3F7F3] transition"
                            >                              <Settings className="w-[17px] h-[17px] flex-shrink-0" />

                              <span>
                                {t.ccEditServer}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={
                                deleteMyServerHistory
                              }
                              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#26332B] text-left hover:bg-[#FFF7E9] transition"
                            >
                              <Trash2 className="w-[17px] h-[17px] flex-shrink-0" />

                              <span>
                                {t.ccDeleteMyChatHistory}
                              </span>
                            </button>

                            <div className="h-px bg-[#EDF0EE] my-1" />

                            <button
                              type="button"
                              onClick={
                                deleteServer
                              }
                              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 text-sm font-semibold text-left hover:bg-red-50 transition"
                            >
                              <Trash2 className="w-[17px] h-[17px] flex-shrink-0" />

                              <span>
                                {t.ccDeleteServer}
                              </span>
                            </button>

                          </div>
                        )}

                      </div>
                    )}

                    {!isOwnerOfSelectedServer && (
                      <button
                        type="button"
                        onClick={
                          deleteMyServerHistory
                        }
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#F4F7F4] hover:bg-[#EAF1EA]"
                        title={t.ccDeleteMyChatHistory}
                      >
                        <MoreVertical className="w-4 h-4 text-[#59665E]" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setShowMembersMobile(
                          value =>
                            !value
                        )
                      }
                      className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center bg-[#F4F7F4]"
                    >
                      <Users className="w-4 h-4 text-[#59665E]" />
                    </button>

                  </div>
                </div>
              </header>

              {/* EDIT SERVER MODAL */}

              {showEditServer && (
                <div className="absolute inset-0 z-[1000000] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">

                  <form
                    onSubmit={
                      saveServerDetails
                    }
                    className="w-full max-w-lg rounded-[26px] bg-white border border-[#E1E9E1] shadow-[0_25px_80px_rgba(20,40,25,0.20)] p-5 sm:p-6"
                  >

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-[9px] uppercase tracking-[0.18em] font-black text-[#8A958E]">
                          {t.ccServerOwner}
                        </p>

                        <h2 className="text-xl font-black text-[#29352E] mt-1">
                          {t.ccEditServer}
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setShowEditServer(
                            false
                          )
                        }
                        className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#F4F7F4]"
                      >
                        <X className="w-4 h-4" />
                      </button>

                    </div>

                    <label className="block mt-5 text-[10px] uppercase tracking-[0.14em] font-black text-[#59655E]">
                      {t.ccServerNameLabel}
                    </label>

                    <input
                      required
                      value={
                        editServerName
                      }
                      onChange={e =>
                        setEditServerName(
                          e.target.value
                        )
                      }
                      className="w-full mt-2 px-4 py-3.5 rounded-2xl border border-[#DDE7DE] bg-[#FBFCFB] text-sm outline-none focus:bg-white"
                    />

                    <label className="block mt-5 text-[10px] uppercase tracking-[0.14em] font-black text-[#59655E]">
                      {t.ccDescriptionLabel}
                    </label>

                    <textarea
                      rows={4}
                      value={
                        editServerDescription
                      }
                      onChange={e =>
                        setEditServerDescription(
                          e.target.value
                        )
                      }
                      className="w-full mt-2 px-4 py-3.5 rounded-2xl border border-[#DDE7DE] bg-[#FBFCFB] text-sm outline-none resize-none focus:bg-white"
                    />

                    <div className="flex gap-2 mt-5">

                      <button
                        type="button"
                        onClick={() =>
                          setShowEditServer(
                            false
                          )
                        }
                        className="flex-1 py-3 rounded-2xl bg-[#F3F6F3] text-sm font-black text-[#59655E]"
                      >
                        {t.ccCancel}
                      </button>

                      <button
                        type="submit"
                        disabled={
                          !editServerName.trim()
                        }
                        className="flex-1 py-3 rounded-2xl text-white text-sm font-black disabled:opacity-40"
                        style={{
                          background:
                            roleColor,
                        }}
                      >
                        {t.ccSaveChanges}
                      </button>

                    </div>

                  </form>
                </div>
              )}

              {/* CHAT + MEMBERS */}

              <div className="flex flex-1 min-h-0">

                {/* CHAT */}

                <section className="flex flex-col min-w-0 flex-1 min-h-0">

                  <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5">

                    <div className="max-w-4xl mx-auto">

                      <div
                        className="rounded-[22px] p-5 sm:p-6 border text-center"
                        style={{
                          background:
                            `linear-gradient(135deg, ${roleColor}0D, rgba(255,255,255,0.8))`,
                          borderColor:
                            `${roleColor}22`,
                        }}
                      >

                        <div
                          className="w-13 h-13 rounded-2xl mx-auto flex items-center justify-center text-2xl"
                          style={{
                            background:
                              `${roleColor}15`,
                          }}
                        >
                          {roleIcon}
                        </div>

                        <h2 className="text-lg sm:text-xl font-black text-[#354139] mt-3">
                          {t.ccWelcomeTo}{' '}
                          {
                            selectedServer.name
                          }
                        </h2>

                        <p className="text-xs sm:text-sm text-[#7A867F] mt-2 max-w-xl mx-auto leading-6">
                          {
                            selectedServer.description ||
                            t.ccStartConversation
                          }
                        </p>

                        <div className="inline-flex items-center gap-2 mt-3 px-3 py-2 rounded-xl bg-white/80 border border-[#E4EAE4] text-[10px] font-bold text-[#7C8780]">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {t.ccOneCommunityConversation}
                        </div>

                      </div>

                      <div className="mt-5">

                        {loadingMessages &&
                        messages.length ===
                          0 ? (
                          <div className="text-center py-12 text-sm text-[#929C96]">
                            {t.ccLoadingMessages}
                          </div>
                        ) : messages.length ===
                          0 ? (
                          <div className="text-center py-12">

                            <div className="w-12 h-12 rounded-2xl bg-[#F5F8F5] mx-auto flex items-center justify-center">
                              <MessageCircle className="w-5 h-5 text-[#98A29C]" />
                            </div>

                            <p className="text-sm font-bold text-[#69756E] mt-4">
                              {t.ccNoMessagesYetTitle}
                            </p>

                            <p className="text-xs text-[#9AA39D] mt-1">
                              {t.ccStartConversation}
                            </p>

                          </div>
                        ) : (
                          <div className="space-y-1">

                            {messages.map(
                              (
                                message,
                                index
                              ) => {

                                const previous =
                                  messages[
                                    index -
                                      1
                                  ];

                                const sameSender =
                                  previous &&
                                  previous.senderId ===
                                    message.senderId;

                                const mine =
                                  message.senderId ===
                                  currentUserId;

                                const isEditing =
                                  editingServerMessageId ===
                                  message.id;

                                return (
                                  <div
                                    key={
                                      message.id
                                    }
                                    className={`group relative flex gap-3 rounded-2xl px-3 py-3 hover:bg-white/65 transition ${
                                      sameSender
                                        ? 'mt-0'
                                        : 'mt-3'
                                    }`}
                                  >

                                    {sameSender ? (
                                      <div className="w-10 flex-shrink-0" />
                                    ) : (
                                      avatar(
                                        message.senderName,
                                        undefined,
                                        'w-10 h-10',
                                        roleColor
                                      )
                                    )}

                                    <div className="min-w-0 flex-1">

                                      {!sameSender && (
                                        <div className="flex flex-wrap items-center gap-2">

                                          <span className="font-black text-sm text-[#344139]">
                                            {
                                              message.senderName
                                            }
                                          </span>

                                          <span
                                            className="text-[8px] px-2 py-0.5 rounded-full font-black"
                                            style={{
                                              background:
                                                `${roleColor}13`,
                                              color:
                                                roleColor,
                                            }}
                                          >
                                            {
                                              roleLabels[
                                                message
                                                  .senderRole
                                              ]
                                            }
                                          </span>

                                          <span className="text-[9px] text-[#A0AAA4]">
                                            {formatDate(
                                              message.createdAt
                                            )}
                                          </span>

                                        </div>
                                      )}

                                      {isEditing ? (
                                        <div className="mt-2 flex flex-col gap-2">

                                          <input
                                            autoFocus
                                            value={
                                              editingText
                                            }
                                            onChange={e =>
                                              setEditingText(
                                                e.target
                                                  .value
                                              )
                                            }
                                            onKeyDown={e => {
                                              if (
                                                e.key ===
                                                'Enter'
                                              ) {
                                                e.preventDefault();

                                                saveServerMessageEdit(
                                                  message.id
                                                );
                                              }

                                              if (
                                                e.key ===
                                                'Escape'
                                              ) {
                                                cancelEditServerMessage();
                                              }
                                            }}
                                            className="w-full px-3 py-2.5 rounded-xl border border-[#CFE0D0] bg-white text-sm outline-none"
                                          />

                                          <div className="flex gap-2">

                                            <button
                                              type="button"
                                              onClick={() =>
                                                saveServerMessageEdit(
                                                  message.id
                                                )
                                              }
                                              className="px-3 py-1.5 rounded-lg text-white text-[10px] font-black"
                                              style={{
                                                background:
                                                  roleColor,
                                              }}
                                            >
                                              <span className="flex items-center gap-1">
                                                <Check className="w-3 h-3" />
                                                {t.ccSave}
                                              </span>
                                            </button>

                                            <button
                                              type="button"
                                              onClick={
                                                cancelEditServerMessage
                                              }
                                              className="px-3 py-1.5 rounded-lg bg-[#F1F4F1] text-[#657169] text-[10px] font-black"
                                            >
                                              {t.ccCancel}
                                            </button>

                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex items-start gap-2">

                                          <p
                                            className={`flex-1 text-sm leading-6 break-words ${
                                              message.deleted
                                                ? 'text-[#9AA39D] italic'
                                                : 'text-[#4C5851]'
                                            } ${
                                              sameSender
                                                ? 'mt-0'
                                                : 'mt-1'
                                            }`}
                                          >
                                            {
                                              message.text
                                            }
                                          </p>

                                          {mine &&
                                            !message.deleted && (
                                              <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1 flex-shrink-0">

                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    startEditServerMessage(
                                                      message
                                                    )
                                                  }
                                                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#EEF3EE]"
                                                  title="Edit message"
                                                >
                                                  <Pencil className="w-3.5 h-3.5 text-[#68756D]" />
                                                </button>

                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    deleteServerMessage(
                                                      message
                                                    )
                                                  }
                                                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"
                                                  title="Delete message"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                                </button>

                                              </div>
                                            )}

                                        </div>
                                      )}

                                      {!isEditing &&
                                        message.edited &&
                                        !message.deleted && (
                                          <span className="text-[8px] text-[#A7B0AA] ml-1">
                                            edited
                                          </span>
                                        )}

                                    </div>
                                  </div>
                                );
                              }
                            )}

                          </div>
                        )}

                        <div ref={chatBottomRef} />

                      </div>
                    </div>
                  </div>

                  {isMemberOfSelectedServer ? (
                    <form
                      onSubmit={
                        sendServerMessage
                      }
                      className="flex-shrink-0 px-4 sm:px-6 py-3 border-t border-[#E2EAE2] bg-white/72 backdrop-blur-xl"
                    >

                      <div className="max-w-4xl mx-auto flex items-center gap-2">

                        {avatar(
                          user?.name ||
                            'You',
                          user?.avatar,
                          'w-9 h-9',
                          roleColor
                        )}

                        <div className="relative flex-1">

                          <input
                            value={
                              messageText
                            }
                            onChange={e =>
                              setMessageText(
                                e.target.value
                              )
                            }
                            placeholder={`Message ${selectedServer.name}...`}
                            className="w-full px-4 py-3 rounded-2xl border border-[#DDE7DE] bg-white text-sm outline-none pr-12 focus:border-[#A9C7AC] transition"
                          />

                          <button
                            type="submit"
                            disabled={
                              !messageText.trim()
                            }
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-30 transition"
                            style={{
                              background:
                                roleColor,
                            }}
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="flex-shrink-0 p-4 border-t border-[#E2EAE2] bg-white/72">

                      <button
                        onClick={() =>
                          joinServer(
                            selectedServer
                          )
                        }
                        className="w-full py-3.5 rounded-2xl text-white text-sm font-black"
                        style={{
                          background:
                            roleColor,
                        }}
                      >
                        {t.ccJoinServerToChat}
                      </button>

                    </div>
                  )}

                </section>

                {/* MEMBERS */}

                <aside
                  className={`
                    ${
                      showMembersMobile
                        ? 'fixed inset-0 z-40 flex'
                        : 'hidden'
                    }
                    lg:relative lg:flex
                    lg:w-[285px]
                    flex-shrink-0
                    flex-col
                    border-l border-[#E2EAE2]
                    bg-white/82
                    backdrop-blur-xl
                  `}
                >

                  <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-[#E3EAE3]">

                    <div>
                      <p className="font-black text-sm text-[#354139]">
                        {t.ccMembers}
                      </p>

                      <p className="text-[10px] text-[#8A958E] mt-0.5">
                        {
                          selectedServer.members?.length ||
                          0
                        }{' '}
                        {t.ccPeopleSuffix}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setShowMembersMobile(
                          false
                        )
                      }
                      className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#F2F6F2]"
                    >
                      <X className="w-4 h-4" />
                    </button>

                  </div>

                  <div className="hidden lg:block px-5 py-4 border-b border-[#E3EAE3]">

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-xs font-black text-[#354139]">
                          {t.ccMembers}
                        </p>

                        <p className="text-[10px] text-[#89938D] mt-1">
                          {
                            selectedServer.members?.length ||
                            0
                          }{' '}
                          {t.ccPeopleSuffix}
                        </p>
                      </div>

                      <div className="w-9 h-9 rounded-xl bg-[#F4F7F4] flex items-center justify-center">
                        <Users className="w-4 h-4 text-[#77827B]" />
                      </div>

                    </div>
                  </div>

                  <div className="p-3 overflow-y-auto min-h-0">

                    <p className="px-2 py-2 text-[9px] uppercase tracking-[0.16em] font-black text-[#A0AAA4]">
                      {t.ccCommunityMembers}
                    </p>

                    <div className="space-y-1">

                      {selectedServer.members?.map(
                        member => {
                          const unread =
                            hasUnreadDM(
                              member.userId
                            );

                          return (
                            <button
                              key={
                                member.userId
                              }
                              onClick={() =>
                                openDM(
                                  member
                                )
                              }
                              disabled={
                                member.userId ===
                                currentUserId
                              }
                              className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition ${
                                member.userId ===
                                currentUserId
                                  ? 'bg-[#F5F8F5]'
                                  : 'hover:bg-white hover:shadow-sm'
                              }`}
                            >

                              <div className="relative flex-shrink-0">

                                {avatar(
                                  member.name,
                                  member.avatar,
                                  'w-9 h-9',
                                  roleColor
                                )}

                                {member.userId !==
                                  currentUserId && (
                                  <span
                                    className="absolute right-0 bottom-0 w-2.5 h-2.5 rounded-full border-2 border-white"
                                    style={{
                                      background:
                                        member.status ===
                                        'offline'
                                          ? '#B6BDB8'
                                          : '#58B765',
                                    }}
                                  />
                                )}

                                {member.userId !==
                                  currentUserId &&
                                  unread && (
                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white shadow-[0_2px_6px_rgba(239,68,68,0.35)] z-10" />
                                  )}

                              </div>

                              <div className="min-w-0 flex-1">

                                <p
                                  className={`text-xs truncate ${
                                    unread
                                      ? 'font-black text-[#28352E]'
                                      : 'font-black text-[#3B4740]'
                                  }`}
                                >
                                  {
                                    member.name
                                  }

                                  {member.userId ===
                                  currentUserId
                                    ? ' (You)'
                                    : ''}
                                </p>

                                <p className="text-[9px] text-[#89938D] truncate mt-0.5">
                                  {member.userId ===
                                  currentUserId
                                    ? 'You'
                                    : roleLabels[
                                        member.role
                                      ]}
                                </p>

                              </div>

                              {member.userId !==
                                currentUserId && (
                                <MessageCircle
                                  className={`w-3.5 h-3.5 ${
                                    unread
                                      ? 'text-red-400'
                                      : 'text-[#A0AAA4]'
                                  }`}
                                />
                              )}

                            </button>
                          );
                        }
                      )}

                    </div>
                  </div>
                </aside>

              </div>
            </div>
          )}

        {/* =================================================
            PRIVATE DM
        ================================================== */}

        {view === 'dm' &&
          selectedMember && (
            <div className="flex flex-col h-full min-h-0">

              <header className="relative z-[1000] flex-shrink-0 px-4 sm:px-6 lg:px-7 py-3.5 border-b border-[#E2EAE2] bg-white/90 backdrop-blur-xl">

                <div className="flex items-center gap-3">

                  <button
                    onClick={
                      selectedServer
                        ? goServer
                        : goPrivateMessages
                    }
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#F0F5F0] transition"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#526058]" />
                  </button>

                  {avatar(
                    selectedMember.name,
                    selectedMember.avatar,
                    'w-10 h-10',
                    roleColor
                  )}

                  <div className="min-w-0">

                    <h1 className="font-black text-[#303C35] truncate">
                      {
                        selectedMember.name
                      }
                    </h1>

                    <p className="text-[10px] text-[#89938D] mt-0.5">
                      {
                        roleLabels[
                          selectedMember.role
                        ]
                      }
                    </p>

                  </div>

                  <div className="ml-auto flex items-center gap-2">

                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E8EEE8]">

                      <Lock className="w-3 h-3 text-[#7E8982]" />

                      <span className="text-[9px] font-black text-[#7E8982]">
                        {t.ccPrivateLabel}
                      </span>

                    </div>

                    <div className="relative z-[99999]">

                      <button
                        type="button"
                        onClick={() =>
                          setShowDMMenu(
                            value =>
                              !value
                          )
                        }
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#F4F7F4] hover:bg-[#EAF1EA]"
                      >
                        <MoreVertical className="w-4 h-4 text-[#59665E]" />
                      </button>

                      {showDMMenu && (
                        <div className="absolute right-0 top-11 z-[999999] w-56 rounded-2xl border border-[#E1E9E1] bg-white shadow-[0_20px_60px_rgba(30,50,35,0.20)] p-1.5">

                          <button
                            type="button"
                            onClick={
                              deleteMyDMConversation
                            }
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-black text-red-500 hover:bg-red-50 text-left"
                          >
                            <Trash2 className="w-4 h-4" />
                            {t.ccDeleteConversationForMe}
                          </button>

                        </div>
                      )}

                    </div>

                  </div>
                </div>
              </header>

              <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5">

                <div className="max-w-3xl mx-auto">

                  <div className="text-center py-3">

                    {avatar(
                      selectedMember.name,
                      selectedMember.avatar,
                      'w-16 h-16',
                      roleColor
                    )}

                    <h2 className="font-black text-lg text-[#344139] mt-3">
                      {
                        selectedMember.name
                      }
                    </h2>

                    <p className="text-[11px] text-[#89938D] mt-1">
                      {
                        roleLabels[
                          selectedMember.role
                        ]
                      }
                    </p>

                    <div className="inline-flex items-center gap-2 mt-3 px-3 py-2 rounded-xl bg-white border border-[#E5EBE5] text-[9px] font-black text-[#7E8982] shadow-sm">
                      <Lock className="w-3 h-3" />
                      {t.ccPrivateConversationLabel}
                    </div>

                    <p className="text-[10px] text-[#A0A9A4] mt-2">
                      {t.ccOnlyYouAndCanSee.replace('{name}', selectedMember.name)}
                    </p>

                    {!selectedServer && (
                      <div className="mt-2 text-[9px] font-bold text-[#8A958E]">
                        {t.ccGlobalPrivateConversation}
                      </div>
                    )}

                  </div>

                  <div className="mt-4 space-y-2">

                    {loadingDM &&
                    dmMessages.length ===
                      0 ? (
                      <div className="text-center py-10 text-sm text-[#929C96]">
                        {t.ccLoadingPrivateMessages}
                      </div>
                    ) : dmMessages.length ===
                      0 ? (
                      <div className="text-center py-10">

                        <div className="w-12 h-12 rounded-2xl bg-[#F5F8F5] mx-auto flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-[#99A39D]" />
                        </div>

                        <p className="text-sm font-bold text-[#69756E] mt-4">
                          {t.ccNoPrivateMessagesYet}
                        </p>

                        <p className="text-xs text-[#9AA39D] mt-1">
                          {t.ccSayHello}
                        </p>

                      </div>
                    ) : (
                      dmMessages.map(
                        message => {

                          const mine =
                            message.senderId ===
                            currentUserId;

                          const isEditing =
                            editingDMId ===
                            message.id;

                          return (
                            <div
                              key={
                                message.id
                              }
                              className={`group flex gap-2.5 ${
                                mine
                                  ? 'justify-end'
                                  : 'justify-start'
                              }`}
                            >

                              {!mine &&
                                avatar(
                                  message.senderName,
                                  undefined,
                                  'w-8 h-8',
                                  roleColor
                                )}

                              <div
                                className={`max-w-[82%] sm:max-w-[70%] ${
                                  mine
                                    ? 'items-end'
                                    : 'items-start'
                                }`}
                              >

                                {isEditing ? (
                                  <div className="flex flex-col gap-2">

                                    <input
                                      autoFocus
                                      value={
                                        editingText
                                      }
                                      onChange={e =>
                                        setEditingText(
                                          e.target
                                            .value
                                        )
                                      }
                                      onKeyDown={e => {
                                        if (
                                          e.key ===
                                          'Enter'
                                        ) {
                                          e.preventDefault();

                                          saveDMEdit(
                                            message.id
                                          );
                                        }

                                        if (
                                          e.key ===
                                          'Escape'
                                        ) {
                                          cancelEditDM();
                                        }
                                      }}
                                      className="w-full px-3 py-2.5 rounded-xl border border-[#CFE0D0] bg-white text-sm outline-none"
                                    />

                                    <div className="flex gap-2">

                                      <button
                                        type="button"
                                        onClick={() =>
                                          saveDMEdit(
                                            message.id
                                          )
                                        }
                                        className="px-3 py-1.5 rounded-lg text-white text-[10px] font-black"
                                        style={{
                                          background:
                                            roleColor,
                                        }}
                                      >
                                        <span className="flex items-center gap-1">
                                          <Check className="w-3 h-3" />
                                          {t.ccSave}
                                        </span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={
                                          cancelEditDM
                                        }
                                        className="px-3 py-1.5 rounded-lg bg-[#F1F4F1] text-[#657169] text-[10px] font-black"
                                      >
                                        {t.ccCancel}
                                      </button>

                                    </div>
                                  </div>
                                ) : (
                                  <div className="relative">

                                    <div
                                      className={`rounded-[20px] px-4 py-3 ${
                                        mine
                                          ? 'rounded-br-md text-white'
                                          : 'rounded-bl-md bg-white border border-[#E1E9E1] text-[#3E4A43]'
                                      } ${
                                        message.deleted
                                          ? 'opacity-70'
                                          : ''
                                      }`}
                                      style={
                                        mine
                                          ? {
                                              background:
                                                roleColor,
                                            }
                                          : undefined
                                      }
                                    >

                                      <p
                                        className={`text-sm leading-6 break-words ${
                                          message.deleted
                                            ? 'italic'
                                            : ''
                                        }`}
                                      >
                                        {
                                          message.text
                                        }
                                      </p>

                                    </div>

                                    {mine &&
                                      !message.deleted && (
                                        <div className="absolute right-0 -top-8 opacity-0 group-hover:opacity-100 transition flex items-center gap-1 bg-white border border-[#E3EAE3] rounded-lg p-1 shadow-sm">

                                          <button
                                            type="button"
                                            onClick={() =>
                                              startEditDM(
                                                message
                                              )
                                            }
                                            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#F0F5F0]"
                                            title="Edit"
                                          >
                                            <Pencil className="w-3.5 h-3.5 text-[#68756D]" />
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              deleteDMMessage(
                                                message
                                              )
                                            }
                                            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50"
                                            title="Delete"
                                          >
                                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                          </button>

                                        </div>
                                      )}

                                  </div>
                                )}

                                <div
                                  className={`flex items-center gap-2 mt-1.5 px-1 ${
                                    mine
                                      ? 'justify-end'
                                      : 'justify-start'
                                  }`}
                                >

                                  <span className="text-[9px] text-[#A0AAA4]">
                                    {mine
                                      ? 'You'
                                      : message.senderName}
                                  </span>

                                  <span className="text-[9px] text-[#B0B8B3]">
                                    {formatDate(
                                      message.createdAt
                                    )}
                                  </span>

                                  {message.edited &&
                                    !message.deleted && (
                                      <span className="text-[8px] text-[#A7B0AA]">
                                        edited
                                      </span>
                                    )}

                                </div>

                              </div>
                            </div>
                          );
                        }
                      )
                    )}

                    <div ref={dmBottomRef} />

                  </div>
                </div>
              </div>

              <form
                onSubmit={
                  sendDM
                }
                className="flex-shrink-0 px-4 sm:px-6 py-3 border-t border-[#E2EAE2] bg-white/72 backdrop-blur-xl"
              >

                <div className="max-w-3xl mx-auto flex items-center gap-2">

                  {avatar(
                    user?.name ||
                      'You',
                    user?.avatar,
                    'w-9 h-9',
                    roleColor
                  )}

                  <div className="relative flex-1">

                    <input
                      value={
                        dmText
                      }
                      onChange={e =>
                        setDmText(
                          e.target
                            .value
                        )
                      }
                      placeholder={`Message ${selectedMember.name} privately...`}
                      className="w-full px-4 py-3 rounded-2xl border border-[#DDE7DE] bg-white text-sm outline-none pr-12 focus:border-[#A9C7AC] transition"
                    />

                    <button
                      type="submit"
                      disabled={
                        !dmText.trim()
                      }
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-30"
                      style={{
                        background:
                          roleColor,
                      }}
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>

                  </div>
                </div>
              </form>

            </div>
          )}

            </main>
    </div>
{/* =====================================================
    CUSTOM DELETE CONFIRMATION MODAL
====================================================== */}

{confirmDialog && (
  <div
    className="fixed inset-0 z-[9999999] bg-black/35 backdrop-blur-sm flex items-center justify-center p-4"
    onMouseDown={e => {
      if (e.target === e.currentTarget) {
        setConfirmDialog(null);
      }
    }}
  >
    <div
      className="w-full max-w-md rounded-[28px] bg-white border border-[#E1E9E1] shadow-[0_30px_100px_rgba(20,40,25,0.25)] p-6 sm:p-7"
      onMouseDown={e => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      {/* ICON */}

      <div className="flex items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
      </div>

      {/* TITLE */}

      <h2 className="text-xl sm:text-2xl font-black text-[#29352E] text-center mt-5">
        {confirmDialog.type === 'deleteServer' &&
          t.ccDeleteServer}

        {confirmDialog.type === 'deleteServerMessage' &&
          t.ccDeleteServer}

        {confirmDialog.type === 'deleteServerHistory' &&
          t.ccDeleteMyChatHistory}

        {confirmDialog.type === 'deleteDMMessage' &&
          t.ccDeleteConversationForMe}

        {confirmDialog.type === 'deleteDMConversation' &&
          t.ccDeleteConversationForMe}
      </h2>

      {/* DETAILS */}

      <div className="text-sm text-[#718078] text-center leading-6 mt-3">

        {confirmDialog.type === 'deleteServer' &&
          selectedServer && (
            <p>
              <span className="font-black text-[#3B4740]">
                {selectedServer.name}
              </span>
            </p>
          )}

        {confirmDialog.type === 'deleteServerMessage' && (
          <p>
            {t.ccDeleteServer}
          </p>
        )}

        {confirmDialog.type === 'deleteServerHistory' && (
          <p>
            {t.ccDeleteMyChatHistory}
          </p>
        )}

        {confirmDialog.type === 'deleteDMMessage' && (
          <p>
            {t.ccDeleteConversationForMe}
          </p>
        )}

        {confirmDialog.type === 'deleteDMConversation' &&
          selectedMember && (
            <p>
              <span className="font-black text-[#3B4740]">
                {selectedMember.name}
              </span>
            </p>
          )}

      </div>

      {/* BUTTONS */}

      <div className="flex gap-3 mt-7">

        <button
          type="button"
          onClick={() => setConfirmDialog(null)}
          className="flex-1 py-3.5 rounded-2xl bg-[#F3F6F3] border border-[#E2E9E2] text-sm font-black text-[#59665E] hover:bg-[#EAEFEA] transition"
        >
          {t.ccCancel}
        </button>

        <button
          type="button"
          onClick={handleConfirmDelete}
          className="flex-1 py-3.5 rounded-2xl bg-red-500 text-white text-sm font-black hover:bg-red-600 transition shadow-sm"
        >
          {confirmDialog.type === 'deleteServer' &&
            t.ccDeleteServer}

          {confirmDialog.type === 'deleteServerMessage' &&
            t.ccDeleteServer}

          {confirmDialog.type === 'deleteServerHistory' &&
            t.ccDeleteMyChatHistory}

          {confirmDialog.type === 'deleteDMMessage' &&
            t.ccDeleteConversationForMe}

          {confirmDialog.type === 'deleteDMConversation' &&
            t.ccDeleteConversationForMe}
        </button>

      </div>
    </div>
  </div>
)}

  </div>
</div>
);
};

export default CommunityChat;