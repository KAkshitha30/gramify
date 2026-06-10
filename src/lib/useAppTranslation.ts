"use client";
import i18n from '@/lib/i18n';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';

export function useAppTranslation() {
  const { language } = useStore();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    i18n.changeLanguage(language).then(() => {
      setTick(t => t + 1);
    });
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const translated = i18n.t(key);
    if (!translated || translated === key) {
      return fallback || key;
    }
    return translated;
  };

  return { t, language, ready: true };
}
