'use no memo';

import { ConversationAvatar } from '@/components/common/chat/conversation-item';
import { formatLastSeen } from '@/lib/utils/utils';
import { EllipsisVertical, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface ChatHeaderProps {
  displayName: string;
  isOnline: boolean;
  isTyping?: boolean;
  lastSeenAt: string | null;
  isLoading?: boolean;
}

export const ChatHeader = ({
  displayName,
  isOnline,
  isTyping = false,
  lastSeenAt,
  isLoading = false,
}: ChatHeaderProps) => {
  const statusLabel = isOnline
    ? 'online'
    : formatLastSeen(lastSeenAt ? new Date(lastSeenAt) : null);

  return (
    <div className="flex h-12 w-full items-center gap-3.5 rounded-full bg-foreground/90 px-2 text-background drop-shadow">
      <ConversationAvatar isOnline={isOnline} size="sm" />

      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold">
          {isLoading ? 'Loading…' : displayName}
        </h2>

        <AnimatePresence mode="wait">
          {isTyping ? (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1.5"
            >
              <span className="text-xs text-primary-400">typing</span>

              <div className="flex items-center gap-1">
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    className="size-1 rounded-full bg-primary-400"
                    animate={{
                      y: [0, -3, 0],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 0.65,
                      repeat: Infinity,
                      delay: dot * 0.15,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm/3.5 text-muted"
            >
              {statusLabel}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 pe-3">
        <button type="button" aria-label="Search in conversation">
          <Search size={22} />
        </button>

        <button type="button" aria-label="Conversation options">
          <EllipsisVertical size={22} />
        </button>
      </div>
    </div>
  );
};