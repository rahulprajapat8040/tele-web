import { PenLine, Reply, Send, X } from 'lucide-react';
import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { MessageAttachment } from './message-attachment';
import { VoiceMessage } from './voice-message';
import { AnimatePresence, motion } from 'motion/react';
import { useTypingIndicator } from '@/hooks/use-typing-indicator';
import { useMessageOption } from '@/lib/store/message-option.store';
import { MessageReplySnippet } from './message-reply-snippet';

interface MessageInputProps {
  conversationId: string;
  onSend: (message: string) => Promise<void>;
  onEdit?: (messageId: string, content: string) => Promise<void>;
  disabled?: boolean;
}

export const MessageInput = ({
  conversationId,
  onSend,
  onEdit,
  disabled,
}: MessageInputProps) => {
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { replyTo, clearReplyTo, editingMessage, clearEditingMessage } =
    useMessageOption();

  const activeReply =
    replyTo?.conversationId === conversationId ? replyTo : null;

  const activeEdit =
    editingMessage?.conversationId === conversationId ? editingMessage : null;

  const isEditMode = Boolean(activeEdit);

  const { handleTyping, stopTyping } = useTypingIndicator(conversationId);

  useEffect(() => {
    if (activeReply) {
      inputRef.current?.focus();
    }
  }, [activeReply?.id]);

  useEffect(() => {
    if (!activeEdit) {
      return;
    }

    setMessageText(activeEdit.content);
    inputRef.current?.focus();
  }, [activeEdit]);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const content = messageText.trim();

    if (!content || sending || disabled) return;

    stopTyping();

    try {
      setSending(true);

      if (isEditMode && activeEdit && onEdit) {
        await onEdit(activeEdit.id, content);
        setMessageText('');
        clearEditingMessage();
        return;
      }

      await onSend(content);
      setMessageText('');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (value: string) => {
    setMessageText(value);

    if (isEditMode) return;

    if (value.trim().length > 0) {
      handleTyping();
    } else {
      stopTyping();
    }
  };

  const showSendButton = isEditMode
    ? messageText.trim() !== (activeEdit?.content ?? '').trim() &&
      Boolean(messageText.trim())
    : Boolean(messageText.trim());

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className="w-full overflow-hidden rounded-3xl bg-foreground/95 text-background shadow-sm"
    >
      <AnimatePresence initial={false}>
        {activeReply && (
          <motion.div
            key="reply-preview"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="flex items-stretch gap-2 border-b border-black/10 px-2 py-2 dark:border-white/10">
              <div className="flex items-center pl-1 text-[#e57373]">
                <Reply size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <MessageReplySnippet
                  replyTo={{
                    id: activeReply.id,
                    content: activeReply.content,
                    senderId: activeReply.senderId,
                    sender: activeReply.sender,
                  }}
                  compact
                />
              </div>

              <button
                type="button"
                onClick={clearReplyTo}
                className="grid size-8 shrink-0 place-items-center rounded-full text-[#e57373] transition-colors hover:bg-black/10"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {activeEdit && (
          <motion.div
            key="edit-preview"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-black/10 px-3 py-2 dark:border-white/10">
              <PenLine size={17} className="shrink-0 text-sky-400" />
              <p className="min-w-0 flex-1 truncate text-sm font-medium text-sky-300">
                Edit message
              </p>
              <button
                type="button"
                onClick={() => {
                  clearEditingMessage();
                  setMessageText('');
                }}
                className="grid size-8 shrink-0 place-items-center rounded-full text-sky-400 transition-colors hover:bg-black/10"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-12 items-center justify-between gap-2 px-2">
        <MessageAttachment />

        <input
          ref={inputRef}
          type="text"
          value={messageText}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={stopTyping}
          placeholder={isEditMode ? 'Edit message' : 'Message'}
          disabled={disabled || sending}
          className="flex-1 bg-transparent font-medium outline-none"
        />

        <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-700">
          <AnimatePresence mode="wait" initial={false}>
            {showSendButton ? (
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
                {!isEditMode ? <VoiceMessage /> : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.form>
  );
};