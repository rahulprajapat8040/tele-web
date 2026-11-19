import { API_ENDPOINTS } from '@/lib/constant/route-constant';
import { request } from '../axios/request';
import type { IApiResponse } from '../axios/base-res.interface';
import type { IMe } from '@/lib/interfaces/auth/auth-user.interface';

export const authApi = {
  me() {
    return request<IApiResponse<IMe>>({
      url: `${API_ENDPOINTS.AUTH}/me`,
      method: 'GET',
    });
  },
};
