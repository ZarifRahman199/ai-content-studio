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
    const stats = await db.stats.getUserStats(user.id);
    const brandVoices = (await db.brandVoice.findMany({ where: { userId: user.id } })).length;
    const teamMembers = (await db.teamMember.findMany({ where: { userId: user.id } })).length;
    return NextResponse.json({ ...stats, brandVoices, teamMembers });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
