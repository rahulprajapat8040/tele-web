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

  updateMessageStatus: (
    conversationId: string,
    messageIds: string[],
    status: 'DELIVERED' | 'READ',
    userId: string,
    timestamp: string,
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

            const existingReceipts = message.receipts ?? [];

            const receiptExists = existingReceipts.some(
              (receipt) => receipt.userId === userId,
            );

            // Update existing receipt
            const updatedReceipts = existingReceipts.map((receipt) => {
              if (receipt.userId !== userId) return receipt;

              return {
                ...receipt,
                deliveredAt:
                  receipt.deliveredAt ??
                  (status === 'DELIVERED' || status === 'READ'
                    ? timestamp
                    : null),
                readAt:
                  receipt.readAt ?? (status === 'READ' ? timestamp : null),
              };
            });

            // Create receipt if it doesn't exist
            if (!receiptExists) {
              updatedReceipts.push({
                userId,
                deliveredAt:
                  status === 'DELIVERED' || status === 'READ'
                    ? timestamp
                    : null,
                readAt: status === 'READ' ? timestamp : null,
              } as IMessage['receipts'][number]);
            }

            return {
              ...message,
              receipts: updatedReceipts,
            };
          }),
        },
      };
    }),
}));
