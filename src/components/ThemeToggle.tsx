"use client"

import { useEffect, useState } from 'react';
import { useStore } from '@/store';

export default function ThemeToggle() {
  const { theme, setTheme } = useStore();
  const [mounted, setMounted] = useState(false);

  // Synchronize on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const root = document.documentElement;
    if (savedTheme === 'dark') {
      root.classList.add('dark');
      setTheme('dark');
    } else if (savedTheme === 'light') {
      root.classList.remove('dark');
      setTheme('light');
    } else {
      // Fallback to prefers-color-scheme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
        setTheme('dark');
      } else {
        root.classList.remove('dark');
        setTheme('light');
      }
    }
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 animate-pulse" />
    );
  }

  const isCurrentDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <button
      onClick={toggle}
      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
      aria-label="Toggle theme"
    >
      {isCurrentDark ? (
        <svg className="w-5 h-5 text-amber-500 transition-transform duration-300 rotate-0 hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728A9 9 0 115.636 5.636m12.728 12.728L12 12" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-indigo-600 transition-transform duration-300 hover:-rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}
