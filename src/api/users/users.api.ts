import type {
  IApiResponse,
  ISearchParam,
} from '@/lib/interfaces/common/base-res.interface';
import { GetFilterUrl } from '@/lib/utils/utils';
import { request } from '../axios/request';
import type { IConversationRes } from '@/lib/interfaces/conversations/conversations-res.interface';
import { API_ENDPOINTS } from '@/lib/constant/route-constant';

export const usersApi = {
  getConversations(queryData: ISearchParam) {
    const query = GetFilterUrl(queryData);
    return request<IApiResponse<IConversationRes>>({
      url: `${API_ENDPOINTS.CONVERSATIONS}/my?${query ? query : ''}`,
    });
  },
};
