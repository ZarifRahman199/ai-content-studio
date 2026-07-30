import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    if (action === "signup") {
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();
      if (existing) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = generateToken();
      const { data: user, error } = await supabase
        .from("users")
        .insert({
          email,
          password: hashedPassword,
          name: name || email.split("@")[0],
          session_token: token,
          credits: 10,
          plan: "free",
        })
        .select("id, email, name, credits, plan")
        .single();
      if (error || !user) {
        return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
      }
      const response = NextResponse.json({ user });
      response.cookies.set("session", token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
      return response;
    }

    if (action === "login") {
      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();
      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      const token = generateToken();
      const { error } = await supabase
        .from("users")
        .update({ session_token: token })
        .eq("id", user.id);
      if (error) {
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
      }
      const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, credits: user.credits, plan: user.plan } });
      response.cookies.set("session", token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
      return response;
    }

    if (action === "logout") {
      const session = request.cookies.get("session")?.value;
      if (session) {
        await supabase
          .from("users")
          .update({ session_token: null })
          .eq("session_token", session);
      }
      const response = NextResponse.json({ success: true });
      response.cookies.set("session", "", { httpOnly: true, sameSite: "lax", maxAge: 0, path: "/" });
      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ user: null });
    }
    const { data: user } = await supabase
      .from("users")
      .select("id, email, name, credits, plan")
      .eq("session_token", session)
      .single();
    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}