import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  return NextResponse.json({
    supabaseUrlSet: !!url,
    supabaseUrlPreview: url ? url.substring(0, 50) + "..." : "NOT SET",
    supabaseKeySet: !!key,
    supabaseKeyPreview: key ? key.substring(0, 30) + "..." : "NOT SET",
    geminiKeySet: !!geminiKey,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
