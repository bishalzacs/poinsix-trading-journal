const fs = require('fs');

async function testUpload() {
  const formData = new FormData();
  formData.append('userId', 'lcNaR01mTmSw2mo6MZAFUKWfZL13');
  
  // Create a 1x1 transparent PNG base64 and write to buffer
  const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const buffer = Buffer.from(pngBase64, 'base64');
  
  const blob = new Blob([buffer], { type: 'image/png' });
  formData.append('file', blob, 'test.png');

  try {
    const res = await fetch('http://localhost:3000/api/import', {
      method: 'POST',
      body: formData
    });

    const txt = await res.text();
    console.log('STATUS:', res.status);
    console.log('RESPONSE:', txt);
  } catch (err) {
    console.error('HTTP ERROR:', err);
  }
}

testUpload();
