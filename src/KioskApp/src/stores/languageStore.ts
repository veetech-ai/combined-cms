import { create } from 'zustand';
import i18n from '../i18n/i18n';

interface LanguageStore {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  currentLanguage: 'en',
  setLanguage: (lang: string) => {
    i18n.changeLanguage(lang);
    set({ currentLanguage: lang });
  },
}));