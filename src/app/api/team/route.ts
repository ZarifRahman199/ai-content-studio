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
    const members = await db.teamMember.findMany({ where: { userId: user.id } });
    return NextResponse.json({ members });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.plan !== "business") return NextResponse.json({ error: "Business plan required" }, { status: 403 });
    const { email, role } = await request.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    const member = await db.teamMember.create({ data: { userId: user.id, email, name: email.split("@")[0], role: role || "member" } });
    return NextResponse.json(member, { status: 201 });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await request.json();
    await db.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
