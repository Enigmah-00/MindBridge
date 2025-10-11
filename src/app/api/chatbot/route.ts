import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// System prompt for the mental health AI chatbot
const SYSTEM_PROMPT = `You are MindBridge AI, a compassionate and professional mental health support chatbot. Your role is to:

1. **Listen actively** and empathetically to users' concerns
2. **Ask thoughtful questions** to understand their situation better
3. **Provide evidence-based suggestions** and coping strategies
4. **Offer emotional support** without being judgmental
5. **Recommend professional help** when appropriate
6. **Maintain boundaries** - you're a support tool, not a replacement for therapy

Key Guidelines:
- Be warm, empathetic, and non-judgmental
- Use active listening techniques (reflect feelings, validate emotions)
- Ask open-ended questions to explore their situation
- Provide actionable, evidence-based coping strategies
- Recognize crisis situations and recommend immediate professional help
- Keep responses concise but meaningful (2-4 paragraphs)
- Use a conversational, supportive tone
- Acknowledge limitations - you're AI, not a licensed therapist

Crisis Keywords: If the user mentions suicide, self-harm, or immediate danger:
- Express concern and take it seriously
- Strongly encourage immediate professional help
- Provide crisis resources (National Suicide Prevention Lifeline: 988)
- Stay supportive but emphasize urgency

Remember: You're here to support, guide, and encourage - but always recommend professional help for serious concerns.`;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireSession();
    const { message, conversationHistory = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Check for Gemini API key (FREE!)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'AIzaSyDummyKeyPleaseReplaceWithRealOne') {
      console.log('⚠️ Gemini API key not configured. Using fallback responses.');
      console.log('💡 Get FREE Gemini API key from: https://makersuite.google.com/app/apikey');
      
      // Fallback to rule-based responses if no API key
      const fallbackMsg = getFallbackResponse(message);
      return NextResponse.json({
        response: fallbackMsg,
        conversationHistory: [
          ...conversationHistory,
          { role: 'user', content: message },
          { role: 'assistant', content: fallbackMsg }
        ],
        usingFallback: true
      });
    }

    // Build conversation context for Gemini
    let conversationContext = SYSTEM_PROMPT + "\n\nConversation history:\n";
    conversationHistory.slice(-6).forEach((msg: any) => {
      conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });
    conversationContext += `User: ${message}\nAssistant:`;

    // Call Google Gemini API (FREE!)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: conversationContext
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
            topP: 0.8,
            topK: 40
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Gemini API error:', error);
      console.error('Status:', response.status);
      
      if (response.status === 400) {
        console.error('🔑 Invalid API key! Get a FREE key from: https://makersuite.google.com/app/apikey');
      }
      
      const fallbackMsg = getFallbackResponse(message);
      return NextResponse.json({
        response: fallbackMsg,
        conversationHistory: [
          ...conversationHistory,
          { role: 'user', content: message },
          { role: 'assistant', content: fallbackMsg }
        ],
        usingFallback: true,
        error: response.status === 400 ? 'Invalid API key' : 'API error'
      });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to listen. Could you tell me more?";

    // Save conversation to database (optional - for history tracking)
    try {
      await prisma.chatMessage.create({
        data: {
          userId: user.id,
          userMessage: message,
          botResponse: aiResponse,
          timestamp: new Date()
        }
      });
    } catch (dbError) {
      console.error('Database error (non-critical):', dbError);
      // Continue even if DB save fails
    }

    return NextResponse.json({
      response: aiResponse,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse }
      ]
    });

  } catch (error: any) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { error: "Failed to process message", details: error.message },
      { status: 500 }
    );
  }
}

// Fallback rule-based responses when OpenAI is unavailable
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Crisis detection
  if (lowerMessage.match(/suicid|kill myself|end my life|want to die|self.harm|hurt myself/i)) {
    return `I'm really concerned about what you're sharing. Please reach out to a crisis helpline immediately:

🆘 **National Suicide Prevention Lifeline: 988** (US)
🆘 **Crisis Text Line: Text HOME to 741741**
🆘 **International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/**

Your life matters, and there are people who want to help you right now. Please don't go through this alone.`;
  }

  // Anxiety patterns
  if (lowerMessage.match(/anxious|anxiety|worry|worried|panic|nervous|stressed/i)) {
    return `I hear that you're feeling anxious, and that can be really overwhelming. Here are some things that might help:

**Immediate Relief:**
- Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste
- Practice deep breathing: Breathe in for 4 counts, hold for 4, out for 4
- Remember: Anxiety is temporary, even though it feels intense right now

**Questions to explore:**
- What situations tend to trigger your anxiety?
- Have you noticed any patterns in when these feelings arise?
- What has helped you feel calmer in the past?

Would you like to talk more about what's triggering these feelings?`;
  }

  // Depression patterns
  if (lowerMessage.match(/depress|sad|hopeless|empty|numb|no energy|can't sleep|tired all the time/i)) {
    return `Thank you for sharing how you're feeling. Depression can make everything feel heavy and exhausting. I want you to know that what you're experiencing is valid, and you're not alone.

**Small steps that can help:**
- Be gentle with yourself - even small accomplishments matter
- Try to maintain a basic routine (sleep, meals)
- Connect with someone, even briefly
- Get outside for a few minutes if possible

**Important to consider:**
- Have you spoken with a mental health professional about these feelings?
- How long have you been feeling this way?
- Are you taking care of basic needs (eating, sleeping)?

I'm here to listen. What would feel most helpful to talk about right now?`;
  }

  // Stress patterns
  if (lowerMessage.match(/stress|overwhelm|too much|can't cope|pressure/i)) {
    return `It sounds like you're dealing with a lot right now. Feeling overwhelmed is a sign that your mind and body are asking for some support. Let's break this down together.

**Quick stress relief:**
- Take 3 deep, slow breaths right now
- List 3 things you have control over in this moment
- Give yourself permission to take a short break

**Let's explore:**
- What's contributing most to your stress right now?
- Are there any tasks you can postpone, delegate, or eliminate?
- What would feel like relief to you?

Remember: You don't have to handle everything at once. Let's talk about what's most pressing for you.`;
  }

  // Relationship issues
  if (lowerMessage.match(/relationship|partner|friend|family|conflict|argument|breakup/i)) {
    return `Relationships can be one of the most challenging and important parts of our lives. It's clear this is weighing on you.

**Things to consider:**
- How are these relationship dynamics affecting your wellbeing?
- What are your needs in this situation?
- Have you been able to communicate your feelings to the other person?

**Healthy boundaries include:**
- Being honest about your needs
- Respecting both your feelings and theirs
- Recognizing when professional support might help

Would you like to tell me more about what's happening? I'm here to listen without judgment.`;
  }

  // Default empathetic response
  return `Thank you for reaching out and sharing with me. I'm here to listen and support you.

To better understand how I can help, could you tell me:
- What's been on your mind lately?
- How have you been feeling?
- Is there something specific that brought you here today?

Remember, this is a safe space to share. Take your time, and know that whatever you're going through, you don't have to face it alone.

*Note: I'm currently running in limited mode. For the full AI experience, please configure the OpenAI API key.*`;
}

// GET endpoint to retrieve chat history
export async function GET(req: NextRequest) {
  try {
    const { user } = await requireSession();
    
    const chatHistory = await prisma.chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' },
      take: 50 // Last 50 messages
    });

    return NextResponse.json(chatHistory);
  } catch (error: any) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}
