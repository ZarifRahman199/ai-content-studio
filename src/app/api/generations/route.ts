import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const session = request.cookies.get("session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: user } = await supabase.from("users").select("id").eq("session_token", session).single();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: generations } = await supabase.from("generations").select("id, type, topic, tone, length, output, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
    const mapped = (generations || []).map((g: any) => ({ ...g, createdAt: g.created_at }));
    return NextResponse.json({ generations: mapped });
  } catch (error) {
    console.error("Generations GET error:", error);
    return NextResponse.json({ error: "Failed to fetch generations" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const session = request.cookies.get("session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: user } = await supabase.from("users").select("id").eq("session_token", session).single();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await request.json();
    const { data: gen } = await s
