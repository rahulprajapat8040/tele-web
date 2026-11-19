import { create } from 'zustand';
import type { IMe } from '../interfaces/auth/auth-user.interface';
import { authApi } from '@/api/auth/auth.api';

interface AuthState {
  user: IMe;

  isLoading: boolean;

  setUser: (user: IMe | null) => void;

  setLoading: (loading: boolean) => void;

  clearUser: () => void;

  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  isLoading: true,

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  setUser: (user) => set({ user, isLoading: false }),

  clearUser: () => set({ user: null, isLoading: false }),

  refreshUser: async () => {
    try {
      const user = await authApi.me();

      set({
        user: user.data,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isLoading: false,
      });
    }
  },
}));
