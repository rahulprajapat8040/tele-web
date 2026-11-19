import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { shouldAttemptTokenRefresh } from "./auth-error";
import { ApiError } from "./errors";
import { refreshSession } from "./refresh";
import { axiosInstance } from "./axios";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

const AUTH_PATHS_WITHOUT_REFRESH = ["/auth/refresh-token", "/auth/login"];

function isAuthPathWithoutRefresh(url: string | undefined): boolean {
  if (!url) {
    return false;
  }

  return AUTH_PATHS_WITHOUT_REFRESH.some((path) => url.includes(path));
}

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;
    const responseData = error.response?.data;

    const canRefresh =
      config &&
      !config._retry &&
      !config.skipAuthRefresh &&
      !isAuthPathWithoutRefresh(config.url) &&
      shouldAttemptTokenRefresh(error.response?.status, responseData);

    if (canRefresh) {
      config._retry = true;

      try {
        await refreshSession();
        return axiosInstance(config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    const responseBody = error.response?.data as {
      message?: string;
      code?: string;
    };

    const apiError = new ApiError({
      message:
        responseBody?.message ??
        error.message ??
        "Something went wrong",

      statusCode: error.response?.status ?? 500,
      code: responseBody?.code,
    });

    return Promise.reject(apiError);
  },
);
