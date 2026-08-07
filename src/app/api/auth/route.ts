import { db } from "@/lib/db";
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
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = generateToken();
      const user = await db.user.create({
        data: { email, password: hashedPassword, name: name || email.split("@")[0], sessionToken: token, credits: 10 },
      });
      const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, credits: user.credits, plan: user.plan } });
      response.cookies.set("session", token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
      return response;
    }

    if (action === "login") {
      const user = await db.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      const token = generateToken();
      const updated = await db.user.update({ where: { id: user.id }, data: { sessionToken: token } });
      const response = NextResponse.json({ user: { id: updated.id, email: updated.email, name: updated.name, credits: updated.credits, plan: updated.plan } });
      response.cookies.set("session", token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
      return response;
    }

    if (action === "logout") {
      const session = request.cookies.get("session")?.value;
      if (session) {
        await db.user.updateMany({ where: { sessionToken: session }, data: { sessionToken: null } });
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
    const user = await db.user.findUnique({ where: { sessionToken: session } });
    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, credits: user.credits, plan: user.plan } });
  } catch {
    return NextResponse.json({ user: null });
  }
}