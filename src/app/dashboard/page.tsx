// force-redeploy-v2
"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppTranslation } from '@/lib/useAppTranslation';

interface LeaderboardUser {
  name: string;
  xp: number;
  avatar: string;
  level: number;
  rank: number;
}

const INITIAL_LEADERBOARD: LeaderboardUser[] = [];

const SUBJECT_LESSON_IDS: Record<string, string[]> = {
  '🤖 AI & Machine Learning': ['ai_ml-basic', 'ai_ml-intermediate', 'ai_ml-advanced'],
  '🌐 Web Development': ['web_dev-basic', 'web_dev-intermediate', 'web_dev-advanced'],
  '📊 Data Science': ['data_science-basic', 'data_science-intermediate', 'data_science-advanced'],
  '💻 Programming': ['programming-basic', 'programming-intermediate', 'programming-advanced'],
  '⚡ Physics': ['physics-basic', 'physics-intermediate', 'physics-advanced'],
  '🧮 Mathematics': ['math-basic', 'math-intermediate', 'math-advanced'],
  '🧪 Chemistry': ['chemistry-basic', 'chemistry-intermediate', 'chemistry-advanced'],
  '🧬 Biology': ['biology-basic', 'biology-intermediate', 'biology-advanced'],
  '🎮 Game Development': ['game_dev-basic', 'game_dev-intermediate', 'game_dev-advanced'],
  '🔒 Cybersecurity': ['cybersecurity-basic', 'cybersecurity-intermediate', 'cybersecurity-advanced'],
  '📚 English': ['english-basic', 'english-intermediate', 'english-advanced'],
  '🌍 Social Studies': ['social_studies-basic', 'social_studies-intermediate', 'social_studies-advanced']
};

