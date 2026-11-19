import { Send } from 'lucide-react';
import { MessageAttachment } from './message-attachment';
import { useState } from 'react';
import { VoiceMessage } from './voice-message';
import { AnimatePresence, motion } from 'motion/react';

export const MessageInput = () => {
  const [messageText, setMessageText] = useState('');
  return (
    <div className="w-full h-12 gap-2 rounded-full bg-foreground/95 px-2 text-background flex items-center justify-between">
      <MessageAttachment />
      <input
        type="text"
        onChange={(e) => setMessageText(e.target.value)}
        placeholder="Message"
        className="font-medium flex-1"
      />
      <div className="bg-primary-700 size-10 rounded-full grid place-items-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {messageText.trim() ? (
            <motion.button
              key="send"
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              type="button"
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
    </div>
  );
};
