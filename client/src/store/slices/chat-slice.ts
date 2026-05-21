import type { StateCreator } from "zustand";

type User = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string;
  color?: number;
};
type Contact = {
  _id: string;
  lastMessageTime: string;

  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;

  color?: number;
};
type UserRef = User | string;

type Message = {
  _id: string;
  content: string;
  messageType: string;
  fileUrl?: string;

  sender: UserRef;
  recipient: UserRef;
  createdAt: string;
};

type ChatData = {
  email: string;
  profileSetup?: boolean;
  _id: string;
  firstName?: string;
  lastName?: string;
  color?: number;
  image?: string | null;
};

export type ChatSlice = {
  selectedChatType: string | undefined;
  selectedChatData: ChatData | undefined;
  selectedChatMessages: Message[];
  directMessagesContacts: Contact[];

  setDirectMessagesContacts: (directMessagesContacts: Contact[]) => void;

  setSelectedChatType: (selectedChatType: string) => void;

  setSelectedChatData: (selectedChatData: ChatData) => void;

  setSelectedChatMessages: (selectedChatMessages: Message[]) => void;

  closeChat: () => void;

  addMessage: (message: Message) => void;
};

export const createChatSlice: StateCreator<ChatSlice> = (set, get) => ({
  selectedChatType: undefined,

  selectedChatData: undefined,

  selectedChatMessages: [],

  directMessagesContacts: [],

  setDirectMessagesContacts: (directMessagesContacts) =>
    set({ directMessagesContacts }),

  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),

  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),

  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),

  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),

  addMessage: (message: Message) => {
    const selectedChatMessages = get().selectedChatMessages;

    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,

        {
          ...message,

          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : typeof message.recipient === "string"
                ? message.recipient
                : message.recipient._id,

          sender:
            selectedChatType === "channel"
              ? message.sender
              : typeof message.sender === "string"
                ? message.sender
                : message.sender._id,
        },
      ],
    });
  },
});
