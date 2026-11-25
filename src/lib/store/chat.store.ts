import { create } from 'zustand';
import type { IMessage } from '../interfaces/conversations/messages-res.interface';

interface ChatState {
  activeConversationId: string | null;
  messages: Record<string, IMessage[]>;

  setActiveConversation: (id: string | null) => void;

  setMessages: (conversationId: string, messages: IMessage[]) => void;

  addMessage: (conversationId: string, message: IMessage) => void;

  replaceMessage: (
    conversationId: string,
    clientMessageId: string,
    message: IMessage,
  ) => void;

  updateMessage: (
    conversationId: string,
    messageId: string,
    updates: Partial<IMessage>,
  ) => void;

  applyMessageEdit: (
    conversationId: string,
    messageId: string,
    updates: Partial<Pick<IMessage, 'content' | 'editedAt' | 'updatedAt'>>,
  ) => void;

  removeMessage: (conversationId: string, messageId: string) => void;

  updateMessageStatus: (
    conversationId: string,
    messageIds: string[],
    status: 'DELIVERED' | 'READ',
    userId: string,
    timestamp: string,
  ) => void;

  typingUsers: Record<string, string[]>;

  setTyping: (
    conversationId: string,
    userId: string,
    isTyping: boolean,
  ) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversationId: null,
  messages: {},

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
  },

  setMessages: (conversationId, messages) => {
    set((state) => {
      const existing = state.messages[conversationId] ?? [];

      const merged = [...messages];

      // Preserve optimistic messages not yet present in API results.
      existing.forEach((message) => {
        const exists = merged.some(
          (item) =>
            item.id === message.id ||
            item.clientMessageId === message.clientMessageId,
        );

        if (!exists && message.localStatus === 'SENDING') {
          merged.push(message);
        }
      });

      return {
        messages: {
          ...state.messages,
          [conversationId]: merged,
        },
      };
    });
  },

  addMessage: (conversationId, message) => {
    set((state) => {
      const existing = state.messages[conversationId] ?? [];

      const alreadyExists = existing.some(
        (item) =>
          item.id === message.id ||
          item.clientMessageId === message.clientMessageId,
      );

      if (alreadyExists) return state;

      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existing, message],
        },
      };
    });
  },

  replaceMessage: (conversationId, clientMessageId, message) => {
    set((state) => {
      const existing = state.messages[conversationId] ?? [];

      const index = existing.findIndex(
        (item) => item.clientMessageId === clientMessageId,
      );

      if (index === -1) {
        if (existing.some((item) => item.id === message.id)) {
          return state;
        }

        return {
          messages: {
            ...state.messages,
            [conversationId]: [...existing, message],
          },
        };
      }

      const updated = [...existing];
      updated[index] = message;

      return {
        messages: {
          ...state.messages,
          [conversationId]: updated,
        },
      };
    });
  },

  updateMessage: (conversationId, messageId, updates) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] ?? []).map(
          (message) =>
            message.id === messageId || message.clientMessageId === messageId
              ? { ...message, ...updates }
              : message,
        ),
      },
    }));
  },

  applyMessageEdit: (conversationId, messageId, updates) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] ?? []).map(
          (message) =>
            message.id === messageId
              ? { ...message, ...updates }
              : message,
        ),
      },
    }));
  },

  removeMessage: (conversationId, messageId) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] ?? []).filter(
          (message) => message.id !== messageId,
        ),
      },
    }));
  },

  updateMessageStatus: (
    conversationId,
    messageIds,
    status,
    userId,
    timestamp,
  ) =>
    set((state) => {
      const currentMessages = state.messages[conversationId];

      if (!currentMessages?.length) return state;

      const messageIdSet = new Set(messageIds);

      return {
        messages: {
          ...state.messages,
          [conversationId]: currentMessages.map((message) => {
            if (!messageIdSet.has(message.id)) return message;

            const receipts = message.receipts ?? [];
            const existingReceipt = receipts.find(
              (receipt) => receipt.userId === userId,
            );

            // Don't downgrade a READ receipt
            if (existingReceipt?.readAt && status === 'DELIVERED') {
              return message;
            }

            const updatedReceipts = existingReceipt
              ? receipts.map((receipt) =>
                  receipt.userId !== userId
                    ? receipt
                    : {
                        ...receipt,
                        deliveredAt: receipt.deliveredAt ?? timestamp,
                        readAt:
                          status === 'READ'
                            ? receipt.readAt ?? timestamp
                            : receipt.readAt,
                      },
                )
              : [
                  ...receipts,
                  {
                    userId,
                    deliveredAt: timestamp,
                    readAt: status === 'READ' ? timestamp : null,
                  } as IMessage['receipts'][number],
                ];

            return {
              ...message,
              receipts: updatedReceipts,
            };
          }),
        },
      };
    }),

  typingUsers: {},

  setTyping: (conversationId, userId, isTyping) =>
    set((state) => {
      const currentUsers = state.typingUsers[conversationId] ?? [];

      const updatedUsers = isTyping
        ? currentUsers.includes(userId)
          ? currentUsers
          : [...currentUsers, userId]
        : currentUsers.filter((id) => id !== userId);

      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: updatedUsers,
        },
      };
    }),
}));
