"use client";

import i18n from '@/lib/i18n';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';

export function useAppTranslation() {
  const { language } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    i18n.changeLanguage(language);
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    // If client component hasn't mounted yet, render fallback (or key) to avoid server/client mismatch.
    if (!mounted) {
      return fallback || key;
    }
    
    const translated = i18n.t(key);
    // If translation key is missing or matches the key name, use fallback if provided
    if (!translated || translated === key) {
      return fallback || key;
    }
    return translated;
  };

  return { t, language, ready: mounted };
}
