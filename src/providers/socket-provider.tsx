import { connectSocket, disconnectSocket } from '@/services/socket.service';
import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const instance = connectSocket();
    setSocket(instance);

    const onPageHide = () => {
      disconnectSocket();
    };

    window.addEventListener('pagehide', onPageHide);

    return () => {
      window.removeEventListener('pagehide', onPageHide);
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);