import { Send } from 'lucide-react';
import { useState, type SubmitEvent } from 'react';
import { MessageAttachment } from './message-attachment';
import { VoiceMessage } from './voice-message';
import { AnimatePresence, motion } from 'motion/react';

interface MessageInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export const MessageInput = ({ onSend, disabled }: MessageInputProps) => {
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const content = messageText.trim();

    if (!content || sending || disabled) return;

    try {
      setSending(true);
      await onSend(content);
      setMessageText('');
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-12 gap-2 rounded-full bg-foreground/95 px-2 text-background flex items-center justify-between"
    >
      <MessageAttachment />

      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        placeholder="Message"
        disabled={disabled || sending}
        className="font-medium flex-1 outline-none bg-transparent"
      />

      <div className="bg-primary-700 size-10 rounded-full grid place-items-center overflow-hidden shrink-0">
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
              className="size-full grid place-items-center"
            >
              <VoiceMessage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
};
