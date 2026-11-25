import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';

import { useMessages } from '@/hooks/use-messages';

import { LoaderCircle, MessageCircle } from 'lucide-react';
import { useChatStore } from '@/lib/store/chat.store';
import type { IMessage } from '@/lib/interfaces/conversations/messages-res.interface';
import { formatMessageDate } from '@/lib/utils/utils';
import { MessageItem } from './messages-item';
import { MessageOptions } from './message-options';
import { CHAT_EVENTS } from '@/lib/constant/chat-events.constant';
import { getSocket } from '@/services/socket.service';
import { useMessageOption } from '@/lib/store/message-option.store';
import { canEditMessage } from '@/lib/utils/message.utils';

interface MessagesListProps {
  conversationId: string;
  currentUserId: string;
}

const EMPTY_MESSAGES: IMessage[] = [];

export const MessagesList = ({
  conversationId,
  currentUserId,
}: MessagesListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const isNearBottomRef = useRef(true);
  const previousScrollHeightRef = useRef(0);
  const shouldRestoreScrollRef = useRef(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useMessages(conversationId);

  const { setMessages } = useChatStore();

  const messages = useChatStore(
    (state) => state.messages[conversationId] ?? EMPTY_MESSAGES,
  );

  // Flatten pages and arrange messages chronologically.
  const apiMessages = useMemo(() => {
    const pages = data?.pages ?? [];

    return pages
      .flatMap((page) => page.data.data)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }, [data]);

  // Synchronize API messages with Zustand.
  useEffect(() => {
    if (data) {
      setMessages(conversationId, apiMessages);
    }
  }, [data, conversationId, apiMessages, setMessages]);

  const lastReadMessageRef = useRef<string | null>(null);

  useEffect(() => {
    lastReadMessageRef.current = null;
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || !messages.length) return;

    const socket = getSocket();

    const emitReadReceipt = () => {
      if (!socket.connected || document.visibilityState !== 'visible') return;

      const lastIncomingMessage = [...messages]
        .reverse()
        .find((message) => message.senderId !== currentUserId);

      if (!lastIncomingMessage) return;

      // Prevent duplicate emissions for the same cursor
      if (lastReadMessageRef.current === lastIncomingMessage.id) return;

      lastReadMessageRef.current = lastIncomingMessage.id;

      socket.emit(CHAT_EVENTS.MESSAGE_READ, {
        conversationId,
        lastReadMessageId: lastIncomingMessage.id,
      });
    };

    const handleConnect = () => {
      // Retry when the socket reconnects
      lastReadMessageRef.current = null;
      emitReadReceipt();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        emitReadReceipt();
      }
    };

    socket.on('connect', handleConnect);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Run immediately if already connected
    emitReadReceipt();

    return () => {
      socket.off('connect', handleConnect);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [conversationId, messages, currentUserId]);

  // Track whether the user is near the bottom.
  const handleScroll = useCallback(() => {
    const container = containerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    isNearBottomRef.current = distanceFromBottom < 150;

    // Fetch older messages near the top.
    if (container.scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
      previousScrollHeightRef.current = container.scrollHeight;
      shouldRestoreScrollRef.current = true;

      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Restore position after older messages have been inserted.
  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container || !shouldRestoreScrollRef.current) return;

    const previousHeight = previousScrollHeightRef.current;
    const newHeight = container.scrollHeight;

    container.scrollTop = newHeight - previousHeight;

    shouldRestoreScrollRef.current = false;
  }, [messages.length]);

  // Automatically scroll to the bottom for new messages.
  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container || shouldRestoreScrollRef.current) return;

    if (isNearBottomRef.current) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length]);

  // Start at the bottom when the first page loads.
  useLayoutEffect(() => {
    const container = containerRef.current;

    if (container && !isLoading && messages.length) {
      container.scrollTop = container.scrollHeight;
    }
  }, [conversationId, isLoading]);

  // Group messages by date.
  const groupedMessages = useMemo(() => {
    const groups: {
      date: string;
      messages: IMessage[];
    }[] = [];

    messages.forEach((message) => {
      const date = new Date(message.createdAt).toDateString();

      const lastGroup = groups[groups.length - 1];

      if (lastGroup?.date === date) {
        lastGroup.messages.push(message);
      } else {
        groups.push({
          date,
          messages: [message],
        });
      }
    });

    return groups;
  }, [messages]);

  const {
    selectedMessage,
    menuPosition,
    openMenu,
    closeMenu,
    setReplyTo,
    setEditingMessage,
    openDeleteDialog,
  } = useMessageOption();

  if (isLoading && !messages.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoaderCircle className="animate-spin text-primary-600" size={28} />
      </div>
    );
  }

  const showMenu =
    selectedMessage?.conversationId === conversationId && menuPosition;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex h-full flex-col overflow-y-auto px-3 py-5 sm:px-6"
    >
      {isFetchingNextPage && (
        <div className="sticky top-2 z-10 flex justify-center py-2">
          <div className="flex items-center gap-2 rounded-full px-4 py-2 text-xs text-gray-500 shadow dark:bg-[#202c33]">
            <LoaderCircle size={14} className="animate-spin" />
            Loading older messages...
          </div>
        </div>
      )}

      {!messages.length && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-3 grid size-16 place-items-center rounded-full  text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
            <MessageCircle size={28} />
          </div>

          <h3 className="text-sm font-semibold text-foreground">
            No messages yet
          </h3>

          <p className="mt-1 text-xs text-muted">
            Send a message to start the conversation.
          </p>
        </div>
      )}

      <div className="mt-auto space-y-5">
        {groupedMessages.map((group) => (
          <div key={group.date} className="space-y-3">
            <div className="sticky top-2 z-1 flex justify-center">
              <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-gray-600 shadow-sm backdrop-blur-md dark:bg-[#26343c]/90 dark:text-gray-300">
                {formatMessageDate(group.messages[0].createdAt)}
              </span>
            </div>

            <div className="space-y-2">
              {group.messages.map((message) => (
                <MessageItem
                  key={message.id || message.clientMessageId}
                  message={message}
                  isOwn={message.senderId === currentUserId}
                  onMenuChange={(message, position) =>
                    openMenu(conversationId, message, position)
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showMenu && selectedMessage && menuPosition && (
        <MessageOptions
          open
          position={menuPosition}
          message={selectedMessage}
          onClose={closeMenu}
          onReply={() => setReplyTo(conversationId, selectedMessage)}
          showEdit={canEditMessage(selectedMessage, currentUserId)}
          onEdit={() => setEditingMessage(conversationId, selectedMessage)}
          onCopy={() =>
            console.log('Copy message:', selectedMessage.id, selectedMessage.content)
          }
          onPin={() => console.log('Pin message:', selectedMessage.id)}
          onForward={() => console.log('Forward message:', selectedMessage.id)}
          onSelect={() => console.log('Select message:', selectedMessage.id)}
          onDelete={() => openDeleteDialog(conversationId, selectedMessage)}
        />
      )}
    </div>
  );
};
