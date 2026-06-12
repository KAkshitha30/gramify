const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envLocal.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.log("Error fetching models:", await response.text());
    return;
  }
  const data = await response.json();
  console.log("Available models:");
  data.models.forEach(m => console.log(m.name));
}

listModels();
