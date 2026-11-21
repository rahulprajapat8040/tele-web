import { CHAT_EVENTS } from '@/lib/constant/chat-events.constant';
import { useChatStore } from '@/lib/store/chat.store';
import { getSocket } from '@/services/socket.service';
import { useEffect } from 'react';

export default function ChatSocketListener() {
  const { addMessage, updateMessageStatus, setTyping } = useChatStore();

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
      const {
        conversationId,
        messageIds,
        status,
        deliveredBy,
        readBy,
        deliveredAt,
        readAt,
      } = payload;

      if (!conversationId || !messageIds?.length) return;

      if (status !== 'DELIVERED' && status !== 'READ') return;

      const userId = status === 'READ' ? readBy : deliveredBy;
      const timestamp = status === 'READ' ? readAt : deliveredAt;

      if (!userId || !timestamp) {
        console.warn('Invalid MESSAGE_STATUS payload:', payload);
        return;
      }

      updateMessageStatus(
        conversationId,
        messageIds,
        status,
        userId,
        timestamp,
      );

      console.log('MESSAGE STATUS UPDATED:', {
        conversationId,
        messageIds,
        status,
        userId,
        timestamp,
      });
    };

    const handleUserTyping = (payload: {
      conversationId: string;
      userId: string;
      isTyping: boolean;
    }) => {
      const { conversationId, userId, isTyping } = payload;

      console.log('hanldeee userrr typing', payload);

      if (!conversationId || !userId) return;

      setTyping(conversationId, userId, isTyping);
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
    socket.on(CHAT_EVENTS.USER_TYPING, handleUserTyping);
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
      socket.off(CHAT_EVENTS.USER_TYPING, handleUserTyping);
    };
  }, [addMessage, updateMessageStatus, setTyping]);

  return null;
}
