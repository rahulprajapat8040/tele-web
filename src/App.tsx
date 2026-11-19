import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/app-layout';
import { IndexPage } from './app/index-page';
import { ChatPage } from './app/chat/chat-page';
import { APP_ROUTES } from './lib/constant/route-constant';
import { ProtectedRoute } from './components/layout/protected-route';

function App() {
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route element={<IndexPage />} index />
            <Route element={<ChatPage />} path={`${APP_ROUTES.CHAT}/:id`} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
