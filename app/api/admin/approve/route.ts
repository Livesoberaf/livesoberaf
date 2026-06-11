import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { ALL_SLOT_IDS } from "@/lib/sponsor-content";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { slotId } = await request.json();

  if (!slotId || !ALL_SLOT_IDS.includes(slotId)) {
    return NextResponse.json({ error: "Unknown slot ID." }, { status: 400 });
  }

  const publicId = `livesoberaf/sponsor/alcohol/${slotId}`;

  // Remove rejected tag if present, then add approved
  await cloudinary.uploader.remove_tag("rejected", [publicId]).catch(() => null);
  await cloudinary.uploader.add_tag("approved", [publicId]);

  return NextResponse.json({ ok: true });
}
