"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { useAppTranslation } from '@/lib/useAppTranslation';
import { useRouter } from 'next/navigation';

interface QuizQuestion {
  question: { en: string; hi: string };
  options: { en: string[]; hi: string[] };
  answer: number;
}

interface Lesson {
  id: string; // e.g. "web_dev-basic"
  level: 'Basic' | 'Intermediate' | 'Advanced';
  levelKey: string;
  title: { en: string; hi: string };
  notes: { en: string; hi: string };
  quiz: QuizQuestion[];
}

const SUBJECT_IDS: Record<string, string> = {
  '🤖 AI & Machine Learning': 'ai_ml',
  '🌐 Web Development': 'web_dev',
  '📊 Data Science': 'data_science',
  '💻 Programming': 'programming',
  '⚡ Physics': 'physics',
  '🧮 Mathematics': 'math',
  '🧪 Chemistry': 'chemistry',
  '🧬 Biology': 'biology',
  '🎮 Game Development': 'game_dev',
  '🔒 Cybersecurity': 'cybersecurity',
  '📚 English': 'english',
  '🌍 Social Studies': 'social_studies',
};

const LESSONS_DATABASE: Record<string, Record<string, Lesson[]>> = {
  'ai_ml': { 'class_6_8': [
    {
      id: 'ai_ml-basic',
      level: 'Basic',
      levelKey: 'basic',
      title: {
        en: 'Introduction to AI & Machine Learning',
        hi: 'कृत्रिम बुद्धिमत्ता (AI) और मशीन लर्निंग का परिचय'
      },
      notes: {
        en: 'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines. Machine Learning (ML) is a subset of AI that enables systems to learn from data, identify patterns, and make decisions with minimal human intervention. There are three main types of ML:\n\n1. **Supervised Learning**: The model is trained on labeled data (e.g., classifying emails as spam or not spam).\n2. **Unsupervised Learning**: The model finds hidden patterns or structures in unlabeled data (e.g., customer segmentation).\n3. **Reinforcement Learning**: The model learns by interacting with its environment to maximize rewards (e.g., teaching an AI to play chess).',
        hi: 'कृत्रिम बुद्धिमत्ता (AI) मशीनों में मानव बुद्धिमत्ता के अनुकरण को संदर्भित करता है। मशीन लर्निंग (ML) AI का एक उपसमुच्चय है जो प्रणालियों को डेटा से सीखने, पैटर्न की पहचान करने और न्यूनतम मानवीय हस्तक्षेप के साथ निर्णय लेने में सक्षम बनाता है। ML के तीन मुख्य प्रकार हैं:\n\n1. **सुपरवाइज़्ड लर्निंग (Supervised Learning)**: मॉडल को लेबल किए गए डेटा पर प्रशिक्षित किया जाता है (जैसे, ईमेल को स्पैम या गैर-स्पैम के रूप में वर्गीकृत करना)।\n2. **अनसुपरवाइज़्ड लर्निंग (Unsupervised Learning)**: मॉडल बिना लेबल वाले डेटा में छिपे हुए पैटर्न या संरचनाओं को ढूंढता है (जैसे, ग्राहक विभाजन)।\n3. **रीइन्फोर्समेंट लर्निंग (Reinforcement Learning)**: मॉडल पुरस्कारों को अधिकतम करने के लिए अपने पर्यावरण के साथ बातचीत करके सीखता है (जैसे, शतरंज खेलना)।'
      },
      quiz: [
        {
          question: {
            en: 'What is Machine Learning?',
            hi: 'मशीन लर्निंग क्या है?'
          },
          options: {
            en: ['A hardware database tool', 'A subset of AI that learns from data', 'A markup rendering language', 'An operating system kernel'],
            hi: ['एक हार्डवेयर डेटाबेस टूल', 'AI का एक उपसमुच्चय जो डेटा से सीखता है', 'एक मार्कअप रेंडरिंग भाषा', 'एक ऑपरेटिंग सिस्टम कर्नेल']
          },
          answer: 1
        },
        {
          question: {
            en: 'Which type of Machine Learning uses labeled data?',
            hi: 'मशीन लर्निंग का कौन सा प्रकार लेबल किए गए डेटा का उपयोग करता है?'
          },
          options: {
            en: ['Unsupervised Learning', 'Reinforcement Learning', 'Supervised Learning', 'Evolutionary Learning'],
            hi: ['अनसुपरवाइज़्ड लर्निंग', 'रीइन्फोर्समेंट लर्निंग', 'सुपरवाइज़्ड लर्निंग', 'इवोल्यूशनरी लर्निंग']
          },
          answer: 2
        },
        {
          question: {
            en: 'What is an example of Unsupervised Learning?',
            hi: 'अनसुपरवाइज़्ड लर्निंग का एक उदाहरण क्या है?'
          },
          options: {
            en: ['Predicting house prices', 'Classifying spam emails', 'Customer segmentation', 'Self-driving path navigation'],
            hi: ['घर की कीमतों की भविष्यवाणी करना', 'स्पैम ईमेल को वर्गीकृत करना', 'ग्राहक विभाजन (Customer segmentation)', 'स्व-चालित पथ नेविगेशन']
          },
          answer: 2
        }
      ]
    },
    {
      id: 'ai_ml-intermediate',
      level: 'Intermediate',
      levelKey: 'intermediate',
      title: {
        en: 'Neural Networks & Deep Learning',
        hi: 'न्यूरल नेटवर्क और डीप लर्निंग'
      },
      notes: {
        en: 'Neural Networks are computational systems inspired by the biological neural networks of the human brain. They consist of connected nodes called neurons organized in layers:\n- **Input Layer**: Receives the raw features.\n- **Hidden Layers**: Perform mathematical transformations to extract complex features.\n- **Output Layer**: Produces the final prediction.\n\nDeep Learning is a subfield of ML that uses neural networks with many hidden layers. Weights and biases in the network connections are dynamically adjusted using backpropagation and gradient descent to minimize errors.',
        hi: 'न्यूरल नेटवर्क मानव मस्तिष्क के जैविक न्यूरल नेटवर्क से प्रेरित कम्प्यूटेशनल प्रणालियां हैं। इनमें आपस में जुड़े नोड्स होते हैं जिन्हें न्यूरॉन्स कहा जाता है जो परतों में व्यवस्थित होते हैं:\n- **इनपुट परत (Input Layer)**: कच्चे फीचर्स प्राप्त करती है।\n- **छिपी हुई परतें (Hidden Layers)**: जटिल फीचर्स निकालने के लिए गणितीय परिवर्तन करती हैं।\n- **आउटपुट परत (Output Layer)**: अंतिम भविष्यवाणी का उत्पादन करती है।\n\nडीप लर्निंग ML का एक उपक्षेत्र है जो कई छिपी हुई परतों वाले न्यूरल नेटवर्क का उपयोग करता है। त्रुटियों को कम करने के लिए बैकप्रोपेगेशन और ग्रेडिएंट डिसेंट का उपयोग करके नेटवर्क कनेक्शन में भार (weights) और पूर्वाग्रहों (biases) को गतिशील रूप से समायोजित किया जाता है।'
      },
      quiz: [
        {
          question: {
            en: 'What are the three main layers of a neural network?',
            hi: 'न्यूरल नेटवर्क की तीन मुख्य परतें कौन सी हैं?'
          },
          options: {
            en: ['Top, Middle, Bottom', 'Input, Hidden, Output', 'Logic, Data, Render', 'Class, Object, Variable'],
            hi: ['शीर्ष, मध्य, निचला', 'इनपुट, हिडन, आउटपुट', 'लॉजिक, डेटा, रेंडर', 'क्लास, ऑब्जेक्ट, वेरिएबल']
          },
          answer: 1
        },
        {
          question: {
            en: 'What is "Deep" in Deep Learning?',
            hi: 'डीप लर्निंग में "डीप" का क्या अर्थ है?'
          },
          options: {
            en: ['Deep nesting of arrays', 'Having many hidden layers in the neural network', 'Deep search algorithms', 'High level memory compression'],
            hi: ['सरणियों की गहरी नेस्टिंग', 'न्यूरल नेटवर्क में कई छिपी हुई परतें होना', 'गहरी खोज एल्गोरिदम', 'उच्च स्तरीय मेमोरी संपीड़न']
          },
          answer: 1
        },
        {
          question: {
            en: 'Which optimization algorithm is used to minimize errors by adjusting weights?',
            hi: 'भार (weights) को समायोजित करके त्रुटियों को कम करने के लिए किस अनुकूलन एल्गोरिदम का उपयोग किया जाता है?'
          },
          options: {
            en: ['Gradient Descent', 'Bubble Sort', 'Linear Search', 'Binary Compilation'],
            hi: ['ग्रेडिएंट डिसेंट (Gradient Descent)', 'बबल सॉर्ट', 'लीनियर सर्च', 'बाइनरी कंपाइलेशन']
          },
          answer: 0
        }
      ]
    },
    {
      id: 'ai_ml-advanced',
      level: 'Advanced',
      levelKey: 'advanced',
      title: {
        en: 'Transformers & Large Language Models',
        hi: 'ट्रांसफॉर्मर और लार्ज लैंग्वेज मॉडल'
      },
      notes: {
        en: 'Transformers are state-of-the-art neural architectures introduced in 2017 that revolutionized Natural Language Processing (NLP). Unlike older sequential models (such as RNNs or LSTMs), Transformers process entire text sequences simultaneously. They utilize a **Self-Attention** mechanism to calculate the mathematical relationship between words in a sentence, regardless of their distance from one another. This parallelized attention forms the foundation of modern Large Language Models (LLMs) like GPT and Claude.',
        hi: 'ट्रांसफॉर्मर्स 2017 में पेश किए गए अत्याधुनिक न्यूरल आर्किटेक्चर हैं जिन्होंने नेचुरल लैंग्वेज प्रोसेसिंग (NLP) में क्रांति ला दी। पुराने अनुक्रमिक मॉडल (जैसे RNN या LSTM) के विपरीत, ट्रांसफॉर्मर एक साथ पूरे पाठ दृश्यों को संसाधित करते हैं। वे एक वाक्य में शब्दों के बीच गणितीय संबंध की गणना करने के लिए एक **सेल्फ-अटेंशन (Self-Attention)** तंत्र का उपयोग करते हैं, चाहे वे एक-दूसरे से कितनी भी दूरी पर हों। यह समानांतर ध्यान आधुनिक लार्ज लैंग्वेज मॉडल (LLMs) जैसे GPT और Claude की नींव बनाता है।'
      },
      quiz: [
        {
          question: {
            en: 'Which paper introduced the Transformer architecture in 2017?',
            hi: 'किस पेपर ने 2017 में ट्रांसफॉर्मर आर्किटेक्चर पेश किया था?'
          },
          options: {
            en: ['Computing Machinery and Intelligence', 'Attention Is All You Need', 'Deep Residual Learning', 'ImageNet Classification'],
            hi: ['कंप्यूटिंग मशीनरी एंड इंटेलिजेंस', 'अटेंशन इज ऑल यू नीड', 'डीप रेसिडुअल लर्निंग', 'इमेजनेट क्लासिफिकेशन']
          },
          answer: 1
        },
        {
          question: {
            en: 'What mechanism allows Transformers to weigh the importance of different words in a sequence?',
            hi: 'कौन सा तंत्र ट्रांसफॉर्मर को एक अनुक्रम में विभिन्न शब्दों के महत्व को तौलने की अनुमति देता है?'
          },
          options: {
            en: ['Self-Attention', 'Recurrent feedback loop', 'Hidden state memory', 'Linear scaling'],
            hi: ['सेल्फ-अटेंशन (Self-Attention)', 'आवर्तक फीडबैक लूप', 'हिडन स्टेट मेमोरी', 'रैखिक स्केलिंग']
          },
          answer: 0
        },
        {
          question: {
            en: 'What does LLM stand for?',
            hi: 'LLM का क्या अर्थ है?'
          },
          options: {
            en: ['Linear Logic Model', 'Large Language Model', 'Linked List Method', 'Layered Learning Module'],
            hi: ['रैखिक तर्क मॉडल', 'लार्ज लैंग्वेज मॉडल', 'लिंक्ड लिस्ट विधि', 'स्तरित शिक्षण मॉड्यूल']
          },
          answer: 1
        }
      ]
    }
  ],
  'web_dev': [
    {
      id: 'web_dev-basic',
      level: 'Basic',
      levelKey: 'basic',
      title: {
        en: 'HTML5 Semantic Layout & Markup',
        hi: 'HTML5 सिमेंटिक लेआउट और मार्कअप'
      },
      notes: {
        en: 'HTML5 is the standard language used to create and structure web pages. **Semantic HTML** refers to elements that clearly describe their meaning to both the browser and the developer (e.g., `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`). Using semantic tags instead of generic `<div>` tags improves accessibility (for screen readers), SEO ranking, and code maintainability.',
        hi: 'HTML5 मानक भाषा है जिसका उपयोग वेब पेजों को बनाने और व्यवस्थित करने के लिए किया जाता है। **सिमेंटिक HTML (Semantic HTML)** उन तत्वों को संदर्भित करता है जो ब्राउज़र और डेवलपर दोनों को अपने अर्थ को स्पष्ट रूप से समझाते हैं (जैसे, `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`)। जेनेरिक `<div>` टैग के बजाय सिमेंटिक टैग का उपयोग करने से पहुंच (स्क्रीन पाठकों के लिए), SEO रैंकिंग और कोड के रखरखाव में सुधार होता है।'
      },
      quiz: [
        {
          question: {
            en: 'Which of the following is a semantic HTML element?',
            hi: 'निम्नलिखित में से कौन सा एक सिमेंटिक HTML तत्व है?'
          },
          options: {
            en: ['<div>', '<span>', '<article>', '<font>'],
            hi: ['<div>', '<span>', '<article>', '<font>']
          },
          answer: 2
        },
        {
          question: {
            en: 'Why is Semantic HTML important for search engines?',
            hi: 'खोज इंजनों के लिए सिमेंटिक HTML क्यों महत्वपूर्ण है?'
          },
          options: {
            en: ['It compiles the code faster', 'It improves search engine optimization (SEO)', 'It encrypts web content', 'It replaces JavaScript styles'],
            hi: ['यह कोड को तेजी से संकलित करता है', 'यह सर्च इंजन ऑप्टिमाइजेशन (SEO) में सुधार करता है', 'यह वेब सामग्री को एन्क्रिप्ट करता है', 'यह जावास्क्रिप्ट शैलियों को बदल देता है']
          },
          answer: 1
        },
        {
          question: {
            en: 'Which tag represents a container for introductory content or navigation links?',
            hi: 'कौन सा टैग परिचयात्मक सामग्री या नेविगेशन लिंक के लिए एक कंटेनर का प्रतिनिधित्व करता है?'
          },
          options: {
            en: ['<footer>', '<header>', '<aside>', '<section>'],
            hi: ['<footer>', '<header>', '<aside>', '<section>']
          },
          answer: 1
        }
      ]
    },
    {
      id: 'web_dev-intermediate',
      level: 'Intermediate',
      levelKey: 'intermediate',
      title: {
        en: 'Modern CSS Layouts: Flexbox & Grid',
        hi: 'आधुनिक सीएसएस लेआउट: फ्लेक्सबॉक्स और ग्रिड'
      },
      notes: {
        en: 'CSS layouts have evolved to support responsive design across different screens. \n\n1. **Flexbox** (Flexible Box Layout) is a one-dimensional layout model. It excels at distributing space and aligning items along a single axis (either a row or a column). Key properties include `justify-content` (aligns items along the main axis) and `align-items` (aligns items along the cross axis).\n2. **CSS Grid** is a two-dimensional layout model. It is designed for complex layouts consisting of both columns and rows. Key properties include `grid-template-columns` and `grid-gap`.',
        hi: 'विभिन्न स्क्रीन पर रिस्पॉन्सिव डिज़ाइन का समर्थन करने के लिए CSS लेआउट विकसित हुए हैं।\n\n1. **फ्लेक्सबॉक्स (Flexbox)** एक-आयामी (1D) लेआउट मॉडल है। यह एक ही अक्ष (या तो एक पंक्ति या एक कॉलम) के साथ स्थान वितरित करने और वस्तुओं को संरेखित करने में उत्कृष्ट है। मुख्य गुणों में `justify-content` (मुख्य अक्ष के साथ वस्तुओं को संरेखित करता है) और `align-items` (क्रॉस अक्ष के साथ वस्तुओं को संरेखित करता है) शामिल हैं।\n2. **CSS ग्रिड (CSS Grid)** एक द्वि-आयामी (2D) लेआउट मॉडल है। इसे कॉलम और पंक्तियों दोनों से मिलकर बनने वाले जटिल लेआउट के लिए डिज़ाइन किया गया है। मुख्य गुणों में `grid-template-columns` और `grid-gap` शामिल हैं।'
      },
      quiz: [
        {
          question: {
            en: 'Flexbox is best described as a ___ layout model.',
            hi: 'फ्लेक्सबॉक्स को सबसे अच्छी तरह से एक ___ लेआउट मॉडल के रूप में वर्णित किया गया है।'
          },
          options: {
            en: ['One-dimensional', 'Two-dimensional', 'Three-dimensional', 'Zero-dimensional'],
            hi: ['एक-आयामी (One-dimensional)', 'द्वि-आयामी (Two-dimensional)', 'त्रि-आयामी', 'शून्य-आयामी']
          },
          answer: 0
        },
        {
          question: {
            en: 'Which property aligns items along the main axis in a Flexbox container?',
            hi: 'फ्लेक्सबॉक्स कंटेनर में मुख्य अक्ष के साथ वस्तुओं को कौन सा गुण संरेखित करता है?'
          },
          options: {
            en: ['align-items', 'justify-content', 'grid-template', 'flex-grow'],
            hi: ['align-items', 'justify-content', 'grid-template', 'flex-grow']
          },
          answer: 1
        },
        {
          question: {
            en: 'Which layout model is designed specifically for two-dimensional grids (rows AND columns)?',
            hi: 'कौन सा लेआउट मॉडल विशेष रूप से द्वि-आयामी ग्रिड (पंक्तियों और कॉलम) के लिए डिज़ाइन किया गया है?'
          },
          options: {
            en: ['Flexbox', 'CSS Grid', 'Position relative', 'Float inline'],
            hi: ['फ्लेक्सबॉक्स', 'CSS ग्रिड', 'पोजीशन रिलेटिव', 'फ्लोट इनलाइन']
          },
          answer: 1
        }
      ]
    },
    {
      id: 'web_dev-advanced',
      level: 'Advanced',
      levelKey: 'advanced',
      title: {
        en: 'ReactJS State & Lifecycle Hooks',
        hi: 'रिएक्टजेएस स्टेट और लाइफसाइकिल हुक्स'
      },
      notes: {
        en: 'ReactJS uses functional components and **Hooks** to manage component states and side effects.\n\n- **useState**: Declares a state variable that triggers a re-render when its value changes.\n- **useEffect**: Manages side effects like fetching data, subscribing to services, or modifying the browser DOM directly. It executes after rendering. The dependency array `[]` dictates when it runs.\n\nReact uses a virtual DOM to optimize UI updates by comparing changes and updating only the affected nodes in the real DOM, boosting performance.',
        hi: 'ReactJS घटक राज्यों (component states) और साइड इफेक्ट्स को प्रबंधित करने के लिए कार्यात्मक घटकों और **हुक्स (Hooks)** का उपयोग करता है।\n\n- **useState**: एक स्टेट वेरिएबल घोषित करता है जो इसका मान बदलने पर घटक को फिर से रेंडर करने के लिए प्रेरित करता है।\n- **useEffect**: डेटा लाने, सेवाओं की सदस्यता लेने या सीधे ब्राउज़र DOM को संशोधित करने जैसे साइड इफेक्ट्स को प्रबंधित करता है। यह रेंडरिंग के बाद निष्पादित होता है। निर्भरता सरणी `[]` यह तय करती है कि यह कब चलता है।\n\nरिएक्ट वर्चुअल DOM का उपयोग करके बदलावों की तुलना करता है और वास्तविक DOM में केवल प्रभावित नोड्स को अपडेट करता है, जिससे प्रदर्शन में सुधार होता है।'
      },
      quiz: [
        {
          question: {
            en: 'What is the purpose of React useState hook?',
            hi: 'रिएक्ट useState हुक का उद्देश्य क्या है?'
          },
          options: {
            en: ['To link external CSS', 'To manage dynamic state variables within a component', 'To bind database routes', 'To declare constant classes'],
            hi: ['बाहरी CSS को लिंक करने के लिए', 'एक घटक के भीतर गतिशील स्टेट वेरिएबल्स को प्रबंधित करने के लिए', 'डेटाबेस रूट को बाइंड करने के लिए', 'लगातार क्लासेस घोषित करने के लिए']
          },
          answer: 1
        },
        {
          question: {
            en: 'When does useEffect run if the dependency array is empty ([])?',
            hi: 'यदि निर्भरता सरणी खाली ([]) है, तो useEffect कब चलता है?'
          },
          options: {
            en: ['On every component re-render', 'Only once when the component mounts', 'Never', 'Just before the component unmounts'],
            hi: ['हर घटक के पुन: रेंडर होने पर', 'घटक के माउंट होने पर केवल एक बार', 'कभी नहीं', 'घटक के अनमाउंट होने से ठीक पहले']
          },
          answer: 1
        },
        {
          question: {
            en: 'How does React optimize browser DOM updates?',
            hi: 'रिएक्ट ब्राउज़र DOM अपडेट को कैसे अनुकूलित करता है?'
          },
          options: {
            en: ['By reloading the page', 'By using a virtual DOM to batch changes', 'By converting HTML to images', 'By bypassing JavaScript execution'],
            hi: ['पेज को रीलोड करके', 'बदलावों को बैच करने के लिए वर्चुअल DOM का उपयोग करके', 'HTML को छवियों में परिवर्तित करके', 'जावास्क्रिप्ट निष्पादन को दरकिनार करके']
          },
          answer: 1
        }
      ]
    }
  ],
  'data_science': [
    {
      id: 'data_science-basic',
      level: 'Basic',
      levelKey: 'basic',
      title: {
        en: 'Introduction to Data Science & Analytics',
        hi: 'डेटा साइंस और एनालिटिक्स का परिचय'
      },
      notes: {
        en: 'Data Science is an interdisciplinary field that uses scientific methods, algorithms, and systems to extract knowledge and insights from structured and unstructured data. The standard lifecycle includes:\n\n1. **Data Collection**: Gathering raw inputs from APIs, databases, or CSV files.\n2. **Data Cleaning**: Removing missing, corrupt, or duplicate values.\n3. **Exploratory Data Analysis (EDA)**: Understanding variables and correlations using statistical summaries and charts.',
        hi: 'डेटा साइंस एक अंतःविषय क्षेत्र है जो संरचित और असंरचित डेटा से ज्ञान और अंतर्दृष्टि निकालने के लिए वैज्ञानिक तरीकों, एल्गोरिदम और प्रणालियों का उपयोग करता है। मानक जीवनचक्र में शामिल हैं:\n\n1. **डेटा संग्रह (Data Collection)**: API, डेटाबेस या CSV फाइलों से कच्चे इनपुट एकत्र करना।\n2. **डेटा सफाई (Data Cleaning)**: अनुपलब्ध, दूषित या डुप्लिकेट मानों को हटाना।\n3. **अन्वेषण डेटा विश्लेषण (EDA)**: सांख्यिकीय सारांश और चार्ट का उपयोग करके चर और सहसंबंधों को समझना।'
      },
      quiz: [
        {
          question: {
            en: 'What is the first step in the Data Science lifecycle?',
            hi: 'डेटा साइंस जीवनचक्र में पहला कदम क्या है?'
          },
          options: {
            en: ['Deploying a machine learning model', 'Data Collection', 'Writing report documentation', 'Encrypting databases'],
            hi: ['मशीन लर्निंग मॉडल तैनात करना', 'डेटा संग्रह (Data Collection)', 'रिपोर्ट दस्तावेज़ीकरण लिखना', 'डेटाबेस को एन्क्रिप्ट करना']
          },
          answer: 1
        },
        {
          question: {
            en: 'What does EDA stand for in Data Science?',
            hi: 'डेटा साइंस में EDA का क्या अर्थ है?'
          },
          options: {
            en: ['Encryption Data Algorithm', 'Exploratory Data Analysis', 'Electronic Data Archive', 'Extreme Derivative Analysis'],
            hi: ['एन्क्रिप्शन डेटा एल्गोरिथम', 'एक्सप्लोरेटरी डेटा एनालिसिस (Exploratory Data Analysis)', 'इलेक्ट्रॉनिक डेटा आर्काइव', 'एक्सट्रीम डेरिवेटिव एनालिसिस']
          },
          answer: 1
        },
        {
          question: {
            en: 'What is the main goal of Data Cleaning?',
            hi: 'डेटा क्लीनिंग (Data Cleaning) का मुख्य लक्ष्य क्या है?'
          },
          options: {
            en: ['To increase files capacity size', 'To remove corrupted, missing, or duplicate data points', 'To change background colors in visual graphs', 'To compile code to machine language'],
            hi: ['फ़ाइलों की क्षमता का आकार बढ़ाने के लिए', 'दूषित, लापता या डुप्लिकेट डेटा बिंदुओं को हटाने के लिए', 'दृश्य ग्राफ़ में पृष्ठभूमि रंग बदलने के लिए', 'मशीन भाषा में कोड संकलित करने के लिए']
          },
          answer: 1
        }
      ]
    },
    {
      id: 'data_science-intermediate',
      level: 'Intermediate',
      levelKey: 'intermediate',
      title: {
        en: 'Data Manipulation with Pandas & NumPy',
        hi: 'पैंडाज़ और नमपाई के साथ डेटा हेरफेर'
      },
      notes: {
        en: 'In Python, two libraries are crucial for data science:\n\n- **NumPy** (Numerical Python): Provides support for large, multi-dimensional arrays and matrices, along with mathematical functions to operate on them efficiently.\n- **Pandas**: Built on top of NumPy, it provides two primary data structures: **Series** (1D labeled array) and **DataFrame** (2D tabular structure, like a spreadsheet). Pandas makes reading CSVs, filtering columns, grouping records, and handling missing data easy.',
        hi: 'पायथन में, डेटा साइंस के लिए दो लाइब्रेरी महत्वपूर्ण हैं:\n\n- **NumPy (Numerical Python)**: बड़े, बहु-आयामी सरणियों (arrays) और मैट्रिसेस के लिए समर्थन प्रदान करता है, साथ ही उन पर कुशलता से संचालन करने के लिए गणितीय कार्य भी प्रदान करता है।\n- **Pandas**: NumPy के शीर्ष पर निर्मित, यह दो प्राथमिक डेटा संरचनाएं प्रदान करता है: **Series** (1D लेबल सरणी) और **DataFrame** (2D सारणीबद्ध संरचना, जैसे स्प्रेडशीट)। पैंडाज़ CSV पढ़ने, कॉलम फ़िल्टर करने, रिकॉर्ड समूहीकृत करने और गुम डेटा को संभालने को आसान बनाता है।'
      },
      quiz: [
        {
          question: {
            en: 'Which library is best suited for high-performance array computations in Python?',
            hi: 'पायथन में उच्च-प्रदर्शन सरणी (array) गणनाओं के लिए कौन सी लाइब्रेरी सबसे उपयुक्त है?'
          },
          options: {
            en: ['Flask', 'NumPy', 'Django', 'Requests'],
            hi: ['फ्लास्क', 'NumPy', 'जैंगो', 'रिक्वेस्ट्स']
          },
          answer: 1
        },
        {
          question: {
            en: 'What is a Pandas DataFrame?',
            hi: 'पैंडाज़ डेटाफ्रेम (Pandas DataFrame) क्या है?'
          },
          options: {
            en: ['A single-dimensional scalar value', 'A two-dimensional tabular data structure with columns and rows', 'A server hosting module', 'A style sheet file'],
            hi: ['एकल-आयामी स्केलर मान', 'कॉलम और पंक्तियों के साथ एक द्वि-आयामी सारणीबद्ध डेटा संरचना', 'एक सर्वर होस्टिंग मॉड्यूल', 'एक स्टाइल शीट फ़ाइल']
          },
          answer: 1
        },
        {
          question: {
            en: 'Which Python package is built on top of NumPy to provide spreadsheet-like DataFrames?',
            hi: 'पायथन का कौन सा पैकेज स्प्रेडशीट जैसे डेटाफ्रेम प्रदान करने के लिए NumPy के ऊपर बनाया गया है?'
          },
          options: {
            en: ['Pandas', 'Matplotlib', 'PyTest', 'BeautifulSoup'],
            hi: ['पैंडाज़ (Pandas)', 'मैटप्लॉटलिब', 'पायटेस्ट', 'ब्यूटीफुलसूप']
          },
          answer: 0
        }
      ]
    },
    {
      id: 'data_science-advanced',
      level: 'Advanced',
      levelKey: 'advanced',
      title: {
        en: 'Predictive Modeling & Regression Analysis',
        hi: 'भविष्य कहनेवाला मॉडलिंग और प्रतिगमन विश्लेषण'
      },
      notes: {
        en: 'Predictive modeling uses statistics to forecast outcomes. **Linear Regression** is a foundational algorithm that models the linear relationship between a dependent variable ($Y$) and one or more independent variables ($X$) using a straight line equation: $Y = mX + c$.\n\nEvaluating regression models involves metrics like:\n- **Mean Squared Error (MSE)**: The average squared difference between actual and predicted values.\n- **R-squared ($R^2$)**: Explains the proportion of variance in the dependent variable predictable from the independent variables (from 0 to 1).',
        hi: 'भविष्य कहनेवाला मॉडलिंग परिणामों की भविष्यवाणी करने के लिए सांख्यिकी का उपयोग करता है। **रैखिक प्रतिगमन (Linear Regression)** एक बुनियादी एल्गोरिदम है जो एक सीधे रेखा समीकरण: $Y = mX + c$ का उपयोग करके एक आश्रित चर ($Y$) और एक या अधिक स्वतंत्र चर ($X$) के बीच रैखिक संबंध को मॉडल करता है।\n\nप्रतिगमन मॉडल का मूल्यांकन करने में निम्न मेट्रिक्स शामिल हैं:\n- **माध्य वर्ग त्रुटि (MSE)**: वास्तविक और अनुमानित मानों के बीच औसत वर्ग अंतर।\n- **आर-स्क्वायर ($R^2$)**: स्वतंत्र चर से अनुमान लगाने योग्य आश्रित चर में भिन्नता के अनुपात को समझाता है (0 से 1 तक)।'
      },
      quiz: [
        {
          question: {
            en: 'What is modeled by Linear Regression?',
            hi: 'रैखिक प्रतिगमन द्वारा क्या मॉडल किया जाता है?'
          },
          options: {
            en: ['A circular cluster of dots', 'The linear relationship between dependent and independent variables', 'The decryption flow of certificates', 'The recursive loop depth'],
            hi: ['बिंदुओं का एक गोलाकार समूह', 'आश्रित और स्वतंत्र चरों के बीच रैखिक संबंध', 'प्रमाणपत्रों का डिक्रिप्शन प्रवाह', 'रिकर्सिव लूप गहराई']
          },
          answer: 1
        },
        {
          question: {
            en: 'What metric measures the proportion of variance predicted by regression variables?',
            hi: 'कौन सा मीट्रिक प्रतिगमन चर द्वारा अनुमानित भिन्नता के अनुपात को मापता है?'
          },
          options: {
            en: ['Mean absolute error', 'R-squared (R2)', 'Standard deviation index', 'Root gradient limit'],
            hi: ['माध्य निरपेक्ष त्रुटि', 'आर-स्क्वायर (R2)', 'मानक विचलन सूचकांक', 'रूट ग्रेडिएंट सीमा']
          },
          answer: 1
        },
        {
          question: {
            en: 'What does a Mean Squared Error of 0 indicate?',
            hi: '0 का माध्य वर्ग त्रुटि (MSE) क्या दर्शाता है?'
          },
          options: {
            en: ['High level of variance errors', 'Perfect prediction accuracy with zero error', 'Completely failed predictions', 'An infinite loop anomaly'],
            hi: ['भिन्नता त्रुटियों का उच्च स्तर', 'शून्य त्रुटि के साथ सही भविष्यवाणी सटीकता', 'पूरी तरह से असफल भविष्यवाणियां', 'एक अनंत लूप विसंगति']
          },
          answer: 1
        }
      ]
    }
  ],
  'programming': [
    {
      id: 'programming-basic',
      level: 'Basic',
      levelKey: 'basic',
      title: {
        en: 'Variables, Data Types & Flow Control',
        hi: 'वेरिएबल्स, डेटा प्रकार और प्रवाह नियंत्रण'
      },
      notes: {
        en: 'Programming starts with variables, which store data in memory. Common primitive **Data Types** include:\n- **Integer / Float**: Numeric values.\n- **String**: Sequences of characters (text).\n- **Boolean**: Logical values (`True` or `False`).\n\n**Flow Control** uses conditionals (`if`, `else if`, `else`) to execute specific blocks of code depending on whether conditions evaluate to true or false. Comparison operators like `==`, `<`, `>`, and `&&` (logical AND) construct these conditions.',
        hi: 'प्रोग्रामिंग वेरिएबल्स के साथ शुरू होती है, जो मेमोरी में डेटा स्टोर करते हैं। सामान्य आदिम **डेटा प्रकार (Data Types)** में शामिल हैं:\n- **Integer / Float**: संख्यात्मक मान।\n- **String**: वर्णों का अनुक्रम (पाठ)।\n- **Boolean**: तार्किक मान (`True` या `False`)।\n\n**प्रवाह नियंत्रण (Flow Control)** विशिष्ट कोड ब्लॉकों को निष्पादित करने के लिए सशर्त कथनों (`if`, `else if`, `else`) का उपयोग करता है, यह इस पर निर्भर करता है कि स्थितियां सही हैं या गलत। तुलना ऑपरेटर जैसे `==`, `<`, `>`, और `&&` इन स्थितियों का निर्माण करते हैं।'
      },
      quiz: [
        {
          question: {
            en: 'Which data type is used to store boolean logic?',
            hi: 'बूलियन लॉजिक को स्टोर करने के लिए किस डेटा प्रकार का उपयोग किया जाता है?'
          },
          options: {
            en: ['Integer', 'Boolean', 'String', 'Array'],
            hi: ['पूर्णांक (Integer)', 'बूलियन (Boolean)', 'स्ट्रिंग', 'ऐरे']
          },
          answer: 1
        },
        {
          question: {
            en: 'What block of code executes when the main "if" condition is false?',
            hi: 'मुख्य "if" स्थिति गलत होने पर कोड का कौन सा ब्लॉक निष्पादित होता है?'
          },
          options: {
            en: ['then', 'else', 'while', 'catch'],
            hi: ['then', 'else', 'while', 'catch']
          },
          answer: 1
        },
        {
          question: {
            en: 'Which operator represents a logical AND operation?',
            hi: 'कौन सा ऑपरेटर तार्किक AND ऑपरेशन का प्रतिनिधित्व करता है?'
          },
          options: {
            en: ['||', '&&', '==', '!'],
            hi: ['||', '&&', '==', '!']
          },
          answer: 1
        }
      ]
    },
    {
      id: 'programming-intermediate',
      level: 'Intermediate',
      levelKey: 'intermediate',
      title: {
        en: 'Loops, Functions & Modular Code',
        hi: 'लूप्स, फ़ंक्शंस और मॉड्यूलर कोड'
      },
      notes: {
        en: 'Loops and functions help developers write DRY (Don\'t Repeat Yourself) code.\n\n- **Loops**: Repeat a block of code while a condition is met. A `for` loop is typically used when the number of iterations is known, while a `while` loop runs as long as a condition is true.\n- **Functions**: Reusable blocks of code that perform a specific task. They can receive inputs (parameters) and return an output value.\n- **Scope**: Determines the visibility of variables (local inside functions vs. global).',
        hi: 'लूप और फ़ंक्शन डेवलपर्स को DRY (डोंट रिपीट योरसेल्फ) कोड लिखने में मदद करते हैं।\n\n- **लूप्स (Loops)**: एक स्थिति पूरी होने तक कोड के एक ब्लॉक को दोहराते हैं। एक `for` लूप का उपयोग आमतौर पर तब किया जाता है जब पुनरावृत्तियों (iterations) की संख्या ज्ञात होती है, जबकि एक `while` लूप तब तक चलता है जब तक कोई स्थिति सच होती है।\n- **फ़ंक्शंस (Functions)**: पुन: प्रयोज्य कोड ब्लॉक जो एक विशिष्ट कार्य करते हैं। वे इनपुट (पैरामीटर) प्राप्त कर सकते हैं और एक आउटपुट मान वापस कर सकते हैं।\n- **दायरा (Scope)**: वेरिएबल्स की दृश्यता निर्धारित करता है (फ़ंक्शन के अंदर स्थानीय बनाम वैश्विक)।'
      },
      quiz: [
        {
          question: {
            en: 'Which loop is best used when the exact number of iterations is known beforehand?',
            hi: 'जब पुनरावृत्तियों की सटीक संख्या पहले से ज्ञात हो तो कौन सा लूप सबसे अच्छा उपयोग किया जाता है?'
          },
          options: {
            en: ['while loop', 'for loop', 'recursive loop', 'switch block'],
            hi: ['while लूप', 'for लूप', 'रिकर्सिव लूप', 'स्विच ब्लॉक']
          },
          answer: 1
        },
        {
          question: {
            en: 'What are inputs passed into functions called?',
            hi: 'फ़ंक्शंस में पास किए गए इनपुट क्या कहलाते हैं?'
          },
          options: {
            en: ['Returns', 'Parameters / Arguments', 'Classes', 'Global variables'],
            hi: ['रिटर्न्स', 'पैरामीटर्स / आर्गुमेंट्स', 'क्लासेस', 'ग्लोबल वेरिएबल्स']
          },
          answer: 1
        },
        {
          question: {
            en: 'What is local scope?',
            hi: 'स्थानीय दायरा (local scope) क्या है?'
          },
          options: {
            en: ['Variables accessible everywhere in the file', 'Variables accessible only inside the block or function where they are declared', 'Variables saved on the server database', 'Variables stored in stylesheet selectors'],
            hi: ['फ़ाइल में हर जगह सुलभ वेरिएबल्स', 'वेरिएबल्स जो केवल उसी ब्लॉक या फ़ंक्शन के अंदर सुलभ होते हैं जहां उन्हें घोषित किया गया है', 'सर्वर डेटाबेस पर सहेजे गए वेरिएबल्स', 'स्टाइलशीट चयनकर्ताओं में संग्रहीत वेरिएबल्स']
          },
          answer: 1
        }
      ]
    },
    {
      id: 'programming-advanced',
      level: 'Advanced',
      levelKey: 'advanced',
      title: {
        en: 'Object-Oriented Programming (OOP) Principles',
        hi: 'ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग (OOP) के सिद्धांत'
      },
      notes: {
        en: 'Object-Oriented Programming (OOP) is a programming paradigm centered around **Classes** (blueprints) and **Objects** (instances of classes). OOP is built on four core pillars:\n\n1. **Encapsulation**: Keeping data (fields) and code (methods) together within an object, hiding internal state.\n2. **Inheritance**: Allowing a child class to inherit fields and methods from a parent class.\n3. **Polymorphism**: The ability for different classes to respond to the same method call in unique ways.\n4. **Abstraction**: Hiding complex implementation details and showing only essential features.',
        hi: 'ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग (OOP) एक प्रोग्रामिंग प्रतिमान (programming paradigm) है जो **क्लासेस (Classes)** (ब्लूप्रिंट) और **ऑब्जेक्ट्स (Objects)** (क्लासेस के उदाहरण) के इर्द-गिर्द केंद्रित है। OOP चार मुख्य स्तंभों पर बनाया गया है:\n\n1. **एन्कैप्सुलेशन (Encapsulation)**: डेटा (फ़ील्ड) और कोड (विधियों) को एक ऑब्जेक्ट के भीतर एक साथ रखना, आंतरिक स्थिति को छिपाना।\n2. **वंशानुक्रम (Inheritance)**: एक चाइल्ड क्लास को पैरेंट क्लास से फ़ील्ड और विधियों को विरासत में लेने की अनुमति देना।\n3. **बहुरूपता (Polymorphism)**: विभिन्न क्लासेस के लिए एक ही विधि कॉल का अद्वितीय तरीकों से उत्तर देने की क्षमता।\n4. **अमूर्तता (Abstraction)**: जटिल कार्यान्वयन विवरणों को छिपाना और केवल आवश्यक विशेषताओं को दिखाना।'
      },
      quiz: [
        {
          question: {
            en: 'Which OOP pillar allows a class to acquire properties of another class?',
            hi: 'कौन सा OOP स्तंभ एक क्लास को दूसरी क्लास के गुणों को प्राप्त करने की अनुमति देता है?'
          },
          options: {
            en: ['Encapsulation', 'Polymorphism', 'Inheritance', 'Abstraction'],
            hi: ['एन्कैप्सुलेशन', 'बहुरूपता', 'वंशानुक्रम (Inheritance)', 'अमूर्तता']
          },
          answer: 2
        },
        {
          question: {
            en: 'What is a Class in OOP?',
            hi: 'OOP में क्लास (Class) क्या है?'
          },
          options: {
            en: ['An instance of an object', 'A blueprint for creating objects', 'A compiling database script', 'A visual CSS styling block'],
            hi: ['एक ऑब्जेक्ट का उदाहरण', 'ऑब्जेक्ट बनाने के लिए एक ब्लूप्रिंट', 'एक कंपाइलिंग डेटाबेस स्क्रिप्ट', 'एक विजुअल CSS स्टाइलिंग ब्लॉक']
          },
          answer: 1
        },
        {
          question: {
            en: 'Hiding internal state and exposing actions through public methods is called...',
            hi: 'आंतरिक स्थिति को छिपाना और सार्वजनिक विधियों के माध्यम से क्रियाओं को उजागर करना क्या कहलाता है?'
          },
          options: {
            en: ['Encapsulation', 'Looping', 'Polymorphism', 'Abstraction'],
            hi: ['एन्कैप्सुलेशन (Encapsulation)', 'लूपिंग', 'बहुरूपता', 'अमूर्तता']
          },
          answer: 0
        }
      ]
    }
  ],
  'physics': [
    {
      id: 'physics-basic',
      level: 'Basic',
      levelKey: 'basic',
      title: {
        en: "Newton's Laws of Motion",
        hi: 'न्यूटन के गति के नियम'
      },
      notes: {
        en: "Sir Isaac Newton's three laws of motion describe the relationship between a body and the forces acting upon it, and its motion in response to those forces:\n\n1. **First Law (Inertia)**: An object remains at rest or in uniform motion unless acted upon by an external net force.\n2. **Second Law ($F=ma$)**: The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.\n3. **Third Law (Action & Reaction)**: For every action, there is an equal and opposite reaction.",
        hi: 'सर आइजैक न्यूटन के गति के तीन नियम एक पिंड और उस पर लगने वाले बलों तथा उन बलों के जवाब में उसकी गति के बीच संबंध का वर्णन करते हैं:\n\n1. **पहला नियम (जड़त्व)**: कोई वस्तु तब तक स्थिर रहती है या एकसमान गति में रहती है जब तक कि उस पर कोई बाहरी शुद्ध बल काम न करे।\n2. **दूसरा नियम ($F=ma$)**: किसी वस्तु का त्वरण (acceleration) उस पर लगने वाले शुद्ध बल के सीधे आनुपातिक और उसके द्रव्यमान के विपरीत आनुपातिक होता है।\n3. **तीसरा नियम (क्रिया और प्रतिक्रिया)**: प्रत्येक क्रिया के लिए, एक समान और विपरीत प्रतिक्रिया होती है।'
      },
      quiz: [
        {
          question: {
            en: "What is Newton's Second Law equation?",
            hi: 'न्यूटन के दूसरे नियम का समीकरण क्या है?'
          },
          options: {
            en: ['E = mc²', 'F = ma', 'v = u + at', 'P = W/t'],
            hi: ['E = mc²', 'F = ma', 'v = u + at', 'P = W/t']
          },
          answer: 1
        },
        {
          question: {
            en: "What is the physical tendency of objects to resist changes in their state of motion called?",
            hi: 'वस्तुओं की उनकी गति की स्थिति में बदलाव का विरोध करने की भौतिक प्रवृत्ति को क्या कहा जाता है?'
          },
          options: {
            en: ['Gravity', 'Velocity', 'Inertia', 'Friction'],
            hi: ['गुरुत्वाकर्षण', 'वेग', 'जड़त्व (Inertia)', 'घर्षण']
          },
          answer: 2
        },
        {
          question: {
            en: "If Object A exerts a force of 10 N on Object B, what force does Object B exert on Object A?",
            hi: 'यदि वस्तु A वस्तु B पर 10 N का बल लगाती है, तो वस्तु B वस्तु A पर कितना बल लगाती है?'
          },
          options: {
            en: ['0 N', '5 N', '-10 N (opposite direction)', '100 N'],
            hi: ['0 N', '5 N', '-10 N (विपरीत दिशा में)', '100 N']
          },
          answer: 2
        }
      ]
    },
    {
      id: 'physics-intermediate',
      level: 'Intermediate',
      levelKey: 'intermediate',
      title: {
        en: 'Work, Energy & Power Principles',
        hi: 'कार्य, ऊर्जा और शक्ति के सिद्धांत'
      },
      notes: {
        en: 'In physics, work and energy are closely related concepts:\n\n- **Work ($W$)**: Occurs when a force acting on an object causes displacement. Formula: $W = F \cdot d \cdot \cos(\theta)$. Measured in Joules (J).\n- **Energy**: The capacity to do work. Two main types are:\n  - **Kinetic Energy ($KE$)**: Energy of motion, $KE = \frac{1}{2}mv^2$.\n  - **Potential Energy ($PE$)**: Stored energy due to position, $PE = mgh$.\n- **Power ($P$)**: The rate at which work is done, $P = \frac{W}{t}$. Measured in Watts (W).',
        hi: 'भौतिकी में, कार्य और ऊर्जा निकट से संबंधित अवधारणाएं हैं:\n\n- **कार्य ($W$)**: तब होता है जब किसी वस्तु पर कार्य करने वाला बल विस्थापन (displacement) का कारण बनता है। सूत्र: $W = F \cdot d \cdot \cos(\theta)$। जूल (J) में मापा जाता है।\n- **ऊर्जा**: कार्य करने की क्षमता। दो मुख्य प्रकार हैं:\n  - **गतिज ऊर्जा (Kinetic Energy - $KE$)**: गति की ऊर्जा, $KE = \frac{1}{2}mv^2$।\n  - **संभावित ऊर्जा (Potential Energy - $PE$)**: स्थिति के कारण संग्रहीत ऊर्जा, $PE = mgh$।\n- **शक्ति (Power - $P$)**: वह दर जिस पर कार्य किया जाता है, $P = \frac{W}{t}$। वाट (W) में मापा जाता है।'
      },
      quiz: [
        {
          question: {
            en: 'What is the SI unit for work and energy?',
            hi: 'कार्य और ऊर्जा की SI इकाई क्या है?'
          },
          options: {
            en: ['Watt', 'Joule', 'Newton', 'Pascal'],
            hi: ['वाट', 'जूल (Joule)', 'न्यूटन', 'पास्कल']
          },
          answer: 1
        },
        {
          question: {
            en: 'What is the formula for Gravitational Potential Energy?',
            hi: 'गुरुत्वाकर्षण संभावित ऊर्जा का सूत्र क्या है?'
          },
          options: {
            en: ['1/2 mv²', 'mgh', 'F * d', 'ma'],
            hi: ['1/2 mv²', 'mgh', 'F * d', 'ma']
          },
          answer: 1
        },
        {
          question: {
            en: 'What does Power measure in physics?',
            hi: 'भौतिकी में शक्ति (Power) किसका माप है?'
          },
          options: {
            en: ['The total force exerted', 'The rate at which work is completed over time', 'The gravitational pull acceleration', 'The density of mass'],
            hi: ['लगाया गया कुल बल', 'समय के साथ कार्य पूरा होने की दर', 'गुरुत्वाकर्षण खिंचाव त्वरण', 'द्रव्यमान का घनत्व']
          },
          answer: 1
        }
      ]
    },
    {
      id: 'physics-advanced',
      level: 'Advanced',
      levelKey: 'advanced',
      title: {
        en: 'Electromagnetism & Maxwell Equations',
        hi: 'विद्युत चुंबकत्व और मैक्सवेल समीकरण'
      },
      notes: {
        en: 'Electromagnetism is the physics of electromagnetic forces. It deals with electric charges, electric fields, magnetic fields, and electromagnetic radiation. James Clerk Maxwell unified these concepts in **Maxwell\'s Equations**:\n\n1. **Gauss\'s Law**: Electric charge produces an electric field.\n2. **Gauss\'s Law for Magnetism**: There are no magnetic monopoles; magnetic field lines are closed loops.\n3. **Faraday\'s Law**: A changing magnetic field induces an electromotive force (electricity).\n4. **Ampere-Maxwell Law**: Electric currents and changing electric fields produce magnetic fields.',
        hi: 'विद्युत चुंबकत्व विद्युत चुंबकीय बलों का भौतिकी है। यह विद्युत आवेशों, विद्युत क्षेत्रों, चुंबकीय क्षेत्रों और विद्युत चुंबकीय विकिरण से संबंधित है। जेम्स क्लर्क मैक्सवेल ने इन अवधारणाओं को **मैक्सवेल के समीकरणों (Maxwell\'s Equations)** में एकीकृत किया:\n\n1. **गॉस का नियम**: विद्युत आवेश एक विद्युत क्षेत्र उत्पन्न करता है।\n2. **चुंबकत्व के लिए गॉस का नियम**: कोई चुंबकीय मोनोपोल नहीं होते हैं; चुंबकीय क्षेत्र रेखाएं बंद लूप होती हैं।\n3. **फैराडे का नियम**: एक बदलता चुंबकीय क्षेत्र एक विद्युत वाहक बल (बिजली) को प्रेरित करता है।\n4. **एम्पीयर-मैक्सवेल नियम**: विद्युत धाराएं और बदलते विद्युत क्षेत्र चुंबकीय क्षेत्र उत्पन्न करते हैं।'
      },
      quiz: [
        {
          question: {
            en: 'Which physicist unified electricity and magnetism into four equations?',
            hi: 'किस भौतिक विज्ञानी ने बिजली और चुंबकत्व को चार समीकरणों में एकीकृत किया?'
          },
          options: {
            en: ['Albert Einstein', 'James Clerk Maxwell', 'Isaac Newton', 'Niels Bohr'],
            hi: ['अल्बर्ट आइंस्टीन', 'जेम्स क्लर्क मैक्सवेल', 'आइंस्टीन न्यूटन', 'नील्स बोर']
          },
          answer: 1
        },
        {
          question: {
            en: "What does Gauss's Law for Magnetism state regarding monopoles?",
            hi: "चुंबकत्व के लिए गॉस का नियम मोनोपोल के संबंध में क्या कहता है?"
          },
          options: {
            en: ['Magnetic monopoles can exist independently', 'Isolated magnetic monopoles do not exist', 'Monopoles double in strength', 'Monopoles repel electric fields'],
            hi: ['चुंबकीय मोनोपोल स्वतंत्र रूप से मौजूद हो सकते हैं', 'पृथक चुंबकीय मोनोपोल मौजूद नहीं हैं', 'मोनोपोल ताकत में दोगुने हो जाते हैं', 'मोनोपोल विद्युत क्षेत्रों को पीछे हटाते हैं']
          },
          answer: 1
        },
        {
          question: {
            en: 'What is induced by a changing magnetic field according to Faraday\'s Law?',
            hi: 'फैराडे के नियम के अनुसार बदलते चुंबकीय क्षेत्र से क्या प्रेरित होता है?'
          },
          options: {
            en: ['Gravity waves', 'An electromotive force / electric current', 'Sound waves', 'Nuclear friction'],
            hi: ['गुरुत्वाकर्षण तरंगें', 'एक विद्युत वाहक बल / विद्युत धारा', 'ध्वनि तरंगें', 'परमाणु घर्षण']
          },
          answer: 1
        }
      ]
    }
  ],
  'math': [
    {
      id: 'math-basic',
      level: 'Basic',
      levelKey: 'basic',
      title: {
        en: 'Introduction to Algebra & Equations',
        hi: 'बीजगणित और समीकरणों का परिचय'
      },
      notes: {
        en: 'Algebra uses symbols (variables like $x$, $y$) to represent numbers in equations. A **linear equation** in one variable is written as $ax + b = 0$. \n\nTo solve an equation, apply inverse operations to isolate the variable on one side. For example, to solve $2x + 4 = 10$:\n1. Subtract 4 from both sides: $2x = 6$.\n2. Divide both sides by 2: $x = 3$.',
        hi: 'बीजगणित समीकरणों में संख्याओं का प्रतिनिधित्व करने के लिए प्रतीकों (जैसे $x$, $y$ चर) का उपयोग करता है। एक चर में एक **रैखिक समीकरण (linear equation)** को $ax + b = 0$ के रूप में लिखा जाता है।\n\nसमीकरण को हल करने के लिए, चर को एक तरफ अलग करने के लिए विपरीत संचालन लागू करें। उदाहरण के लिए, $2x + 4 = 10$ को हल करने के लिए:\n1. दोनों पक्षों से 4 घटाएं: $2x = 6$।\n2. दोनों पक्षों को 2 से विभाजित करें: $x = 3$।'
      },
      quiz: [
        {
          question: {
            en: 'Solve for x: 3x - 5 = 10.',
            hi: 'x के लिए हल करें: 3x - 5 = 10।'
          },
          options: {
            en: ['x = 3', 'x = 5', 'x = 15', 'x = 2'],
            hi: ['x = 3', 'x = 5', 'x = 15', 'x = 2']
          },
          answer: 1
        },
        {
          question: {
            en: 'What is a variable in algebra?',
            hi: 'बीजगणित में चर (variable) क्या है?'
          },
          options: {
            en: ['A constant value that never changes', 'A symbol representing an unknown or changing value', 'An operator like plus or minus', 'A visual graph matrix'],
            hi: ['एक स्थिर मान जो कभी नहीं बदलता', 'एक अज्ञात या बदलते मान का प्रतिनिधित्व करने वाला प्रतीक', 'प्लस या माइनस जैसा ऑपरेटर', 'एक विजुअल ग्राफ़ मैट्रिक्स']
          },
          answer: 1
        },
        {
          question: {
            en: 'What is the coefficient of x in the term -4x?',
            hi: 'पद -4x में x का गुणांक (coefficient) क्या है?'
          },
          options: {
            en: ['4', '-4', 'x', '0'],
            hi: ['4', '-4', 'x', '0']
          },
          answer: 1
        }
      ]
    },
    {
      id: 'math-intermediate',
      level: 'Intermediate',
      levelKey: 'intermediate',
      title: {
        en: 'Calculus: Limits and Derivatives',
        hi: 'कलन: सीमाएं और अवकलज (Limits & Derivatives)'
      },
      notes: {
        en: 'Calculus is the mathematical study of continuous change.\n\n- **Limit**: Describes the value that a function approaches as the input approaches some value. Written as $\\lim_{x \\to c} f(x) = L$.\n- **Derivative**: Represents the instantaneous rate of change of a function, which corresponds to the slope of the tangent line to the function\'s graph at a given point. The derivative of $f(x) = x^n$ is $f\'(x) = n \cdot x^{n-1}$ (Power Rule).',
        hi: 'कलन (Calculus) निरंतर परिवर्तन का गणितीय अध्ययन है।\n\n- **सीमा (Limit)**: उस मान का वर्णन करता है जिसके करीब एक फ़ंक्शन पहुंचता है जैसे इनपुट किसी मान के करीब पहुंचता है। इसे $\\lim_{x \\to c} f(x) = L$ के रूप में लिखा जाता है।\n- **अवकलज (Derivative)**: एक फ़ंक्शन के परिवर्तन की तात्कालिक दर का प्रतिनिधित्व करता है, जो किसी दिए गए बिंदु पर फ़ंक्शन के ग्राफ़ की स्पर्शरेखा (tangent line) के ढलान से मेल खाता है। $f(x) = x^n$ का अवकलज $f\'(x) = n \cdot x^{n-1}$ है (पॉवर रूल)।'
      },
      quiz: [
        {
          question: {
            en: 'What is the derivative of f(x) = x² according to the Power Rule?',
            hi: 'पॉवर रूल के अनुसार f(x) = x² का अवकलज (derivative) क्या है?'
          },
          options: {
            en: ['x', '2x', 'x³', '2'],
            hi: ['x', '2x', 'x³', '2']
          },
          answer: 1
        },
        {
          question: {
            en: 'What geometric feature corresponds to the derivative of a function at a point?',
            hi: 'कौन सी ज्यामितीय विशेषता एक बिंदु पर फ़ंक्शन के अवकलज से मेल खाती है?'
          },
          options: {
            en: ['The area under the curve', 'The slope of the tangent line', 'The intersection with the y-axis', 'The length of the curve segment'],
            hi: ['वक्र के नीचे का क्षेत्रफल', 'स्पर्शरेखा का ढलान (slope of the tangent line)', 'y-अक्ष के साथ प्रतिच्छेदन', 'वक्र खंड की लंबाई']
          },
          answer: 1
        },
        {
          question: {
            en: 'Evaluate the limit: lim(x -> 3) of (x² - 9) / (x - 3).',
            hi: 'सीमा का मूल्यांकन करें: (x² - 9) / (x - 3) की lim(x -> 3)।'
          },
          options: {
            en: ['0', '3', '6', 'Undefined'],
            hi: ['0', '3', '6', 'अपरिभाषित']
          },
          answer: 2
        }
      ]
    },
    {
      id: 'math-advanced',
      level: 'Advanced',
      levelKey: 'advanced',
      title: {
        en: 'Linear Algebra: Vectors & Matrices',
        hi: 'रैखिक बीजगणित: वैक्टर और मैट्रिसेस'
      },
      notes: {
        en: 'Linear Algebra is the branch of mathematics concerning vector spaces and linear mappings between them.\n\n- **Vector**: A geometric object with both magnitude and direction, represented as coordinates in space.\n- **Matrix**: A rectangular array of numbers arranged in rows and columns. Matrices represent linear transformations. \n- **Determinant**: A scalar value calculated from a square matrix that encodes scaling behavior and invertibility. If the determinant is 0, the matrix is not invertible.',
        hi: 'रैखिक बीजगणित (Linear Algebra) गणित की वह शाखा है जो वेक्टर स्पेस और उनके बीच रैखिक मैपिंग से संबंधित है।\n\n- **वेक्टर (Vector)**: परिमाण और दिशा दोनों वाला एक ज्यामितीय ऑब्जेक्ट, जिसे अंतरिक्ष में निर्देशांक के रूप में दर्शाया जाता है।\n- **मैट्रिक्स (Matrix)**: पंक्तियों और कॉलमों में व्यवस्थित संख्याओं का एक आयताकार सरणी। मैट्रिसेस रैखिक परिवर्तनों का प्रतिनिधित्व करते हैं।\n- **सारणिक (Determinant)**: एक वर्ग मैट्रिक्स से गणना किया गया एक स्केलर मान जो स्केलिंग व्यवहार और उलटने की क्षमता (invertibility) को एनकोड करता है। यदि सारणिक 0 है, तो मैट्रिक्स उलटने योग्य (invertible) नहीं है।'
      },
      quiz: [
        {
          question: {
            en: 'If a matrix has a determinant of 0, what does it mean for its inverse?',
            hi: 'यदि किसी मैट्रिक्स का सारणिक (determinant) 0 है, तो इसके व्युत्क्रम (inverse) के लिए इसका क्या अर्थ है?'
          },
          options: {
            en: ['The inverse is also 0', 'The matrix does not have an inverse', 'The inverse is infinite', 'The inverse is equal to its transpose'],
            hi: ['व्युत्क्रम भी 0 है', 'मैट्रिक्स का व्युत्क्रम मौजूद नहीं होता है', 'व्युत्क्रम अनंत है', 'व्युत्क्रम इसके ट्रांसपोज़ के बराबर है']
          },
          answer: 1
        },
        {
          question: {
            en: 'What is a Matrix?',
            hi: 'मैट्रिक्स (Matrix) क्या है?'
          },
          options: {
            en: ['A scalar vector coordinate', 'A rectangular array of numbers arranged in rows and columns', 'A trigonometric equation', 'A curve-fitting polynomial function'],
            hi: ['एक स्केलर वेक्टर समन्वय', 'पंक्तियों और कॉलमों में व्यवस्थित संख्याओं का एक आयताकार सरणी', 'एक त्रिकोणमितीय समीकरण', 'एक वक्र-फिटिंग बहुपद फ़ंक्शन']
          },
          answer: 1
        },
        {
          question: {
            en: 'What is the result of multiplying a matrix by its inverse?',
            hi: 'एक मैट्रिक्स को उसके व्युत्क्रम से गुणा करने का क्या परिणाम होता है?'
          },
          options: {
            en: ['Zero Matrix', 'Identity Matrix', 'The original matrix itself', 'Diagonal scalar matrix'],
            hi: ['शून्य मैट्रिक्स', 'तत्समक मैट्रिक्स (Identity Matrix)', 'मूल मैट्रिक्स ही', 'विकर्ण स्केलर मैट्रिक्स']
          },
          answer: 1
        }
      ]
    }
  ],
  'chemistry': [
    {
      id: 'chemistry-basic',
      level: 'Basic',
      levelKey: 'basic',
      title: {
        en: 'Atomic Structure & Chemical Bonding',
        hi: 'परमाणु संरचना और रासायनिक बंधन'
      },
      notes: {
        en: 'Matter is composed of **atoms**, which consist of three subatomic particles:\n- **Protons**: Positively charged particles in the nucleus.\n- **Neutrons**: Uncharged particles in the nucleus.\n- **Electrons**: Negatively charged particles orbiting the nucleus.\n\nAtoms bond to achieve stable outer electron shells. The two primary types of bonding are:\n1. **Ionic Bonding**: The electrostatic attraction between oppositely charged ions formed by transferring electrons.\n2. **Covalent Bonding**: The sharing of electron pairs between atoms.',
        hi: 'पदार्थ **परमाणुओं** से बना है, जिसमें तीन उप-परमाणु कण होते हैं:\n- **प्रोटॉन (Protons)**: नाभिक में धनावेशित कण।\n- **न्यूट्रॉन (Neutrons)**: नाभिक में अनावेशित कण।\n- **इलेक्ट्रॉन (Electrons)**: नाभिक की परिक्रमा करने वाले ऋणावेशित कण।\n\nपरमाणु स्थिर बाहरी इलेक्ट्रॉन शेल प्राप्त करने के लिए बंधते हैं। बंधन के दो प्राथमिक प्रकार हैं:\n1. **आयनिक बंधन (Ionic Bonding)**: इलेक्ट्रॉनों को स्थानांतरित करके बने विपरीत आवेशित आयनों के बीच इलेक्ट्रोस्टैटिक आकर्षण।\n2. **सहसंयोजक बंधन (Covalent Bonding)**: परमाणुओं के बीच इलेक्ट्रॉन जोड़े साझा करना।'
      },
      quiz: [
        {
          question: {
            en: 'Which subatomic particles are located in the nucleus of an atom?',
            hi: 'परमाणु के नाभिक में कौन से उप-परमाणु कण स्थित होते हैं?'
          },
          options: {
            en: ['Protons and Electrons', 'Protons and Neutrons', 'Neutrons and Electrons', 'Electrons only'],
            hi: ['प्रोटॉन और इलेक्ट्रॉन', 'प्रोटॉन और न्यूट्रॉन', 'न्यूट्रॉन और इलेक्ट्रॉन', 'केवल इलेक्ट्रॉन']
          },
          answer: 1
        },
        {
          question: {
            en: 'What type of bond is formed when atoms share electron pairs?',
            hi: 'जब परमाणु इलेक्ट्रॉन जोड़े साझा करते हैं तो किस प्रकार का बंधन बनता है?'
          },
          options: {
            en: ['Ionic Bond', 'Covalent Bond', 'Metallic Bond', 'Hydrogen Bond'],
            hi: ['आयोनिक बांड', 'सहसंयोजक बांड (Covalent Bond)', 'धातु बांड', 'हाइड्रोजन बांड']
          },
          answer: 1
        },
        {
          question: {
            en: 'What electrical charge do electrons carry?',
            hi: 'इलेक्ट्रॉन कौन सा विद्युत आवेश ले जाते हैं?'
          },
          options: {
            en: ['Positive', 'Negative', 'Neutral / Zero', 'Variable charge'],
            hi: ['सकारात्मक', 'नकारात्मक', 'तटस्थ / शून्य', 'परिवर्तनीय आवेश']
          },
          answer: 1
        }
      ]
    },
    {
      id: 'chemistry-intermediate',
      level: 'Intermediate',
      levelKey: 'intermediate',
      title: {
        en: 'Chemical Reactions & Stoichiometry',
        hi: 'रासायनिक प्रतिक्रियाएं और स्टोइकोमेट्री'
      },
      notes: {
        en: 'A **chemical reaction** rearranges atoms to convert reactants into products. According to the Law of Conservation of Mass, reactions must be balanced so that the same number of atoms of each element exist on both sides of the equation.\n\n**Stoichiometry** is the calculation of quantitative relationships of elements and compounds in reactions. The **Mole** ($6.022 \times 10^{23}$ particles) is the standard unit of measurement for amount of substance.',
        hi: 'एक **रासायनिक प्रतिक्रिया (chemical reaction)** अभिकारकों (reactants) को उत्पादों में बदलने के लिए परमाणुओं को पुनर्व्यवस्थित करती है। द्रव्यमान संरक्षण के नियम के अनुसार, प्रतिक्रियाओं को संतुलित होना चाहिए ताकि समीकरण के दोनों पक्षों में प्रत्येक तत्व के परमाणुओं की समान संख्या मौजूद हो।\n\n**स्टोइकोमेट्री (Stoichiometry)** प्रतिक्रियाओं में तत्वों और यौगिकों के मात्रात्मक संबंधों की गणना है। **मोल (Mole)** ($6.022 \\times 10^{23}$ कण) पदार्थ की मात्रा के मापन की मानक इकाई है।'
      },
      quiz: [
        {
          question: {
            en: 'What constant represents the number of particles in a mole?',
            hi: 'कौन सा स्थिरांक एक मोल में कणों की संख्या का प्रतिनिधित्व करता है?'
          },
          options: {
            en: ["Planck's constant", "Avogadro's number", "Newton's constant", "Boltzmann's constant"],
            hi: ["प्लांक स्थिरांक", "एवोगैड्रो की संख्या (Avogadro's number)", "न्यूटन स्थिरांक", "बोल्ट्जमैन स्थिरांक"]
          },
          answer: 1
        },
        {
          question: {
            en: 'Why must chemical equations be balanced?',
            hi: 'रासायनिक समीकरणों को संतुलित क्यों किया जाना चाहिए?'
          },
          options: {
            en: ['To satisfy the Law of Conservation of Mass', 'To change reactant colors', 'To heat up the reaction flask', 'To speed up electron movement'],
            hi: ['द्रव्यमान संरक्षण के नियम को पूरा करने के लिए', 'अभिकारक रंगों को बदलने के लिए', 'प्रतिक्रिया फ्लास्क को गर्म करने के लिए', 'इलेक्ट्रॉन आंदोलन को गति देने के लिए']
          },
          answer: 0
        },
        {
          question: {
            en: 'What are the starting substances in a chemical reaction called?',
            hi: 'रासायनिक प्रतिक्रिया में शुरूआती पदार्थों को क्या कहा जाता है?'
          },
          options: {
            en: ['Products', 'Reactants', 'Catalysts', 'Solutes'],
            hi: ['उत्पाद (Products)', 'अभिकारक (Reactants)', 'उत्प्रेरक', 'विलेय']
          },
          answer: 1
        }
      ]
    },
    {
      id: 'chemistry-advanced',
      level: 'Advanced',
      levelKey: 'advanced',
      title: {
        en: 'Chemical Equilibrium & Thermodynamics',
        hi: 'रासायनिक संतुलन और ऊष्मागतिकी'
      },
      notes: {
        en: 'Chemical reactions are often reversible. **Equilibrium** is reached when the rate of the forward reaction equals the rate of the reverse reaction.\n\n- **Le Chatelier\'s Principle**: If a dynamic equilibrium is disturbed, the position of equilibrium shifts to counteract the change (e.g. pressure, temperature, or concentration).\n- **Gibbs Free Energy ($G$)**: Predicts reaction spontaneity. \n  - $\\Delta G < 0$: Spontaneous reaction.\n  - $\\Delta G > 0$: Non-spontaneous reaction.\n  - $\\Delta G = 0$: System is at equilibrium.',
        hi: 'रासायनिक प्रतिक्रियाएं अक्सर प्रतिवर्ती (reversible) होती हैं। **संतुलन (Equilibrium)** तब प्राप्त होता है जब अग्रगामी प्रतिक्रिया की दर विपरीत प्रतिक्रिया की दर के बराबर होती है।\n\n- **ले शातेलिए का सिद्धांत (Le Chatelier\'s Principle)**: यदि एक गतिशील संतुलन बाधित होता है, तो संतुलन की स्थिति परिवर्तन (जैसे दबाव, तापमान, या एकाग्रता) का मुकाबला करने के लिए स्थानांतरित हो जाती है।\n- **गिब्स मुक्त ऊर्जा ($G$)**: प्रतिक्रिया सहजता (spontaneity) की भविष्यवाणी करती है।\n  - $\\Delta G < 0$: सहज प्रतिक्रिया (Spontaneous)।\n  - $\\Delta G > 0$: गैर-सहज प्रतिक्रिया।\n  - $\\Delta G = 0$: सिस्टम संतुलन पर है।'
      },
      quiz: [
        {
          question: {
            en: 'What indicates a spontaneous reaction at constant temperature and pressure?',
            hi: 'स्थिर तापमान और दबाव पर एक सहज (spontaneous) प्रतिक्रिया क्या दर्शाती है?'
          },
          options: {
            en: ['Positive change in enthalpy', 'Gibbs Free Energy change is negative (delta G < 0)', 'Gibbs Free Energy change is positive', 'Entropy equals 0'],
            hi: ['एन्थैल्पी में सकारात्मक बदलाव', 'गिब्स मुक्त ऊर्जा परिवर्तन नकारात्मक है (delta G < 0)', 'गिब्स मुक्त ऊर्जा परिवर्तन सकारात्मक है', 'एन्ट्रॉपी 0 के बराबर है']
          },
          answer: 1
        },
        {
          question: {
            en: "What does Le Chatelier's Principle state?",
            hi: "ले शातेलिए का सिद्धांत (Le Chatelier's Principle) क्या कहता है?"
          },
          options: {
            en: ['Mass is always conserved', 'Equilibrium shifts to counteract disturbances', 'All reactions are irreversible', 'Entropy of the universe decreases'],
            hi: ['द्रव्यमान हमेशा संरक्षित रहता है', 'अशांति का मुकाबला करने के लिए संतुलन बदल जाता है', 'सभी प्रतिक्रियाएं अपरिवर्तनीय हैं', 'ब्रह्मांड की एन्ट्रॉपी घटती है']
          },
          answer: 1
        },
        {
          question: {
            en: 'When is dynamic chemical equilibrium reached?',
            hi: 'गतिशील रासायनिक संतुलन कब प्राप्त होता है?'
          },
          options: {
            en: ['When all reactants are completely consumed', 'When the rates of forward and reverse reactions are equal', 'When the container temperature drops to zero', 'When the catalyst is removed'],
            hi: ['जब सभी अभिकारक पूरी तरह से उपभोग किए जाते हैं', 'जब अग्र और विपरीत प्रतिक्रियाओं की दरें बराबर होती हैं', 'जब कंटेनर का तापमान शून्य हो जाता है', 'जब उत्प्रेरक हटा दिया जाता है']
          },
          answer: 1
        }
      ]
    }
  ],
  'biology': [
    {
      id: 'biology-basic',
      level: 'Basic',
      levelKey: 'basic',
      title: {
        en: 'The Cell: Structure & Organelles',
        hi: 'कोशिका: संरचना और कोशिकांग'
      },
      notes: {
        en: 'The cell is the basic structural, functional, and biological unit of all living organisms. Cells are divided into **Prokaryotic** (lacking a nucleus) and **Eukaryotic** (containing a membrane-bound nucleus). Eukaryotic cells contain specialized structures called **organelles**:\n- **Nucleus**: Holds the genetic material (DNA).\n- **Mitochondria**: The powerhouse of the cell, generating energy (ATP).\n- **Ribosomes**: Sites of protein synthesis.\n- **Cell Membrane**: Controls movement of substances in and out of the cell.',
        hi: 'कोशिका सभी जीवित जीवों की बुनियादी संरचनात्मक, कार्यात्मक और जैविक इकाई है। कोशिकाओं को **प्रोकैरियोटिक** (नाभिक रहित) और **यूकेरियोटिक** (झिल्ली-बाध्य नाभिक वाले) में विभाजित किया गया है। यूकेरियोटिक कोशिकाओं में **कोशिकांग (organelles)** नामक विशेष संरचनाएं होती हैं:\n- **नाभिक (Nucleus)**: आनुवंशिक सामग्री (DNA) रखता है।\n- **माइटोकॉन्ड्रिया (Mitochondria)**: कोशिका का पावरहाउस, ऊर्जा (ATP) उत्पन्न करता है।\n- **राइबोसोम (Ribosomes)**: प्रोटीन संश्लेषण के स्थान।\n- **कोशिका झिल्ली (Cell Membrane)**: कोशिका के अंदर और बाहर पदार्थों की आवाजाही को नियंत्रित करती है।'
      },
      quiz: [
        {
          question: {
            en: 'Which organelle is known as the powerhouse of the cell?',
            hi: 'किस कोशिकांग को कोशिका का पावरहाउस कहा जाता है?'
          },
          options: {
            en: ['Nucleus', 'Mitochondria', 'Ribosome', 'Lysosome'],
            hi: ['नाभिक', 'माइटोकॉन्ड्रिया (Mitochondria)', 'राइबोसोम', 'लाइसोसोम']
          },
          answer: 1
        },
        {
          question: {
            en: 'What is the main difference between prokaryotic and eukaryotic cells?',
            hi: 'प्रोकैरियोटिक और यूकेरियोटिक कोशिकाओं में मुख्य अंतर क्या है?'
          },
          options: {
            en: ['Eukaryotic cells have a membrane-bound nucleus', 'Prokaryotic cells are larger', 'Eukaryotic cells have no DNA', 'Prokaryotic cells have mitochondria'],
            hi: ['यूकेरियोटिक कोशिकाओं में एक झिल्ली-बाध्य नाभिक होता है', 'प्रोकैरियोटिक कोशिकाएं बड़ी होती हैं', 'यूकेरियोटिक कोशिकाओं में कोई DNA नहीं होता', 'प्रोकैरियोटिक कोशिकाओं में माइटोकॉन्ड्रिया होते हैं']
          },
          answer: 0
        },
        {
          question: {
            en: 'Where are proteins synthesized in the cell?',
            hi: 'कोशिका में प्रोटीन कहाँ संश्लेषित होते हैं?'
          },
          options: {
            en: ['Nucleus', 'Mitochondria', 'Ribosomes', 'Vacuole'],
            hi: ['नाभिक', 'माइटोकॉन्ड्रिया', 'राइबोसोम (Ribosomes)', 'रिक्तिका']
          },
          answer: 2
        }
      ]
    },
    {
      id: 'biology-intermediate',
      level: 'Intermediate',
      levelKey: 'intermediate',
      title: {
        en: 'DNA Structure & Replication Flow',
        hi: 'डीएनए संरचना और प्रतिकृति प्रवाह'
      },
      notes: {
        en: '**DNA** (Deoxyribonucleic Acid) carries genetic instructions. Structurally, it is a double helix composed of nucleotides. Each nucleotide contains a sugar, phosphate group, and nitrogenous base. The bases pair complementarily:\n- **Adenine (A)** pairs with **Thymine (T)**.\n- **Cytosine (C)** pairs with **Guanine (G)**.\n\n**DNA Replication** is semi-conservative. The double helix unwinds (via DNA Helicase), and each strand serves as a template for synthesizing a new complementary strand (catalyzed by DNA Polymerase).',
        hi: '**DNA** (डीऑक्सीराइबोन्यूक्लिक एसिड) आनुवंशिक निर्देश ले जाता है। संरचनात्मक रूप से, यह न्यूक्लियोटाइड से बना एक डबल हेलिक्स है। प्रत्येक न्यूक्लियोटाइड में एक चीनी, फॉस्फेट समूह और नाइट्रोजनस बेस होता है। आधार पूरक रूप से मेल खाते हैं:\n- **एडेनिन (A)** का मेल **थायमिन (T)** के साथ होता है।\n- **साइटोसिन (C)** का मेल **गुआनिन (G)** के साथ होता है।\n\n**DNA प्रतिकृति (DNA Replication)** अर्ध-रूढ़िवादी (semi-conservative) है। डबल हेलिक्स खुलता है (DNA हेलिकेस के माध्यम से), और प्रत्येक स्ट्रैंड एक नया पूरक स्ट्रैंड (DNA पोलीमरेज़ द्वारा उत्प्रेरित) को संश्लेषित करने के लिए एक टेम्पलेट के रूप में कार्य करता है।'
      },
      quiz: [
        {
          question: {
            en: 'Which nitrogenous base pairs with Adenine in DNA?',
            hi: 'DNA में एडेनिन (Adenine) के साथ कौन सा नाइट्रोजनस बेस जुड़ता है?'
          },
          options: {
            en: ['Cytosine', 'Guanine', 'Thymine', 'Uracil'],
            hi: ['साइटोसिन', 'गुआनिन', 'थायमिन (Thymine)', 'यूरैसिल']
          },
          answer: 2
        },
        {
          question: {
            en: 'What enzyme is responsible for unwinding the DNA double helix during replication?',
            hi: 'प्रतिकृति के दौरान DNA डबल हेलिक्स को खोलने के लिए कौन सा एंजाइम जिम्मेदार है?'
          },
          options: {
            en: ['DNA Polymerase', 'DNA Helicase', 'RNA Primase', 'Ligase'],
            hi: ['DNA पोलीमरेज़', 'DNA हेलिकेस (DNA Helicase)', 'RNA प्राइमेज़', 'लाइगेज']
          },
          answer: 1
        },
        {
          question: {
            en: 'Why is DNA replication called semi-conservative?',
            hi: 'DNA प्रतिकृति को अर्ध-रूढ़िवादी (semi-conservative) क्यों कहा जाता है?'
          },
          options: {
            en: ['It only copies half of the genes', 'Each new DNA molecule contains one original parent strand and one newly synthesized strand', 'It encrypts the genetic codes', 'It destroys old cells'],
            hi: ['यह केवल आधे जीनों की नकल करता है', 'प्रत्येक नए DNA अणु में एक मूल मूल स्ट्रैंड और एक नया संश्लेषित स्ट्रैंड होता है', 'यह आनुवंशिक कोडों को एन्क्रिप्ट करता है', 'यह पुरानी कोशिकाओं को नष्ट कर देता है']
          },
          answer: 1
        }
      ]
    },
    {
      id: 'biology-advanced',
      level: 'Advanced',
      levelKey: 'advanced',
      title: {
        en: 'Genetics & Mendelian Inheritance',
        hi: 'आनुवंशिकी और मेंडेलियन वंशानुक्रम'
      },
      notes: {
        en: 'Genetics studies heredity. Gregor Mendel discovered the laws of inheritance through pea plants:\n\n1. **Law of Segregation**: Alleles separate during gamete formation; offspring inherit one allele from each parent.\n2. **Law of Independent Assortment**: Genes for different traits segregate independently.\n\nAlleles can be **dominant** (masks other alleles) or **recessive** (expressed only when homozygous). A **Punnett Square** helps predict genotype and phenotype probabilities in cross-breeding.',
        hi: 'आनुवंशिकी वंशानुक्रम (heredity) का अध्ययन करती है। ग्रेगर मेंडल ने मटर के पौधों के माध्यम से वंशानुक्रम के नियमों की खोज की:\n\n1. **पृथक्करण का नियम**: युग्मक (gamete) निर्माण के दौरान एलील अलग हो जाते हैं; संतान को प्रत्येक माता-पिता से एक एलील विरासत में मिलता है।\n2. **स्वतंत्र वर्गीकरण का नियम**: विभिन्न लक्षणों के जीन स्वतंत्र रूप से अलग होते हैं।\n\nएलील **प्रभावी (dominant)** (अन्य एलील को छुपाता है) या **अप्रभावी (recessive)** (केवल समरूप होने पर व्यक्त) हो सकते हैं। एक **पुनेट स्क्वायर (Punnett Square)** क्रॉस-ब्रीडिंग में जीनोटाइप और फेनोटाइप संभावनाओं की भविष्यवाणी करने में मदद करता है।'
      },
      quiz: [
        {
          question: {
            en: 'Who is known as the father of modern genetics?',
            hi: 'आधुनिक आनुवंशिकी के जनक के रूप में किसे जाना जाता है?'
          },
          options: {
            en: ['Charles Darwin', 'Gregor Mendel', 'Louis Pasteur', 'Alexander Fleming'],
            hi: ['चार्ल्स डार्विन', 'ग्रेगर मेंडल (Gregor Mendel)', 'लुई पाश्चर', 'अलेक्जेंडर फ्लेमिंग']
          },
          answer: 1
        },
        {
          question: {
            en: 'When is a recessive allele expressed in an organism?',
            hi: 'एक जीव में एक अप्रभावी (recessive) एलील कब व्यक्त होता है?'
          },
          options: {
            en: ['Always', 'Only when the organism is homozygous for that trait (two copies of the recessive allele)', 'Only when paired with a dominant allele', 'Never'],
            hi: ['हमेशा', 'केवल तभी जब जीव उस लक्षण के लिए समरूप (homozygous) हो (अप्रभावी एलील की दो प्रतियां)', 'केवल जब एक प्रभावी एलील के साथ जोड़ा जाता है', 'कभी नहीं']
          },
          answer: 1
        },
        {
          question: {
            en: 'What tool is used to predict the genotype probabilities of genetic crosses?',
            hi: 'आनुवंशिक क्रॉस की जीनोटाइप संभावनाओं की भविष्यवाणी करने के लिए किस उपकरण का उपयोग किया जाता है?'
          },
          options: {
            en: ['Pedigree chart', 'Punnett Square', 'Karyotype map', 'Codon wheel'],
            hi: ['पेडिग्री चार्ट', 'पुनेट स्क्वायर (Punnett Square)', 'कैरियोटाइप मैप', 'कोडन व्हील']
          },
          answer: 1
        }
      ]
    }
  ],
  'game_dev': [
    {
      id: 'game_dev-basic',
      level: 'Basic',
      levelKey: 'basic',
      title: {
        en: 'Game Architecture & Loops',
        hi: 'गेम आर्किटेक्चर और गेम लूप'
      },
      notes: {
        en: 'At the heart of every game engine (like Unity or Unreal) is the **Game Loop**. The game loop runs continuously while the game is running, executing three primary phases:\n\n1. **Process Input**: Captures keypresses, mouse movement, or controller sticks.\n2. **Update State**: Calculates physics, movement, AI logic, and collision detections.\n3. **Render Graphics**: Draws the objects on screen at a target frame rate (e.g. 60 FPS).',
        hi: 'प्रत्येक गेम इंजन (जैसे यूनिटी या अनरियल) के केंद्र में **गेम लूप (Game Loop)** होता है। गेम लूप तब तक लगातार चलता है जब तक गेम चल रहा होता है, तीन प्राथमिक चरणों को निष्पादित करता है:\n\n1. **प्रक्रिया इनपुट (Process Input)**: कीप्रेस, माउस मूवमेंट या कंट्रोलर इनपुट कैप्चर करता है।\n2. **अपडेट स्थिति (Update State)**: भौतिकी, आंदोलन, AI तर्क और टकराव की गणना करता है।\n3. **रेंडर ग्राफ़िक्स (Render Graphics)**: लक्षित फ्रेम दर (जैसे 60 FPS) पर स्क्रीन पर ऑब्जेक्ट बनाता है।'
      },
      quiz: [
        {
          question: {
            en: 'What are the three main steps executed continuously in a Game Loop?',
            hi: 'गेम लूप में लगातार निष्पादित होने वाले तीन मुख्य चरण कौन से हैं?'
          },
          options: {
            en: ['Launch, Play, Quit', 'Input, Update, Render', 'Compile, Build, Test', 'Model, Texture, Animate'],
            hi: ['लॉन्च, प्ले, क्विट', 'इनपुट, अपडेट, रेंडर (Input, Update, Render)', 'कंपाइल, बिल्ड, टेस्ट', 'मॉडल, टेक्सचर, एनिमेट']
          },
          answer: 1
        },
        {
          question: {
            en: 'What is FPS stand for in gaming?',
            hi: 'गेमिंग में FPS का क्या अर्थ है?'
          },
          options: {
            en: ['File Processing Speed', 'Frames Per Second', 'Function Point Scale', 'First Person Shooter'],
            hi: ['फाइल प्रोसेसिंग स्पीड', 'फ्रेम्स प्रति सेकंड (Frames Per Second)', 'फंक्शन पॉइंट स्केल', 'फर्स्ट पर्सन शूटर']
          },
          answer: 1
        },
        {
          question: {
            en: 'Which component is responsible for gathering mouse clicks inside a game loop?',
            hi: 'गेम लूप के भीतर माउस क्लिक एकत्र करने के लिए कौन सा घटक जिम्मेदार है?'
          },
          options: {
            en: ['Physics solver', 'Input handler', 'GPU renderer', 'Asset manager'],
            hi: ['भौतिकी सॉल्वर', 'इनपुट हैंडलर (Input handler)', 'GPU रेंडरर', 'एसेट मैनेजर']
          },
          answer: 1
        }
      ]
    },
    {
      id: 'game_dev-intermediate',
      level: 'Intermediate',
      levelKey: 'intermediate',
      title: {
        en: 'C# Scripting & Unity Physics Engine',
        hi: 'C# स्क्रिप्टिंग और यूनिटी फिजिक्स इंजन'
      },
      notes: {
        en: 'In Unity game development, scripts are written in C# and inherit from `MonoBehaviour`.\n\n- **Rigidbody**: A component that subjects a GameObject to physics, calculating gravity, drag, and forces.\n- **Colliders**: Define the physical shape of a GameObject for collision detection. Checking "Is Trigger" disables physical reactions, letting you detect overlap (via `OnTriggerEnter`).\n- **Update()** runs once per frame (varying), whereas **FixedUpdate()** runs on a constant timer, making it the correct place for physics calculations.',
        hi: 'यूनिटी गेम डेवलपमेंट में, स्क्रिप्ट्स C# में लिखी जाती हैं और `MonoBehaviour` से विरासत में मिलती हैं।\n\n- **रिजिडबॉडी (Rigidbody)**: एक घटक जो गेमऑब्जेक्ट पर भौतिकी लागू करता है, गुरुत्वाकर्षण, ड्रैग और बलों की गणना करता है।\n- **कोलाइडर्स (Colliders)**: टकराव का पता लगाने के लिए गेमऑब्जेक्ट का भौतिक आकार परिभाषित करते हैं। "Is Trigger" को सक्षम करने से शारीरिक प्रतिक्रियाएं अक्षम हो जाती हैं, जिससे आप ओवरलैप का पता लगा सकते हैं (`OnTriggerEnter` के माध्यम से)।\n- **Update()** प्रति फ्रेम एक बार चलता है (परिवर्तनीय), जबकि **FixedUpdate()** एक स्थिर टाइमर पर चलता है, जो भौतिकी गणनाओं के लिए सही स्थान है।'
      },
      quiz: [
        {
          question: {
            en: 'Which script function should be used for physical forces computations in Unity?',
            hi: 'यूनिटी में भौतिक बलों की गणना के लिए किस स्क्रिप्ट फ़ंक्शन का उपयोग किया जाना चाहिए?'
          },
          options: {
            en: ['Update()', 'FixedUpdate()', 'Start()', 'Awake()'],
            hi: ['Update()', 'FixedUpdate()', 'Start()', 'Awake()']
          },
          answer: 1
        },
        {
          question: {
            en: 'What component must be attached to a GameObject to allow gravity to act on it?',
            hi: 'गुरुत्वाकर्षण को कार्य करने की अनुमति देने के लिए गेमऑब्जेक्ट से कौन सा घटक जुड़ा होना चाहिए?'
          },
          options: {
            en: ['Mesh Renderer', 'Rigidbody', 'NavMeshAgent', 'Audio Source'],
            hi: ['मेष रेंडरर', 'रिजिडबॉडी (Rigidbody)', 'NavMeshAgent', 'ऑडियो स्रोत']
          },
          answer: 1
        },
        {
          question: {
            en: 'What occurs when "Is Trigger" is enabled on a Collider?',
            hi: 'जब कोलाइडर पर "Is Trigger" सक्षम होता है तो क्या होता है?'
          },
          options: {
            en: ['It bounces with infinite force', 'It passes through other colliders without physical collision but triggers events', 'It becomes invisible', 'It deletes the object'],
            hi: ['यह अनंत बल के साथ उछलता है', 'यह शारीरिक टकराव के बिना अन्य कोलाइडर्स से गुजरता है लेकिन घटनाओं को ट्रिगर करता है', 'यह अदृश्य हो जाता है', 'यह ऑब्जेक्ट को हटा देता है']
          },
          answer: 1
        }
      ]
    },
    {
      id: 'game_dev-advanced',
      level: 'Advanced',
      levelKey: 'advanced',
      title: {
        en: 'Pathfinding, Navigation & AI',
        hi: 'पाथफाइंडिंग, नेविगेशन और एआई'
      },
      notes: {
        en: 'Game AI often involves navigating agents through game worlds. The standard pathfinding algorithm is **A* (A-Star)**, which calculates the shortest distance between two points by evaluating costs: $f(n) = g(n) + h(n)$ (where $g$ is actual distance and $h$ is heuristic guess).\n\nUnity uses **NavMesh** (Navigation Mesh), a simplified surface mapped over static geometry. A **NavMeshAgent** component is attached to NPCs, automatically computing paths and avoiding obstacles within the NavMesh.',
        hi: 'गेम AI में अक्सर एजेंटों को गेम की दुनिया में नेविगेट करना शामिल होता है। मानक पाथफाइंडिंग एल्गोरिदम **A* (A-Star)** है, जो लागतों का मूल्यांकन करके दो बिंदुओं के बीच सबसे कम दूरी की गणना करता है: $f(n) = g(n) + h(n)$ (जहां $g$ वास्तविक दूरी है और $h$ अनुमानित दूरी है)।\n\nयूनिटी **NavMesh (Navigation Mesh)** का उपयोग करती है, जो स्थिर ज्यामिति पर मैप की गई एक सरल सतह है। एक **NavMeshAgent** घटक NPC से जुड़ा होता है, जो स्वचालित रूप से पथों की गणना करता है और नवमेश के भीतर बाधाओं से बचता है।'
      },
      quiz: [
        {
          question: {
            en: 'What pathfinding algorithm is most commonly used in video games to move agents?',
            hi: 'एजेंटों को स्थानांतरित करने के लिए वीडियो गेम में कौन सा पाथफाइंडिंग एल्गोरिदम सबसे अधिक उपयोग किया जाता है?'
          },
          options: {
            en: ['Bubble Sort', 'A* (A-Star) Algorithm', 'Binary Search Tree', 'Quick Selection'],
            hi: ['बबल सॉर्ट', 'A* (A-Star) एल्गोरिदम', 'बाइनरी सर्च ट्री', 'क्विक सिलेक्शन']
          },
          answer: 1
        },
        {
          question: {
            en: 'In Unity NavMesh, what represents the walkable surface area?',
            hi: 'यूनिटी नवमेश (NavMesh) में, चलने योग्य सतह क्षेत्र का प्रतिनिधित्व कौन करता है?'
          },
          options: {
            en: ['Audio Source', 'NavMesh geometry baking', 'Mesh filter', 'Canvas overlays'],
            hi: ['ऑडियो स्रोत', 'NavMesh ज्यामिति बेकिंग', 'मेष फ़िल्टर', 'कैनवास ओवरले']
          },
          answer: 1
        },
        {
          question: {
            en: 'What component allows an NPC to automatically move along a NavMesh?',
            hi: 'कौन सा घटक NPC को NavMesh के साथ स्वचालित रूप से स्थानांतरित होने की अनुमति देता है?'
          },
          options: {
            en: ['Rigidbody2D', 'NavMeshAgent', 'BoxCollider', 'Sprite Renderer'],
            hi: ['Rigidbody2D', 'NavMeshAgent', 'BoxCollider', 'स्प्राइट रेंडरर']
          },
          answer: 1
        }
      ]
    }
  ],
  'cybersecurity': [
    {
      id: 'cybersecurity-basic',
      level: 'Basic',
      levelKey: 'basic',
      title: {
        en: 'Introduction to Cyber Threats & Malware',
        hi: 'साइबर खतरों और मैलवेयर का परिचय'
      },
      notes: {
        en: 'Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. Common security threats include:\n- **Malware**: Malicious software (e.g. Viruses, Trojans, Ransomware) designed to disrupt or exploit devices.\n- **Phishing**: Fraudulent emails designed to trick users into sharing sensitive passwords or bank details.\n- **Firewalls**: Network security devices that monitor incoming and outgoing traffic, blocking unauthorized access based on defined rules.',
        hi: 'साइबर सुरक्षा डिजिटल हमलों से प्रणालियों, नेटवर्क और कार्यक्रमों की रक्षा करने का अभ्यास है। सामान्य सुरक्षा खतरों में शामिल हैं:\n- **मैलवेयर (Malware)**: दुर्भावनापूर्ण सॉफ़्टवेयर (जैसे वायरस, ट्रोजन, रैंसमवेयर) जिन्हें उपकरणों को बाधित करने या उनका शोषण करने के लिए डिज़ाइन किया गया है।\n- **फ़िशिंग (Phishing)**: धोखाधड़ी वाले ईमेल जो उपयोगकर्ताओं को संवेदनशील पासवर्ड या बैंक विवरण साझा करने के लिए धोखा देने के लिए डिज़ाइन किए गए हैं।\n- **फ़ायरवॉल (Firewalls)**: नेटवर्क सुरक्षा उपकरण जो आने वाले और बाहर जाने वाले ट्रैफ़िक की निगरानी करते हैं, परिभाषित नियमों के आधार पर अनधिकृत पहुंच को अवरुद्ध करते हैं।'
      },
      quiz: [
        {
          question: {
            en: 'What type of malicious software encrypts user files and demands payment for decryption keys?',
            hi: 'किस प्रकार का दुर्भावनापूर्ण सॉफ़्टवेयर उपयोगकर्ता फ़ाइलों को एन्क्रिप्ट करता है और डिक्रिप्शन कुंजियों के लिए भुगतान की मांग करता है?'
          },
          options: {
            en: ['Spyware', 'Ransomware', 'Adware', 'Phishing email'],
            hi: ['स्पाइवेयर', 'रैंसमवेयर (Ransomware)', 'एडवेयर', 'फ़िशिंग ईमेल']
          },
          answer: 1
        },
        {
          question: {
            en: 'What technique uses fraudulent emails resembling trusted companies to steal login credentials?',
            hi: 'लॉगिन क्रेडेंशियल चुराने के लिए विश्वसनीय कंपनियों के समान धोखाधड़ी वाले ईमेल का उपयोग करने वाली तकनीक क्या है?'
          },
          options: {
            en: ['SQL Injection', 'Phishing', 'Man-in-the-Middle', 'Brute Force'],
            hi: ['SQL इंजेक्शन', 'फ़िशिंग (Phishing)', 'मैन-इन-द-मिडिल', 'ब्रूट फ़ोर्स']
          },
          answer: 1
        },
        {
          question: {
            en: 'What is a firewall in cybersecurity?',
            hi: 'साइबर सुरक्षा में फ़ायरवॉल (firewall) क्या है?'
          },
          options: {
            en: ['A physical wall protecting server hardware from fire', 'A security system monitoring and filtering network traffic', 'A code compiler script', 'An email spam folder'],
            hi: ['सर्वर हार्डवेयर को आग से बचाने वाली एक भौतिक दीवार', 'नेटवर्क ट्रैफ़िक की निगरानी और फ़िल्टरिंग करने वाली एक सुरक्षा प्रणाली', 'एक कोड कंपाइलर स्क्रिप्ट', 'एक ईमेल स्पैम फ़ोल्डर']
          },
          answer: 1
        }
      ]
    },
    {
      id: 'cybersecurity-intermediate',
      level: 'Intermediate',
      levelKey: 'intermediate',
      title: {
        en: 'Cryptography: Symmetric vs Asymmetric Keys',
        hi: 'क्रिप्टोग्राफी: सममित बनाम असममित कुंजियाँ'
      },
      notes: {
        en: 'Cryptography secures communication by converting plaintext into ciphertext. Two main types of encryption are:\n\n1. **Symmetric Encryption**: Uses a single secret key for both encryption and decryption (e.g. AES). It is fast but requires sharing the key securely.\n2. **Asymmetric Encryption**: Uses a key pair: a **Public Key** (available to anyone to encrypt data) and a **Private Key** (kept secret by the recipient to decrypt data). E.g. RSA.\n- **Hashing**: A one-way function converting data into a fixed-length string (cannot be decrypted, e.g. SHA-256).',
        hi: 'क्रिप्टोग्राफी प्लेनटेक्स्ट को सिफरटेक्स्ट में परिवर्तित करके संचार को सुरक्षित करती है। एन्क्रिप्शन के दो मुख्य प्रकार हैं:\n\n1. **सममित एन्क्रिप्शन (Symmetric Encryption)**: एन्क्रिप्शन और डिक्रिप्शन दोनों के लिए एक एकल गुप्त कुंजी का उपयोग करता है (जैसे AES)। यह तेज़ है लेकिन कुंजी को सुरक्षित रूप से साझा करने की आवश्यकता होती है।\n2. **असममित एन्क्रिप्शन (Asymmetric Encryption)**: एक कुंजी जोड़ी का उपयोग करता है: एक **सार्वजनिक कुंजी (Public Key)** (डेटा एन्क्रिप्ट करने के लिए किसी के लिए भी उपलब्ध) और एक **निजी कुंजी (Private Key)** (डेटा डिक्रिप्ट करने के लिए प्राप्तकर्ता द्वारा गुप्त रखी जाती है)। जैसे RSA।\n- **हैशिंग (Hashing)**: एकतरफा फ़ंक्शन जो डेटा को एक निश्चित लंबाई वाले स्ट्रिंग में परिवर्तित करता है (डिक्रिप्ट नहीं किया जा सकता, जैसे SHA-256)।'
      },
      quiz: [
        {
          question: {
            en: 'Which encryption method uses two separate keys (public and private)?',
            hi: 'कौन सी एन्क्रिप्शन विधि दो अलग-अलग कुंजियों (सार्वजनिक और निजी) का उपयोग करती है?'
          },
          options: {
            en: ['Symmetric Encryption', 'Asymmetric Encryption', 'Rot13 substitution', 'Plain text logging'],
            hi: ['सममित एन्क्रिप्शन', 'असममित एन्क्रिप्शन (Asymmetric Encryption)', 'Rot13 प्रतिस्थापन', 'सादा पाठ लॉगिंग']
          },
          answer: 1
        },
        {
          question: {
            en: 'Can a SHA-256 hash value be decrypted back into its original text?',
            hi: 'क्या एक SHA-256 हैश मान को उसके मूल पाठ में वापस डिक्रिप्ट किया जा सकता है?'
          },
          options: {
            en: ['Yes, using the public key', 'No, hashing is a one-way mathematical function', 'Yes, using AES standards', 'Only inside local databases'],
            hi: ['हाँ, सार्वजनिक कुंजी का उपयोग करके', 'नहीं, हैशिंग एकतरफा गणितीय फ़ंक्शन है', 'हाँ, AES मानकों का उपयोग करके', 'केवल स्थानीय डेटाबेस के अंदर']
          },
          answer: 1
        },
        {
          question: {
            en: 'Which key is used to decrypt data in Asymmetric Cryptography?',
            hi: 'असममित क्रिप्टोग्राफी में डेटा डिक्रिप्ट करने के लिए किस कुंजी का उपयोग किया जाता है?'
          },
          options: {
            en: ['Public key', 'Private key', 'Symmetric shared key', 'Master license key'],
            hi: ['सार्वजनिक कुंजी', 'निजी कुंजी (Private key)', 'सममित साझा कुंजी', 'मास्टर लाइसेंस कुंजी']
          },
          answer: 1
        }
      ]
    },
    {
      id: 'cybersecurity-advanced',
      level: 'Advanced',
      levelKey: 'advanced',
      title: {
        en: 'Network Penetration & Web Vulnerabilities',
        hi: 'नेटवर्क पेनेट्रेशन और वेब कमजोरियां'
      },
      notes: {
        en: 'Penetration testing simulates attacks to identify security flaws. Web applications are vulnerable to standard exploits classified by OWASP:\n\n- **SQL Injection (SQLi)**: Injecting malicious SQL statements into input fields, allowing unauthorized access to databases.\n- **Cross-Site Scripting (XSS)**: Injecting malicious scripts (JavaScript) into web pages viewed by other users.\n- **Mitigation**: Sanitizing input fields, using prepared database statements, and implementing HTTPS certificate encryptions.',
        hi: 'पेनेट्रेशन परीक्षण सुरक्षा खामियों की पहचान करने के लिए हमलों का अनुकरण करता है। वेब एप्लिकेशन OWASP द्वारा वर्गीकृत मानक कारनामों के प्रति संवेदनशील हैं:\n\n- **SQL इंजेक्शन (SQLi)**: इनपुट फ़ील्ड में दुर्भावनापूर्ण SQL कथनों को इंजेक्ट करना, जिससे डेटाबेस तक अनधिकृत पहुंच की अनुमति मिलती है।\n- **क्रॉस-साइट स्क्रिप्टिंग (XSS)**: अन्य उपयोगकर्ताओं द्वारा देखे जाने वाले वेब पेजों में दुर्भावनापूर्ण स्क्रिप्ट (जावास्क्रिप्ट) इंजेक्ट करना।\n- **शमन (Mitigation)**: इनपुट फ़ील्ड को साफ (sanitize) करना, तैयार डेटाबेस कथनों का उपयोग करना और HTTPS प्रमाणपत्र एन्क्रिप्शन लागू करना।'
      },
      quiz: [
        {
          question: {
            en: 'What vulnerability allows attackers to run custom JavaScript on other users browsers?',
            hi: 'कौन सी भेद्यता हमलावरों को अन्य उपयोगकर्ताओं के ब्राउज़र पर कस्टम जावास्क्रिप्ट चलाने की अनुमति देती है?'
          },
          options: {
            en: ['SQL Injection', 'Cross-Site Scripting (XSS)', 'Phishing email redirection', 'Buffer Overflow'],
            hi: ['SQL इंजेक्शन', 'क्रॉस-साइट स्क्रिप्टिंग (XSS)', 'फ़िशिंग ईमेल रीडायरेक्शन', 'बफ़र ओवरफ़्लो']
          },
          answer: 1
        },
        {
          question: {
            en: 'How can developers prevent SQL Injection?',
            hi: 'डेवलपर्स SQL इंजेक्शन को कैसे रोक सकते हैं?'
          },
          options: {
            en: ['By writing longer SQL statements', 'By using parameterized inputs / prepared statements and sanitizing inputs', 'By deleting the database files', 'By using absolute CSS positioning'],
            hi: ['लंबे SQL स्टेटमेंट लिखकर', 'पैरामीटराइज्ड इनपुट / तैयार बयानों का उपयोग करके और इनपुट को साफ करके', 'डेटाबेस फ़ाइलों को हटाकर', 'पूर्ण CSS स्थिति का उपयोग करके']
          },
          answer: 1
        },
        {
          question: {
            en: 'What does SQL Injection target?',
            hi: 'SQL इंजेक्शन किसे लक्षित करता है?'
          },
          options: {
            en: ['Browser styles sheets', 'The application database', 'Network firewalls', 'User avatars'],
            hi: ['ब्राउज़र शैलियों शीट', 'एप्लिकेशन डेटाबेस (Application database)', 'नेटवर्क फ़ायरवॉल', 'उपयोगकर्ता अवतार']
          },
          answer: 1
        }
      ]
    }
  ]
};

export default function LessonsPage() {
  const router = useRouter();
  const { xp, setXP } = useStore();
  const { t, language, ready } = useAppTranslation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [userRole, setUserRole] = useState('Class 6-8 Student');

  // Modal / Active Lesson State
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeSubject, setActiveSubject] = useState<string>('');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizPassed, setQuizPassed] = useState<boolean | null>(null);

  const syncProfile = () => {
    if (typeof window === 'undefined') return;

    const storedName = localStorage.getItem('user_name');
    const loginStatus = localStorage.getItem('is_logged_in') === 'true';

    if (!loginStatus || !storedName) {
      setIsLoggedIn(false);
      return;
    }

    setIsLoggedIn(true);

    const usersRaw = localStorage.getItem('registered_users') || '[]';
    let users = [];
    try {
      users = JSON.parse(usersRaw);
    } catch (e) {
      users = [];
    }

    const user = users.find((u: any) => u && u.name === storedName);
    if (user) {
      setActiveUser(user);
      setSelectedSubjects(user.interests || []);
      setCompletedLessons(user.completedLessons || []);
      setUserRole(user.role || 'Class 6-8 Student');
      setUserRole(user.role || 'Class 6-8 Student');
      
    } else {
      // Fallback if user profile not found inside list
      const storedInterests = localStorage.getItem('user_interests');
      let interests = ['🌐 Web Development', '🤖 AI & Machine Learning'];
      if (storedInterests) {
        try {
          interests = JSON.parse(storedInterests);
        } catch (err) {}
      }
      setSelectedSubjects(interests);
      setCompletedLessons([]);
    }
  };

  useEffect(() => {
    syncProfile();
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-semibold text-sm">Loading Lessons...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-2xl flex items-center justify-center text-4xl mx-auto shadow-inner">
            🔒
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Access Restricted</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
              Please sign in or register an account to view your interactive lessons, track subject progress, and take quizzes.
            </p>
          </div>
          <button
            onClick={() => router.push('/auth')}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/10 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-98"
          >
            Go to Login / Signup
          </button>
        </div>
      </div>
    );
  }

  const getLevelGroup = () => {
  if (userRole.includes('Engineering')) return 'engineering';
  if (userRole.includes('11') || userRole.includes('12')) return 'class_11_12';
  if (userRole.includes('9') || userRole.includes('10')) return 'class_9_10';
  return 'class_6_8';
};

