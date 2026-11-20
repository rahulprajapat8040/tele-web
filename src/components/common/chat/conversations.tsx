import { usersApi } from '@/api/users/users.api';
import { APP_ROUTES } from '@/lib/constant/route-constant';
import { getFullName } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Conversations = () => {
  const [page, setPage] = useState(1);
  const {
    data: {
      data: { data },
    },
  } = useSuspenseQuery({
    queryFn: () => usersApi.getConversations({ page, limit: 30 }),
    queryKey: ['conversations', page],
  });
  return data.map((i) => {
    const user = i?.members?.[0]?.user;
    const lastMessage = i?.messages?.[0];
    return (
      <Link
        key={i.id}
        to={`${APP_ROUTES.CHAT}/${i.id}`}
        className="flex cursor-pointer items-center gap-3 px-2 py-3 transition hover:bg-background/5 rounded-lg"
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
          <MessageCircle size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="truncate text-sm font-semibold text-background">
              {getFullName(user.firstName, user.phoneNo)}
            </h3>
            <span className="text-xs text-muted">10:30 AM</span>
          </div>

          <p className="truncate text-sm text-muted">{lastMessage.content}</p>
        </div>
      </Link>
    );
  });
};
