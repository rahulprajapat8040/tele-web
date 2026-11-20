import { CHAT_EVENTS } from '@/lib/constant/chat-events.constant';
import type { IMessage } from '@/lib/interfaces/conversations/messages-res.interface';
import { useChatStore } from '@/lib/store/chat.store';
import { useSocket } from '@/providers/socket-provider';
import { useEffect } from 'react';

function extractMessage(payload: any): IMessage | null {
  // Supports your responseSender envelope.
  const message = payload?.data?.data ?? payload?.data ?? payload;

  if (!message?.id || !message?.conversationId) {
    return null;
  }

  return message as IMessage;
}

export const useSocketEvents = () => {
  const socket = useSocket();
  const addMessage = useChatStore((state) => state.addMessage);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (payload: any) => {
      const message = extractMessage(payload);

      if (!message) return;

      addMessage(message.conversationId, message);
    };

    socket.on(CHAT_EVENTS.NEW_MESSAGE, handleNewMessage);

    return () => {
      socket.off(CHAT_EVENTS.NEW_MESSAGE, handleNewMessage);
    };
  }, [socket, addMessage]);
};
