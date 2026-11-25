import { CHAT_EVENTS } from '@/lib/constant/chat-events.constant';
import { userPresenceStore } from '@/lib/store/presence.store';
import { Socket } from 'socket.io-client';

export const registerPresenceListeners = (socket: Socket) => {
  const { setOnline, setOffline } = userPresenceStore.getState();

  socket.on(CHAT_EVENTS.USER_ONLINE, (data: { userId: string }) => {
    setOnline(data.userId);
  });

  socket.on(
    CHAT_EVENTS.USER_OFFLINE,
    (data: { userId: string; lastSeenAt: string | null }) => {
      setOffline(data.userId, data.lastSeenAt);
    },
  );
};

export const unregisterPresenceListeners = (socket: Socket) => {
  socket.off(CHAT_EVENTS.USER_ONLINE);
  socket.off(CHAT_EVENTS.USER_OFFLINE);
};
