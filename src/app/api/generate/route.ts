import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const k = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!u || !k) throw new Error("Missing Supabase env vars");
  return createClient(u, k);
}

async function ai(topic, system) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return "No AI key configured. Add GROQ_API_KEY in Vercel.";
  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "system", content: system }, { role: "user", content: topic }], temperature: 0.8, max_tokens: 1024 }),
    });
    const body = await r.text();
    if (!r.ok) return "Groq API error (status " + r.status + "): " + body.substring(0, 200);
    const d = JSON.parse(body);
    return d.choices?.[0]?.message?.content || "AI returned empty. Try again.";
  } catch (e) {
    return "Fetch error: " + (e?.message || String(e));
  }
}

const PROMPTS = { social: "Create engaging social media post with emojis, hashtags, and CTA.", blog: "Write a blog draft with clear headings, intro, key points, and conclusion.", email: "Write a marketing email with subject line, engaging opening, value, and CTA.", ad: "Write ad copy with headline, value proposition, urgency, and strong CTA." };
const TONES = { professional: "Professional tone.", casual: "Casual friendly tone.", humorous: "Witty humorous tone.", persuasive: "Persuasive action-driven tone." };
const LENGTHS = { short: "50-100 words.", medium: "150-300 words.", long: "400-600 words." };

export async function POST(req) {
  try {
    const supabase = db();
    const session = req.cookies.get("session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: user } = await supabase.from("users").select("id, credits").eq("session_token", session).single();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.credits <= 0) return NextResponse.json({ error: "No credits. Upgrade." }, { status: 403 });
    const { type, topic, tone, length } = await req.json();
    if (!type || !topic) return NextResponse.json({ error: "Type and topic required" }, { status: 400 });
    if (!["social","blog","email","ad"].includes(type)) return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    const sys = (PROMPTS[type]||PROMPTS.social) + " " + (TONES[tone]||TONES.professional) + " " + (LENGTHS[length]||LENGTHS.medium);
    const output = await ai(topic, sys);
    await supabase.from("users").update({ credits: user.credits - 1 }).eq("id", user.id);
    const { data: gen, error } = await supabase.from("generations").insert({ user_id: user.id, type, topic, tone: tone||"professional", length: length||"medium", output }).select("id,type,topic,tone,length,output,created_at").single();
    if (error || !gen) return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    return NextResponse.json({ generation: { ...gen, createdAt: gen.created_at }, credits: user.credits - 1 });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
