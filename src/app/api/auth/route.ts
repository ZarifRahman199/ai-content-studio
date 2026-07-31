import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

function db() {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const k = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log("[AUTH] URL:", !!u, "Key:", !!k);
  if (!u || !k) throw new Error("Missing Supabase env vars");
  return createClient(u, k);
}

function tk() { return Math.random().toString(36).substring(2) + Date.now().toString(36); }

export async function POST(req) {
  try {
    const supabase = db();
    const { action, email, password, name } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    if (action === "signup") {
      const { data: ex } = await supabase.from("users").select("id").eq("email", email).single();
      if (ex) return NextResponse.json({ error: "Email already exists" }, { status: 409 });
      const hp = await bcrypt.hash(password, 10);
      const token = tk();
      const { data: user, error } = await supabase.from("users").insert({ email, password: hp, name: name || email.split("@")[0], session_token: token, credits: 10, plan: "free" }).select("id, email, name, credits, plan").single();
      if (error || !user) return NextResponse.json({ error: "Signup failed: " + (error?.message || "DB error") }, { status: 500 });
      const r = NextResponse.json({ user });
      r.cookies.set("session", token, { httpOnly: true, sameSite: "lax", maxAge: 2592000, path: "/" });
      return r;
    }
    if (action === "login") {
      const { data: user } = await supabase.from("users").select("*").eq("email", email).single();
      if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      if (!await bcrypt.compare(password, user.password)) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      const token = tk();
      await supabase.from("users").update({ session_token: token }).eq("id", user.id);
      const r = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, credits: user.credits, plan: user.plan } });
      r.cookies.set("session", token, { httpOnly: true, sameSite: "lax", maxAge: 2592000, path: "/" });
      return r;
    }
    if (action === "logout") {
      const s = req.cookies.get("session")?.value;
      if (s) await supabase.from("users").update({ session_token: null }).eq("session_token", s);
      const r = NextResponse.json({ success: true });
      r.cookies.set("session", "", { httpOnly: true, sameSite: "lax", maxAge: 0, path: "/" });
      return r;
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) {
    console.error("[AUTH]", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const supabase = db();
    const s = req.cookies.get("session")?.value;
    if (!s) return NextResponse.json({ user: null });
    const { data: user } = await supabase.from("users").select("id, email, name, credits, plan").eq("session_token", s).single();
    return NextResponse.json({ user: user || null });
  } catch { return NextResponse.json({ user: null }); }
}
