"use client";

import Link from 'next/link';

export default function Home() {
  const features = [
    {
      title: 'Gamified Battle Arena',
      description: 'Challenge your friends or online players to real-time, fast-paced grammar matches. Win battles and climb the ranks!',
      icon: '⚔️',
      color: 'from-amber-500 to-orange-600',
      link: '/battle-arena',
    },
    {
      title: 'AI Smart Tutor',
      description: 'Chat with Guru AI, your dedicated language guide. Ask grammar questions, practice translations, and learn in Hindi & English.',
      icon: '🤖',
      color: 'from-indigo-500 to-purple-600',
      link: '/ai-tutor',
    },
    {
      title: 'Daily Quests & Streaks',
      description: 'Build robust habits with personalized daily lessons. Accumulate XP points, level up, and keep your flame streak burning!',
      icon: '🔥',
      color: 'from-rose-500 to-pink-600',
      link: '/dashboard',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center gap-8 z-10">
        {/* Glow effect backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[80px] sm:blur-[120px] -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-semibold text-xs sm:text-sm tracking-wide shadow-sm animate-pulse">
          🚀 Next-Gen Grammar Learning
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Master Grammar the <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">Fun Way</span>
        </h1>

        <p className="text-lg sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Empowering rural and local student education with gamified battles, bite-sized quests, and smart bilingual AI language tutoring.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
          <Link
            href="/auth"
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 dark:shadow-indigo-950/40 hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-center"
          >
            Get Started Free 👋
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-2xl font-bold shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all text-center"
          >
            Enter Dashboard 📊
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">Unleash Your Grammar Potential</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Everything you need to learn, compete, and excel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.link}
              className="group flex flex-col p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 rounded-bl-[100px] transition-opacity`} />
              
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 group-hover:scale-110 transition-transform shadow-inner">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm flex-grow">
                {feature.description}
              </p>

              <div className="mt-6 flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Try Now <span className="ml-1.5 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-8 text-sm text-slate-500 dark:text-slate-500 border-t border-slate-200/50 dark:border-slate-800/30 bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm">
        <p>© {new Date().getFullYear()} Gramify. Dedicated to bringing premium gamified education to everyone.</p>
      </footer>
    </div>
  );
}
