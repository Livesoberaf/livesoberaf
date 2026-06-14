import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { cookies } from "next/headers";
import { ALL_SLOT_IDS } from "@/lib/sponsor-content";
import { getSupabaseAdmin } from "@/lib/supabase";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function uploadToCloudinary(
  buffer: Buffer,
  options: object
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) reject(error);
      else resolve(result as { secure_url: string; public_id: string });
    });
    Readable.from(buffer).pipe(stream);
  });
}

// Map slot stage to app_placement and a representative sober day for range matching
function slotMeta(slotId: string): { app_placement: string; day_number: number } {
  if (slotId.startsWith("day1"))   return { app_placement: "day_1",      day_number: 1  };
  if (slotId.includes("craving"))  return { app_placement: "craving",    day_number: 5  };
  if (slotId.includes("sleep"))    return { app_placement: "low_moment", day_number: 10 };
  if (slotId.startsWith("d1-3"))   return { app_placement: "early_days", day_number: 2  };
  if (slotId.startsWith("d4-7"))   return { app_placement: "week_1",     day_number: 5  };
  if (slotId.startsWith("d8-14"))  return { app_placement: "week_1",     day_number: 11 };
  if (slotId.startsWith("d15-30")) return { app_placement: "milestone",  day_number: 22 };
  if (slotId.startsWith("m2"))     return { app_placement: "milestone",  day_number: 45 };
  if (slotId.startsWith("m3"))     return { app_placement: "milestone",  day_number: 75 };
  if (slotId.startsWith("ongoing"))return { app_placement: "milestone",  day_number: 90 };
  return { app_placement: "story", day_number: 30 };
}

export async function POST(request: Request) {
  try {
    // Identify the creator from their session cookie
    const cookieStore = await cookies();
    const creatorId   = cookieStore.get("creator_id")?.value;

    if (!creatorId) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { data: creator, error: creatorError } = await getSupabaseAdmin()
      .from("creators")
      .select("id, name, pathway, region, sex, age_range")
      .eq("id", creatorId)
      .single();

    if (creatorError || !creator) {
      return NextResponse.json({ error: "Creator not found." }, { status: 401 });
    }

    const formData = await request.formData();
    const file     = formData.get("file") as File | null;
    const slotId   = formData.get("slotId") as string | null;

    if (!file || !slotId) {
      return NextResponse.json({ error: "Missing file or slot ID." }, { status: 400 });
    }

    if (!ALL_SLOT_IDS.includes(slotId)) {
      return NextResponse.json({ error: "Unknown slot ID." }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadToCloudinary(buffer, {
      resource_type: "video",
      folder:        `livesoberaf/sponsor/${creator.pathway}`,
      public_id:     `${creator.id}-${slotId}`,
      overwrite:     true,
      context: {
        slotId,
        creatorId:   creator.id,
        creatorName: creator.name,
        pathway:     creator.pathway,
        uploadedAt:  new Date().toISOString(),
      },
    });

    // Write to Supabase peer_clips so the clip flows through admin approval
    // and the app can serve it once approved.
    const { app_placement, day_number } = slotMeta(slotId);
    const sessionId = `studio-${creator.id}-${slotId}`;

    // Upsert by session_id so a retake replaces the pending record rather than duplicating
    const { data: existing } = await getSupabaseAdmin()
      .from("peer_clips")
      .select("id")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (existing) {
      await getSupabaseAdmin()
        .from("peer_clips")
        .update({
          cloudinary_url: result.secure_url,
          status:         "pending",
        })
        .eq("session_id", sessionId);
    } else {
      await getSupabaseAdmin()
        .from("peer_clips")
        .insert({
          session_id:     sessionId,
          question_index: 0,
          sharer_name:    creator.name,
          day_number,
          pathway:        creator.pathway,
          age_range:      creator.age_range || "",
          sex:            creator.sex,
          region:         creator.region,
          cloudinary_url: result.secure_url,
          status:         "pending",
          consent:        true,
          app_placement,
        });
    }

    return NextResponse.json({ success: true, videoUrl: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
