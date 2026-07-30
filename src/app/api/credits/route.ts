import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("id, credits")
      .eq("session_token", session)
      .single();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, amount } = await request.json();

    if (action === "add" && amount && amount > 0) {
      const { data: updated, error } = await supabase
        .from("users")
        .update({ credits: user.credits + amount })
        .eq("id", user.id)
        .select("credits")
        .single();

      if (error || !updated) {
        return NextResponse.json({ error: "Failed to update credits" }, { status: 500 });
      }

      return NextResponse.json({ credits: updated.credits });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to update credits" }, { status: 500 });
  }
}