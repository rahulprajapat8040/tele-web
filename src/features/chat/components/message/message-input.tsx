import { Send } from 'lucide-react';
import { useState, type SubmitEvent } from 'react';
import { MessageAttachment } from './message-attachment';
import { VoiceMessage } from './voice-message';
import { AnimatePresence, motion } from 'motion/react';
import { useTypingIndicator } from '@/hooks/use-typing-indicator';

interface MessageInputProps {
  conversationId: string;
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export const MessageInput = ({
  conversationId,
  onSend,
  disabled,
}: MessageInputProps) => {
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  const { handleTyping, stopTyping } = useTypingIndicator(conversationId);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const content = messageText.trim();

    if (!content || sending || disabled) return;

    stopTyping();

    try {
      setSending(true);
      await onSend(content);
      setMessageText('');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (value: string) => {
    setMessageText(value);

    if (value.trim().length > 0) {
      handleTyping();
    } else {
      stopTyping();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-12 w-full items-center justify-between gap-2 rounded-full bg-foreground/95 px-2 text-background"
    >
      <MessageAttachment />

      <input
        type="text"
        value={messageText}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={stopTyping}
        placeholder="Message"
        disabled={disabled || sending}
        className="flex-1 bg-transparent font-medium outline-none"
      />

      <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-700">
        <AnimatePresence mode="wait" initial={false}>
          {messageText.trim() ? (
            <motion.button
              key="send"
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              type="submit"
              disabled={sending || disabled}
              className="grid size-10 place-items-center"
            >
              <Send size={22} />
            </motion.button>
          ) : (
            <motion.div
              key="voice"
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="grid size-full place-items-center"
            >
              <VoiceMessage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
};
