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

async function generateWithGemini(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return generateMockContent(userMessage);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `${systemPrompt}\n\nTopic: ${userMessage}` }] },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      return generateMockContent(userMessage);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate content. Please try again.";
  } catch (error) {
    console.error("Gemini fetch error:", error);
    return generateMockContent(userMessage);
  }
}

function generateMockContent(topic: string): string {
  return `# Generated Content for: ${topic}

This is a preview of your AI-generated content. When you deploy with your Gemini API key, real AI-generated content will appear here.

---

To enable real AI generation:
1. Get your API key from ai.google.dev
2. Add GEMINI_API_KEY to your .env file
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

    const output = await generateWithGemini(systemPrompt, topic);

    await db.user.update({ where: { id: user.id }, data: { credits: { decrement: 1 } } });

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
