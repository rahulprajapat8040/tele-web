import { create } from 'zustand';

export interface IUserPresence {
  userId: string;
  isOnline: boolean;
  lastSeenAt: string | null;
}

interface PresenceState {
  users: Record<string, IUserPresence>;

  setUserPresence: (userId: string, presence: Partial<IUserPresence>) => void;
  setUsersPresence: (users: IUserPresence[]) => void;
  setOnline: (userId: string) => void;
  setOffline: (userId: string, lastSeenAt: string | null) => void;
  clearPresence: () => void;
}

export const userPresenceStore = create<PresenceState>((set) => ({
  users: {},

  setUserPresence: (userId, presence) =>
    set((state) => {
      const previous = state.users[userId];

      return {
        users: {
          ...state.users,
          [userId]: {
            userId,
            isOnline: presence.isOnline ?? previous?.isOnline ?? false,
            lastSeenAt:
              presence.isOnline === true
                ? null
                : presence.lastSeenAt !== undefined
                ? presence.lastSeenAt
                : previous?.lastSeenAt ?? null,
          },
        },
      };
    }),

  setUsersPresence: (users) =>
    set((state) => {
      const updated = { ...state.users };

      for (const user of users) {
        updated[user.userId] = {
          ...user,
          lastSeenAt: user.isOnline ? null : user.lastSeenAt,
        };
      }

      return { users: updated };
    }),

  setOnline: (userId) =>
    set((state) => {
      const previous = state.users[userId];

      if (previous?.isOnline && previous.lastSeenAt === null) {
        return state;
      }

      return {
        users: {
          ...state.users,
          [userId]: {
            userId,
            isOnline: true,
            lastSeenAt: null,
          },
        },
      };
    }),

  setOffline: (userId, lastSeenAt) =>
    set((state) => {
      const previous = state.users[userId];

      if (previous?.isOnline === false && previous.lastSeenAt === lastSeenAt) {
        return state;
      }

      return {
        users: {
          ...state.users,
          [userId]: {
            userId,
            isOnline: false,
            lastSeenAt,
          },
        },
      };
    }),

  clearPresence: () => set({ users: {} }),
}));
