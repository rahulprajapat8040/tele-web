import { usersApi } from '@/api/users/users.api';
import { getConversationPeer } from '@/lib/utils/conversation-peer.utils';
import { useAuthStore } from '@/lib/store/auth.store';
import { conversationsListQueryKey } from '@/lib/constant/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useActiveConversationPeer = (conversationId: string | undefined) => {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const page = 1;

  const { data, isLoading } = useQuery({
    queryKey: conversationsListQueryKey(page),
    queryFn: () => usersApi.getConversations({ page, limit: 30 }),
    enabled: Boolean(conversationId),
    staleTime: 60_000,
  });

  const conversations = data?.data?.data ?? [];
  const conversation = conversationId
    ? conversations.find((item) => item.id === conversationId)
    : undefined;
  const peer = conversation
    ? getConversationPeer(conversation, currentUserId)
    : undefined;

  return { conversation, peer, isLoading };
};