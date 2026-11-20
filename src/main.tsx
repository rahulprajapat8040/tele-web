import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { QueryProivder } from './providers/query-provider.tsx';
import { AuthProvider } from './providers/auth-provider.tsx';
import { SocketProvider } from './providers/socket-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProivder>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </QueryProivder>
  </StrictMode>,
);
