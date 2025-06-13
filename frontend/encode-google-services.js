const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, './google-services.json'); // adjust if needed

try {
  const data = fs.readFileSync(filePath);
  const base64 = data.toString('base64');
  fs.writeFileSync(path.resolve(__dirname, 'google-services.base64.txt'), base64);
  console.log('✅ google-services.base64.txt created successfully');
} catch (err) {
  console.error('❌ Failed to read file:', err.message);
}
