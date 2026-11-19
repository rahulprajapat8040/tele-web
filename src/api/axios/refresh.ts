import { axiosInstance } from "./axios";
import { endLocalSession } from "@/features/auth/lib/end-session";

let refreshPromise: Promise<void> | null = null;

async function requestRefreshToken(): Promise<void> {
  await axiosInstance.post("/auth/refresh-token", undefined, {
    skipAuthRefresh: true,
  });
}

export async function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = requestRefreshToken()
      .catch((error) => {
        endLocalSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}
