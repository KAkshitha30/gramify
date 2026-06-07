"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const PUBLIC_ROUTES = ['/', '/auth'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const isPublic = PUBLIC_ROUTES.includes(pathname);

        if (session) {
          setAuthenticated(true);
          if (pathname === '/auth') {
            router.push('/dashboard');
          }
        } else {
          setAuthenticated(false);
          if (!isPublic) {
            router.push('/auth');
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isPublic = PUBLIC_ROUTES.includes(pathname);
      if (session) {
        setAuthenticated(true);
        if (pathname === '/auth') {
          router.push('/dashboard');
        }
      } else {
        setAuthenticated(false);
        if (!isPublic) {
          router.push('/auth');
        }
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide animate-pulse">Loading Gramify...</p>
      </div>
    );
  }

  // Render content if route is public or user session is valid
  if (isPublic || authenticated) {
    return <>{children}</>;
  }

  return null;
}
