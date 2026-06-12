const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envLocal.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

console.log("Gemini key exists:", !!apiKey);
console.log("Gemini key prefix:", apiKey ? apiKey.slice(0, 10) : "null");

const systemPrompt = `You are Guru AI, a knowledgeable, friendly, and bilingually supportive personal teacher for a student learning platform.
The student is currently registered as a "student" and is learning: Science.
You must answer questions on ANY topic in detail, acting like a brilliant bilingually supportive teacher.
IMPORTANT: Reply bilingually or in a mix of Hindi and English (Hinglish/Hindi script where appropriate).
Always format your response cleanly using Markdown, bold text for key terms, lists, and code blocks.`;

const testQuestions = [
  "Explain recursion",
  "What is cryptography",
  "Explain photosynthesis"
];

async function test() {
  for (const question of testQuestions) {
    console.log(`\n--- Testing Question: "${question}" ---`);
    // NOTE: intentionally using the endpoint exactly as currently written in page.tsx
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    console.log("Endpoint:", endpoint);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\nUser Question: ${question}` }]
          }]
        })
      });

      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);

      if (!response.ok) {
        const errorBody = await response.text();
        console.log("Error Body:", errorBody);
      } else {
        const data = await response.json();
        console.log("Success! Response text prefix:", data.candidates?.[0]?.content?.parts?.[0]?.text.slice(0, 100));
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  }
}

test();
