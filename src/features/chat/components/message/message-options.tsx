import { AnimatePresence, motion } from 'motion/react';
import {
  Copy,
  Forward,
  PenLine,
  Pin,
  Reply,
  Trash2,
  CheckSquare,
} from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/utils';
import type { IMessage } from '@/lib/interfaces/conversations/messages-res.interface';

interface MessageOptionsProps {
  open: boolean;
  position: { x: number; y: number };
  message?: IMessage;
  onClose: () => void;
  onReply: () => void;
  onEdit?: () => void;
  showEdit?: boolean;
  onCopy: () => void;
  onPin: () => void;
  onForward: () => void;
  onSelect: () => void;
  onDelete: () => void;
}

export const MessageOptions = ({
  open,
  position,
  onClose,
  onReply,
  onEdit,
  showEdit = false,
  onCopy,
  onPin,
  onForward,
  onSelect,
  onDelete,
}: MessageOptionsProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useLayoutEffect(() => {
    setAdjustedPosition(position);
  }, [position]);

  useLayoutEffect(() => {
    if (!open || !menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();
    const padding = 8;
    let x = position.x;
    let y = position.y;

    if (rect.right > window.innerWidth - padding) {
      x = Math.max(padding, window.innerWidth - rect.width - padding);
    }

    if (rect.bottom > window.innerHeight - padding) {
      y = Math.max(padding, window.innerHeight - rect.height - padding);
    }

    setAdjustedPosition({ x, y });
  }, [open, position]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Only left-click should dismiss — right-click is used to open the menu.
      if (event.button !== 0) return;

      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const handleScroll = () => onClose();

    // Defer so the same right-click that opened the menu doesn't close it.
    const timer = window.setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    document.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open, onClose]);

  const options = [
    { label: 'Reply', icon: Reply, action: onReply },
    ...(showEdit && onEdit
      ? [{ label: 'Edit', icon: PenLine, action: onEdit }]
      : []),
    { label: 'Copy text', icon: Copy, action: onCopy },
    { label: 'Pin message', icon: Pin, action: onPin },
    { label: 'Forward', icon: Forward, action: onForward },
    { label: 'Select', icon: CheckSquare, action: onSelect },
    {
      label: 'Delete',
      icon: Trash2,
      action: onDelete,
      danger: true,
    },
  ];

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.92, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -5 }}
        transition={{ duration: 0.14, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          left: adjustedPosition.x,
          top: adjustedPosition.y,
          zIndex: 9999,
        }}
        className="w-46 overflow-hidden rounded-xl border px-2 bg-foreground/95 py-1.5 shadow-xl"
        onContextMenu={(event) => event.preventDefault()}
      >
        {options.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                option.action();
                onClose();
              }}
              className={cn(
                'flex w-full items-center gap-3 py-1 px-3 rounded-md text-sm transition-colors text-background hover:bg-black/90',
                option.danger && 'text-red-500 hover:text-background',
              )}
            >
              <Icon size={17} />
              <span className="font-medium">{option.label}</span>
            </button>
          );
        })}
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};
