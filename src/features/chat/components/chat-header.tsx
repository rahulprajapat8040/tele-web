import { EllipsisVertical, MessageCircle, Search } from 'lucide-react';

export const ChatHeader = () => {
  return (
    <div className="w-full h-12 text-background bg-foreground/90 drop-shadow rounded-full flex items-center gap-3.5 px-2">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
        <MessageCircle size={22} />
      </div>
      <div className="flex-1">
        <h2 className="font-semibold ">The College Mitraa</h2>
        <h3 className="text-sm/3.5 text-muted">last seen 6 hours ago</h3>
      </div>
      <div className="flex items-center gap-4 pe-3">
        <button>
          <Search size={22} />
        </button>
        <button>
          <EllipsisVertical size={22} />
        </button>
      </div>
    </div>
  );
};
