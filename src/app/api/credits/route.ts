import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const session = request.cookies.get("session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: user } = await supabase.from("users").select("id, credits").eq("session_token", session).single();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { action, amount } = await request.json();
    if (action === "add" && amount && amount > 0) {
      const { data: updated, error } = await supabase.from("users").update({ credits: user.credits + amount }).eq("id", user.id).select("credits").single();
      if (error || !updated) return NextResponse.json({ error: "Failed to update credits" }, { status: 500 });
      return NextResponse.json({ credits: updated.credits });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Credits error:", error);
    return NextResponse.json({ error: "Failed to update credits" }, { status: 500 });
  }
}
