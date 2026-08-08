import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const templates = await db.template.findMany({ where: category ? { category } : undefined });
    return NextResponse.json({ templates });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
