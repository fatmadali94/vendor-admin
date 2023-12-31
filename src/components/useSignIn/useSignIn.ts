import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// interface SignIn {
//   username: string;
//   password: string;
// }

// const store = (set: any) => ({
//   user: { currentUser: [], isFetching: false, error: false },
//   loginStart: () =>
//     set((state: any) => ({ user: { ...state.user, isFetching: true } })),
//   loginSuccess: (user: any) =>
//     set((state: any) => ({
//       user: { ...state.user, currentUser: user, isFetching: false },
//     })),
//   loginFailure: () =>
//     set((state: any) => ({
//       user: { ...state.user, isFetching: false, error: true },
//     })),
//   logout: () =>
//     set((state: any) => ({ user: { ...state.user, currentUser: null } })),
// });

// export const useStore = create((store));

export const useStore = create(
  persist(
    (set) => ({
      user: { currentUser: [], isFetching: false, error: false },
      loginStart: () =>
        set((state: any) => ({ user: { ...state.user, isFetching: true } })),
      loginSuccess: (user: any) =>
        set((state: any) => ({
          user: { ...state.user, currentUser: user, isFetching: false },
        })),
      loginFailure: () =>
        set((state: any) => ({
          user: { ...state.user, isFetching: false, error: true },
        })),
      logout: () =>
        set((state: any) => ({ user: { ...state.user, currentUser: null } })),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
