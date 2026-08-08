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
    const events = await db.calendarEvent.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } });
    return NextResponse.json({ events });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { title, date, platform, status } = await request.json();
    if (!title || !date) return NextResponse.json({ error: "Title and date required" }, { status: 400 });
    const event = await db.calendarEvent.create({ data: { userId: user.id, title, date, platform: platform || "Instagram", status: status || "scheduled" } });
    return NextResponse.json(event, { status: 201 });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await request.json();
    await db.calendarEvent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
