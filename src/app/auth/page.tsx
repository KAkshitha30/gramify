"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useAppTranslation } from '@/lib/useAppTranslation';

const AVATARS = [
  { emoji: '🦊', label: 'Fox' },
  { emoji: '🦁', label: 'Lion' },
  { emoji: '🐯', label: 'Tiger' },
  { emoji: '🐼', label: 'Panda' },
  { emoji: '🦅', label: 'Eagle' },
  { emoji: '🦋', label: 'Butterfly' },
  { emoji: '🐬', label: 'Dolphin' },
  { emoji: '🦄', label: 'Unicorn' },
  { emoji: '🐍', label: 'Snake' },
  { emoji: '🦉', label: 'Owl' },
  { emoji: '🦚', label: 'Peacock' },
  { emoji: '🦀', label: 'Crab' }
];

const ROLES = [
  "Class 6–8 Student",
  "Class 9–10 Student",
  "Class 11–12 Student",
  "Engineering Student",
  "College Student",
  "Self Learner / Working Professional",
  "Preparing for JEE/NEET",
  "Preparing for UPSC / Govt Exams"
];

const SUBJECTS = [
  { id: 'ai_ml', name: '🤖 AI & Machine Learning' },
  { id: 'web_dev', name: '🌐 Web Development' },
  { id: 'data_science', name: '📊 Data Science' },
  { id: 'programming', name: '💻 Programming' },
  { id: 'physics', name: '⚡ Physics' },
  { id: 'math', name: '🧮 Mathematics' },
  { id: 'chemistry', name: '🧪 Chemistry' },
  { id: 'biology', name: '🧬 Biology' },
  { id: 'game_dev', name: '🎮 Game Development' },
  { id: 'cybersecurity', name: '🔒 Cybersecurity' }
];

