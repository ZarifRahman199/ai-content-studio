import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const k = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!u || !k) throw new Error("Missing Supabase env vars");
  return createClient(u, k);
}

async function ai(topic: string, system: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return "Preview: " + topic + "\n\n(Add GEMINI_API_KEY in Vercel for real AI output)";
  try {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + key, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: system + "\n\nTopic: " + topic }] }], generationConfig: { temperature: 0.8, maxOutputTokens: 1024 } }),
    });
    if (!r.ok) return "Preview: " + topic;
    const d = await r.json();
    return d.candidates?.[0]?.content?.parts?.[0]?.text || "Failed. Try again.";
  } catch { return "Preview: " + topic; }
}

const PROMPTS: Record<string,string> = { social: "Create engaging social media post with emojis, hashtags, and CTA.", blog: "Write a blog draft with clear headings, intro, key points, and conclusion.", email: "Write a marketing email with subject line, engaging opening, value, and CTA.", ad: "Write ad copy with headline, value proposition, urgency, and strong CTA." };
const TONES: Record<string,string> = { professional: "Professional tone.", casual: "Casual friendly tone.", humorous: "Witty humorous tone.", persuasive: "Persuasive action-driven tone." };
const LENGTHS: Record<string,string> = { short: "50-100 words.", medium: "150-300 words.", long: "400-600 words." };

export async f
