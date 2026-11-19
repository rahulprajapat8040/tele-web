import { AppSidebar } from './app-sidebar';
import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
  return (
    <main className="flex h-dvh overflow-hidden p-3">
      <div className="flex h-full w-full overflow-hidden shadow-soft justify-between">
        <AppSidebar />

        <section className="min-w-0 flex-1 max-w-[50%] overflow-hidden mx-auto">
          <Outlet />
        </section>
      </div>
    </main>
  );
};
