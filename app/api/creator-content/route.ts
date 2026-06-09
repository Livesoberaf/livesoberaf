import { NextResponse } from "next/server";
import { ALCOHOL_CONTENT } from "@/lib/sponsor-content";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stage     = searchParams.get("stage");
  const timeLabel = searchParams.get("timeLabel");

  if (!stage || !timeLabel) return NextResponse.json({ clip: null });

  const stageContent = ALCOHOL_CONTENT.find((s) => s.id === stage);
  if (!stageContent) return NextResponse.json({ clip: null });

  const slot = stageContent.slots.find((s) => s.timeLabel === timeLabel);
  if (!slot) return NextResponse.json({ clip: null });

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey    = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) return NextResponse.json({ clip: null });

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/upload/livesoberaf/sponsor/alcohol/${slot.id}?tags=true`,
      {
        headers: { Authorization: `Basic ${auth}` },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) return NextResponse.json({ clip: null });

    const data = await res.json();
    const tags: string[] = data.tags ?? [];

    if (!tags.includes("approved")) return NextResponse.json({ clip: null });

    return NextResponse.json({
      clip: {
        slotId:   slot.id,
        title:    slot.title,
        videoUrl: `https://res.cloudinary.com/${cloudName}/video/upload/livesoberaf/sponsor/alcohol/${slot.id}`,
        duration: slot.duration,
      },
    });
  } catch {
    return NextResponse.json({ clip: null });
  }
}
