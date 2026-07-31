import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const k = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!u || !k) throw new Error("Missing Supabase env vars");
  return createClient(u, k);
}

export async function POST(req) {
  try {
    const supabase = db();
    const session = req.cookies.get("session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: user } = await supabase.from("users").select("id, credits").eq("session_token", session).single();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { action, amount } = await req.json();
    if (action === "add" && amount && amount > 0) {
      const { data: updated, error } = await supabase.from("users").update({ credits: user.credits + amount }).eq("id", user.id).select("credits").single();
      if (error || !updated) return NextResponse.json({ error: "Failed" }, { status: 500 });
      return NextResponse.json({ credits: updated.credits });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
