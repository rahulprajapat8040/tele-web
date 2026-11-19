import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Paperclip,
  Image,
  File,
  Music,
  ListChecks,
  CalendarDays,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttachmentOption {
  label: string;
  icon: LucideIcon;
  value: string;
}

interface MessageAttachmentProps {
  onSelect?: (value: string) => void;
}

const attachmentOptions: AttachmentOption[] = [
  {
    label: 'Photo or Video',
    icon: Image,
    value: 'media',
  },
  {
    label: 'File',
    icon: File,
    value: 'file',
  },
  {
    label: 'Music',
    icon: Music,
    value: 'music',
  },
  {
    label: 'Checklist',
    icon: ListChecks,
    value: 'checklist',
  },
  {
    label: 'Date',
    icon: CalendarDays,
    value: 'date',
  },
  {
    label: 'Article',
    icon: Newspaper,
    value: 'article',
  },
];

export const MessageAttachment = ({ onSelect }: MessageAttachmentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelect = (value: string) => {
    onSelect?.(value);
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }

    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Attachment Button */}
      <button
        type="button"
        aria-label="Add attachment"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-full hover:text-primary-text transition-colors"
      >
        <span className="flex">
          <Paperclip size={22} />
        </span>
      </button>

      {/* Attachment Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 12,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.95,
            }}
            transition={{
              duration: 0.18,
              ease: 'easeOut',
            }}
            className="absolute bottom-12 left-0 pb-2 z-50 origin-bottom-left"
          >
            <div className="w-48 p-2 rounded-2xl bg-foreground/90 shadow-xl backdrop-blur-xl">
              {attachmentOptions.map((option, index) => {
                const Icon = option.icon;

                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.03,
                      duration: 0.15,
                    }}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'w-full flex items-center gap-3 px-2 py-1.5',
                      'rounded-lg text-sm text-background',
                      'hover:bg-black/90 transition-colors',
                    )}
                  >
                    <Icon size={18} />

                    <span className="font-semibold text-sm">
                      {option.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
