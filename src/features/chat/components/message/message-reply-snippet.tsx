import { cn } from '@/lib/utils/utils';
import type { IMessageReplyPreview } from '@/lib/interfaces/conversations/messages-res.interface';

interface MessageReplySnippetProps {
  replyTo: IMessageReplyPreview;
  isOwn?: boolean;
  compact?: boolean;
}

export const MessageReplySnippet = ({
  replyTo,
  isOwn = false,
  compact = false,
}: MessageReplySnippetProps) => {
  const previewText = replyTo.content?.trim() || 'Message';

  return (
    <div
      className={cn(
        'mb-1 flex min-w-0 gap-2 rounded-md px-2 py-1',
        isOwn
          ? 'bg-[#c8edbf]/80 dark:bg-[#1f4a3c]/90'
          : 'bg-black/5 dark:bg-black/25',
      )}
    >
      <div
        className={cn(
          'w-0.5 shrink-0 rounded-full',
          isOwn ? 'bg-emerald-600' : 'bg-[#e57373]',
        )}
      />
      <div className="min-w-0">
        <p
          className={cn(
            'truncate text-[12px] font-semibold leading-tight',
            isOwn ? 'text-emerald-700 dark:text-emerald-300' : 'text-[#e57373]',
          )}
        >
          {replyTo.sender.firstName}
        </p>
        <p
          className={cn(
            'truncate text-[12px] leading-tight text-gray-600 dark:text-gray-300',
            compact && 'max-w-55',
          )}
        >
          {previewText}
        </p>
      </div>
    </div>
  );
};
