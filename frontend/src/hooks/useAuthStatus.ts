import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isAuthenticated: boolean;
  setAuthenticated: (status: boolean) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  user: {
    id?: number;
    username?: string;
    email?: string;
  } | null;
  setUser: (user: AuthStore['user']) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      showLoginModal: false,
      setShowLoginModal: (show) => set({ showLoginModal: show }),
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user 
      }),
    }
  )
); 