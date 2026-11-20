import { messagesApi } from '@/api/users/messages.api';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useMessages = (conversationId: string) => {
  return useInfiniteQuery({
    queryKey: ['messages', conversationId],

    queryFn: ({ pageParam }) =>
      messagesApi.getMessages({ conversationId, cursor: pageParam }),

    initialPageParam: undefined as string | undefined,

    getNextPageParam: (lastPage) => {
      if (!lastPage.data.pagination.hasMore) {
        return undefined;
      }

      return lastPage.data.pagination.nextCursor;
    },

    enabled: !!conversationId,
  });
};
