const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: '../frontend/.env.local' });

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Hello, respond with exactly the word SUCCESS.";
    
    console.log("Testing generateContent(prompt) ...");
    const result1 = await model.generateContent(prompt);
    console.log("Response:", result1.response.text());

  } catch (err) {
    console.error("SDK ERROR:", err.message);
  }
}

testGemini();
