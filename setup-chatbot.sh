#!/bin/bash

echo "🤖 MindBridge AI Chatbot Setup"
echo "================================"
echo ""
echo "This chatbot uses Google's Gemini AI (100% FREE!)"
echo ""
echo "📋 Steps to get your FREE API key:"
echo ""
echo "1. Open this link in your browser:"
echo "   👉 https://makersuite.google.com/app/apikey"
echo ""
echo "2. Sign in with your Google account"
echo ""
echo "3. Click 'Create API Key'"
echo ""
echo "4. Copy the API key (it starts with 'AIza...')"
echo ""
echo "5. Paste it below when prompted"
echo ""
echo "================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Prompt for API key
read -p "📝 Paste your Gemini API key here: " api_key

if [ -z "$api_key" ]; then
    echo "❌ No API key provided!"
    exit 1
fi

# Update .env file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/GEMINI_API_KEY=.*/GEMINI_API_KEY=$api_key/" .env
else
    # Linux
    sed -i "s/GEMINI_API_KEY=.*/GEMINI_API_KEY=$api_key/" .env
fi

echo ""
echo "✅ API key saved successfully!"
echo ""
echo "🚀 Now restart your dev server:"
echo "   1. Press Ctrl+C to stop the current server"
echo "   2. Run: npm run dev"
echo ""
echo "🎉 Your AI chatbot is ready to use!"
