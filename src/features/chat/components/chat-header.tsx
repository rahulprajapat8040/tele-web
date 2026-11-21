import { EllipsisVertical, MessageCircle, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface ChatHeaderProps {
  typing?: boolean;
}

export const ChatHeader = ({ typing = false }: ChatHeaderProps) => {
  return (
    <div className="flex h-12 w-full items-center gap-3.5 rounded-full bg-foreground/90 px-2 text-background drop-shadow">
      {/* Avatar */}
      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-100 text-primary-600">
        <MessageCircle size={22} />
      </div>

      {/* Name + typing indicator */}
      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold">The College Mitraa</h2>

        <AnimatePresence mode="wait">
          {typing ? (
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
            <motion.h3
              key="status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm/3.5 text-muted"
            >
              last seen 6 hours ago
            </motion.h3>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pe-3">
        <button type="button">
          <Search size={22} />
        </button>

        <button type="button">
          <EllipsisVertical size={22} />
        </button>
      </div>
    </div>
  );
};
