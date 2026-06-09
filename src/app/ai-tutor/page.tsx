"use client";

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store';
import { supabase } from '@/lib/supabase';
import { useAppTranslation } from '@/lib/useAppTranslation';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

const SUGGESTION_MAP: Record<string, string> = {
  '🤖 AI & Machine Learning': 'Explain Neural Networks 🧠',
  '🌐 Web Development': 'What is an API? 🌐',
  '📊 Data Science': 'Explain Data Science foundations 📊',
  '💻 Programming': 'What is recursion in coding? 💻',
  '⚡ Physics': 'Explain Gravity in Physics ⚡',
  '🧮 Mathematics': 'Explain Limits in Calculus 🧮',
  '🧪 Chemistry': 'What is Organic Chemistry? 🧪',
  '🧬 Biology': 'Explain cellular DNA 🧬',
  '🎮 Game Development': 'Unity 3D collision mechanics 🎮',
  '🔒 Cybersecurity': 'Explain Cryptography keys 🔒'
};

export default function AITutorPage() {
  const { xp, setXP } = useStore();
  const { t } = useAppTranslation();

  const [userName, setUserName] = useState('Explorer');
  const [userAvatar, setUserAvatar] = useState('🎓');
  const [userRole, setUserRole] = useState('Class 6-8 Student');
  const [interests, setInterests] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize tutor state based on Supabase / local storage
  useEffect(() => {
    const initializeTutor = async () => {
      let activeName = 'Explorer';
      let activeAvatar = '🎓';
      let activeRole = 'Class 6-8 Student';
      let activeInterests: string[] = [];

      // 1. Pull user data from Supabase Auth
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.user_metadata) {
          const meta = user.user_metadata;
          if (meta.name) activeName = meta.name;
          if (meta.avatar) activeAvatar = meta.avatar;
          if (meta.role) activeRole = meta.role;
          if (meta.interests && Array.isArray(meta.interests)) {
            activeInterests = meta.interests;
          }
        }
      } catch (err) {
        console.error("Failed to query user profile:", err);
      }

      // 2. Local storage fallback
      if (activeInterests.length === 0 && typeof window !== 'undefined') {
        const storedName = localStorage.getItem('user_name');
        const storedAvatar = localStorage.getItem('user_avatar');
        const storedRole = localStorage.getItem('user_role');
        const storedInterests = localStorage.getItem('user_interests');
        
        if (storedName) activeName = storedName;
        if (storedAvatar) activeAvatar = storedAvatar;
        if (storedRole) activeRole = storedRole;
        if (storedInterests) {
          try {
            activeInterests = JSON.parse(storedInterests);
          } catch {
            // ignore
          }
        }
      }

      if (activeInterests.length === 0) {
        activeInterests = ['🌐 Web Development', '🤖 AI & Machine Learning'];
      }

      setUserName(activeName);
      setUserAvatar(activeAvatar);
      setUserRole(activeRole);
      setInterests(activeInterests);

      // Suggest prompts based on interests
      const chips = activeInterests.map(interest => SUGGESTION_MAP[interest]).filter(Boolean);
      if (chips.length < 3) {
        chips.push("Explain what is API? 🌐");
        chips.push("Explain Newton's Laws ☄️");
      }
      setSuggestions(chips);

      // Initial bilingual greeting
      const greetingText = t('tutor.welcome_msg', `Namaste, {{name}}! I am Guru AI, your dedicated personal learning tutor. 🤖\n\nI noticed you are learning **{{interests}}**! I can explain complex rules, chemical reactions, algorithms, physics, history, or language skills bilingually in Hindi & English.\n\nSelect a quick suggestion chip below or type any question to start!`)
        .replace('{{name}}', activeName)
        .replace('{{interests}}', activeInterests.join(', '));
      
      setMessages([
        {
          sender: 'ai',
          text: greetingText,
          timestamp: new Date()
        }
      ]);
    };

    initializeTutor();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const fetchAIResponse = async (question: string, history: Message[]): Promise<string> => {
    console.log('API KEY EXISTS: ' + !!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY);
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!apiKey) {
      console.warn("OpenRouter API key is missing. Using local bilingually parsed templates.");
      return "";
    }

    const formattedHistory = history.map(msg => ({
      role: msg.sender === 'ai' ? 'assistant' : 'user',
      content: msg.text
    }));

    const systemPrompt = `You are Guru AI, a knowledgeable, friendly, and bilingually supportive personal teacher for a student learning platform.
The student is currently registered as a "${userRole}" and is learning: ${interests.join(', ')}.
You must answer questions on ANY topic (science, math, history, coding, general knowledge, etc.) in detail, acting like a brilliant bilingually supportive teacher.
IMPORTANT: You must answer the student's question directly, clearly, and completely, regardless of whether it is related to their registered subjects. Do not dodge the question, do not try to steer the conversation back to their registered subjects, and do not tell the user that you are only able to explain their selected subjects. Simply answer any question they ask directly.
Please reply bilingually or in a mix of Hindi and English (Hinglish/Hindi script where appropriate) to make complex concepts simple and engaging for students.
Always format your response cleanly using Markdown, bold text for key terms, lists, and code blocks for programming syntax.
Provide detailed explanations like Google or ChatGPT would. Keep your tone highly encouraging and positive!`;

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
          messages: [
            { role: 'system', content: systemPrompt },
            ...formattedHistory.slice(-6), // Send last 6 messages of context
            { role: 'user', content: question }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      if (!reply) throw new Error("Empty reply from OpenRouter");

      return reply;
    } catch (err) {
      console.error("OpenRouter query failed:", err);
      return "";
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      sender: 'user',
      text,
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    // Call OpenRouter
    const aiText = await fetchAIResponse(text, updatedMessages);
    
    let finalAiText = aiText;
    let xpReward = 20;

    // Fallback logic if OpenRouter fails
    if (!finalAiText) {
      const lowerText = text.toLowerCase();
      if (lowerText.includes('api')) {
        finalAiText = "An **API (Application Programming Interface)** allows two software applications to communicate with each other. 🌐\n\nसरल शब्दों में (In simple terms):\nयह एक रेस्टोरेंट के वेटर (waiter) की तरह है। आप (Client/Browser) टेबल पर बैठकर आर्डर देते हैं, वेटर (API) आपकी रिक्वेस्ट लेकर किचन (Server) में जाता है और वहाँ से लज़ीज़ खाना (Data) लाकर आपको परोस देता है।\n\n**Example**:\nWhen you check the weather on your phone, Google uses an Weather API to fetch live forecasts from a weather server and display it to you!";
      } else if (lowerText.includes('neural') || lowerText.includes('machine learning') || lowerText.includes('ai')) {
        finalAiText = "A **Neural Network** in AI & ML is a series of algorithms that endeavors to recognize underlying relationships in a set of data through a process that mimics the way the human brain operates. 🧠\n\nसरल भाषा में:\nयह कंप्यूटर का एक काल्पनिक 'दिमाग' है जिसमें कृत्रिम न्यूरॉन्स (artificial neurons) होते हैं। यह बार-बार गलतियाँ करके सीखता है, ठीक वैसे ही जैसे एक बच्चा चलना सीखता है।\n\nइसका उपयोग इमेजेज पहचानने (image recognition) और ट्रांसलेशन (language translation) में बड़े पैमाने पर होता है!";
      } else if (lowerText.includes('recursion')) {
        finalAiText = "**Recursion** in Programming is a technique where a function calls itself directly or indirectly to solve a problem. 💻\n\nसरल भाषा में:\nजब एक कोड अपने आप को बार-बार तब तक कॉल करता है जब तक कि वह एक विशिष्ट अंत बिंदु (Base Case) पर न पहुँच जाए।\n\n**उदाहरण (Python Example)**:\n```python\ndef factorial(n):\n    if n == 1: # Base Case\n        return 1\n    return n * factorial(n - 1) # Recursive Call\n```\nWarning: Without a proper base case, recursion causes a 'Stack Overflow' error!";
      } else if (lowerText.includes('gravity') || lowerText.includes('physics')) {
        finalAiText = "**Gravity** in Physics is the fundamental force by which all things with mass or energy are brought toward one another. ☄️\n\nसरल शब्दों में:\nयह वह अदृश्य आकर्षण बल है जो हमें जमीन से बांधे रखता है और जिसके कारण पृथ्वी सूर्य के चारों ओर घूमती है।\n\n**Formula (Newton's Law)**:\n$$F = G \\frac{m_1 m_2}{r^2}$$\nजहाँ $F$ गुरुत्वाकर्षण बल है, $m_1, m_2$ दोनों वस्तुओं का द्रव्यमान (mass) हैं, और $r$ उनके बीच की दूरी है।";
      } else if (lowerText.includes('calculus') || lowerText.includes('limits') || lowerText.includes('math')) {
        finalAiText = "A **Limit** in Calculus describes the behavior of a function near a specific input value, rather than exactly at that value. 🧮\n\nसरल भाषा में:\nजब हम किसी बिंदु के बहुत करीब पहुँचते हैं (लेकिन बिल्कुल उस पर नहीं), तो फलन का मान क्या होता है।\n\n**उदाहरण**:\nयदि $f(x) = x^2$, तो जैसे ही $x$ का मान $2$ के करीब जाता है, फलन $f(x)$ का मान $4$ के करीब जाएगा। इसे हम इस प्रकार लिखते हैं:\n$$\\lim_{x \\to 2} x^2 = 4$$";
      } else if (lowerText.includes('organic') || lowerText.includes('chemistry')) {
        finalAiText = "**Organic Chemistry** is the scientific study of the structure, properties, composition, reactions, and preparation of chemical compounds containing carbon. 🧪\n\nसरल भाषा में:\nयह 'कार्बन के यौगिकों' (Carbon compounds) का विज्ञान है। पृथ्वी पर लगभग सारा जीवन कार्बनिक रसायन पर ही आधारित है (जैसे हमारा DNA, प्रोटीन, भोजन, कोयला और दवाएं।";
      } else if (lowerText.includes('dna') || lowerText.includes('biology')) {
        finalAiText = "**DNA (Deoxyribonucleic Acid)** is the hereditary material in humans and almost all other organisms. 🧬\n\nसरल शब्दों में:\nयह हमारे शरीर की 'ब्लूप्रिंट' या निर्देश पुस्तिका है। यह तय करता है कि आपकी आँखों का रंग क्या होगा, आपकी लंबाई कितनी होगी और आपका शरीर कैसे काम करेगा। इसका आकार एक घुमावदार सीढ़ी (Double Helix) की तरह होता है।";
      } else if (lowerText.includes('cryptography') || lowerText.includes('cybersecurity')) {
        finalAiText = "**Cryptography** in Cybersecurity is the practice and study of techniques for secure communication in the presence of adversarial behavior. 🔑\n\nसरल भाषा में:\nअपने सीक्रेट मैसेज को एक गुप्त कोड में बदलना (Encryption) ताकि केवल वही व्यक्ति इसे पढ़ सके जिसके पास इसकी चाबी (Decryption Key) हो। इससे डेटा चोरी होने से बचता है!";
      } else if (lowerText.includes('unity') || lowerText.includes('game')) {
        finalAiText = "In **Unity 3D Game Development**, collision detection allows game objects to interact or crash into each other. 🎮\n\nसरल भाषा में:\nजब एक प्लेयर किसी दीवार या दुश्मन से टकराता है, तो Unity का Physics Engine (Collider & Rigidbody component) उस टक्कर को पहचानता है और खिलाड़ी को रोकने या उसकी हेल्थ कम करने का आदेश देता है!";
      } else if (lowerText.includes('data science')) {
        finalAiText = "**Data Science** is the field of study that combines domain expertise, programming skills, and knowledge of mathematics and statistics to extract meaningful insights from data. 📊\n\nसरल भाषा में:\nकचरा डेटा में से कीमती जानकारी ढूंढना! इसके जरिए कंपनियाँ भविष्य की योजनाएँ बनाती हैं और नए प्रोडक्ट्स लॉन्च करती हैं।";
      } else if (lowerText.includes('history') || lowerText.includes('gandhi') || lowerText.includes('war') || lowerText.includes('india')) {
        finalAiText = "**History & General Knowledge** teaches us about past events, societies, and civilizations that shaped our world. 📜\n\nसरल शब्दों में (In simple terms):\nइतिहास हमें बताता है कि हमारे पूर्वज कैसे रहते थे, महत्वपूर्ण युद्ध (like World Wars) क्यों हुए, और महात्मा गांधी (Mahatma Gandhi) जैसे नेताओं ने स्वतंत्रता संग्राम में क्या भूमिका निभाई।\n\n**Key Lesson**:\nUnderstanding history helps us learn from past mistakes and make better decisions for a smarter future!";
      } else if (lowerText.includes('grammar') || lowerText.includes('english') || lowerText.includes('noun') || lowerText.includes('verb') || lowerText.includes('tense')) {
        finalAiText = "**English Grammar** is the system and structure of the English language, guiding how we combine words to express ideas clearly. 📝\n\nसरल शब्दों में:\nव्याकरण नियमों का वह समूह है जो हमें सही तरीके से बोलना और लिखना सिखाता है।\n- **Noun (संज्ञा)**: Name of a person, place, or thing (e.g., Akshitha, Delhi, Book).\n- **Verb (क्रिया)**: Action words (e.g., learn, play, code).\n- **Tenses (काल)**: Show the time of action (Past, Present, Future).\n\nHaving good grammar makes communication simple and effective!";
      } else {
        // Dynamic educational helper fallback
        let topic = text.trim();
        if (topic.endsWith('?')) topic = topic.slice(0, -1);
        if (topic.endsWith('.')) topic = topic.slice(0, -1);
        if (topic.endsWith('!')) topic = topic.slice(0, -1);

        const prefixes = [
          /^(what is a|what is an|what is|what are|what's|define|explain|tell me about|how does|why is|who is)\s+/i,
          /^(meaning of|concept of|history of|formula for)\s+/i
        ];
        
        for (const p of prefixes) {
          if (p.test(topic)) {
            topic = topic.replace(p, '');
            break;
          }
        }

        topic = topic.trim();
        if (topic.length > 0) {
          topic = topic.charAt(0).toUpperCase() + topic.slice(1);
        } else {
          topic = "this topic";
        }

        finalAiText = `Here is a clear and direct explanation of **${topic}**: 🌟\n\n1. **Core Concept**: **${topic}** represents the foundational principles, definitions, or processes associated with this subject.\n\n2. **Bilingual Explanation (सरल शब्दों में)**:\nजब हम **${topic}** के बारे में बात करते हैं, तो इसका सीधा मतलब उस विषय या तकनीक से है जो इस क्षेत्र को संचालित करती है। इसे अच्छी तरह समझने से आपके प्रैक्टिकल और थ्योरिटिकल दोनों स्किल्स मजबूत होते हैं।\n\n3. **Practical Application**:\nIn real-world scenarios, application of **${topic}** helps experts, developers, and researchers solve complex problems, build robust designs, and understand natural or artificial phenomena.\n\nWould you like to dive deeper into this or see a specific example related to **${topic}**?`;
        xpReward = 20;
      }
    }

    setIsTyping(false);
    setMessages(prev => [...prev, {
      sender: 'ai',
      text: finalAiText,
      timestamp: new Date()
    }]);

    setXP(xp + xpReward);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-between bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Overview Header */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center justify-between mb-6 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
            🤖
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{t('tutor.title', 'Guru AI Personal Tutor')}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('tutor.subtitle', 'Bilingual Subject Guide • Active (+XP for asking questions)')}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400 block uppercase">Level Bonus</span>
          <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{xp} {t('tutor.bonus', 'total XP')}</span>
        </div>
      </section>

      {/* Main chat window container */}
      <div className="flex-grow bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col justify-between gap-6 min-h-[500px] relative overflow-hidden transition-colors duration-300">
        
        {/* Absolute glow design */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-br-[120px] pointer-events-none -z-10" />

        {/* Message feed */}
        <div className="flex-grow space-y-4 overflow-y-auto pr-2 max-h-[450px]">
          {messages.map((msg, index) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse ml-auto'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                    🤖
                  </div>
                )}
                
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed border whitespace-pre-wrap ${
                    isAI
                      ? 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800/80 text-slate-800 dark:text-slate-100'
                      : 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  }`}
                >
                  {msg.text}
                  <span className={`block text-[9px] mt-1.5 text-right ${isAI ? 'text-slate-400' : 'text-indigo-200'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 self-start max-w-[85%]">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-lg flex-shrink-0 shadow-inner animate-pulse">
                🤖
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-2xl text-sm text-slate-400 flex items-center gap-1.5 shadow-sm">
                <span>{t('tutor.thinking', 'Guru is thinking')}</span>
                <span className="flex gap-0.5 mt-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length === 1 && !isTyping && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t('tutor.suggested', 'Suggested Quests')}</span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(suggestion)}
                  className="px-3.5 py-2 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input box */}
        <div className="flex gap-2.5 items-center border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <input
            type="text"
            placeholder={t('tutor.placeholder', 'Ask about AI, Web Dev, Programming, Physics, Math, Biology, Cybersecurity, History...')}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(inputValue)}
            className="flex-grow px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition text-sm"
          />
          <button
            type="button"
            onClick={() => handleSend(inputValue)}
            className="px-5 py-3.5 bg-[#6366f1] hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:shadow-xl transition active:scale-95 flex items-center justify-center cursor-pointer"
          >
            {t('tutor.send', 'Send ⚡')}
          </button>
        </div>
      </div>
    </div>
  );
}
