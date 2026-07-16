require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY;

const testModel = (version, model) => {
  return new Promise((resolve) => {
    const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
    const payload = JSON.stringify({
      contents: [{ parts: [{ text: "Hello" }] }]
    });
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ version, model, statusCode: res.statusCode, data: data.substring(0, 300) });
      });
    });
    req.on('error', (e) => resolve({ version, model, error: e.message }));
    req.write(payload);
    req.end();
  });
};

const listModels = (version) => {
  return new Promise((resolve) => {
    const url = `https://generativelanguage.googleapis.com/${version}/models?key=${apiKey}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const models = json.models ? json.models.map(m => m.name) : [];
          resolve({ version, statusCode: res.statusCode, models, data: data.substring(0, 300) });
        } catch (e) {
          resolve({ version, statusCode: res.statusCode, error: e.message, data: data.substring(0, 300) });
        }
      });
    }).on('error', (e) => resolve({ version, error: e.message }));
  });
};

(async () => {
  console.log("Listing v1 models...");
  console.log(await listModels('v1'));
  console.log("\nListing v1beta models...");
  console.log(await listModels('v1beta'));
  
  console.log("\nTesting endpoints...");
  console.log(await testModel('v1', 'gemini-1.5-flash'));
  console.log(await testModel('v1beta', 'gemini-1.5-flash'));
  console.log(await testModel('v1beta', 'gemini-1.5-flash-latest'));
  console.log(await testModel('v1beta', 'gemini-2.5-flash'));
})();
