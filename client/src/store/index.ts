import { create } from "zustand";
import { createAuthSlice, type AuthSlice } from "./slices/auth-slice";

type Store = AuthSlice;
//(...a) ==> This is shorthand for : (set, get, api)
export const useAppStore = create<Store>()((...a) => ({
  ...createAuthSlice(...a),
}));
