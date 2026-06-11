import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { ALL_SLOT_IDS } from "@/lib/sponsor-content";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function uploadToCloudinary(buffer: Buffer, options: object): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) reject(error);
      else resolve(result as { secure_url: string; public_id: string });
    });
    Readable.from(buffer).pipe(stream);
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const slotId = formData.get("slotId") as string | null;

    if (!file || !slotId) {
      return NextResponse.json({ error: "Missing file or slot ID." }, { status: 400 });
    }

    if (!ALL_SLOT_IDS.includes(slotId)) {
      return NextResponse.json({ error: "Unknown slot ID." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadToCloudinary(buffer, {
      resource_type: "video",
      folder: "livesoberaf/sponsor/alcohol",
      public_id: slotId,
      overwrite: true,
      context: {
        slotId,
        pathway: "alcohol",
        status: "submitted",
        uploadedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ success: true, videoUrl: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
