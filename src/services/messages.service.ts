import { CHAT_EVENTS } from '@/lib/constant/chat-events.constant';
import { getSocket } from './socket.service';

interface SendMessagePayload {
  conversationId: string;
  clientMessageId: string;
  content: string;
  type: string;
}

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
