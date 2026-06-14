import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const QUESTIONS = [
  "Before recovery, what was life like when things were at their worst?",
  "Looking back, what was your lowest point?",
  "What finally made you decide to change?",
  "What was day one like?",
  "What got you through the first week?",
  "When a craving hit hard, what did you actually do to get through it?",
  "What was the hardest part of early recovery for you?",
  "Was there a moment you nearly gave up — and what kept you going?",
  "What's something you've got back that you thought you'd lost for good?",
  "What surprised you most about getting sober?",
  "What's a small, ordinary thing you love about life sober now?",
  "What does life look like for you now?",
  "How are you different now from the person you were then?",
  "What would you say to someone on their very first day?",
  "What would you say to someone who feels like giving up right now?",
];

type PeerClipRow = {
  id: string;
  question_index: number;
  sharer_name: string;
  day_number: number;
  age_range: string;
  sex: string;
  region: string;
  cloudinary_url: string;
};

function score(
  clip: PeerClipRow,
  ageRange: string | null,
  sex: string | null,
  region: string | null,
): number {
  let s = Math.random();
  if (ageRange && clip.age_range === ageRange) s += 2;
  if (sex      && clip.sex       === sex)      s += 1.5;
  if (region   && clip.region    === region)   s += 1;
  return s;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const day        = Number(searchParams.get("day"));
  const pathway    = searchParams.get("pathway");
  const ageRange   = searchParams.get("ageRange");
  const sex        = searchParams.get("sex");
  const region     = searchParams.get("region");
  const placement  = searchParams.get("placement"); // optional: filter by app_placement

  if (!day || day < 1 || !pathway) {
    return NextResponse.json({ clips: [] });
  }

  try {
    let query = getSupabaseAdmin()
      .from("peer_clips")
      .select("id, question_index, sharer_name, day_number, age_range, sex, region, cloudinary_url")
      .eq("day_number", day)
      .eq("pathway",    pathway)
      .eq("status",     "approved")
      .eq("consent",    true);

    if (placement) query = query.eq("app_placement", placement);

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return NextResponse.json({ clips: [] });
    }

    const byQuestion = new Map<number, PeerClipRow[]>();
    for (const clip of data as PeerClipRow[]) {
      const list = byQuestion.get(clip.question_index) ?? [];
      list.push(clip);
      byQuestion.set(clip.question_index, list);
    }

    const selected = [];
    for (let i = 0; i < QUESTIONS.length; i++) {
      const options = byQuestion.get(i);
      if (!options?.length) continue;
      const best = options.sort((a, b) => score(b, ageRange, sex, region) - score(a, ageRange, sex, region))[0];
      selected.push({
        id:            best.id,
        questionIndex: best.question_index,
        question:      QUESTIONS[best.question_index] ?? "",
        sharerName:    best.sharer_name,
        dayNumber:     best.day_number,
        videoUrl:      best.cloudinary_url,
      });
    }

    const response = NextResponse.json({ clips: selected });
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
    return response;

  } catch {
    return NextResponse.json({ clips: [] });
  }
}
