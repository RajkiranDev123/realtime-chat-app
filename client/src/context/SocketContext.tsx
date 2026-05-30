import { useRef, useEffect, createContext, useContext } from "react"; // createContext , useContext

import type { ReactNode } from "react";

import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

// io is a function used to create a socket connection.
// Socket is a TypeScript type.

import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";

type IncomingMessage = {
  _id: string;
  content: string;
  messageType: string;
  fileUrl?: string;
  channelId?: string;
  createdAt: string;

  sender: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    image?: string;
    color?: number;
  };

  recipient: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    image?: string;
    color?: number;
  };
};

type SocketContextType = Socket | null;

const SocketContext = createContext<SocketContextType>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

type SocketProviderProps = {
  children: ReactNode;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {

  // socket connection is not UI data. You don't need a re-render just because the socket object changed.
  const socket = useRef<Socket | null>(null);

  const { userInfo } = useAppStore();

  useEffect(() => {

    if (userInfo) { //
      
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

      socket.current.on("connect_error", (err) => {
        console.log("Socket connect error =>", err);
      });

      // handleReceiveMessage
      const handleReceiveMessage = (message: IncomingMessage) => {
        console.log("handleReceiveMsg ==>", message);

        const {
          selectedChatType,
          selectedChatData,
          addMessage,
          addContactsInDMContacts,
        } = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          selectedChatData &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          addMessage(message);
        }
        addContactsInDMContacts(message);
      };


      // handleReceiveChannelMessage
      const handleReceiveChannelMessage = (message: IncomingMessage) => {
        console.log("handleReceiveChannelMsg ==>", message);
        const {
          selectedChatType,
          selectedChatData,
          addMessage,
          addChannelInChannelList,
        } = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          selectedChatData &&
          selectedChatData._id === message.channelId
        ) {
          addMessage(message);
        }
        addChannelInChannelList(message);
      };

      // listen 
      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receive-channel-message", handleReceiveChannelMessage);

      return () => {
        socket.current?.disconnect();
      };
    }
    //
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {/* {value} → pass variable / expression
      {{ key: value }} → pass inline object
      Your case → no object creation → no double braces needed */}
      {/* creates new object and changes reference every render (can trigger re-renders) */}
      {/* Use {value} → when passing variable/value directly */}
      {/* Use {{ }} → when creating a new object inline */}
      {children}
    </SocketContext.Provider>
  );
};
