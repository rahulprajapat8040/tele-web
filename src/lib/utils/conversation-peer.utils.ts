import type {
  IConversation,
  User,
} from '@/lib/interfaces/conversations/conversations-res.interface';
import { userPresenceStore } from '@/lib/store/presence.store';

export const getConversationPeer = (
  conversation: IConversation,
  currentUserId: string | undefined,
): User | undefined => {
  if (!conversation.members?.length) return undefined;

  const peer = currentUserId
    ? conversation.members.find((member) => member.user.id !== currentUserId)
    : undefined;

  return peer?.user ?? conversation.members[0]?.user;
};

export const usePeerPresence = (userId: string, apiIsOnline: boolean) => {
  return userPresenceStore((state) => {
    const presence = state.users[userId];
    if (presence !== undefined) {
      return presence.isOnline;
    }
    return apiIsOnline;
  });
};

export const usePeerLastSeen = (
  userId: string | undefined,
  apiLastSeen: Date | string | null | undefined,
) => {
  return userPresenceStore((state) => {
    if (!userId) {
      return normalizeLastSeen(apiLastSeen);
    }

    const presence = state.users[userId];
    if (presence !== undefined) {
      if (presence.isOnline) return null;
      return presence.lastSeenAt;
    }

    return normalizeLastSeen(apiLastSeen);
  });
};

const normalizeLastSeen = (
  value: Date | string | null | undefined,
): string | null => {
  if (!value) return null;
  return typeof value === 'string' ? value : value.toISOString();
};