const getFilteredLessons = (subjectId: string) => {
  const levelGroup = getLevelGroup();
  const subjectData = LESSONS_DATABASE[subjectId];
  if (!subjectData) return [];
  const techSubjects = ['ai_ml', 'web_dev', 'programming', 'game_dev', 'cybersecurity', 'data_science'];
  const key = techSubjects.includes(subjectId) ? 'engineering' : levelGroup;
  return (subjectData as any)[key] || [];
};


const getUnlockState = (lessons: Lesson[]) => {
  const completedCount = lessons.filter(l => completedLessons.includes(l.id)).length;
  const unlockedUpTo = Math.min(completedCount + 2, lessons.length);
  return lessons.map((lesson, index) => ({
    lesson,
    isCompleted: completedLessons.includes(lesson.id),
    isUnlocked: index < unlockedUpTo,
  }));
};

const handleLessonStart = (lesson: Lesson, subject: string) => {
    setActiveLesson(lesson);
    setActiveSubject(subject);
    setQuizAnswers({});
    setQuizChecked(false);
    setQuizPassed(null);
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (quizChecked && quizPassed) return; // Locked once passed
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleQuizSubmit = () => {
    if (!activeLesson) return;

    // Verify all 3 questions answered
    const answersLength = Object.keys(quizAnswers).length;
    if (answersLength < 3) {
      alert(language === 'en' ? 'Please answer all 3 questions before submitting!' : 'कृपया सबमिट करने से पहले सभी 3 प्रश्नों के उत्तर दें!');
      return;
    }

    // Check answers
    let allCorrect = true;
    activeLesson.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] !== q.answer) {
        allCorrect = false;
      }
    });

    setQuizChecked(true);
    setQuizPassed(allCorrect);

    if (allCorrect) {
      // Complete lesson & gain +50 XP
      const isAlreadyCompleted = completedLessons.includes(activeLesson.id);
      
      let nextXp = xp;
      if (!isAlreadyCompleted) {
        nextXp = xp + 50;
        setXP(nextXp);
      }

      const updatedCompleted = isAlreadyCompleted 
        ? completedLessons 
        : [...completedLessons, activeLesson.id];

      // Sync local storage
      const storedName = localStorage.getItem('user_name');
      const usersRaw = localStorage.getItem('registered_users') || '[]';
      let users = [];
      try {
        users = JSON.parse(usersRaw);
      } catch (e) {
        users = [];
      }

      users = users.map((u: any) => {
        if (u && u.name === storedName) {
          return {
            ...u,
            completedLessons: updatedCompleted,
            xp: nextXp
          };
        }
        return u;
      });

      localStorage.setItem('registered_users', JSON.stringify(users));
      setCompletedLessons(updatedCompleted);
    }
  };

  const getSubjectProgress = (subjectName: string): number => {
  const subKey = SUBJECT_IDS[subjectName];
  if (!subKey) return 0;
  const lessonsList = getFilteredLessons(subKey);
  const total = lessonsList.length;
  if (total === 0) return 0;
  const completed = lessonsList.filter((l: Lesson) => completedLessons.includes(l.id)).length;
  return Math.round((completed / total) * 100);
};

  const getSubjectCompletedCount = (subjectName: string): string => {
  const subKey = SUBJECT_IDS[subjectName];
  if (!subKey) return '0/0';
  const lessonsList = getFilteredLessons(subKey);
  const total = lessonsList.length;
  const completed = lessonsList.filter((l: Lesson) => completedLessons.includes(l.id)).length;
  return `${completed}/${total}`;
};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 transition-colors duration-300">
      
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-800 dark:text-slate-100">
          {t('lessons.title', 'Interactive Lessons 📚')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium leading-relaxed">
          {t('lessons.subtitle', 'Select a subject to start learning basic to advanced concepts with short checks.')}
        </p>
      </section>

      {/* Subjects Grid */}
      <div className="space-y-8">
        {selectedSubjects.map((subjectName) => {
          const subKey = SUBJECT_IDS[subjectName];
          const lessonsList = getFilteredLessons(subKey);
    const unlockedLessons = getUnlockState(lessonsList);
          const progressPercent = getSubjectProgress(subjectName);
          const completedCount = getSubjectCompletedCount(subjectName);

          return (
            <div 
              key={subjectName}
              className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 transition-all duration-300 hover:shadow-md"
            >
              {/* Subject Title & Progress Bar Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-6">
                <div className="space-y-1.5">
                  <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                    {subjectName}
                  </h2>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg">
                    {completedCount} {t('lessons.lessons_completed', 'lessons completed')}
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="w-full md:w-72 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>{t('dash.level_progress', 'Progress')}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${progressPercent}%` }} 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Subject Lessons List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {unlockedLessons.map(({ lesson, isCompleted, isUnlocked }) => {
                  const levelColors = {
                    Basic: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40',
                    Intermediate: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40',
                    Advanced: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/40'
                  };

                  if (!isUnlocked) {
                    return (
                      <div
                        key={lesson.id}
                        className="relative border border-slate-200/40 dark:border-slate-800/40 rounded-2xl p-5 sm:p-6 bg-slate-100/40 dark:bg-slate-900/20 flex flex-col justify-between gap-5 opacity-50 cursor-not-allowed border-l-4 border-l-slate-200 dark:border-l-slate-800"
                      >
                        <div className="space-y-3">
                          <span className={`inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${levelColors[lesson.level]}`}>
                            {t(`lessons.${lesson.levelKey}`, lesson.level)}
                          </span>
                          <h3 className="font-extrabold text-base text-slate-400 dark:text-slate-600 leading-snug">
                            {language === 'en' ? lesson.title.en : lesson.title.hi}
                          </h3>
                        </div>
                        <div className="w-full py-2.5 rounded-xl font-bold text-xs tracking-wide text-center bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-700">
                          🔒 Complete previous lessons to unlock
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={lesson.id}
                      className={`relative border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 sm:p-6 bg-slate-50/40 dark:bg-[#0b0f19]/40 hover:bg-slate-50 dark:hover:bg-[#0b0f19] flex flex-col justify-between gap-5 transition-all duration-200 hover:shadow-inner ${
                        isCompleted ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-slate-300 dark:border-l-slate-700'
                      }`}
                    >
                      <div className="space-y-3">
                        <span className={`inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${levelColors[lesson.level]}`}>
                          {t(`lessons.${lesson.levelKey}`, lesson.level)}
                        </span>
                        <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 leading-snug">
                          {language === 'en' ? lesson.title.en : lesson.title.hi}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleLessonStart(lesson, subjectName)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs tracking-wide shadow-sm hover:shadow transition-all transform active:scale-98 cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10'
                        }`}
                      >
                        {isCompleted
                          ? t('lessons.completed', 'Completed ✅')
                          : t('lessons.start_lesson', 'Start Lesson')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lesson Content & Quiz Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 max-w-3xl w-full rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slideUp">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                  {activeSubject}
                </span>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
                  {language === 'en' ? activeLesson.title.en : activeLesson.title.hi}
                </h3>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="w-8 h-8 flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full text-base transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-grow space-y-8 leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-300">
              
              {/* Written Notes */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  {language === 'en' ? 'Lesson Notes 📝' : 'पाठ नोट्स 📝'}
                </h4>
                <div className="p-5 bg-slate-50 dark:bg-[#0b0f19]/80 border border-slate-100 dark:border-slate-850 rounded-2xl whitespace-pre-wrap font-medium">
                  {language === 'en' ? activeLesson.notes.en : activeLesson.notes.hi}
                </div>
              </div>

              {/* Quiz Section */}
              <div className="border-t border-slate-100 dark:border-slate-850 pt-8 space-y-6">
                <div>
                  <h4 className="text-lg font-black text-slate-800 dark:text-slate-100">
                    {t('lessons.quiz_title', 'Lesson Quiz 📝')}
                  </h4>
                  <p className="text-xs font-semibold text-slate-400 mt-1">
                    {t('lessons.quiz_subtitle', 'Answer all 3 questions correctly to complete this lesson and earn +50 XP!')}
                  </p>
                </div>

                <div className="space-y-8">
                  {activeLesson.quiz.map((q, qIdx) => {
                    const qText = language === 'en' ? q.question.en : q.question.hi;
                    const optionsList = language === 'en' ? q.options.en : q.options.hi;
                    const selectedAns = quizAnswers[qIdx];

                    return (
                      <div key={qIdx} className="space-y-3.5">
                        <h5 className="font-extrabold text-slate-700 dark:text-slate-200">
                          {qIdx + 1}. {qText}
                        </h5>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {optionsList.map((opt, oIdx) => {
                            const isSelected = selectedAns === oIdx;
                            const isCorrect = q.answer === oIdx;
                            
                            // Visual feedback border colors
                            let borderClass = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60';
                            if (isSelected) {
                              borderClass = 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/20';
                            }
                            if (quizChecked) {
                              if (isCorrect) {
                                borderClass = 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-600 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400';
                              } else if (isSelected) {
                                borderClass = 'border-rose-500 bg-rose-50/50 dark:border-rose-600 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={quizChecked && quizPassed === true}
                                onClick={() => handleAnswerSelect(qIdx, oIdx)}
                                className={`text-left p-4 rounded-xl border text-sm font-semibold transition-all ${borderClass} disabled:opacity-90`}
                              >
                                <span className="mr-2 text-indigo-500 font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Score Alert Banners */}
                {quizChecked && (
                  <div className="animate-fadeIn">
                    {quizPassed ? (
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 p-5 rounded-2xl flex items-center gap-4 text-emerald-800 dark:text-emerald-400">
                        <span className="text-4xl">🎉</span>
                        <div>
                          <h4 className="font-extrabold text-base">{t('lessons.congrats', 'Congratulations! 🎉')}</h4>
                          <p className="text-xs font-semibold mt-0.5">{t('lessons.passed_msg', 'You passed the quiz, completed the lesson, and earned +50 XP!')}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 p-5 rounded-2xl flex items-center gap-4 text-rose-800 dark:text-rose-400">
                        <span className="text-4xl">❌</span>
                        <div>
                          <h4 className="font-extrabold text-base">{t('lessons.incorrect', 'Incorrect! ❌')}</h4>
                          <p className="text-xs font-semibold mt-0.5">{t('lessons.failed_msg', 'You did not answer all questions correctly. Please review the notes and try again!')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3.5">
              {quizChecked && !quizPassed && (
                <button
                  onClick={() => {
                    setQuizChecked(false);
                    setQuizPassed(null);
                    setQuizAnswers({});
                  }}
                  className="px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-colors"
                >
                  {t('lessons.retry', 'Try Again')}
                </button>
              )}

              {(!quizChecked || quizPassed === false) && (
                <button
                  onClick={handleQuizSubmit}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-extrabold text-xs tracking-wider uppercase shadow-md shadow-indigo-600/10 transition-transform active:scale-95"
                >
                  {t('lessons.submit', 'Submit Answer')}
                </button>
              )}

              <button
                onClick={() => setActiveLesson(null)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-colors"
              >
                {t('lessons.close', 'Close & Return')}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
