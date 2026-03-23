require('dotenv').config();
if (!global.fetch) {
  const fetch = require('node-fetch');
  global.fetch = fetch;
  global.Headers = fetch.Headers;
  global.Request = fetch.Request;
  global.Response = fetch.Response;
}
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There is no direct listModels in the SDK for some versions, 
    // but we can try to see if it works or use a different method.
    // Actually, usually you just try a model.
    console.log('Testing gemini-1.5-flash-latest...');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent("Hi");
    console.log('Success with gemini-1.5-flash-latest:', (await result.response).text());
    process.exit(0);
  } catch (err) {
    console.error('List Models / Test Error:', err);
    process.exit(1);
  }
}

listModels();
