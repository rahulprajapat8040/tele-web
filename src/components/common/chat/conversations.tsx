import { usersApi } from '@/api/users/users.api';
import {
  getConversationPeer,
  usePeerPresence,
} from '@/lib/utils/conversation-peer.utils';
import { conversationsListQueryKey } from '@/lib/constant/query-keys';
import { useAuthStore } from '@/lib/store/auth.store';
import { userPresenceStore } from '@/lib/store/presence.store';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ConversationRow } from './conversation-item';
import type { IConversation, User } from '@/lib/interfaces/conversations/conversations-res.interface';

const ConversationListEntry = ({
  conversation,
  user,
}: {
  conversation: IConversation;
  user: User;
}) => {
  const isOnline = usePeerPresence(user.id, user.isOnline);

  return (
    <ConversationRow
      conversation={conversation}
      user={user}
      isOnline={isOnline}
    />
  );
};

export const Conversations = () => {
  const [page] = useState(1);
  const currentUserId = useAuthStore((state) => state.user?.id);

  const {
    data: {
      data: { data: conversations },
    },
  } = useSuspenseQuery({
    queryFn: () => usersApi.getConversations({ page, limit: 30 }),
    queryKey: conversationsListQueryKey(page),
  });

  useEffect(() => {
    const { users, setUserPresence } = userPresenceStore.getState();

    for (const conversation of conversations) {
      const peer = getConversationPeer(conversation, currentUserId);
      if (!peer) continue;

      if (users[peer.id] !== undefined) continue;

      setUserPresence(peer.id, {
        isOnline: peer.isOnline,
        lastSeenAt: peer.lastSeenAt
          ? new Date(peer.lastSeenAt).toISOString()
          : null,
      });
    }
  }, [conversations, currentUserId]);

  return (
    <>
      {conversations.map((conversation) => {
        const user = getConversationPeer(conversation, currentUserId);
        if (!user) return null;
        return (
          <ConversationListEntry
            key={conversation.id}
            conversation={conversation}
            user={user}
          />
        );
      })}
    </>
  );
};