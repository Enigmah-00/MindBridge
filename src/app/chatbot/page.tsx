'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatbotPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm MindBridge AI, your mental health support companion. I'm here to listen, support, and guide you. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Show warning if using fallback mode
      if (data.usingFallback) {
        console.warn('⚠️ Chatbot is using fallback responses. Configure OPENAI_API_KEY for full AI capabilities.');
      }
      
      // Simulate typing delay for more natural feel
      setTimeout(() => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I apologize, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "I'm feeling anxious lately",
    "I've been feeling down",
    "I'm stressed about work",
    "Having trouble sleeping",
    "Feeling overwhelmed"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-secondary"
            >
              ← Back
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🤖</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">MindBridge AI</h1>
                <p className="text-sm text-gray-500">Mental Health Support Companion</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Quick Prompts - Show only at start */}
        {messages.length <= 1 && (
          <div className="mb-6 animate-fade-in">
            <p className="text-sm text-gray-600 mb-3">💬 Quick start prompts:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-full text-sm text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-4 mb-6">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                    : 'bg-gradient-to-br from-indigo-500 to-purple-500'
                }`}>
                  <span className="text-white text-sm">
                    {message.role === 'user' ? '👤' : '🤖'}
                  </span>
                </div>

                {/* Message Bubble */}
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                    : 'bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm border border-gray-100'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Info Banners */}
        <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
          <span className="text-2xl">🤖</span>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Powered by Google Gemini AI (FREE!)</p>
            <p>This chatbot uses advanced AI to provide empathetic mental health support. <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Get your free API key</a> to unlock full AI capabilities!</p>
          </div>
        </div>
        
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
          <span className="text-2xl">ℹ️</span>
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Important Notice:</p>
            <p>This AI chatbot provides support and guidance but is not a replacement for professional mental health care. If you're in crisis, please contact emergency services or call 988 (Suicide & Crisis Lifeline).</p>
          </div>
        </div>

        {/* Input Area - Sticky at bottom */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <span className="text-lg">📤</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
