"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAppTranslation } from '@/lib/useAppTranslation';

interface LeaderboardUser {
  name: string;
  xp: number;
  avatar: string;
  level: number;
  rank: number;
}

interface QuestTopic {
  id: string;
  name: string;
  count: string;
  xpReward: number;
  progress: number;
  color: string;
}

const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Aarav Sharma', xp: 2450, avatar: '🦊', level: 12 },
  { rank: 2, name: 'Priya Patel', xp: 2100, avatar: '🦄', level: 10 },
  { rank: 3, name: 'Amit Verma', xp: 1850, avatar: '🐼', level: 9 },
  { rank: 4, name: 'Neha Gupta', xp: 1520, avatar: '🦉', level: 8 },
  { rank: 5, name: 'Rohan Singh', xp: 1200, avatar: '🐯', level: 6 }
];

const SUBJECT_MAP: Record<string, QuestTopic[]> = {
  '🤖 AI & Machine Learning': [
    { id: 'neural_nets', name: 'Neural Networks Foundations 🧠', count: '8 Lessons', xpReward: 120, progress: 0, color: 'border-l-indigo-500 hover:border-indigo-500' },
    { id: 'ml_models', name: 'Supervised vs Unsupervised ML 📉', count: '6 Lessons', xpReward: 90, progress: 0, color: 'border-l-purple-500 hover:border-purple-500' }
  ],
  '🌐 Web Development': [
    { id: 'html_css', name: 'HTML5 & CSS3 Premium Styling 🎨', count: '10 Lessons', xpReward: 100, progress: 0, color: 'border-l-indigo-500 hover:border-indigo-500' },
    { id: 'react_core', name: 'ReactJS Interactive Components ⚛️', count: '12 Lessons', xpReward: 150, progress: 0, color: 'border-l-sky-500 hover:border-sky-500' }
  ],
  '📊 Data Science': [
    { id: 'pandas_ds', name: 'Pandas & NumPy Data Analysis 🐼', count: '9 Lessons', xpReward: 110, progress: 0, color: 'border-l-emerald-500 hover:border-emerald-500' },
    { id: 'data_viz', name: 'Data Visualization with Seaborn 📊', count: '7 Lessons', xpReward: 80, progress: 0, color: 'border-l-teal-500 hover:border-teal-500' }
  ],
  '💻 Programming': [
    { id: 'python_algos', name: 'Python Algorithms & Structures 🐍', count: '15 Lessons', xpReward: 180, progress: 0, color: 'border-l-amber-500 hover:border-amber-500' },
    { id: 'git_mastery', name: 'Git Version Control Mastery 🐙', count: '5 Lessons', xpReward: 70, progress: 0, color: 'border-l-orange-500 hover:border-orange-500' }
  ],
  '⚡ Physics': [
    { id: 'kinematics', name: 'Classical Mechanics & Kinematics ☄️', count: '12 Lessons', xpReward: 140, progress: 0, color: 'border-l-amber-500 hover:border-amber-500' },
    { id: 'electromagnetism', name: 'Electromagnetism & Wave Optics 🧲', count: '10 Lessons', xpReward: 120, progress: 0, color: 'border-l-yellow-500 hover:border-yellow-500' }
  ],
  '🧮 Mathematics': [
    { id: 'calculus', name: 'Calculus: Limits & Derivatives 📈', count: '14 Lessons', xpReward: 160, progress: 0, color: 'border-l-rose-500 hover:border-rose-500' },
    { id: 'linear_alg', name: 'Linear Algebra & Vector Spaces 📐', count: '11 Lessons', xpReward: 130, progress: 0, color: 'border-l-pink-500 hover:border-pink-500' }
  ],
  '🧪 Chemistry': [
    { id: 'organic_chem', name: 'Organic Chemistry Reactions 🧪', count: '10 Lessons', xpReward: 120, progress: 0, color: 'border-l-emerald-500 hover:border-emerald-500' },
    { id: 'thermo_equilibrium', name: 'Thermodynamics & Equilibrium 🌡️', count: '8 Lessons', xpReward: 90, progress: 0, color: 'border-l-green-500 hover:border-green-500' }
  ],
  '🧬 Biology': [
    { id: 'cellular_resp', name: 'Cellular Respiration & Genetics 🧬', count: '11 Lessons', xpReward: 130, progress: 0, color: 'border-l-emerald-500 hover:border-emerald-500' },
    { id: 'human_anatomy', name: 'Human Anatomy & Systems 🫁', count: '13 Lessons', xpReward: 150, progress: 0, color: 'border-l-rose-500 hover:border-rose-500' }
  ],
  '🎮 Game Development': [
    { id: 'unity_intro', name: 'Unity 3D Physics Engine Intro 🎮', count: '12 Lessons', xpReward: 140, progress: 0, color: 'border-l-purple-500 hover:border-purple-500' },
    { id: 'csharp_scripting', name: 'C# Scripting for Games ⚔️', count: '10 Lessons', xpReward: 120, progress: 0, color: 'border-l-violet-500 hover:border-violet-500' }
  ],
  '🔒 Cybersecurity': [
    { id: 'crypto_keys', name: 'Cryptography & Hashing Keys 🔑', count: '10 Lessons', xpReward: 130, progress: 0, color: 'border-l-slate-500 hover:border-slate-500' },
    { id: 'network_audit', name: 'Network Vulnerability Auditing 🛡️', count: '8 Lessons', xpReward: 100, progress: 0, color: 'border-l-cyan-500 hover:border-cyan-500' }
  ]
};

