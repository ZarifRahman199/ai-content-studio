import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { sessionToken: session } });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, amount } = await request.json();

    if (action === "add" && amount && amount > 0) {
      const updated = await db.user.update({
        where: { id: user.id },
        data: { credits: user.credits + amount },
      });
      return NextResponse.json({ credits: updated.credits });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to update credits" }, { status: 500 });
  }
}
