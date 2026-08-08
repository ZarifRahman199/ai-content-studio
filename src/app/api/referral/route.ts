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
    let ref = await db.referral.findFirst({ referrerId: user.id } as any);
    if (!ref) {
      ref = await db.referral.create({ referrerId: user.id } as any);
    }
    return NextResponse.json({ code: ref.code, clicks: ref.clicks, signups: ref.signups, credits: ref.credits });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
