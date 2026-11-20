import { motion } from 'motion/react';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import type { IMessage } from '@/lib/interfaces/conversations/messages-res.interface';
import { formatMessageTime } from '@/lib/utils';

interface MessageItemProps {
  message: IMessage;
  isOwn: boolean;
}

export const MessageItem = ({ message, isOwn }: MessageItemProps) => {
  const isRead = message.receipts?.some((receipt) => receipt.readAt);

  const isDelivered = message.receipts?.some((receipt) => receipt.deliveredAt);
  console.log('Message isss', isOwn);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18 }}
      className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`relative max-w-[78%] min-w-22.5 px-3.5 pt-2.5 pb-2 shadow-sm sm:max-w-[65%] ${
          isOwn
            ? 'rounded-2xl rounded-br-sm bg-[#d9fdd3] text-[#172b20] dark:bg-[#285c4a] dark:text-white'
            : 'rounded-2xl rounded-bl-sm bg-white text-gray-800 dark:bg-[#202c33] dark:text-gray-100'
        }`}
      >
        {!isOwn && (
          <p className="mb-1 text-xs font-semibold text-primary-700 dark:text-primary-400">
            {message.sender?.firstName ?? 'Unknown'}
          </p>
        )}

        <p className="whitespace-pre-wrap wrap-break-word text-[14px] leading-[1.55]">
          {message.content}
        </p>

        <div className="mt-1 flex items-center justify-end gap-1.5">
          <span className="text-[10px] text-gray-500 dark:text-gray-300">
            {formatMessageTime(message.createdAt)}
          </span>

          {isOwn && (
            <span>
              {message.localStatus === 'SENDING' ? (
                <Clock size={13} className="text-gray-500" />
              ) : message.localStatus === 'FAILED' ? (
                <AlertCircle size={14} className="text-red-500" />
              ) : isRead ? (
                <CheckCheck size={15} className="text-sky-600" />
              ) : isDelivered ? (
                <CheckCheck size={15} className="text-gray-500" />
              ) : (
                <Check size={15} className="text-gray-500" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
