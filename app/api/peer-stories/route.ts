import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const QUESTIONS = [
  "How are you feeling today, honestly?",
  "What's been hardest about today?",
  "What's been helping you get through it?",
  "What would you say to someone else on this exact day?",
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

// Score a clip by how closely it matches the requesting user's profile.
// Higher = closer match. Random jitter ensures variety across sessions.
function score(clip: PeerClipRow, ageRange: string | null, sex: string | null): number {
  let s = Math.random(); // jitter so equal-score clips vary
  if (ageRange && clip.age_range === ageRange) s += 2;
  if (sex      && clip.sex       === sex)      s += 1;
  return s;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const day      = Number(searchParams.get("day"));
  const pathway  = searchParams.get("pathway");
  const ageRange = searchParams.get("ageRange");
  const sex      = searchParams.get("sex");

  if (!day || day < 1 || !pathway) {
    return NextResponse.json({ clips: [] });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("peer_clips")
      .select("id, question_index, sharer_name, day_number, age_range, sex, region, cloudinary_url")
      .eq("day_number",  day)
      .eq("pathway",     pathway)
      .eq("status",      "approved")
      .eq("consent",     true);

    if (error || !data || data.length === 0) {
      return NextResponse.json({ clips: [] });
    }

    // Group by question, then pick the best-matched clip per question
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

      // Sort by demographic match score, take the top clip
      const best = options.sort((a, b) => score(b, ageRange, sex) - score(a, ageRange, sex))[0];

      selected.push({
        id:            best.id,
        questionIndex: best.question_index,
        question:      QUESTIONS[best.question_index],
        sharerName:    best.sharer_name,
        dayNumber:     best.day_number,
        videoUrl:      best.cloudinary_url,
      });
    }

    const response = NextResponse.json({ clips: selected });
    // Cache 5 minutes at the CDN — each unique day+pathway+ageRange+sex URL is cached separately
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
    return response;

  } catch {
    return NextResponse.json({ clips: [] });
  }
}
