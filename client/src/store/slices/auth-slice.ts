import type { StateCreator } from "zustand";
// StateCreator gives types to: set , state ,your slice ,Without it → everything becomes any ❌
// StateCreator is a TypeScript type from Zustand.
type UserInfo = {
  email: string;
  profileSetup:boolean,
  id:string
};

export type AuthSlice = {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
};

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  userInfo: null, // 👈 important

  setUserInfo: (userInfo) => {
    console.log(77, userInfo);
    set({
      userInfo,
    });
  },
});