export default function AuthPage() {
  const router = useRouter();
  const { setXP, setStreak } = useStore();
  const { t } = useAppTranslation();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup');
  const [step, setStep] = useState<1 | 2>(1);

  // Sign up fields
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Onboarding Step 2 fields
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([SUBJECTS[1].name]); // Default to Web Dev

  // Sign in fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const toggleSubject = (subjectName: string) => {
    if (selectedSubjects.includes(subjectName)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subjectName));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectName]);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert('Please fill out all fields.');
      return;
    }
    setStep(2);
  };

  const handleFinalSignUp = async () => {
    if (selectedSubjects.length === 0) {
      alert('Please pick at least 1 subject to learn!');
      return;
    }

    setXP(100); // 100 bonus XP for signing up!
    setStreak(1);
    
    // Save details to localStorage to synchronize
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_name', name);
      localStorage.setItem('user_avatar', selectedAvatar);
      localStorage.setItem('user_role', selectedRole);
      localStorage.setItem('user_interests', JSON.stringify(selectedSubjects));
      localStorage.setItem('is_logged_in', 'true');
    }

    alert(`Account created successfully! Welcome ${name}! 🎉`);
    router.push('/dashboard');
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      alert('Please enter your email and password.');
      return;
    }

    // Fully offline mock sign-in
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_name', signInEmail.split('@')[0]);
      localStorage.setItem('user_avatar', '🦁');
      localStorage.setItem('user_role', 'Engineering Student');
      localStorage.setItem('user_interests', JSON.stringify(['🤖 AI & Machine Learning', '🌐 Web Development']));
      localStorage.setItem('is_logged_in', 'true');
    }

    alert('Logged in successfully! Welcome back! 👋');
    setXP(240);
    setStreak(4);
    router.push('/dashboard');
  };

  const handleMagicLink = async () => {
    if (!signInEmail && activeTab === 'signin') {
      alert('Please enter your email address first.');
      return;
    }
    const emailToUse = activeTab === 'signin' ? signInEmail : email;
    if (!emailToUse) {
      alert('Please fill in your email address.');
      return;
    }
    
    // Fully offline mock magic link
    alert(`Magic link has been simulated! Welcome ${emailToUse.split('@')[0]}! 🪄`);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_name', emailToUse.split('@')[0]);
      localStorage.setItem('user_avatar', '🦉');
      localStorage.setItem('user_role', 'Self Learner / Working Professional');
      localStorage.setItem('user_interests', JSON.stringify(['💻 Programming', '🌐 Web Development']));
      localStorage.setItem('is_logged_in', 'true');
    }
    setXP(150);
    setStreak(3);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen py-12 px-4 flex flex-col justify-center items-center bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Container panel */}
      <div className="w-full max-w-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-8 relative transition-colors duration-300">
        
        {/* Absolute glow design */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-bl-[120px] pointer-events-none -z-10" />

        {/* Top active tab picker */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl mb-8 border border-slate-200/50 dark:border-slate-800/40">
          <button
            onClick={() => { setActiveTab('signin'); setStep(1); }}
            className={`py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'signin'
                ? 'bg-white dark:bg-[#1e293b] text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-800'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            👋 {t('auth.welcome_back', 'Sign In')}
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'signup'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            🚀 {t('auth.create_account', 'Sign Up')}
          </button>
        </div>

        {activeTab === 'signup' ? (
          /* Sign Up Forms */
          <div>
            {step === 1 ? (
              <form onSubmit={handleSignUpSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{t('auth.create_account', 'Create your account')}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('auth.step_1', 'Step 1 of 2 — Basic details')}</p>
                </div>

                {/* Avatar selection grid */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t('auth.pick_avatar', 'PICK AVATAR')}
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {AVATARS.map((avatar) => (
                      <button
                        key={avatar.label}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar.emoji)}
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl border transition-all ${
                          selectedAvatar === avatar.emoji
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-400 scale-105 shadow-md shadow-indigo-600/10'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:scale-102'
                        }`}
                      >
                        {avatar.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">{t('auth.your_name', 'Your name')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('auth.name_placeholder', 'Enter your name')}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">{t('auth.email_label', 'Email Address')}</label>
                  <input
                    type="email"
                    required
                    placeholder={t('auth.email_placeholder', 'you@example.com')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">{t('auth.password_label', 'Password')}</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                  >
                    {t('auth.next_interests', 'Next: Your Interests →')}
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2 Onboarding */
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    {t('auth.almost_there', 'Almost there, {{name}}!').replace('{{name}}', name)} <span className="text-3xl">{selectedAvatar}</span>
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {t('auth.step_2', 'Step 2 of 2 — What are you learning?')}
                  </p>
                </div>

                {/* Section 1 - I AM A... */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t('auth.i_am_a', 'I AM A...')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ROLES.map((role) => {
                      const isSelected = selectedRole === role;
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setSelectedRole(role)}
                          className={`px-4 py-3 rounded-2xl text-left border text-xs sm:text-sm font-bold tracking-tight transition-all duration-150 ${
                            isSelected
                              ? 'bg-slate-100 dark:bg-slate-800 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-600/5'
                              : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2 - I WANT TO LEARN... */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t('auth.i_want_to_learn', 'I WANT TO LEARN... (PICK 1+)')}
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {SUBJECTS.map((subject) => {
                      const isSelected = selectedSubjects.includes(subject.name);
                      return (
                        <button
                          key={subject.id}
                          type="button"
                          onClick={() => toggleSubject(subject.name)}
                          className={`px-4 py-2.5 rounded-full border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all duration-150 ${
                            isSelected
                              ? 'bg-[#6366f1] border-[#6366f1] text-white shadow-lg shadow-indigo-600/20'
                              : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          {subject.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-bold rounded-2xl transition-all"
                  >
                    {t('auth.back', '← Back')}
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSignUp}
                    className="flex-[2] py-4 bg-[#854d31] hover:bg-[#6c3e27] text-white font-bold rounded-2xl shadow-lg shadow-[#854d31]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
                  >
                    {t('auth.start_learning', '🚀 Start Learning!')}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Sign In Form */
          <form onSubmit={handleSignInSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">{t('auth.welcome_back', 'Welcome back!')}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('auth.signin_sub', 'Sign in with email and password or magic link')}</p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">{t('auth.email_label', 'Email Address')}</label>
              <input
                type="email"
                required
                placeholder={t('auth.email_placeholder', 'you@example.com')}
                value={signInEmail}
                onChange={e => setSignInEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">{t('auth.password_label', 'Password')}</label>
              <input
                type="password"
                required
                placeholder="••••••"
                value={signInPassword}
                onChange={e => setSignInPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={handleMagicLink}
                className="flex-1 py-4 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl transition"
              >
                {t('auth.magic_link', '🪄 Magic Link')}
              </button>
              <button
                type="submit"
                className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-xl transition transform hover:-translate-y-0.5"
              >
                {t('auth.signin_btn', 'Sign In 🔒')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
