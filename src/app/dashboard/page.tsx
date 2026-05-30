"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import Link from 'next/link';

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

// Mapping of selected subjects to realistic, high-quality learning tracks
const SUBJECT_MAP: Record<string, QuestTopic[]> = {
  '🤖 AI & Machine Learning': [
    { id: 'neural_nets', name: 'Neural Networks Foundations 🧠', count: '8 Lessons', xpReward: 120, progress: 40, color: 'border-l-indigo-500 hover:border-indigo-500' },
    { id: 'ml_models', name: 'Supervised vs Unsupervised ML 📉', count: '6 Lessons', xpReward: 90, progress: 10, color: 'border-l-purple-500 hover:border-purple-500' }
  ],
  '🌐 Web Development': [
    { id: 'html_css', name: 'HTML5 & CSS3 Premium Styling 🎨', count: '10 Lessons', xpReward: 100, progress: 70, color: 'border-l-indigo-500 hover:border-indigo-500' },
    { id: 'react_core', name: 'ReactJS Interactive Components ⚛️', count: '12 Lessons', xpReward: 150, progress: 30, color: 'border-l-sky-500 hover:border-sky-500' }
  ],
  '📊 Data Science': [
    { id: 'pandas_ds', name: 'Pandas & NumPy Data Analysis 🐼', count: '9 Lessons', xpReward: 110, progress: 50, color: 'border-l-emerald-500 hover:border-emerald-500' },
    { id: 'data_viz', name: 'Data Visualization with Seaborn 📊', count: '7 Lessons', xpReward: 80, progress: 25, color: 'border-l-teal-500 hover:border-teal-500' }
  ],
  '💻 Programming': [
    { id: 'python_algos', name: 'Python Algorithms & Structures 🐍', count: '15 Lessons', xpReward: 180, progress: 60, color: 'border-l-amber-500 hover:border-amber-500' },
    { id: 'git_mastery', name: 'Git Version Control Mastery 🐙', count: '5 Lessons', xpReward: 70, progress: 90, color: 'border-l-orange-500 hover:border-orange-500' }
  ],
  '⚡ Physics': [
    { id: 'kinematics', name: 'Classical Mechanics & Kinematics ☄️', count: '12 Lessons', xpReward: 140, progress: 45, color: 'border-l-amber-500 hover:border-amber-500' },
    { id: 'electromagnetism', name: 'Electromagnetism & Wave Optics 🧲', count: '10 Lessons', xpReward: 120, progress: 15, color: 'border-l-yellow-500 hover:border-yellow-500' }
  ],
  '🧮 Mathematics': [
    { id: 'calculus', name: 'Calculus: Limits & Derivatives 📈', count: '14 Lessons', xpReward: 160, progress: 55, color: 'border-l-rose-500 hover:border-rose-500' },
    { id: 'linear_alg', name: 'Linear Algebra & Vector Spaces 📐', count: '11 Lessons', xpReward: 130, progress: 20, color: 'border-l-pink-500 hover:border-pink-500' }
  ],
  '🧪 Chemistry': [
    { id: 'organic_chem', name: 'Organic Chemistry Reactions 🧪', count: '10 Lessons', xpReward: 120, progress: 35, color: 'border-l-emerald-500 hover:border-emerald-500' },
    { id: 'thermo_equilibrium', name: 'Thermodynamics & Equilibrium 🌡️', count: '8 Lessons', xpReward: 90, progress: 60, color: 'border-l-green-500 hover:border-green-500' }
  ],
  '🧬 Biology': [
    { id: 'cellular_resp', name: 'Cellular Respiration & Genetics 🧬', count: '11 Lessons', xpReward: 130, progress: 50, color: 'border-l-emerald-500 hover:border-emerald-500' },
    { id: 'human_anatomy', name: 'Human Anatomy & Systems 🫁', count: '13 Lessons', xpReward: 150, progress: 10, color: 'border-l-rose-500 hover:border-rose-500' }
  ],
  '🎮 Game Development': [
    { id: 'unity_intro', name: 'Unity 3D Physics Engine Intro 🎮', count: '12 Lessons', xpReward: 140, progress: 30, color: 'border-l-purple-500 hover:border-purple-500' },
    { id: 'csharp_scripting', name: 'C# Scripting for Games ⚔️', count: '10 Lessons', xpReward: 120, progress: 75, color: 'border-l-violet-500 hover:border-violet-500' }
  ],
  '🔒 Cybersecurity': [
    { id: 'crypto_keys', name: 'Cryptography & Hashing Keys 🔑', count: '10 Lessons', xpReward: 130, progress: 40, color: 'border-l-slate-500 hover:border-slate-500' },
    { id: 'network_audit', name: 'Network Vulnerability Auditing 🛡️', count: '8 Lessons', xpReward: 100, progress: 15, color: 'border-l-cyan-500 hover:border-cyan-500' }
  ]
};

