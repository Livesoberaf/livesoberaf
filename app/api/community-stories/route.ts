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

    type Session = {
      sessionId: string; sharerName: string; pathway: string;
      dayNumber: number; ageRange: string; sex: string; region: string;
      createdAt: string;
      clips: { videoUrl: string; question: string; questionIndex: number }[];
    };

    const map = new Map<string, Session>();

    for (const row of data as Row[]) {
      let s = map.get(row.session_id);
      if (!s) {
        s = {
          sessionId: row.session_id,
          sharerName: row.sharer_name,
          pathway:    row.pathway,
          dayNumber:  row.day_number,
          ageRange:   row.age_range,
          sex:        row.sex,
          region:     row.region,
          createdAt:  row.created_at,
          clips:      [],
        };
        map.set(row.session_id, s);
      }
      s.clips.push({
        videoUrl:      row.cloudinary_url,
        question:      QUESTIONS[row.question_index] ?? "",
        questionIndex: row.question_index,
      });
    }

    // Sort each session's clips by question order
    const stories = Array.from(map.values()).map((s) => ({
      ...s,
      clips: s.clips.sort((a, b) => a.questionIndex - b.questionIndex),
    }));

    return NextResponse.json({ stories });
  } catch {
    return NextResponse.json({ stories: [] });
  }
}
