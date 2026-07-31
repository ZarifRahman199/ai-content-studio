import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log("[AUTH DEBUG] URL set:", !!url, "| Key set:", !!key);
  if (!url || !key) {
    throw new Error("Missing Supabase env vars. URL: " + !!url + ", Key: " + !!key);
  }
  return createClient(url, key);
}

function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    const { action, email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    if (action === "signup") {
      const { data: existing, error: exErr } = await supabase.from("users").select("id").eq("email", email).single();
      if (exErr && exErr.code !== "PGRST116") {
        console.error("[AUTH] Check existing error:", JSON.stringify(exErr));
      }
      if (existing) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const token = generateToken();
      const { data: user, error } = await supabase.from("users").insert({
        email, password: hashedPassword, name: name || email.split("@")[0],
        session_token: token, credits: 10, plan: "free",
      }).select("id, email, name, credits, plan").single();

      if (error) {
        console.error("[AUTH] Signup error:", JSON.stringify(error));
        return NextResponse.json({ error: "Sig
