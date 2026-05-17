import type { StateCreator } from "zustand";

type Message = {
  id: string;
  text: string;
};

type ChatData = {
  email: string;
  profileSetup: boolean;
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

  setSelectedChatType: (selectedChatType: string) => void;
  setSelectedChatData: (selectedChatData: ChatData) => void;
  setSelectedChatMessages: (selectedChatMessages: Message[]) => void;

  closeChat: () => void;
};

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],

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
});
