import { CHAT_EVENTS } from '@/lib/constant/chat-events.constant';
import { useChatStore } from '@/lib/store/chat.store';
import { getSocket } from '@/services/socket.service';
import { useEffect } from 'react';

export default function ChatSocketListener() {
  const { addMessage, updateMessageStatus } = useChatStore();

  useEffect(() => {
    const socket = getSocket();

    // ---------------------------
    // NEW MESSAGE
    // ---------------------------
    const handleNewMessage = (payload: any) => {
      const message =
        payload?.message?.data ??
        payload?.data?.data ??
        payload?.data ??
        payload?.message ??
        payload;

      if (!message?.id || !message?.conversationId) return;

      // Update Zustand globally
      addMessage(message.conversationId, message);

      // Acknowledge delivery
      socket.emit(CHAT_EVENTS.MESSAGE_DELIVERED, {
        conversationId: message.conversationId,
        lastDeliveredMessageId: message.id,
      });
    };

    // ---------------------------
    // MESSAGE STATUS
    // ---------------------------
    const handleMessageStatus = (payload: any) => {
      if (!payload?.conversationId || !payload?.messageIds?.length) {
        return;
      }

      updateMessageStatus(
        payload.conversationId,
        payload.messageIds,
        payload.status,
        payload.deliveredBy ?? payload.readBy,
        payload.deliveredAt ?? payload.readAt,
      );
    };

    // ---------------------------
    // PENDING MESSAGE SYNC
    // ---------------------------
    const handleConnect = () => {
      socket.emit(CHAT_EVENTS.SYNC_PENDING_MESSAGES);
    };

    // Register listeners
    socket.on(CHAT_EVENTS.NEW_MESSAGE, handleNewMessage);
    socket.on(CHAT_EVENTS.MESSAGE_STATUS, handleMessageStatus);
    socket.on('connect', handleConnect);

    // If already connected, sync immediately
    if (socket.connected) {
      handleConnect();
    }

    // Cleanup
    return () => {
      socket.off(CHAT_EVENTS.NEW_MESSAGE, handleNewMessage);
      socket.off(CHAT_EVENTS.MESSAGE_STATUS, handleMessageStatus);
      socket.off('connect', handleConnect);
    };
  }, [addMessage, updateMessageStatus]);

  return null;
}
