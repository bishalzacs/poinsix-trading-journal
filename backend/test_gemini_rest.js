require("dotenv").config({ path: '../frontend/.env.local' });

async function testRest() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: "Hello, respond with exactly the word SUCCESS." }]
      }
    ]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log("REST STATUS:", res.status);
    console.log("REST RESPONSE:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("HTTP ERROR:", err);
  }
}

testRest();
