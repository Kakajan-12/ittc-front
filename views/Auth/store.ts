import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type T_ANON_TOKEN = {
  token: string;
  isAnonymous: boolean;
  login: string;
  anonUserId: string;
};

type T_AUTH_STATE = {
  anonymousSession: T_ANON_TOKEN | null;
  setAnonymousSession: (session: T_ANON_TOKEN) => void;
  clearAnonymousSession: () => void;
};

export const useAuthStore = create<T_AUTH_STATE>()(
  persist(
    (set) => ({
      anonymousSession: null,

      setAnonymousSession: (anonymousSession) => set({ anonymousSession }),

      clearAnonymousSession: () => set({ anonymousSession: null }),
    }),
    {
      name: "anonymous-auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
