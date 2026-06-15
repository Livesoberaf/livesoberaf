import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v2 as cloudinary } from "cloudinary";
import { getSupabaseAdmin } from "@/lib/supabase";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const creatorId   = cookieStore.get("creator_id")?.value;
  if (!creatorId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { data: creator } = await getSupabaseAdmin()
    .from("creators")
    .select("id, pathway, role")
    .eq("id", creatorId)
    .single();
  if (!creator) return NextResponse.json({ error: "Creator not found." }, { status: 401 });

  const { promptId, slotId } = await request.json();

  let folder:   string;
  let publicId: string;

  if (promptId) {
    const { data: prompt } = await getSupabaseAdmin()
      .from("prompts")
      .select("pathway")
      .eq("id", promptId)
      .single();

    const pathway = prompt?.pathway ?? "universal";
    folder   = `livesoberaf/${creator.role}/${pathway}`;
    publicId = promptId;
  } else if (slotId) {
    folder   = `livesoberaf/sponsor/${creator.pathway}`;
    publicId = `${creator.id}-${slotId}`;
  } else {
    return NextResponse.json({ error: "promptId or slotId required." }, { status: 400 });
  }

  const timestamp    = Math.round(Date.now() / 1000);
  const paramsToSign = { folder, public_id: publicId, timestamp };
  const signature    = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET!);

  return NextResponse.json({
    signature,
    timestamp,
    apiKey:    process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
    publicId,
  });
}
