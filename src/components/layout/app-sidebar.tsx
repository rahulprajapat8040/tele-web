import { Menu, Search } from 'lucide-react';
import { ChatTabs } from '../common/chat/chat-tab';
import { Conversations } from '../common/chat/conversations';

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
        <Conversations />
      </div>
    </aside>
  );
};
