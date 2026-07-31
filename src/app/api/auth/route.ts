import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

function db() {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const k = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!u || !k) throw new Error("Missing Supabase env vars");
  return createClient(u, k);
}

function tk() { return Math.random().toString(36).substring(2) + Date.now().toString(36); }

export async function POST(req: NextRequest) {
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
  
