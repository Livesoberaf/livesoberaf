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

type Row = {
  session_id: string;
  sharer_name: string;
  pathway: string;
  day_number: number;
  age_range: string;
  sex: string;
  region: string;
  cloudinary_url: string;
  question_index: number;
  created_at: string;
};

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("peer_clips")
      .select("session_id, sharer_name, pathway, day_number, age_range, sex, region, cloudinary_url, question_index, created_at")
      .eq("status",  "approved")
      .eq("consent", true)
      .order("created_at", { ascending: false });

    if (error || !data) return NextResponse.json({ stories: [] });

    // Group clips by session; track the clip with the lowest question_index
    // as the lead video for each story card.
    type Session = {
      sessionId: string; sharerName: string; pathway: string;
      dayNumber: number; ageRange: string; sex: string; region: string;
      firstVideoUrl: string; firstQuestion: string;
      answerCount: number; createdAt: string; minQIndex: number;
    };

    const map = new Map<string, Session>();

    for (const row of data as Row[]) {
      const s = map.get(row.session_id);
      if (!s) {
        map.set(row.session_id, {
          sessionId:     row.session_id,
          sharerName:    row.sharer_name,
          pathway:       row.pathway,
          dayNumber:     row.day_number,
          ageRange:      row.age_range,
          sex:           row.sex,
          region:        row.region,
          firstVideoUrl: row.cloudinary_url,
          firstQuestion: QUESTIONS[row.question_index] ?? "",
          answerCount:   1,
          createdAt:     row.created_at,
          minQIndex:     row.question_index,
        });
      } else {
        s.answerCount++;
        if (row.question_index < s.minQIndex) {
          s.minQIndex     = row.question_index;
          s.firstVideoUrl = row.cloudinary_url;
          s.firstQuestion = QUESTIONS[row.question_index] ?? "";
        }
      }
    }

    // Strip internal minQIndex before returning
    const stories = Array.from(map.values()).map(({ minQIndex: _q, ...rest }) => rest);
    return NextResponse.json({ stories });
  } catch {
    return NextResponse.json({ stories: [] });
  }
}
