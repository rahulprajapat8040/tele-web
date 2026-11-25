'use no memo';

import {
  usePeerLastSeen,
  usePeerPresence,
} from '@/lib/utils/conversation-peer.utils';
import { useActiveConversationPeer } from '@/hooks/use-active-conversation-peer';
import { getFullName } from '@/lib/utils/utils';
import { useParams } from 'react-router-dom';
import { ChatHeader } from '../components/chat-header';
import { MessageInput } from '../components/message/message-input';
import { MessagesList } from '../components/message/messages-list';
import {
  sendSocketDeleteMessage,
  sendSocketEditMessage,
  sendSocketMessage,
} from '@/services/messages.service';
import { MessageDeleteDialog } from '../components/message/message-delete-dialog';
import { useChatStore } from '@/lib/store/chat.store';
import { useEffect } from 'react';
import type { IMessage } from '@/lib/interfaces/conversations/messages-res.interface';
import { useAuthStore } from '@/lib/store/auth.store';
import { getSocket } from '@/services/socket.service';
import { CHAT_EVENTS } from '@/lib/constant/chat-events.constant';
import { useMessageOption } from '@/lib/store/message-option.store';

export const Chat = () => {
  const { id: conversationId } = useParams();
  const { user } = useAuthStore();
  const [currentUserId, currentUserFirstName] = [user.id, user.firstName];

  const {
    addMessage,
    replaceMessage,
    updateMessage,
    applyMessageEdit,
    removeMessage,
    setActiveConversation,
    typingUsers,
  } = useChatStore();

  const isTyping = (typingUsers[conversationId ?? ''] ?? []).some(
    (id) => id !== currentUserId,
  );

  const {
    replyTo,
    clearReplyTo,
    clearEditingMessage,
    deleteTarget,
    closeDeleteDialog,
  } = useMessageOption();

  const { peer, isLoading: isPeerLoading } =
    useActiveConversationPeer(conversationId);
  const peerId = peer?.id ?? '';
  const isOnline = usePeerPresence(peerId, peer?.isOnline ?? false);
  const lastSeenAt = usePeerLastSeen(peerId, peer?.lastSeenAt);
  const displayName = peer
    ? getFullName(peer.firstName, peer.lastName)
    : 'Conversation';

  useEffect(() => {
    setActiveConversation(conversationId ?? null);

    return () => setActiveConversation(null);
  }, [conversationId, setActiveConversation]);

  useEffect(() => {
    clearReplyTo();
    clearEditingMessage();
    closeDeleteDialog();
  }, [conversationId, clearReplyTo, clearEditingMessage, closeDeleteDialog]);

  useEffect(() => {
    if (!conversationId) return;

    const socket = getSocket();

    const joinConversation = () => {
      socket.emit(CHAT_EVENTS.CONVERSATION_JOIN, {
        conversationId,
      });
    };

    if (socket.connected) {
      joinConversation();
    }

    socket.on('connect', joinConversation);

    return () => {
      socket.off('connect', joinConversation);
    };
  }, [conversationId]);

  const handleSendMessage = async (content: string) => {
    if (!conversationId || !content.trim()) return;

    const replyTarget =
      replyTo?.conversationId === conversationId ? replyTo : null;

    const replyToMessageId =
      replyTarget && !replyTarget.id.startsWith('temp-') ? replyTarget.id : null;

    const clientMessageId = crypto.randomUUID();
    const now = new Date().toISOString();

    const optimisticMessage: IMessage = {
      id: `temp-${clientMessageId}`,
      clientMessageId,
      conversationId,
      senderId: currentUserId,
      type: 'TEXT',
      content: content.trim(),
      replyToMessageId,
      replyTo: replyTarget
        ? {
            id: replyTarget.id,
            content: replyTarget.content,
            senderId: replyTarget.senderId,
            sender: replyTarget.sender,
          }
        : null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      sender: {
        id: currentUserId,
        firstName: currentUserFirstName,
      },
      receipts: [],
      localStatus: 'SENDING',
    };

    // Immediately display the message.
    addMessage(conversationId, optimisticMessage);
    clearReplyTo();

    try {
      const message = await sendSocketMessage({
        conversationId,
        clientMessageId,
        content: content.trim(),
        type: 'TEXT',
        replyToMessageId,
      });

      // Replace temporary message with the server message.
      replaceMessage(conversationId, clientMessageId, {
        ...message,
        localStatus: 'SENT',
      });
    } catch (error) {
      console.error('Message sending failed:', error);

      updateMessage(conversationId, clientMessageId, {
        localStatus: 'FAILED',
      });
    }
  };

  const handleEditMessage = async (messageId: string, content: string) => {
    if (!conversationId || !content.trim() || messageId.startsWith('temp-')) {
      return;
    }

    const original = useChatStore
      .getState()
      .messages[conversationId]?.find((message) => message.id === messageId);

    if (!original) return;

    const trimmed = content.trim();
    const editedAt = new Date().toISOString();

    applyMessageEdit(conversationId, messageId, {
      content: trimmed,
      editedAt,
      updatedAt: editedAt,
    });

    try {
      const updatedMessage = await sendSocketEditMessage({
        conversationId,
        messageId,
        content: trimmed,
      });

      applyMessageEdit(conversationId, messageId, {
        content: updatedMessage.content ?? trimmed,
        editedAt: updatedMessage.editedAt ?? editedAt,
        updatedAt: updatedMessage.updatedAt ?? editedAt,
      });
    } catch (error) {
      console.error('Message edit failed:', error);

      applyMessageEdit(conversationId, messageId, {
        content: original.content,
        editedAt: original.editedAt ?? null,
        updatedAt: original.updatedAt,
      });
    }
  };

  const handleDeleteMessage = async (forEveryone: boolean) => {
    if (!conversationId || !deleteTarget) return;

    const messageId = deleteTarget.id;

    if (messageId.startsWith('temp-')) {
      removeMessage(conversationId, messageId);
      return;
    }

    const original = useChatStore
      .getState()
      .messages[conversationId]?.find((message) => message.id === messageId);

    if (!original) return;

    removeMessage(conversationId, messageId);

    try {
      await sendSocketDeleteMessage({
        conversationId,
        messageId,
        forEveryone,
      });
    } catch (error) {
      console.error('Message delete failed:', error);

      const list = [
        ...(useChatStore.getState().messages[conversationId] ?? []),
        original,
      ].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      useChatStore.getState().setMessages(conversationId, list);
      throw error;
    }
  };

  if (!conversationId) return null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChatHeader
        displayName={displayName}
        isOnline={isOnline}
        isTyping={isTyping}
        lastSeenAt={lastSeenAt}
        isLoading={isPeerLoading && !peer}
      />

      <div className="min-h-0 flex-1">
        <MessagesList
          conversationId={conversationId}
          currentUserId={currentUserId}
        />
      </div>

      <div className="shrink-0 p-3">
        <MessageInput
          conversationId={conversationId}
          onSend={handleSendMessage}
          onEdit={handleEditMessage}
        />
      </div>

      <MessageDeleteDialog
        conversationId={conversationId}
        peerName={displayName}
        onConfirm={handleDeleteMessage}
      />
    </div>
  );
};
