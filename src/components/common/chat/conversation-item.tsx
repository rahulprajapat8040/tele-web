import { APP_ROUTES } from '@/lib/constant/route-constant';
import type {
  IConversation,
  User,
} from '@/lib/interfaces/conversations/conversations-res.interface';
import { cn, formatMessageTime, getFullName } from '@/lib/utils/utils';
import { MessageCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

type AvatarSize = 'sm' | 'md';

const avatarSizeClass: Record<AvatarSize, string> = {
  sm: 'size-10',
  md: 'size-12',
};

const iconSize: Record<AvatarSize, number> = {
  sm: 20,
  md: 22,
};

export const ConversationAvatar = ({
  isOnline,
  size = 'md',
  className,
}: {
  isOnline?: boolean;
  size?: AvatarSize;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600',
        avatarSizeClass[size],
        className,
      )}
    >
      <MessageCircle size={iconSize[size]} />

      {isOnline ? (
        <span
          className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-success"
          aria-hidden
        />
      ) : null}
    </div>
  );
};

export const ConversationRow = ({
  conversation,
  user,
  isOnline,
}: {
  conversation: IConversation;
  user: User;
  isOnline: boolean;
}) => {
  const lastMessage = conversation.messages?.[0];

  return (
    <NavLink
      to={`${APP_ROUTES.CHAT}/${conversation.id}`}
      className={({ isActive }) =>
        cn(
          'flex cursor-pointer items-center gap-3 rounded-lg px-2 py-3 transition hover:bg-background/5',
          isActive && 'bg-background/10',
        )
      }
    >
      <ConversationAvatar isOnline={isOnline} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-background">
            {getFullName(user.firstName, user.lastName)}
          </h3>

          {lastMessage?.createdAt ? (
            <span className="shrink-0 text-xs text-muted">
              {formatMessageTime(lastMessage.createdAt)}
            </span>
          ) : null}
        </div>

        <div className="flex min-w-0 items-center gap-1">
          <p className="truncate text-sm text-muted">
            {lastMessage?.content ?? 'No messages yet'}
          </p>
        </div>
      </div>
    </NavLink>
  );
};
