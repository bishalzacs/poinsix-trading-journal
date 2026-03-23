require("dotenv").config({ path: '../frontend/.env.local' });
const https = require('https');
const fs = require('fs');

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => fs.writeFileSync('models.json', JSON.stringify(JSON.parse(body), null, 2)));
});
