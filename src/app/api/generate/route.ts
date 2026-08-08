import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const PROMPTS: Record<string, string> = {
  social: `You are a social media content expert. Create engaging social media content based on the user's topic.

Rules:
- Include emojis
- Use hashtags
- Make it scroll-stopping
- Add a call-to-action`,
  blog: `You are a professional blog writer. Write a blog post outline/draft based on the user's topic.

Rules:
- Use clear headings
- Include an engaging introduction
- Add key points under each section
- End with a conclusion`,
  email: `You are an email marketing expert. Write a professional email based on the user's topic.

Rules:
- Compelling subject line
- Engaging opening
- Clear body with value
- Strong call-to-action at the end`,
  ad: `You are a copywriting expert specializing in ad copy. Create compelling ad text based on the user's topic.

Rules:
- Attention-grabbing headline
- Clear value proposition
- Urgency/scarcity elements
- Strong CTA`,
};

const LENGTH_MAP: Record<string, string> = {
  short: "Keep it concise and brief. Around 50-100 words.",
  medium: "Write a standard length piece. Around 150-300 words.",
  long: "Write a detailed, comprehensive piece. Around 400-600 words.",
};

const TONE_MAP: Record<string, string> = {
  professional: "Use a professional, business-like tone.",
  casual: "Use a casual, friendly, conversational tone.",
  humorous: "Use a humorous, witty, light-hearted tone.",
  persuasive: "Use a persuasive, compelling, action-driven tone.",
};

async function generateWithGroq(systemPrompt: string, userMessage: string): Promise<string> {
  // Support both GROQ_API_KEY and GEMINI_API_KEY for backward compat
  const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return generateMockContent(userMessage);
  }

  try {
    // Use Groq's OpenAI-compatible API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Topic: ${userMessage}` },
        ],
        temperature: 0.8,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      console.error("Groq API error:", await response.text());
      return generateMockContent(userMessage);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Failed to generate content. Please try again.";
  } catch (error) {
    console.error("Groq fetch error:", error);
    return generateMockContent(userMessage);
  }
}

function generateMockContent(topic: string): string {
  return `# Generated Content for: ${topic}

This is a preview of your AI-generated content. When you deploy with your API key, real AI-generated content will appear here.

---

To enable real AI generation:
1. Get your API key from console.groq.com
2. Add GROQ_API_KEY to your Vercel environment variables
3. Redeploy on Vercel

This preview uses mock content to demonstrate the workflow.`;
}

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { sessionToken: session } });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.credits <= 0) {
      return NextResponse.json({ error: "No credits remaining. Upgrade your plan for more credits." }, { status: 403 });
    }

    const { type, topic, tone, length } = await request.json();

    if (!type || !topic) {
      return NextResponse.json({ error: "Content type and topic are required" }, { status: 400 });
    }

    const validTypes = ["social", "blog", "email", "ad"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const systemPrompt = `${PROMPTS[type] || PROMPTS.social}\n\nTone: ${TONE_MAP[tone] || TONE_MAP.professional}\n\n${LENGTH_MAP[length] || LENGTH_MAP.medium}`;

    const output = await generateWithGroq(systemPrompt, topic);

    // Deduct credit
    await db.user.update({ where: { id: user.id }, data: { credits: user.credits - 1 } });

    const generation = await db.generation.create({
      data: { userId: user.id, type, topic, tone: tone || "professional", length: length || "medium", output },
    });

    const updatedUser = await db.user.findUnique({ where: { id: user.id } });

    return NextResponse.json({
      generation: { id: generation.id, type, topic, tone: generation.tone, length: generation.length, output: generation.output, createdAt: generation.createdAt },
      credits: updatedUser?.credits || 0,
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
