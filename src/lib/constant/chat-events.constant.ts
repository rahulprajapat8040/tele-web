export const CHAT_EVENTS = {
  SEND_MESSAGE: 'message:send',
  NEW_MESSAGE: 'message:new',

  JOIN_CONVERSATION: 'conversation:join',

  MESSAGE_DELIVERED: 'message:delivered',
  MESSAGE_READ: 'message:read',
  MESSAGE_STATUS: 'message:status',

  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  USER_TYPING: 'user:typing',

  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
} as const;
