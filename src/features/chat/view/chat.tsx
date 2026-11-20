import { useParams } from 'react-router-dom';
import { ChatHeader } from '../components/chat-header';
import { MessageInput } from '../components/message/message-input';
import { MessagesList } from '../components/message/messages-list';
import { sendSocketMessage } from '@/services/messages.service';
import { useChatStore } from '@/lib/store/chat.store';
import { useEffect } from 'react';
import type { IMessage } from '@/lib/interfaces/conversations/messages-res.interface';
import { useAuthStore } from '@/lib/store/auth.store';

export const Chat = () => {
  const { id: conversationId } = useParams();
  const { user } = useAuthStore();
  const [currentUserId, currentUserFirstName] = [user.id, user.firstName];

  const { addMessage, replaceMessage, updateMessage, setActiveConversation } =
    useChatStore();

  useEffect(() => {
    setActiveConversation(conversationId ?? null);

    return () => setActiveConversation(null);
  }, [conversationId, setActiveConversation]);

  const handleSendMessage = async (content: string) => {
    if (!conversationId || !content.trim()) return;

    const clientMessageId = crypto.randomUUID();
    const now = new Date().toISOString();

    const optimisticMessage: IMessage = {
      id: `temp-${clientMessageId}`,
      clientMessageId,
      conversationId,
      senderId: currentUserId,
      type: 'TEXT',
      content: content.trim(),
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

    try {
      const message = await sendSocketMessage({
        conversationId,
        clientMessageId,
        content: content.trim(),
        type: 'TEXT',
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

  if (!conversationId) return null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChatHeader />

      <div className="min-h-0 flex-1">
        <MessagesList
          conversationId={conversationId}
          currentUserId={currentUserId}
        />
      </div>

      <div className="shrink-0 p-3">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};
