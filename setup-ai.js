#!/usr/bin/env node

console.log('\n🤖 ================================');
console.log('   MindBridge AI Chatbot Setup');
console.log('================================\n');

console.log('✅ Your chatbot is WORKING with smart responses!');
console.log('🚀 To unlock FULL AI power (100% FREE):\n');

console.log('📋 Step-by-Step Guide:\n');
console.log('1. Open this link (opening in browser now...)');
console.log('   👉 https://makersuite.google.com/app/apikey\n');

console.log('2. Sign in with your Google account\n');

console.log('3. Click the "Create API Key" button\n');

console.log('4. Copy the API key (starts with "AIza...")\n');

console.log('5. Open the .env file in your project folder\n');

console.log('6. Find this line:');
console.log('   GEMINI_API_KEY=AIzaSyDummyKeyPleaseReplaceWithRealOne\n');

console.log('7. Replace it with:');
console.log('   GEMINI_API_KEY=your_actual_api_key_here\n');

console.log('8. Restart your dev server (Ctrl+C then npm run dev)\n');

console.log('================================');
console.log('🎉 DONE! Chatbot fully powered!');
console.log('================================\n');

console.log('💡 Why Google Gemini?');
console.log('   • 100% FREE forever');
console.log('   • No credit card needed');
console.log('   • As smart as ChatGPT');
console.log('   • Unlimited usage');
console.log('   • Perfect for mental health AI\n');

// Open the URL in default browser
const { exec } = require('child_process');
const url = 'https://makersuite.google.com/app/apikey';

exec(`open "${url}" || xdg-open "${url}" || start "${url}"`, (error) => {
  if (!error) {
    console.log('✅ Browser opened! Follow the steps above.\n');
  }
});
