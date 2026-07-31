import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const k = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!u || !k) throw new Error("Missing Supabase env vars");
  return createClient(u, k);
}

export async function GET(req: NextRequest) {
  try {
    const supabase = db();
    const s = req.cookies.get("session")?.value;
    if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: user } = await supabase.from("users").select("id").eq("session_token", s).single();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: gens } = await supabase.from("generations").select("id,type,topic,tone,length,output,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
    const mapped = (gens || []).map((g: any) => ({ ...g, createdAt: g.created_at }));
    return NextResponse.json({ generations: mapped });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = db();
    const s = req.cookies.get("session")?.value;
    if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: user } = await supabase.from("users").select("id").eq("session_token", s).single();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await req.json();
    const { data: gen } = await supabase.from("generations").select("id").eq("id", id).eq("user_id", user.id).single();
    if (!gen) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { e
