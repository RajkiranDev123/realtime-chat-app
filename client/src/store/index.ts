import { create } from "zustand";
import { createAuthSlice, type AuthSlice } from "./slices/auth-slice";

type Store = AuthSlice;
// (...a) ==> This is shorthand for : (set, get, api)
export const useAppStore = create<Store>()((...a) => ({
  ...createAuthSlice(...a),
}));

// type outside (same thing) :

// Same meaning, just longer

// import { sayHi } from "./types";
// import type { User } from "./types";
// vs
// import { sayHi, type User } from "./types"; (shorter)

// ----------------------------------------------------------------

// types.ts ==>

// export type Person = {
//   name: string;
//   age: number;
// };

// index.ts ==>

// import type { Person } from "./types";

// const p: Person = {
//   name: "Rj",
//   age: 31,
// };

// console.log(p.name);

// currying
// const add = (a) => (b) => a + b;
// add(5)(10); // 15
