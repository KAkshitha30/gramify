"use client";

import { useStore } from '@/store';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useStore();

  const toggle = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <button
      onClick={toggle}
      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm font-semibold text-sm tracking-wide flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      aria-label="Switch Language"
    >
      <span>🌐</span>
      <span>{language === 'en' ? 'EN' : 'HI'}</span>
    </button>
  );
};
