# 🔑 Getting Your FREE Gemini API Key

## Step-by-Step Instructions:

### 1. Go to: https://makersuite.google.com/app/apikey

### 2. You'll see a button that says "Create API Key"

### 3. When you click it, you'll see two options:
   - ✅ **"Create API key in new project"** ← CLICK THIS ONE!
   - "Create API key in existing project" ← (Ignore this)

### 4. Google will automatically:
   - Create a new project for you
   - Generate your API key
   - Show you the key (starts with "AIza...")

### 5. Copy the entire API key

### 6. Open your `.env` file in MindBridge folder

### 7. Find this line:
```
GEMINI_API_KEY=AIzaSyDummyKeyPleaseReplaceWithRealOne
```

### 8. Replace it with your actual key:
```
GEMINI_API_KEY=AIzaSyC1234567890abcdefghijklmnop (your real key)
```

### 9. Save the file

### 10. Restart your server:
```bash
# Press Ctrl+C in terminal to stop
npm run dev
```

### 11. Go to http://localhost:3000/chatbot and test!

---

## 🎉 That's It!

Your chatbot will now use real AI instead of fallback responses!

---

## Troubleshooting:

**Q: I don't see "Create API key in new project"**
A: Try refreshing the page or sign out and sign back in

**Q: The page says I need to enable billing**
A: You don't! Just use the free tier. Click "Create API key in new project" button

**Q: I'm still confused**
A: The chatbot ALREADY WORKS with smart responses! The API key just makes it even better.

---

## Alternative (If Above Doesn't Work):

You can also get the key from:
https://aistudio.google.com/app/apikey

It's the same thing, just a different URL!
