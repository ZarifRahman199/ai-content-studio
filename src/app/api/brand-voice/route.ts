import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function getUser(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  if (!session) return null;
  return await db.user.findUnique({ where: { sessionToken: session } });
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const voices = await db.brandVoice.findMany({ where: { userId: user.id } });
    return NextResponse.json({ voices });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { name, tone, style, audience, keywords } = await request.json();
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
    const voice = await db.brandVoice.create({ data: { userId: user.id, name, tone: tone || "", style: style || "", audience: audience || "", keywords: keywords || [] } });
    return NextResponse.json(voice, { status: 201 });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await request.json();
    await db.brandVoice.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
