import type { StateCreator } from "zustand";
// StateCreator gives types to : set , get , state , your slice , Without it → everything becomes any
// StateCreator is a TypeScript type from Zustand.
export type UserInfo = {
  email: string;
  profileSetup: boolean;
  id: string;
  //
  firstName: string;
  lastName?: string;
  color?: number;
  image?: string | null;
};

// Example with ?:

// type User = {
//   name: string;
//   age?: number;
// };

// Also Valid :

// const user1: User = {
//   name: "RJ",
// };

// 👉 Slice = States and Functions for ==> ONE feature
// slice type

export type AuthSlice = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  // The parameter name in the type definition doesn't have to match the parameter name in the actual function ,
  // setLoading: (loa : boolean) => void;
  // TypeScript only cares about the type, not the parameter name.
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo | null) => void; // When someone calls setUserInfo, they can pass either : a UserInfo object or null
};

// Zustand version, the slice creator complete type is provided before =

// generic arrow function expression with implicit return
// const identity = <T>(value: T): T => value;

// Parentheses around the object are needed so {} is treated as the returned object, not a function body
// const identity = <T>(value: T): T => ({name:"raj"});

// Generic arrow function expression with explicit return
// const identity = <T>(value: T): T => {
//   statements....
//   return value;
// };

// Generic function declaration , no = and no =>
// function identity<T>(value: T): T {
//   return value;
// }

// Generic function expression , only =
// const identity = function <T>(value: T): T {
//   return value;
// };

// typed arrow function
// const greet = (name: string): string => {
//   return `Hello ${name}`;
// };

// type User = {
//   id: string;
//   name: string;
// };

// typed arrow function with implicit return
// const getUser = (id: string): User => ({
//   id: id,
//   name: "John"
// });
// const user = getUser("123");

// StateCreator<AuthSlice> already describes things like : (set, get, store) => AuthSlice
// so we don't need to write the parameter and return types manually.

// below function is best called a typed arrow function, not a “generic arrow function.”
// AuthSlice = Type/contract and createAuthSlice = implementation
// In createAuthSlice, you provide the initial/default values and the actual functions.
// AuthSlice only describes the type , it doesn't create any actual data
export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  userInfo: null,
  loading: false,

  setUserInfo: (userInfo) => {
    // userInfo is parameter
    // userInfo: userInfo ==> object property shorthand.
    set({
      userInfo,
    });
    // At runtime, it can store a value that doesn't match UserInfo.
    // if the stored runtime value doesn't actually have the expected UserInfo properties, accessing them with . can fail or give undefined or no suggestion
  },
  setLoading: (loading) => {
    set({ loading });
  },
  // setLoading: (loa) => {
  //   set({ loading : loa });
  // },
});

// import type { StateCreator } from "zustand";
// import  { create } from "zustand";

//  ---------- Slice type ----------

// type Slice = {
//   value: string;
//   setValue: (v: string) => void;
// };

// ----------Create Slice ----------

// const createSlice: StateCreator<Slice> = (set) => ({
//   value: "",
//   setValue: (v) => set({ value: v }), or  setValue: (value) => set({ value }),
// });

// ---------- Store (this is what you use) ----------

// export type Store = Slice

// export const useStore = create<Store>()((...a) => ({
//   ...createSlice(...a),
// }));

// using ==>

// const value = useStore((s) => s.value);
// or const {value} = useStore()
