"use client";

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAppTranslation } from '@/lib/useAppTranslation';

interface Question {
  text: string;
  options: string[];
  answer: number;
  explanation: string;
}

// Local high-quality database as fallback
const SUBJECT_QUESTIONS: Record<string, Question[]> = {
  '🤖 AI & Machine Learning': [
    {
      text: "What is 'overfitting' in Machine Learning? 🤖",
      options: [
        "Model performs well on training data but poorly on unseen data",
        "Model performs poorly on both training and test data",
        "Model performs well on both training and test data",
        "Model runs too slowly"
      ],
      answer: 0,
      explanation: "Overfitting occurs when a model learns the details and noise in the training data to the extent that it negatively impacts performance on new data."
    },
    {
      text: "Which of the following is a supervised learning algorithm? 📉",
      options: ["K-Means Clustering", "Linear Regression", "Principal Component Analysis (PCA)", "Apriori Algorithm"],
      answer: 1,
      explanation: "Linear Regression is supervised (predicts continuous outputs from labeled data), whereas K-Means and PCA are unsupervised."
    },
    {
      text: "What activation function outputs values in the range [0, 1]? 🧠",
      options: ["ReLU", "Tanh", "Sigmoid", "Linear"],
      answer: 2,
      explanation: "The Sigmoid function maps any real-valued number into a value between 0 and 1, making it perfect for probability predictions."
    }
  ],
  '🌐 Web Development': [
    {
      text: "What does HTML stand for? 🌐",
      options: ["HighText Machine Language", "HyperText Markup Language", "HyperText Markdown Language", "Hyperlink Markup Language"],
      answer: 1,
      explanation: "HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages."
    },
    {
      text: "Which CSS property is used to change the text color? 🎨",
      options: ["text-color", "font-color", "color", "background-color"],
      answer: 2,
      explanation: "The 'color' property in CSS is used to set the color of the text."
    },
    {
      text: "In React, which hook is used to perform side effects? ⚛️",
      options: ["useState", "useContext", "useEffect", "useReducer"],
      answer: 2,
      explanation: "The 'useEffect' hook lets you synchronize a component with an external system or run side effects (data fetching, subscriptions)."
    }
  ],
  '📊 Data Science': [
    {
      text: "Which Python library is primarily used for high-performance data manipulation and analysis? 📊",
      options: ["NumPy", "Pandas", "Matplotlib", "Scikit-Learn"],
      answer: 1,
      explanation: "Pandas provides the DataFrame structure and is the standard tool for data manipulation and analysis in Python."
    },
    {
      text: "What is a 'null hypothesis' in statistics? 📉",
      options: [
        "A hypothesis proposing no statistical difference or effect",
        "A hypothesis stating there is a significant relationship",
        "A hypothesis that is always true",
        "None of the above"
      ],
      answer: 0,
      explanation: "The null hypothesis (H0) represents a default position that there is no relationship or difference between variables."
    },
    {
      text: "What structure does Pandas use to represent 2-dimensional tabular data? 🐼",
      options: ["Series", "DataFrame", "Panel", "Tensor"],
      answer: 1,
      explanation: "A DataFrame is a 2-dimensional, size-mutable, potentially heterogeneous tabular data structure with labeled axes (rows and columns)."
    }
  ],
  '💻 Programming': [
    {
      text: "What is 'recursion' in programming? 💻",
      options: ["A function calling itself", "A loop that never ends", "Dividing code into multiple threads", "Importing external libraries"],
      answer: 0,
      explanation: "Recursion is a programming technique where a function calls itself directly or indirectly to solve a problem."
    },
    {
      text: "Which of the following is NOT a primitive data type in Java? ☕",
      options: ["int", "boolean", "String", "char"],
      answer: 2,
      explanation: "In Java, 'String' is a Class/Object reference type, while int, boolean, and char are primitive types."
    },
    {
      text: "What is the time complexity of searching in a sorted array using Binary Search? ⏱️",
      options: ["O(N)", "O(log N)", "O(N^2)", "O(1)"],
      answer: 1,
      explanation: "Binary search halves the search space in each step, yielding a logarithmic time complexity of O(log N)."
    }
  ],
  '⚡ Physics': [
    {
      text: "What is Newton's Second Law of Motion? ☄️",
      options: ["F = m * a", "For every action, there is an equal reaction", "Objects in motion remain in motion", "E = m * c^2"],
      answer: 0,
      explanation: "Newton's Second Law states that force equals mass times acceleration (F = ma)."
    },
    {
      text: "What is the speed of light in a vacuum? ⚡",
      options: ["3 * 10^8 m/s", "3 * 10^6 m/s", "1.5 * 10^8 m/s", "343 m/s"],
      answer: 0,
      explanation: "Light travels at approximately 300,000 kilometers per second, commonly written as 3 * 10^8 m/s."
    },
    {
      text: "Which particles are found inside the nucleus of an atom? 🧲",
      options: ["Protons and Electrons", "Neutrons and Electrons", "Protons and Neutrons", "Only Protons"],
      answer: 2,
      explanation: "The atomic nucleus consists of protons (positively charged) and neutrons (neutral), surrounded by an electron cloud."
    }
  ],
  '🧮 Mathematics': [
    {
      text: "What is the derivative of x^2 with respect to x? 📈",
      options: ["x", "2x", "2", "x/2"],
      answer: 1,
      explanation: "According to the power rule in calculus, d/dx (x^n) = n * x^(n-1). Thus, the derivative of x^2 is 2x."
    },
    {
      text: "What is the value of log(1) to any base? 🧮",
      options: ["1", "0", "Infinity", "Undefined"],
      answer: 1,
      explanation: "The logarithm of 1 to any base is always 0, since b^0 = 1."
    },
    {
      text: "Which of the following describes two vectors whose dot product is zero? 📐",
      options: ["Parallel", "Orthogonal (Perpendicular)", "Collinear", "Opposite"],
      answer: 1,
      explanation: "If the dot product of two vectors is zero (A · B = 0), they are perpendicular or orthogonal to each other."
    }
  ],
  '🧪 Chemistry': [
    {
      text: "What is the pH level of pure water? 🧪",
      options: ["5", "7", "9", "14"],
      answer: 1,
      explanation: "Pure water is neutral and has a pH of 7 at 25°C."
    },
    {
      text: "Which element is organic chemistry primarily centered around? 🌡️",
      options: ["Oxygen", "Hydrogen", "Carbon", "Nitrogen"],
      answer: 2,
      explanation: "Organic chemistry is the branch of chemistry concerned with carbon-containing compounds."
    },
    {
      text: "What is the chemical formula for common table salt? 🧂",
      options: ["H2O", "CO2", "NaCl", "HCl"],
      answer: 2,
      explanation: "Common table salt is Sodium Chloride, which has the chemical formula NaCl."
    }
  ],
  '🧬 Biology': [
    {
      text: "What is the 'powerhouse of the cell'? 🫁",
      options: ["Nucleus", "Ribosome", "Mitochondria", "Lysosome"],
      answer: 2,
      explanation: "Mitochondria are known as the powerhouse of the cell because they generate ATP, the cell's main energy source."
    },
    {
      text: "What is the molecular structure of DNA? 🧬",
      options: ["Single helix", "Double helix", "Triple helix", "Circular strand"],
      answer: 1,
      explanation: "DNA has a double-helix structure, consisting of two strands coiled around each other."
    },
    {
      text: "Which pigment gives plants their green color and absorbs light? 🌿",
      options: ["Carotenoid", "Hemoglobin", "Chlorophyll", "Melanin"],
      answer: 2,
      explanation: "Chlorophyll is the green pigment in chloroplasts that absorbs light energy for photosynthesis."
    }
  ],
  '🎮 Game Development': [
    {
      text: "Which game engine uses C# as its primary scripting language? 🎮",
      options: ["Unreal Engine", "Unity", "Godot", "GameMaker"],
      answer: 1,
      explanation: "Unity uses C# for script writing, while Unreal uses C++ and Godot uses GDScript/C#."
    },
    {
      text: "What is 'Raycasting' in game development? ⚔️",
      options: [
        "Sending an invisible line in 3D space to detect collisions",
        "Rendering light rays",
        "Creating 3D models",
        "Simulating water physics"
      ],
      answer: 0,
      explanation: "Raycasting shoots an invisible ray from a point in a direction to detect intersections with colliders."
    },
    {
      text: "What is a 'RigidBody' component used for in Unity? 📦",
      options: ["Drawing graphics", "Enabling physical interactions (gravity, forces)", "Playing audio", "Defining text fonts"],
      answer: 1,
      explanation: "Rigidbody components put a game object under the control of Unity's physics engine, adding gravity, mass, and velocity."
    }
  ],
  '🔒 Cybersecurity': [
    {
      text: "What does HTTPS stand for? 🔒",
      options: [
        "Hypertext Transfer Protocol Secure",
        "Hyperlink Text Transmission System",
        "High Transmission Protocol System",
        "Hypertext Transfer Process Standard"
      ],
      answer: 0,
      explanation: "HTTPS stands for Hypertext Transfer Protocol Secure. It is the secure version of HTTP, encrypting traffic using SSL/TLS."
    },
    {
      text: "What is a 'phishing' attack? 🎣",
      options: [
        "Hacking a WiFi router",
        "Sending deceptive communications to steal sensitive data",
        "Flooding a server with massive fake requests",
        "Decrypting database keys"
      ],
      answer: 1,
      explanation: "Phishing is a social engineering attack where bad actors masquerade as trusted entities to steal credentials or cards."
    },
    {
      text: "Which type of encryption uses a public key to encrypt and a private key to decrypt? 🔑",
      options: ["Symmetric Encryption", "Asymmetric Encryption", "Hashing", "Obfuscation"],
      answer: 1,
      explanation: "Asymmetric (or public-key) encryption uses a mathematically linked pair of keys: a public key and a private key."
    }
  ]
};