export default function DashboardPage() {
  const router = useRouter();
  const { xp, streak, setXP, setStreak } = useStore();
  const { t } = useAppTranslation();
  
  const [userName, setUserName] = useState('Explorer');
  const [userAvatar, setUserAvatar] = useState('🎓');
  const [userRole, setUserRole] = useState('Class 6–8 Student');
  const [interests, setInterests] = useState<string[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const syncUserProfile = () => {
      let activeName = 'Explorer';
      let activeAvatar = '🎓';
      let activeRole = 'Class 6–8 Student';
      let activeInterests: string[] = [];
      let activeCompleted: string[] = [];

      if (typeof window !== 'undefined') {
        const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
        if (!isLoggedIn) {
          router.push('/auth');
          return;
        }

        const storedName = localStorage.getItem('user_name');
        const usersRaw = localStorage.getItem('registered_users') || '[]';
        let users = [];
        try {
          users = JSON.parse(usersRaw);
        } catch (e) {
          users = [];
        }

        const foundUser = users.find((u: any) => u && u.name === storedName);

        if (foundUser) {
          activeName = foundUser.name;
          activeAvatar = foundUser.avatar || '🎓';
          activeRole = foundUser.role || 'Class 6–8 Student';
          activeInterests = foundUser.interests || [];
          activeCompleted = foundUser.completedLessons || [];
          
          localStorage.setItem('user_name', activeName);
          localStorage.setItem('user_avatar', activeAvatar);
          localStorage.setItem('user_role', activeRole);
          localStorage.setItem('user_interests', JSON.stringify(activeInterests));
          const role = activeRole || 'Class 6-8 Student';
          const allowedLevels = (role.includes('Engineering') || role.includes('11') || role.includes('12')) ? ['basic','intermediate','advanced'] : (role.includes('9') || role.includes('10')) ? ['basic','intermediate'] : ['basic'];
          localStorage.setItem('allowed_levels', JSON.stringify(allowedLevels));
          const dashXP = (foundUser.completedLessons && foundUser.completedLessons.length > 0) ? (foundUser.xp || 0) : 0;
          setXP(dashXP);
          const dashStreak = foundUser.streak || 0;
          setStreak(dashStreak);
        } else {
          const storedAvatar = localStorage.getItem('user_avatar');
          const storedRole = localStorage.getItem('user_role');
          const storedInterests = localStorage.getItem('user_interests');
          
          if (storedName) activeName = storedName;
          if (storedAvatar) activeAvatar = storedAvatar;
          if (storedRole) activeRole = storedRole;
          if (storedInterests) {
            try {
              activeInterests = JSON.parse(storedInterests);
            } catch (err) {}
          }
        }
      }

      setUserName(activeName);
      setUserAvatar(activeAvatar);
      setUserRole(activeRole);
      
      if (activeInterests.length === 0) {
        activeInterests = ['🌐 Web Development', '🤖 AI & Machine Learning'];
      }
      setInterests(activeInterests);
      setCompletedLessons(activeCompleted);
    };

    syncUserProfile();

    setTimeout(() => {
      const stored = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const dynamic = stored
        .filter((u: any) => u && u.name)
        .sort((a: any, b: any) => (b.xp || 0) - (a.xp || 0))
        .slice(0, 10)
        .map((u: any, i: number) => ({
          rank: i + 1,
          name: u.name,
          xp: u.xp || 0,
          avatar: u.avatar || '🎓',
          level: Math.floor((u.xp || 0) / 100) + 1
        }));
      setLeaderboard(dynamic);
    }, 100);
  }, []);

  const level = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Welcome & Overview Header */}
      <section className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-bl-[150px] pointer-events-none" />
        
        <div className="flex items-center gap-4 sm:gap-6 flex-col sm:flex-row text-center sm:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-5xl sm:text-6xl border border-white/20 shadow-inner hover:scale-105 transition-transform duration-200">
            {userAvatar}
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t('dash.namaste', 'Namaste, {{name}}! 👋').replace('{{name}}', userName)}
            </h1>
            <p className="text-indigo-100 mt-1 sm:mt-2 text-sm sm:text-base max-w-md font-medium">
              {t('dash.registered_as', 'Registered as')} <span className="underline font-bold text-white">{userRole}</span>. Practice daily, earn XP, and climb the leaderboard!
            </p>
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3 justify-center sm:justify-start">
                {interests.map((interest, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-semibold text-white">
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Level badge */}
        <div className="px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex flex-col items-center">
          <span className="text-xs font-semibold tracking-wider text-indigo-200 uppercase">{t('dash.current_status', 'Current Status')}</span>
          <span className="text-3xl font-black mt-1">{t('dash.level', 'Level')} {level}</span>
          <span className="text-xs text-indigo-100 font-medium mt-1">{t('dash.syntax_master', 'Smart Learner 🛡️')}</span>
        </div>
      </section>

      {/* Grid: Metrics & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Metrics & active lessons */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Metrics summary widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* XP Card */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">{t('dash.total_xp', 'Total Experience')}</h3>
                  <span className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-1 block">{xp} XP</span>
                </div>
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-xl">
                  ⚡
                </div>
              </div>
              <div className="mt-6 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{t('dash.level_progress', 'Level progress')}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{xpInCurrentLevel}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${xpInCurrentLevel}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block font-medium">{t('dash.xp_required', '100 XP required to reach next level')}</span>
              </div>
            </div>

            {/* Streak Card */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">{t('dash.daily_streak', 'Daily Streak')}</h3>
                  <span className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-1 block">{streak} {t('dash.days', 'Days')}</span>
                </div>
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950/40 rounded-xl flex items-center justify-center text-xl animate-bounce">
                  🔥
                </div>
              </div>
              <p className="mt-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {streak > 2
                ? t('dash.streak_great', 'Outstanding! Keep up the great work and maintain this momentum!')
                : t('dash.streak_start', 'Great start! Practice daily to protect your flame streak.')}
              </p>
            </div>
          </div>

          {/* Subject Progress Section */}
          <section className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-4">
              {t('dash.lesson_progress', 'Lesson Progress 📚')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(SUBJECT_LESSON_IDS).filter(([subject]) => interests.includes(subject)).map(([subject, lessonIds]) => {
                const completedCount = lessonIds.filter(id => completedLessons.includes(id)).length;
                const total = lessonIds.length;
                const progress = Math.round((completedCount / total) * 100);
                return (
                  <div key={subject} className="p-5 bg-slate-50 dark:bg-[#0b0f19] hover:bg-slate-100/50 dark:hover:bg-[#1f2937]/30 border-l-4 border-indigo-500 rounded-2xl transition duration-200 flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-snug">{subject}</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-1">
                        {completedCount} / {total} {t('dash.lessons_completed', 'lessons completed')}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${progress}%` }} className="h-full bg-[#6366f1] rounded-full transition-all duration-300" />
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-400">{progress}% {t('dash.complete', 'complete')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right 1 Col: Leaderboard */}
        <section className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm h-fit transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{t('leaderboard', 'Leaderboard 🏆')}</h2>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
              {t('dash.live_updates', 'Live updates')}
            </span>
          </div>

          <div className="space-y-3.5">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#0b0f19]/50 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl transition duration-150"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center font-black text-sm ${
                    user.rank === 1 ? 'text-amber-500 text-base' : user.rank === 2 ? 'text-slate-400' : user.rank === 3 ? 'text-amber-700' : 'text-slate-400'
                  }`}>
                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-inner">
                    {user.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">{user.name}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{t('dash.level', 'Level')} {user.level}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm block text-slate-700 dark:text-slate-200">{user.xp}</span>
                  <span className="text-[9px] font-bold text-slate-400 tracking-wide uppercase">{t('dash.xp_points', 'XP Points')}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('dash.ranking_footer', 'Ranked among top learners. Keep mastering concepts to climb ranks!')}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
