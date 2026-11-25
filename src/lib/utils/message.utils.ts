import type { IMessage } from '@/lib/interfaces/conversations/messages-res.interface';

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

export const canEditMessage = (message: IMessage, currentUserId: string) => {
  if (message.senderId !== currentUserId) return false;
  if (message.type !== 'TEXT') return false;
  if (message.id.startsWith('temp-')) return false;
  if (message.deletedAt) return false;
  if (!message.content?.trim()) return false;

  const age = Date.now() - new Date(message.createdAt).getTime();

  return age >= 0 && age < EDIT_WINDOW_MS;
};

const DELETE_FOR_EVERYONE_MS = 48 * 60 * 60 * 1000;

export const canDeleteForEveryone = (message: IMessage) => {
  if (message.id.startsWith('temp-')) return false;

  const age = Date.now() - new Date(message.createdAt).getTime();

  return age >= 0 && age < DELETE_FOR_EVERYONE_MS;
};