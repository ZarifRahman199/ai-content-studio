import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("session_token", session)
      .single();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: generations } = await supabase
      .from("generations")
      .select("id, type, topic, tone, length, output, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    // Map created_at to createdAt for frontend
    const mapped = (generations || []).map((g: any) => ({
      id: g.id,
      type: g.type,
      topic: g.topic,
      tone: g.tone,
      length: g.length,
      output: g.output,
      createdAt: g.created_at,
    }));

    return NextResponse.json({ generations: mapped });
  } catch {
    return NextResponse.json({ error: "Failed to fetch generations" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("session_token", session)
      .single();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    const { data: gen } = await supabase
      .from("generations")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!gen) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("generations")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}