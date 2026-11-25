export const CHAT_EVENTS = {
  SEND_MESSAGE: 'message:send',
  EDIT_MESSAGE: 'message:edit',
  DELETE_MESSAGE: 'message:delete',
  NEW_MESSAGE: 'message:new',
  MESSAGE_EDITED: 'message:edited',
  MESSAGE_DELETED: 'message:deleted',

  JOIN_CONVERSATION: 'conversation:join',

  MESSAGE_DELIVERED: 'message:delivered',
  MESSAGE_READ: 'message:read',
  MESSAGE_STATUS: 'message:status',

  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  USER_TYPING: 'user:typing',

  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',

  SYNC_PENDING_MESSAGES: 'sync_pending_messages',

  CONVERSATION_JOIN: 'conversation:join',
} as const;
