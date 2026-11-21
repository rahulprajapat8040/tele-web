import { CHAT_EVENTS } from '@/lib/constant/chat-events.constant';
import { getSocket } from '@/services/socket.service';
import { useCallback, useEffect, useRef } from 'react';

export const useTypingIndicator = (conversationId: string) => {
  const typingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTyping = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!typingRef.current) return;

    typingRef.current = false;

    const socket = getSocket();

    if (socket.connected) {
      socket.emit(CHAT_EVENTS.TYPING_STOP, {
        conversationId,
      });
    }
  }, [conversationId]);

  const handleTyping = useCallback(() => {
    const socket = getSocket();

    if (!socket.connected) return;

    console.log('⌨️ KEY PRESSED', Date.now());

    if (!typingRef.current) {
      typingRef.current = true;

      console.log('🟢 EMITTING TYPING_START');

      socket.emit(CHAT_EVENTS.TYPING_START, { conversationId });
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      console.log('🔄 TIMER RESET');
    }

    timerRef.current = setTimeout(() => {
      console.log('🔴 FRONTEND TIMER FIRED - STOPPING TYPING', Date.now());
      stopTyping();
    }, 10000);
  }, [conversationId, stopTyping]);
  useEffect(() => {
    return () => stopTyping();
  }, [stopTyping]);

  return {
    handleTyping,
    stopTyping,
  };
};
