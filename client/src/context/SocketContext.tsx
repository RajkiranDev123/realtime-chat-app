import { useRef, useEffect, createContext, useContext } from "react";

import type { ReactNode } from "react";

import { io, Socket } from "socket.io-client";
// io is a function used to create a socket connection.
// Socket is a TypeScript type.

import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";

type SocketContextType = Socket | null;

const SocketContext = createContext<SocketContextType>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

type SocketProviderProps = {
  children: ReactNode;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socket = useRef<Socket | null>(null);

  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      // io() ==> creates + returns socket instance/object
      socket.current = io(HOST, {
        withCredentials: true,
        query: {
          userId: userInfo.id,
        },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