const DEFAULT_QUESTIONS: Question[] = [
  {
    text: "What is the speed of light in a vacuum? ⚡",
    options: ["3 * 10^8 m/s", "3 * 10^6 m/s", "1.5 * 10^8 m/s", "343 m/s"],
    answer: 0,
    explanation: "Light travels at approximately 300,000 kilometers per second, commonly written as 3 * 10^8 m/s."
  },
  {
    text: "Which Python library is primarily used for high-performance data manipulation and analysis? 📊",
    options: ["NumPy", "Pandas", "Matplotlib", "Scikit-Learn"],
    answer: 1,
    explanation: "Pandas provides the DataFrame structure and is the standard tool for data manipulation and analysis in Python."
  },
  {
    text: "What is Newton's Second Law of Motion? ☄️",
    options: ["F = m * a", "For every action, there is an equal reaction", "Objects in motion remain in motion", "E = m * c^2"],
    answer: 0,
    explanation: "Newton's Second Law states that force equals mass times acceleration (F = ma)."
  }
];

export default function BattleArenaPage() {
  const { xp, setXP } = useStore();
const router = useRouter();

useEffect(() => {
  if (typeof window !== 'undefined') {
    const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
    if (!isLoggedIn) {
      router.push('/auth');
    }
  }
}, []);
  const { t } = useAppTranslation();

  const [state, setState] = useState<'idle' | 'searching' | 'battle' | 'finished'>('idle');
  const [opponent, setOpponent] = useState({ name: '', avatar: '🤖', xp: 0 });
  
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [feedback, setFeedback] = useState('');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Generate dynamic questions using OpenRouter
  const fetchAIQuestions = async (subjects: string[]) => {
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!apiKey) {
      console.warn("OpenRouter API key is missing. Using local questions database.");
      return loadLocalFallbackQuestions(subjects);
    }

    const prompt = `Generate exactly 3 multiple-choice questions for the following subjects/domains: ${subjects.join(', ')}.
The questions must be educational and suitable for students.
Return ONLY a valid JSON array of objects. Do not include markdown code block styling like \`\`\`json.
Each object must have the following fields:
- "text": string (the question text)
- "options": array of 4 strings (the options)
- "answer": number (0 to 3, the index of the correct option)
- "explanation": string (brief explanation of the correct answer)

Example:
[
  {
    "text": "What is overfitting in ML?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Explanation here..."
  }
]`;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
          'X-Title': 'Gramify Smart Learning'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty content returned from AI");

      const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanContent) as Question[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setActiveQuestions(parsed);
        return;
      }
      throw new Error("Parsed content is not a valid question array");
    } catch (err) {
      console.error("OpenRouter questions generation failed, falling back:", err);
      loadLocalFallbackQuestions(subjects);
    }
  };

  const loadLocalFallbackQuestions = (subjects: string[]) => {
    const customQuestions: Question[] = [];
    subjects.forEach(interest => {
      if (SUBJECT_QUESTIONS[interest]) {
        customQuestions.push(...SUBJECT_QUESTIONS[interest]);
      }
    });

    if (customQuestions.length > 0) {
      const shuffled = customQuestions.sort(() => 0.5 - Math.random());
      setActiveQuestions(shuffled.slice(0, 3));
    } else {
      setActiveQuestions(DEFAULT_QUESTIONS);
    }
  };

  const handleStartSearching = async () => {
    setState('searching');
    setIsLoadingQuestions(true);

    let chosenSubjects: string[] = [];

    // Pull chosen subjects from Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.user_metadata?.interests) {
        chosenSubjects = user.user_metadata.interests;
      }
    } catch (err) {
      console.error("Failed to fetch user subjects from Supabase:", err);
    }

    // Fallback to local storage
    if (chosenSubjects.length === 0 && typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_interests');
      if (stored) {
        try {
          chosenSubjects = JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }

    if (chosenSubjects.length === 0) {
      chosenSubjects = ['🌐 Web Development', '🤖 AI & Machine Learning'];
    }

    // Pre-generate questions using OpenRouter during search animation
    await fetchAIQuestions(chosenSubjects);
    setIsLoadingQuestions(false);
  };

  // Simulating finding an opponent
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state === 'searching' && !isLoadingQuestions) {
      timer = setTimeout(() => {
        setOpponent({
          name: ['Rahul Sen', 'Sneha Roy', 'Dev Yadav', 'Kavita Das'][Math.floor(Math.random() * 4)],
          avatar: ['🐼', '🦁', '🦉', '🦊'][Math.floor(Math.random() * 4)],
          xp: Math.floor(Math.random() * 500) + 100
        });
        setState('battle');
        setCurrentQuestionIndex(0);
        setUserScore(0);
        setOpponentScore(0);
        setTimeLeft(10);
        setFeedback('');
        setSelectedOption(null);
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [state, isLoadingQuestions]);

  // Battle countdown timer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state === 'battle' && timeLeft > 0 && selectedOption === null) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAnswerSubmit(-1); // Timeout
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state, timeLeft, selectedOption]);

  const handleAnswerSubmit = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const question = activeQuestions[currentQuestionIndex];
    const isCorrect = optionIndex === question.answer;

    if (isCorrect) {
      setUserScore(prev => prev + 10 + timeLeft); // faster answer rewards more
      setFeedback('Correct! 🎉 ' + question.explanation);
    } else {
      setFeedback('Incorrect! ❌ ' + question.explanation);
    }

    // Opponent random behavior simulation
    setTimeout(() => {
      const opponentCorrect = Math.random() > 0.4;
      if (opponentCorrect) {
        setOpponentScore(prev => prev + Math.floor(Math.random() * 10) + 8);
      }
    }, 800);
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setFeedback('');
      setTimeLeft(10);
    } else {
      setState('finished');
      if (userScore > opponentScore) {
        setXP(xp + 50); // Winner bonus
      } else {
        setXP(xp + 20); // Participation reward
      }
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 flex flex-col justify-center items-center bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {state === 'idle' && (
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl space-y-6 transition-colors duration-300">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/40 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner">
            ⚔️
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{t('arena.title', 'Gramify Battle Arena')}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              {t('arena.subtitle', 'Enter multiplayer battles! Solve quiz questions faster than your opponent to win matches and secure +50 XP!')}
            </p>
          </div>
          <button
            onClick={handleStartSearching}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            {t('arena.find_opponent', 'Find Opponent 🔍')}
          </button>
        </div>
      )}

      {state === 'searching' && (
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl space-y-6 transition-colors duration-300">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-950 animate-ping" />
            <div className="relative w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-3xl shadow-lg">
              🔍
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t('arena.matching', 'Matching Competitors...')}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">{t('arena.searching', 'Searching among digital classrooms...')}</p>
          </div>
          <div className="h-1 w-32 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-indigo-600 rounded-full animate-progress-load w-1/2" />
          </div>
        </div>
      )}

      {state === 'battle' && (
        <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8 relative overflow-hidden transition-colors duration-300">
          
          {/* Top banner: Head to Head Score */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
            {/* User */}
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">🎓</span>
              <div>
                <span className="font-extrabold text-sm block">You</span>
                <span className="text-xs font-bold text-slate-400">{userScore} {t('xp', 'Points')}</span>
              </div>
            </div>

            {/* Vs Badge */}
            <div className="flex flex-col items-center">
              <span className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs">
                {t('arena.vs', 'VS')}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 font-semibold">{t('arena.timer', 'TIMER')}: {timeLeft}s</span>
            </div>

            {/* Opponent */}
            <div className="flex items-center gap-2.5 text-right flex-row-reverse">
              <span className="text-3xl">{opponent.avatar}</span>
              <div>
                <span className="font-extrabold text-sm block">{opponent.name}</span>
                <span className="text-xs font-bold text-slate-400">{opponentScore} {t('xp', 'Points')}</span>
              </div>
            </div>
          </div>

          {/* Question panel */}
          <div className="space-y-4">
            <span className="text-xs font-bold tracking-wide uppercase text-indigo-600 dark:text-indigo-400">
              {t('arena.question', 'Question')} {currentQuestionIndex + 1} {t('arena.of', 'of')} {activeQuestions.length}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold leading-snug">
              {activeQuestions[currentQuestionIndex].text}
            </h2>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-1 gap-3.5">
            {activeQuestions[currentQuestionIndex].options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isAnswer = idx === activeQuestions[currentQuestionIndex].answer;
              
              let optionStyle = "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80";
              if (selectedOption !== null) {
                if (isAnswer) {
                  optionStyle = "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/10";
                } else if (isSelected) {
                  optionStyle = "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/10";
                } else {
                  optionStyle = "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60 pointer-events-none";
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedOption !== null}
                  onClick={() => handleAnswerSubmit(idx)}
                  className={`w-full p-4 rounded-2xl border text-left font-semibold text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                >
                  <span>{option}</span>
                  {selectedOption !== null && isAnswer && <span>✓</span>}
                  {selectedOption !== null && isSelected && !isAnswer && <span>✗</span>}
                </button>
              );
            })}
          </div>

          {/* Feedback & Actions */}
          {selectedOption !== null && (
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-4 transition-colors duration-300">
              <p className="text-sm font-semibold leading-relaxed">{feedback}</p>
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/10 transition active:scale-98 cursor-pointer"
              >
                {currentQuestionIndex < activeQuestions.length - 1 ? t('arena.next_quest', 'Next Question →') : t('arena.finish', 'Finish Battle 🏁')}
              </button>
            </div>
          )}
        </div>
      )}

      {state === 'finished' && (
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl space-y-6 transition-colors duration-300">
          <div className="text-6xl animate-bounce">
            {userScore > opponentScore ? '🏆' : '🤝'}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">
              {userScore > opponentScore ? t('arena.won', 'You Won! 🎉') : t('arena.draw_defeat', 'Draw/Defeat! 🤝')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              {userScore > opponentScore 
                ? t('arena.won_desc', 'Sensational battle! You scored {{user}} points and defeated {{opp}}. +50 XP Reward!')
                  .replace('{{user}}', userScore.toString())
                  .replace('{{opp}}', opponent.name)
                : t('arena.draw_desc', 'Excellent match. You scored {{user}} points while {{opp}} scored {{oppScore}}. +20 XP participation reward!')
                  .replace('{{user}}', userScore.toString())
                  .replace('{{opp}}', opponent.name)
                  .replace('{{oppScore}}', opponentScore.toString())
              }
            </p>
          </div>

          {/* Match Score Overview */}
          <div className="grid grid-cols-2 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold transition-colors duration-300">
            <div>
              <span className="text-slate-400 text-xs block font-medium">{t('arena.your_score', 'YOUR SCORE')}</span>
              <span className="text-2xl mt-1 block">{userScore}</span>
            </div>
            <div className="border-l border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-xs block font-medium">{t('arena.opponent', 'OPPONENT')}</span>
              <span className="text-2xl mt-1 block">{opponentScore}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-bold rounded-2xl transition text-center"
            >
              {t('dashboard', 'Dashboard 📊')}
            </Link>
            <button
              onClick={handleStartSearching}
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              {t('arena.play_again', 'Play Again ⚔️')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
