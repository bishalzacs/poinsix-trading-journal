const fs = require('fs');

async function testUpload() {
  const formData = new FormData();
  formData.append('userId', 'lcNaR01mTmSw2mo6MZAFUKWfZL13');
  
  const csvContent = 'symbol,type,volume,profit\nEURUSD,BUY,0.1,50.5';
  const blob = new Blob([csvContent], { type: 'text/csv' });
  formData.append('file', blob, 'test.csv');

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
