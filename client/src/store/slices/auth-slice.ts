import type { StateCreator } from "zustand";
// StateCreator gives types to : set , state , your slice , Without it → everything becomes any ❌
// StateCreator is a TypeScript type from Zustand.
type UserInfo = {
  email: string;
  profileSetup: boolean;
  id: string;
  firstName?: string;
  lastName?: string;
  color?: number;
  image?: string | null;
};

export type AuthSlice = {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo | null) => void;
  // When someone calls setUserInfo, they can pass either :a UserInfo object or null
};

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  userInfo: null,

  setUserInfo: (userInfo) => {

    set({
      userInfo,
    });
  },
});

// import { create, StateCreator } from "zustand";

// /* ---------- Slice type ---------- */
// type Slice = {
//   value: string;
//   setValue: (v: string) => void;
// };

// /* ---------- Slice ---------- */
// const createSlice: StateCreator<Slice> = (set) => ({
//   value: "",

//   setValue: (v) => set({ value: v }),
// });

// /* ---------- Store (this is what you use) ---------- */
// export const useStore = create<Slice>()((...a) => ({
//   ...createSlice(...a),
// }));

// const value = useStore((s) => s.value);
// or const {value} = useStore()