export default function DashboardPage() {
  const { xp, streak, setXP, setStreak } = useStore();
  const { t } = useAppTranslation();
  
  const [userName, setUserName] = useState('Explorer');
  const [userAvatar, setUserAvatar] = useState('🎓');
  const [userRole, setUserRole] = useState('Class 6–8 Student');
  const [interests, setInterests] = useState<string[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [dynamicTopics, setDynamicTopics] = useState<QuestTopic[]>([]);

  useEffect(() => {
    const syncUserProfile = () => {
      let activeName = 'Explorer';
      let activeAvatar = '🎓';
      let activeRole = 'Class 6–8 Student';
      let activeInterests: string[] = [];

      if (typeof window !== 'undefined') {
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
          
          localStorage.setItem('user_name', activeName);
          localStorage.setItem('user_avatar', activeAvatar);
          localStorage.setItem('user_role', activeRole);
          localStorage.setItem('user_interests', JSON.stringify(activeInterests));
          
          setXP(foundUser.xp || 0);
          setStreak(foundUser.streak || 0);
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

      const topics: QuestTopic[] = [];
      activeInterests.forEach(interest => {
        if (SUBJECT_MAP[interest]) {
          topics.push(...SUBJECT_MAP[interest].map(topic => ({ ...topic, progress: 0 })));
        }
      });
      setDynamicTopics(topics);
    };

    syncUserProfile();

    setLeaderboard(INITIAL_LEADERBOARD);
  }, []);

  const handleQuestCompletion = (questXp: number, topicId: string) => {
    const nextXp = xp + questXp;
    const nextStreak = streak + 1;
    setXP(nextXp);
    setStreak(nextStreak);
    
    if (typeof window !== 'undefined') {
      const activeName = localStorage.getItem('user_name');
      const usersRaw = localStorage.getItem('registered_users') || '[]';
      let users = [];
      try {
        users = JSON.parse(usersRaw);
      } catch (e) {
        users = [];
      }
      users = users.map((u: any) => {
        if (u && u.name === activeName) {
          return { ...u, xp: nextXp, streak: nextStreak };
        }
        return u;
      });
      localStorage.setItem('registered_users', JSON.stringify(users));
    }
    
    setDynamicTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const nextProgress = Math.min(t.progress + 15, 100);
        return { ...t, progress: nextProgress };
      }
      return t;
    }));
    
    alert(t('dash.quest_completed', 'Quest completed! +{{xp}} XP gained & Streak increased! 🚀').replace('{{xp}}', questXp.toString()));
  };

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

      {/* Grid: Metrics, Leaderboard & Quests */}
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
                  ? t('dash.streak_great', 'Outstanding! Keep completing active quests to maintain this momentum!')
                  : t('dash.streak_start', 'Great start! Practice daily to protect your flame streak.')
                }
              </p>
            </div>
          </div>

          {/* Dynamic Subject Quests Path Section */}
          <section className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{t('dash.active_path', 'Active Learning Path 📚')}</h2>
              <Link href="/battle-arena" className="text-xs font-bold text-[#6366f1] dark:text-indigo-400 hover:underline">
                {t('dash.enter_arena', 'Enter Arena →')}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dynamicTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={`p-5 bg-slate-50 dark:bg-[#0b0f19] hover:bg-slate-100/50 dark:hover:bg-[#1f2937]/30 border-l-4 ${topic.color} rounded-2xl transition duration-200 flex flex-col justify-between gap-4`}
                >
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-snug">{topic.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      {topic.count} • {t('dash.xp_gained', 'Gain +{{xp}} XP').replace('{{xp}}', topic.xpReward.toString())}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div style={{ width: `${topic.progress}%` }} className="h-full bg-[#6366f1] rounded-full transition-all duration-300" />
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-400">{topic.progress}% {t('dash.complete', 'complete')}</span>
                      <button
                        onClick={() => handleQuestCompletion(topic.xpReward, topic.id)}
                        className="px-3 py-1 bg-[#6366f1] hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold shadow-md shadow-indigo-600/10 transition-transform active:scale-95 cursor-pointer"
                      >
                        {t('dash.start_quest', 'Start Quest')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
