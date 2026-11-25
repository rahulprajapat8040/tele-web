import { AnimatePresence, motion } from 'motion/react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/utils';
import { useMessageOption } from '@/lib/store/message-option.store';
import { canDeleteForEveryone } from '@/lib/utils/message.utils';

interface MessageDeleteDialogProps {
  conversationId: string;
  peerName: string;
  onConfirm: (forEveryone: boolean) => Promise<void>;
}

export const MessageDeleteDialog = ({
  conversationId,
  peerName,
  onConfirm,
}: MessageDeleteDialogProps) => {
  const { deleteTarget, closeDeleteDialog } = useMessageOption();
  const [forEveryone, setForEveryone] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const activeTarget =
    deleteTarget?.conversationId === conversationId ? deleteTarget : null;

  const allowDeleteForEveryone =
    activeTarget && canDeleteForEveryone(activeTarget);

  useEffect(() => {
    if (!activeTarget) return;

    setForEveryone(Boolean(allowDeleteForEveryone));
  }, [activeTarget, allowDeleteForEveryone]);

  useEffect(() => {
    if (!activeTarget) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !deleting) {
        closeDeleteDialog();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, [activeTarget, deleting, closeDeleteDialog]);

  if (!activeTarget) return null;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onConfirm(forEveryone && Boolean(allowDeleteForEveryone));
      closeDeleteDialog();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleting(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/45 p-4"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !deleting) {
            closeDeleteDialog();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="w-full max-w-sm overflow-hidden rounded-2xl bg-[#17212b] text-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="px-5 pb-2 pt-5">
            <h3 className="text-lg font-semibold text-white">Delete message?</h3>
            <p className="mt-1 text-sm text-gray-300">
              This message will be removed from your chat.
            </p>
          </div>

          {allowDeleteForEveryone && (
            <label className="flex cursor-pointer items-start gap-3 px-5 py-3 text-sm text-gray-200">
              <input
                type="checkbox"
                checked={forEveryone}
                onChange={(event) => setForEveryone(event.target.checked)}
                disabled={deleting}
                className="mt-0.5 size-4 rounded border-gray-500 accent-[#8774e1]"
              />
              <span>
                Also delete for{' '}
                <span className="font-medium text-white">{peerName}</span>
              </span>
            </label>
          )}

          <div className="flex justify-end gap-2 border-t border-white/10 px-4 py-3">
            <button
              type="button"
              onClick={closeDeleteDialog}
              disabled={deleting}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className={cn(
                'rounded-lg bg-[#e53935] px-4 py-2 text-sm font-semibold text-white transition-opacity',
                deleting && 'opacity-60',
              )}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};