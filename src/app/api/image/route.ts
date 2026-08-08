import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

async function getUser(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  if (!session) return null;
  return await db.user.findUnique({ where: { sessionToken: session } });
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.credits < 2) return NextResponse.json({ error: "Need 2 credits" }, { status: 403 });

    const { prompt, style } = await request.json();
    if (!prompt) return NextResponse.json({ error: "Prompt required" }, { status: 400 });

    // Use pollinations.ai for free image generation
    const encodedPrompt = encodeURIComponent(`${prompt}, ${style || "realistic"} style, high quality`);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

    // Save to generations
    await db.user.update({ where: { id: user.id }, data: { credits: { decrement: 2 } } });
    await db.generation.create({ userId: user.id, type: "image", topic: prompt.substring(0, 100), tone: style || "realistic", length: "medium", output: imageUrl, language: "en" });

    const updatedUser = await db.user.findUnique({ where: { id: user.id } });
    return NextResponse.json({ url: imageUrl, credits: updatedUser?.credits || 0 });
  } catch (error) {
    console.error("Image error:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
