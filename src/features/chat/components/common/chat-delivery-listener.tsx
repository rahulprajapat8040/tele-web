'use client';

import { useEffect } from 'react';
import { getSocket } from '@/services/socket.service';
import { CHAT_EVENTS } from '@/lib/constant/chat-events.constant';

export function ChatDeliveryListener() {
  useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    // Acknowledge messages received in real time OR through pending sync.
    const handleNewMessage = (payload: any) => {
      const message =
        payload?.message?.data ??
        payload?.data?.data ??
        payload?.data ??
        payload?.message ??
        payload;

      if (!message?.id || !message?.conversationId) return;

      socket.emit(CHAT_EVENTS.MESSAGE_DELIVERED, {
        conversationId: message.conversationId,
        lastDeliveredMessageId: message.id,
      });
    };

    // Ask server for messages missed while offline.
    const handleConnect = () => {
      console.log('Socket connected. Syncing pending messages...');

      socket.emit(CHAT_EVENTS.SYNC_PENDING_MESSAGES);
    };

    // Register listeners first.
    socket.on(CHAT_EVENTS.NEW_MESSAGE, handleNewMessage);
    socket.on('connect', handleConnect);

    // If socket is already connected, sync immediately.
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off(CHAT_EVENTS.NEW_MESSAGE, handleNewMessage);
      socket.off('connect', handleConnect);
    };
  }, []);

  return null;
}
