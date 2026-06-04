import type { StateCreator } from "zustand";
import type { Store } from "../index";

type User = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string;
  color?: number;
};

export type Channel = {
  _id: string;
  name: string;
};

export type Contact = {
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
  channelId?: string;

  sender: UserRef;
  recipient: UserRef;

  createdAt: string;
};

// type ChatData = {
//   email: string;
//   profileSetup?: boolean;
//   _id: string;
//   firstName?: string;
//   lastName?: string;
//   color?: number;
//   image?: string | null;
// };

const isUser = (val: User | string): val is User => {
  return typeof val !== "string";
};

export type ChatSlice = {
  //
  isUploading: boolean;
  isDownloading: boolean;
  fileUploadProgress: number;
  fileDownloadProgress: number;

  setIsUploading: (isUploading: boolean) => void;
  setIsDownloading: (isDownloading: boolean) => void;
  setFileUploadProgress: (fileUploadProgress: number) => void;
  setFileDownloadProgress: (fileDownloadProgress: number) => void;

  //
  selectedChatType: "contact" | "channel" | undefined; // is a union of string literal types.
  selectedChatData: Contact | Channel | undefined;
  selectedChatMessages: Message[];
  directMessagesContacts: Contact[];
  //
  channels: Channel[];

  addChannel: (channel: Channel) => void;
  setChannels: (channels: Channel[]) => void;
  //

  setDirectMessagesContacts: (directMessagesContacts: Contact[]) => void;

  setSelectedChatType: (selectedChatType: "contact" | "channel") => void;

  setSelectedChatData: (selectedChatData: Contact | Channel) => void;

  setSelectedChatMessages: (selectedChatMessages: Message[]) => void;

  closeChat: () => void;

  addMessage: (message: Message) => void;

  addContactsInDMContacts: (message: Message) => void;
  addChannelInChannelList: (message: Message) => void;
};

export const createChatSlice: StateCreator<Store, [], [], ChatSlice> = (
  set,
  get,
) => ({
  //
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownloadProgress) =>
    set({ fileDownloadProgress }),

  //
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  //
  
  channels: [],
  setChannels: (channels) => set({ channels }),
  addChannel: (channel) => {
    const channels = get().channels;
    set({ channels: [channel, ...channels] });
  },
  //

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
  addChannelInChannelList: (message: Message) => {
    const channels = get().channels;
    const data = channels.find((channel) => channel._id === message.channelId);
    // find can return channel | undefined
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId,
    );
    // must && data
    if (index !== -1 && data) {
      channels.splice(index, 1);
      channels.unshift(data);
    }
  },
  
  addContactsInDMContacts: (message: Message) => {
    const userId = get().userInfo?.id;

    const sender = message.sender;
    const recipient = message.recipient;

    const fromId =
      isUser(sender) && sender._id === userId
        ? isUser(recipient)
          ? recipient._id
          : recipient
        : isUser(sender)
          ? sender._id
          : sender;

    const fromData =
      isUser(sender) && sender._id === userId ? recipient : sender;

    const dmContacts = get().directMessagesContacts;

    const index = dmContacts.findIndex((c) => c._id === fromId);

    let updated = [...dmContacts];

    if (index !== -1) {
      updated.splice(index, 1);
    }

    updated.unshift(fromData as Contact);

    set({ directMessagesContacts: updated });
  },
});
