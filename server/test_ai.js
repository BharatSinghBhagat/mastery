require('dotenv').config();
if (!global.fetch) {
  const fetch = require('node-fetch');
  global.fetch = fetch;
  global.Headers = fetch.Headers;
  global.Request = fetch.Request;
  global.Response = fetch.Response;
}
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAI() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('No GEMINI_API_KEY found in .env');
      process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = "Explain Angular in 2 sentences.";
    console.log('Generating content...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Response:', text);
    process.exit(0);
  } catch (err) {
    console.error('AI Test Error:', err);
    process.exit(1);
  }
}

testAI();
