import { Menu, Search, MessageCircle } from 'lucide-react';
import { ChatTabs } from '../common/chat/chat-tab';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '@/lib/constant/route-constant';

export const AppSidebar = () => {
  return (
    <aside className="flex h-full w-88 rounded-2xl shrink-0 flex-col bg-foreground py-2">
      {/* Sidebar Header */}
      <div className="flex h-14 items-center gap-3 px-4">
        <button className="rounded-full p-2 text-muted transition hover:bg-sidebar-hover">
          <Menu size={22} />
        </button>

        <div className="flex flex-1 items-center gap-2 bg-background/10 rounded-full px-3 py-2.25">
          <Search size={17} className="text-muted" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-sm text-background placeholder:text-muted"
          />
        </div>
      </div>

      <div className="px-2 mt-3 mb-2">
        <ChatTabs />
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <Link
          to={`${APP_ROUTES.CHAT}/a`}
          className="flex cursor-pointer items-center gap-3 px-2 py-3 transition hover:bg-background/5 rounded-lg"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <MessageCircle size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="truncate text-sm font-semibold text-background">
                John Doe
              </h3>
              <span className="text-xs text-muted">10:30 AM</span>
            </div>

            <p className="truncate text-sm text-muted">
              Hey! How are you doing?
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
};
