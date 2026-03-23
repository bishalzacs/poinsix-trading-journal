const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: '../frontend/.env.local' });

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "What is in this image? Respond with a description.";
    
    // 1x1 transparent png
    const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    
    const imagePart = {
      inlineData: {
        data: pngBase64,
        mimeType: "image/png"
      }
    };

    console.log("Testing generateContent([prompt, imagePart]) ...");
    const result1 = await model.generateContent([prompt, imagePart]);
    console.log("Success 1:", result1.response.text());

  } catch (err) {
    console.error("SDK ERROR:", err.message);
  }
}

testGemini();
