import { create } from 'zustand';

interface User {
  phoneNumber: string;
  rewardPoints: number;
  coupons: string[];
}

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  login: (phoneNumber: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  login: (phoneNumber: string) => {
    set({
      user: {
        phoneNumber,
        rewardPoints: 500,
        coupons: ['SAVE10', 'WELCOME20'],
      },
      isLoggedIn: true,
    });
  },
  logout: () => {
    set({ user: null, isLoggedIn: false });
  },
}));