'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { setAuthToken } from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  updateCredits: (credits: number) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),

      setToken: (token) => {
        setAuthToken(token);
        set({ token });
      },

      updateCredits: (credits) =>
        set((state) => ({ user: state.user ? { ...state.user, credits } : null })),

      logout: () => {
        setAuthToken(null);
        // Also clear the browser cookie used by middleware
        if (typeof document !== 'undefined') {
          document.cookie = 'token=; path=/; max-age=0';
        }
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'studyai-auth',
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
          // Ensure browser cookie exists for middleware on page reload
          if (typeof document !== 'undefined') {
            document.cookie = `token=${state.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
          }
        }
      },
    }
  )
);
