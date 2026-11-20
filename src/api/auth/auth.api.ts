import { API_ENDPOINTS } from '@/lib/constant/route-constant';
import { request } from '../axios/request';
import type { IApiResponse } from '../../lib/interfaces/common/base-res.interface';
import type { IMe } from '@/lib/interfaces/auth/auth-user.interface';
import type { LoginPayload } from '@/lib/interfaces/auth/login-form.interface';

export const authApi = {
  sendOTP(data: { countryCode: string; phoneNo: string }) {
    return request({
      url: `${API_ENDPOINTS.AUTH}/send-otp`,
      data,
      method: 'POST',
    });
  },

  login(data: LoginPayload) {
    return request({
      url: `${API_ENDPOINTS.AUTH}/login`,
      data,
      method: 'POST',
    });
  },

  me() {
    return request<IApiResponse<IMe>>({
      url: `${API_ENDPOINTS.AUTH}/me`,
      method: 'GET',
    });
  },
};