export default function DashboardPage() {
  const { xp, streak, setXP, setStreak } = useStore();
  const [userName, setUserName] = useState('Explorer');
  const [userAvatar, setUserAvatar] = useState('🎓');
  const [userRole, setUserRole] = useState('Class 6–8 Student');
  const [interests, setInterests] = useState<string[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [dynamicTopics, setDynamicTopics] = useState<QuestTopic[]>([]);

  useEffect(() => {
    // Load local storage simulation data
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('user_name');
      const storedAvatar = localStorage.getItem('user_avatar');
      const storedRole = localStorage.getItem('user_role');
      const storedInterests = localStorage.getItem('user_interests');
      
      if (storedName) setUserName(storedName);
      if (storedAvatar) setUserAvatar(storedAvatar);
      if (storedRole) setUserRole(storedRole);
      
      let parsedInterests: string[] = [];
      if (storedInterests) {
        try {
          parsedInterests = JSON.parse(storedInterests);
          setInterests(parsedInterests);
        } catch {
          // ignore parsing error
        }
      }

      // Generate dynamic content based on selected interests
      const topics: QuestTopic[] = [];
      parsedInterests.forEach(interest => {
        if (SUBJECT_MAP[interest]) {
          topics.push(...SUBJECT_MAP[interest]);
        }
      });

      // If no valid topics are chosen or user hasn't completed onboarding, fall back to Web Dev and AI
      if (topics.length === 0) {
        topics.push(...SUBJECT_MAP['🌐 Web Development']);
        topics.push(...SUBJECT_MAP['🤖 AI & Machine Learning']);
        setInterests(['🌐 Web Development', '🤖 AI & Machine Learning']);
      }
      setDynamicTopics(topics);
    }

    // Initialize state metrics if empty
    if (xp === 0) setXP(120);
    if (streak === 0) setStreak(2);

    // Dynamic leaderboard compilation
    setLeaderboard(INITIAL_LEADERBOARD);
  }, []);

  const handleQuestCompletion = (questXp: number, topicId: string) => {
    setXP(xp + questXp);
    setStreak(streak + 1);
    
    // Smoothly update visual progress bar on dashboard for active element
    setDynamicTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const nextProgress = Math.min(t.progress + 15, 100);
        return { ...t, progress: nextProgress };
      }
      return t;
    }));
    
    alert(`Quest completed! +${questXp} XP gained & Streak increased! 🚀`);
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
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Namaste, {userName}! 👋</h1>
            <p className="text-indigo-100 mt-1 sm:mt-2 text-sm sm:text-base max-w-md font-medium">
              Registered as <span className="underline font-bold text-white">{userRole}</span>. Practice daily, earn XP, and climb the leaderboard!
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
          <span className="text-xs font-semibold tracking-wider text-indigo-200 uppercase">Current Status</span>
          <span className="text-3xl font-black mt-1">Level {level}</span>
          <span className="text-xs text-indigo-100 font-medium mt-1">Syntax Master 🛡️</span>
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
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Total Experience</h3>
                  <span className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-1 block">{xp} XP</span>
                </div>
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-xl">
                  ⚡
                </div>
              </div>
              <div className="mt-6 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Level progress</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{xpInCurrentLevel}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${xpInCurrentLevel}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block font-medium">100 XP required to reach next level</span>
              </div>
            </div>

            {/* Streak Card */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Daily Streak</h3>
                  <span className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-1 block">{streak} Days</span>
                </div>
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950/40 rounded-xl flex items-center justify-center text-xl animate-bounce">
                  🔥
                </div>
              </div>
              <p className="mt-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {streak > 2 
                  ? 'Outstanding! Keep completing active quests to maintain this momentum!' 
                  : 'Great start! Practice daily to protect your flame streak.'
                }
              </p>
            </div>
          </div>

          {/* Dynamic Subject Quests Path Section */}
          <section className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Active Learning Path 📚</h2>
              <Link href="/battle-arena" className="text-xs font-bold text-[#6366f1] dark:text-indigo-400 hover:underline">
                Enter Arena →
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
                    <p className="text-xs text-slate-400 font-semibold mt-1">{topic.count} • Gain +{topic.xpReward} XP</p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div style={{ width: `${topic.progress}%` }} className="h-full bg-[#6366f1] rounded-full transition-all duration-300" />
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-400">{topic.progress}% complete</span>
                      <button
                        onClick={() => handleQuestCompletion(topic.xpReward, topic.id)}
                        className="px-3 py-1 bg-[#6366f1] hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold shadow-md shadow-indigo-600/10 transition-transform active:scale-95 cursor-pointer"
                      >
                        Start Quest
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
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Leaderboard 🏆</h2>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
              Live updates
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
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Level {user.level}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm block text-slate-700 dark:text-slate-200">{user.xp}</span>
                  <span className="text-[9px] font-bold text-slate-400 tracking-wide uppercase">XP Points</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Ranked among top learners in rural classrooms. Keep mastering concepts to climb ranks!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
