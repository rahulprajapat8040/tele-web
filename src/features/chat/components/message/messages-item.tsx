import { motion } from 'motion/react';
import { Check, CheckCheck } from 'lucide-react';
import type { IMessage } from '@/lib/interfaces/conversations/messages-res.interface';
import { formatMessageTime, getMessageStatus } from '@/lib/utils';

interface MessageItemProps {
  message: IMessage;
  isOwn: boolean;
}

export const MessageItem = ({ message, isOwn }: MessageItemProps) => {
  const status = getMessageStatus(message);

  console.log('STATUSSSS FOUNDDD', message, status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18 }}
      className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`relative min-w-0 max-w-[78%] px-3.5 py-1.5 shadow-sm sm:max-w-[65%] ${
          isOwn
            ? 'rounded-2xl rounded-br-sm bg-[#d9fdd3] text-[#172b20] dark:bg-[#285c4a] dark:text-white'
            : 'rounded-2xl rounded-tl-sm bg-white text-gray-800 dark:bg-[#202c33] dark:text-gray-100'
        }`}
      >
        <p className="whitespace-pre-wrap wrap-break-word text-wrap text-[14px] leading-[1.55]">
          {message.content}
        </p>

        <div className="mt-2 shrink-0 flex items-center justify-end gap-0.5">
          <span className="text-[10px] text-gray-500 dark:text-gray-300">
            {formatMessageTime(message.createdAt)}
          </span>

          {isOwn && (
            <span>
              {status === 'SENT' && (
                <Check size={14} className="text-gray-400" />
              )}

              {status === 'DELIVERED' && (
                <CheckCheck size={16} className="text-gray-400" />
              )}

              {status === 'READ' && (
                <CheckCheck size={16} className="text-sky-500" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
