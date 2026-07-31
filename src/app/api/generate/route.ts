import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

const PROMPTS: Record<string, string> = {
  social: "You are a social media content expert. Create engaging social media content based on the user's topic.\n\nRules:\n- Include emojis\n- Use hashtags\n- Make it scroll-stopping\n- Add a call-to-action",
  blog: "You are a professional blog writer. Write a blog post outline/draft based on the user's topic.\n\nRules:\n- Use clear headings\n- Include an engaging introduction\n- Add key points under each section\n- End with a conclusion",
  email: "You are an email marketing expert. Write a professional email based on the user's topic.\n\nRules:\n- Compelling subject line\n- Engaging opening\n- Clear body with value\n- Strong call-to-action at the end",
  ad: "You are a copywriting expert specializing in ad copy. Create compelling ad text based on the user's topic.\n\nRules:\n- Attention-grabbing headline\n- Clear value proposition\n- Urgency/scarcity elements\n- Strong CTA",
};

const LENGTH_MAP: Record<string, string> = {
  short: "Keep it concise. Around 50-100 words.",
  medium: "Write a standard length piece. Around 150-300 words.",
  long: "Write a detailed piece. Around 400-600 words.",
};

const TONE_MAP: Record<string, string> = {
  professional: "Use a professional, business-like tone.",
  casual: "Use a casual, friendly, conversational tone.",
  humorous: "Use a humorous, witty, light-hearted tone.",
  persuasive: "Use a persuasive, compelling, action-driven tone.",
};

async function generat
