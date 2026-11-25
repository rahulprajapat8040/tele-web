import { create } from 'zustand';
import type { IMessage } from '../interfaces/conversations/messages-res.interface';

type SelectedMessage = IMessage & { conversationId: string };

interface MessageOptionState {
  selectedMessage: SelectedMessage | null;
  menuPosition: { x: number; y: number } | null;
  replyTo: SelectedMessage | null;
  editingMessage: SelectedMessage | null;
  deleteTarget: SelectedMessage | null;

  openMenu: (
    conversationId: string,
    message: IMessage,
    position: { x: number; y: number },
  ) => void;
  closeMenu: () => void;
  setReplyTo: (conversationId: string, message: IMessage) => void;
  clearReplyTo: () => void;
  setEditingMessage: (conversationId: string, message: IMessage) => void;
  clearEditingMessage: () => void;
  openDeleteDialog: (conversationId: string, message: IMessage) => void;
  closeDeleteDialog: () => void;
}

export const useMessageOption = create<MessageOptionState>((set) => ({
  selectedMessage: null,
  menuPosition: null,
  replyTo: null,
  editingMessage: null,
  deleteTarget: null,

  openMenu: (conversationId, message, position) => {
    set({
      selectedMessage: { ...message, conversationId },
      menuPosition: position,
    });
  },

  closeMenu: () => {
    set({ selectedMessage: null, menuPosition: null });
  },

  setReplyTo: (conversationId, message) => {
    set({
      replyTo: { ...message, conversationId },
      editingMessage: null,
      selectedMessage: null,
      menuPosition: null,
    });
  },

  clearReplyTo: () => {
    set({ replyTo: null });
  },

  setEditingMessage: (conversationId, message) => {
    set({
      editingMessage: { ...message, conversationId },
      replyTo: null,
      selectedMessage: null,
      menuPosition: null,
    });
  },

  clearEditingMessage: () => {
    set({ editingMessage: null });
  },

  openDeleteDialog: (conversationId, message) => {
    set({
      deleteTarget: { ...message, conversationId },
      selectedMessage: null,
      menuPosition: null,
    });
  },

  closeDeleteDialog: () => {
    set({ deleteTarget: null });
  },
}));