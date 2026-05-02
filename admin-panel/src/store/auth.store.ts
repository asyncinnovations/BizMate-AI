import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, AuthState } from "@/modules/auth/types";

interface AuthStore extends AuthState {
  setUser: (user: AuthUser) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) =>
        set({ user, isAuthenticated: true, error: null }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      logout: () =>
        set({ user: null, isAuthenticated: false, error: null }),
    }),
    {
      name: "bizmate-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);