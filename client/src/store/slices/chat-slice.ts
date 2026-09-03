import type { StateCreator } from "zustand";
import type { Store } from "../index";

// when ts may complain

// type User = {
//   firstName?: string;
//   email : string
// };

// user.firstName.toUpperCase();
// TypeScript complains because firstName might be undefined.
// user.firstName?.toUpperCase() or if (user.firstName) {  user.firstName.toUpperCase() }

// So ? matters at compile time both when creating the object and when accessing the property. Runtime JavaScript itself doesn't enforce it.
// const user: User = {   firstname : "raj" } TypeScript complains : Property 'email' is missing



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

//  dm
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
  content?: string;
  messageType: string;
  fileUrl?: string;
  channelId?: string;
  sender: UserRef;
  recipient?: UserRef;
  createdAt: string;
};

const isUser = (val: User | string | undefined): val is User => {
  return typeof val !== "string" && val !== undefined;
};

export type ChatSlice = {
  
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
  setSelectedChatType: (
    selectedChatType: "contact" | "channel" | undefined,
  ) => void;

  //
  selectedChatData: Contact | Channel | undefined;
  setSelectedChatData: (
    selectedChatData: Contact | Channel | undefined,
  ) => void;

  // api response to store all chat messages on mount
  selectedChatMessages: Message[];
  setSelectedChatMessages: (selectedChatMessages: Message[]) => void;
  

  // all dm contact lists ==> api response
  directMessagesContacts: Contact[];
  setDirectMessagesContacts: (directMessagesContacts: Contact[]) => void;

  // update dm contact list ==> after receiving msg from socket in socket
  addContactsInDMContacts: (message: Message) => void; // removes existing contact and adds it at front

  // update new messages in existing messages
  addMessage: (message: Message) => void; // updates the existing messages array
  
  //
  channels: Channel[];
  addChannel: (channel: Channel) => void; // locally add one new channel without making an API call.
  setChannels: (channels: Channel[]) => void; // api response

  // the channel with the newest message moves to the top ==> socket
  addChannelInChannelList: (message: Message) => void;
  
  //
  closeChat: () => void;

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
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),

  //
  selectedChatData: undefined,
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),

  //
  selectedChatMessages: [],
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),

  // update message locally for both dm and channel , no need to make another api call to fetch message after sending
  addMessage: (message: Message) => {

    const selectedChatMessages = get().selectedChatMessages;

    const selectedChatType = get().selectedChatType;

    set({

      selectedChatMessages: [
        ...selectedChatMessages,
        
        // add new message object and update its sender and recipient
        {
          ...message,
          // For a direct message, both sender and recipient become IDs (strings).
          // For a channel, the code keeps sender and recipient exactly as they came in.
          // If your API messages and socket messages have different shapes, you usually want to normalize both to one consistent shape,
          // rather than leaving the API response and socket response different.
          
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : typeof message.recipient === "string"
                ? message.recipient
                : message.recipient?._id,

          // recipient:
          // selectedChatType === "channel"
          //   ? null : message.recipient?._id

          sender:
            selectedChatType === "channel"
              ? message.sender
              : typeof message.sender === "string"
                ? message.sender
                : message.sender._id,

            // sender:
            // selectedChatType === "channel"
            //   ? message.sender :  message.sender._id
               
        },

      ],
    });
  },
  

  //
  directMessagesContacts: [],

  setDirectMessagesContacts: (directMessagesContacts) =>
    set({ directMessagesContacts }),

  // update contact
  // Already exists → remove it → put it at front.
  // Doesn't exist  → just put it at front.
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
  

  //
  channels: [],
  setChannels: (channels) => set({ channels }), // from api response

  // locally add one new channel without making an API call after creating channel via model.
  addChannel: (channel) => {
    const channels = get().channels;
    set({ channels: [channel, ...channels] });
  },

  // the channel with the newest message moves to the top ==> socket
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

  //
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),


});
