// src/store/index.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppState {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  language: 'en' | 'hi' | 'te';
  setLanguage: (l: 'en' | 'hi' | 'te') => void;
  xp: number;
  streak: number;
  setXP: (x: number) => void;
  setStreak: (s: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: (typeof window !== 'undefined' ? localStorage.getItem('theme') : null) as ('light' | 'dark') || 'light',
      setTheme: (t) => set({ theme: t }),
      language: (typeof window !== 'undefined' ? localStorage.getItem('language') : null) as ('en' | 'hi') || 'en',
      setLanguage: (l) => set({ language: l }),
      xp: 0,
      streak: 0,
      setXP: (x) => set({ xp: x }),
      setStreak: (s) => set({ streak: s }),
    }),
    { name: 'gramify-store' }
  )
);
