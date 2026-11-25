import { CHAT_EVENTS } from '@/lib/constant/chat-events.constant';
import { getSocket } from './socket.service';

interface SendMessagePayload {
  conversationId: string;
  clientMessageId: string;
  content: string;
  type: string;
  replyToMessageId?: string | null;
}

interface EditMessagePayload {
  conversationId: string;
  messageId: string;
  content: string;
}

interface DeleteMessagePayload {
  conversationId: string;
  messageId: string;
  forEveryone: boolean;
}

export const sendSocketDeleteMessage = (payload: DeleteMessagePayload) => {
  const socket = getSocket();

  if (!socket?.connected) {
    return Promise.reject(new Error('Socket is not connected'));
  }

  return new Promise<any>((resolve, reject) => {
    socket
      .timeout(10000)
      .emit(
        CHAT_EVENTS.DELETE_MESSAGE,
        payload,
        (error: Error | null, response: any) => {
          if (error) {
            reject(error);
            return;
          }

          if (!response?.success) {
            reject(new Error('Message delete failed'));
            return;
          }

          resolve(response.data?.data ?? response.data);
        },
      );
  });
};

export const sendSocketEditMessage = (payload: EditMessagePayload) => {
  const socket = getSocket();

  if (!socket?.connected) {
    return Promise.reject(new Error('Socket is not connected'));
  }

  return new Promise<any>((resolve, reject) => {
    socket
      .timeout(10000)
      .emit(
        CHAT_EVENTS.EDIT_MESSAGE,
        payload,
        (error: Error | null, response: any) => {
          if (error) {
            reject(error);
            return;
          }

          if (!response?.success) {
            reject(new Error('Message edit failed'));
            return;
          }

          resolve(response.message?.data ?? response.message);
        },
      );
  });
};

export const sendSocketMessage = (payload: SendMessagePayload) => {
  const socket = getSocket();

  if (!socket?.connected) {
    return Promise.reject(new Error('Socket is not connected'));
  }

  return new Promise<any>((resolve, reject) => {
    socket
      .timeout(10000)
      .emit(
        CHAT_EVENTS.SEND_MESSAGE,
        payload,
        (error: Error | null, response: any) => {
          if (error) {
            reject(error);
            return;
          }

          if (!response?.success) {
            reject(new Error('Message sending failed'));
            return;
          }

          // Your gateway returns { success: true, message: responseSender(...) }
          console.log('Message sending', payload);
          resolve(response.message?.data ?? response.message);
        },
      );
  });
};
