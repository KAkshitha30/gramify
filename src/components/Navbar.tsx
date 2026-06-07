"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppTranslation } from '@/lib/useAppTranslation';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useAppTranslation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      router.push('/auth');
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const links = [
    { name: 'Dashboard', href: '/dashboard', emoji: '📊', key: 'dashboard' },
    { name: 'Battle Arena', href: '/battle-arena', emoji: '⚔️', key: 'battle_arena' },
    { name: 'AI Tutor', href: '/ai-tutor', emoji: '🤖', key: 'ai_tutor' },
  ];

  return (
    <nav className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-indigo-600 dark:text-indigo-400">
              <span className="text-3xl">🎓</span>
              <span>Gramify</span>
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{link.emoji}</span>
                  <span>{t(`nav.${link.key}`, link.name)}</span>
                </Link>
              );
            })}
          </div>

          {/* Actions - Right */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            
            {user && (
              <button
                onClick={handleSignOut}
                className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-100 dark:border-rose-900/30 hover:scale-102 hover:shadow-sm transition-all duration-200 cursor-pointer animate-fadeIn"
              >
                Sign Out 🚪
              </button>
            )}
            
            {/* Mobile Nav Button */}
            <div className="md:hidden flex items-center">
              <Link href="/dashboard" className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                <span>⚡</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
