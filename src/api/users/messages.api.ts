import { GetFilterUrl } from '@/lib/utils/utils';
import { request } from '../axios/request';
import type { IApiResponse } from '@/lib/interfaces/common/base-res.interface';
import type { IMessagesRes } from '@/lib/interfaces/conversations/messages-res.interface';

export const messagesApi = {
  getMessages(queryData: { conversationId: string; cursor?: string }) {
    const { conversationId, cursor } = queryData;
    const query = GetFilterUrl({ limit: 30, before: cursor });
    return request<IApiResponse<IMessagesRes>>({
      url: `/messages/conversation/${conversationId}/history?${
        query ? query : ''
      }`,
      method: 'GET',
    });
  },
};
