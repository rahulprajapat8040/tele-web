'use no memo';

import { CHAT_EVENTS } from '@/lib/constant/chat-events.constant';
import { useChatStore } from '@/lib/store/chat.store';
import { userPresenceStore } from '@/lib/store/presence.store';
import { useSocket } from '@/providers/socket-provider';
import { useEffect } from 'react';

export default function ChatSocketListener() {
  const socket = useSocket();

  useEffect(() => {
    console.log('Socket listener mounted');
    console.log('Socket ID:', socket.id);
    console.log('Socket connected:', socket.connected);
    if (!socket) {
      return () => {};
    }

    const handleNewMessage = (payload: any) => {
      const message =
        payload?.message?.data ??
        payload?.data?.data ??
        payload?.data ??
        payload?.message ??
        payload;

      if (!message?.id || !message?.conversationId) return;

      useChatStore.getState().addMessage(message.conversationId, message);

      socket.emit(CHAT_EVENTS.MESSAGE_DELIVERED, {
        conversationId: message.conversationId,
        lastDeliveredMessageId: message.id,
      });
    };

    const handleMessageEdited = (payload: any) => {
      const conversationId = payload?.conversationId;
      const rawMessage =
        payload?.message?.data ?? payload?.message ?? payload?.data;

      if (!conversationId || !rawMessage?.id) return;

      useChatStore.getState().applyMessageEdit(conversationId, rawMessage.id, {
        content: rawMessage.content,
        editedAt: rawMessage.editedAt ?? new Date().toISOString(),
        updatedAt: rawMessage.updatedAt ?? new Date().toISOString(),
      });
    };

    const handleMessageDeleted = (payload: any) => {
      const data = payload?.data ?? payload;
      const conversationId = data?.conversationId;

      if (!conversationId) return;

      const messageId = data.messageId ?? data?.message?.id;

      if (!messageId) return;

      useChatStore.getState().removeMessage(conversationId, messageId);
    };

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

      if (!userId || !timestamp) return;

      useChatStore
        .getState()
        .updateMessageStatus(
          conversationId,
          messageIds,
          status,
          userId,
          timestamp,
        );
    };

    const handleUserTyping = (payload: {
      conversationId: string;
      userId: string;
      isTyping: boolean;
    }) => {
      const { conversationId, userId, isTyping } = payload;

      if (!conversationId || !userId) return;

      useChatStore.getState().setTyping(conversationId, userId, isTyping);
    };

    const handleUserOnline = (payload: {
      userId?: string;
      id?: string;
      status?: string;
    }) => {
      const userId = payload?.userId ?? payload?.id;

      console.log('USER ONLINE PAYLOAD:', payload);
      console.log('USER ID:', userId);

      if (!userId) return;

      userPresenceStore.getState().setOnline(userId);

      console.log('STORE AFTER UPDATE:', userPresenceStore.getState().users);
    };

    const handleUserOffline = (payload: {
      userId?: string;
      id?: string;
      lastSeenAt: string | null;
    }) => {
      const userId = payload?.userId ?? payload?.id;

      if (!userId) return;

      userPresenceStore.getState().setOffline(userId, payload.lastSeenAt ?? null);

      console.log(
        'Presence store after offline:',
        userPresenceStore.getState().users,
      );
    };

    const handleConnect = () => {
      socket.emit(CHAT_EVENTS.SYNC_PENDING_MESSAGES);
    };

    socket.on(CHAT_EVENTS.NEW_MESSAGE, handleNewMessage);
    socket.on(CHAT_EVENTS.MESSAGE_EDITED, handleMessageEdited);
    socket.on(CHAT_EVENTS.MESSAGE_DELETED, handleMessageDeleted);
    socket.on(CHAT_EVENTS.MESSAGE_STATUS, handleMessageStatus);
    socket.on(CHAT_EVENTS.USER_TYPING, handleUserTyping);
    socket.on(CHAT_EVENTS.USER_ONLINE, handleUserOnline);
    socket.on(CHAT_EVENTS.USER_OFFLINE, handleUserOffline);
    socket.on('connect', handleConnect);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off(CHAT_EVENTS.NEW_MESSAGE, handleNewMessage);
      socket.off(CHAT_EVENTS.MESSAGE_EDITED, handleMessageEdited);
      socket.off(CHAT_EVENTS.MESSAGE_DELETED, handleMessageDeleted);
      socket.off(CHAT_EVENTS.MESSAGE_STATUS, handleMessageStatus);
      socket.off(CHAT_EVENTS.USER_TYPING, handleUserTyping);
      socket.off(CHAT_EVENTS.USER_ONLINE, handleUserOnline);
      socket.off(CHAT_EVENTS.USER_OFFLINE, handleUserOffline);
      socket.off('connect', handleConnect);
    };
  }, [socket]);

  return null;
}
