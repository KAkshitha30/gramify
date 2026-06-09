"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAppTranslation } from '@/lib/useAppTranslation';
import { useStore } from '@/store';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useAppTranslation();
  const { setXP, setStreak } = useStore();
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const syncProfile = () => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('user_name');
      const storedAvatar = localStorage.getItem('user_avatar');
      const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
      if (isLoggedIn && storedName) {
        setUserName(storedName);
        setUserAvatar(storedAvatar || '🎓');
      } else {
        setUserName('');
        setUserAvatar('');
      }
    }
  };

  useEffect(() => {
    syncProfile();
    
    // Listen for storage events (if changed in another tab)
    window.addEventListener('storage', syncProfile);
    return () => {
      window.removeEventListener('storage', syncProfile);
    };
  }, [pathname]); // Re-sync when navigation occurs to update instantly on login/signup

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const closeDropdown = () => setDropdownOpen(false);
    window.addEventListener('click', closeDropdown);
    return () => {
      window.removeEventListener('click', closeDropdown);
    };
  }, [dropdownOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('is_logged_in');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_avatar');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_interests');
      setUserName('');
      setUserAvatar('');
      setXP(0);
      setStreak(0);
      setDropdownOpen(false);
      router.push('/auth');
    }
  };

  const links = [
    { name: 'Dashboard', href: '/dashboard', emoji: '📊', key: 'dashboard' },
    { name: 'Lessons', href: '/lessons', emoji: '📚', key: 'lessons' },
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
            
            {userName && (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl animate-fadeIn transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <span className="text-xl">{userAvatar}</span>
                  <span className="hidden sm:inline text-xs font-bold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">{userName}</span>
                  <span className="text-[10px] text-slate-400">▼</span>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      👤 {t('nav.profile', 'Profile')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer border-t border-slate-100 dark:border-slate-850"
                    >
                      🚪 {t('nav.logout', 'Logout')}
                    </button>
                  </div>
                )}
              </div>
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

