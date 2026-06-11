import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const VALID_PATHWAYS     = ["Alcohol","Cocaine","Codeine","Heroin","Gambling","Cannabis","Other"];
const VALID_PLACEMENTS   = ["early_days","day_1","week_1","craving","low_moment","milestone","story"];

export async function POST(request: Request) {
  try {
    const {
      sessionId,
      questionIndex,
      sharerName,
      dayNumber,
      pathway,
      ageRange,
      sex,
      region,
      cloudinaryUrl,
      consent,
      appPlacement,
    } = await request.json();

    if (!sessionId || questionIndex == null || !sharerName || !dayNumber ||
        !pathway || !ageRange || !sex || !region || !cloudinaryUrl) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (questionIndex < 0 || questionIndex > 14) {
      return NextResponse.json({ error: "Invalid question index." }, { status: 400 });
    }
    const day = Number(dayNumber);
    if (!Number.isInteger(day) || day < 1) {
      return NextResponse.json({ error: "Invalid day number." }, { status: 400 });
    }
    if (!VALID_PATHWAYS.includes(pathway)) {
      return NextResponse.json({ error: "Invalid pathway." }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ error: "Consent required." }, { status: 400 });
    }

    const placement = VALID_PLACEMENTS.includes(appPlacement) ? appPlacement : "story";

    const { error } = await getSupabaseAdmin().from("peer_clips").insert({
      session_id:     sessionId,
      question_index: Number(questionIndex),
      sharer_name:    sharerName,
      day_number:     day,
      pathway,
      age_range:      ageRange,
      sex,
      region,
      cloudinary_url: cloudinaryUrl,
      status:         "pending",
      consent,
      app_placement:  placement,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save clip record." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("peer-clip API error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
