import { getSupabaseAdmin } from "./supabase";

export type Prompt = {
  id: string;
  role: string;
  trigger_type: string;
  day_number: number | null;
  moment: string | null;
  mood: string | null;
  event: string | null;
  pathway: string | null;
  title: string;
  brief: string;
  sequence: number;
  active: boolean;
};

export async function getCreatorPrompts(pathway: string): Promise<Prompt[]> {
  const { data } = await getSupabaseAdmin()
    .from("prompts")
    .select("*")
    .eq("role", "creator")
    .eq("pathway", pathway)
    .eq("active", true)
    .order("day_number", { ascending: true, nullsFirst: false })
    .order("sequence", { ascending: true });
  return (data as Prompt[]) ?? [];
}

export async function getMattPrompts(): Promise<Prompt[]> {
  const { data } = await getSupabaseAdmin()
    .from("prompts")
    .select("*")
    .eq("role", "matt")
    .eq("active", true)
    .order("trigger_type", { ascending: true })
    .order("sequence", { ascending: true });
  return (data as Prompt[]) ?? [];
}

export async function getPromptById(id: string): Promise<Prompt | null> {
  const { data } = await getSupabaseAdmin()
    .from("prompts")
    .select("*")
    .eq("id", id)
    .single();
  return (data as Prompt) ?? null;
}

// Returns the set of prompt IDs already recorded by this contributor (not rejected).
export async function getRecordedPromptIds(creatorId: string): Promise<Set<string>> {
  const { data } = await getSupabaseAdmin()
    .from("peer_clips")
    .select("prompt_id")
    .like("session_id", `prompt-${creatorId}-%`)
    .neq("status", "rejected")
    .not("prompt_id", "is", null);

  const ids = new Set<string>();
  for (const row of (data ?? []) as { prompt_id: string | null }[]) {
    if (row.prompt_id) ids.add(row.prompt_id);
  }
  return ids;
}

// Friendly label for a moment slug
export function momentLabel(moment: string | null): string {
  const MAP: Record<string, string> = {
    morning:       "Morning",
    mid_morning:   "Mid-morning",
    lunch:         "Lunch",
    afternoon:     "Afternoon",
    late_afternoon:"Late afternoon",
    evening:       "Evening",
    before_bed:    "Before bed",
    midday:        "Midday",
  };
  return moment ? (MAP[moment] ?? moment) : "";
}

export function moodLabel(mood: string | null): string {
  const MAP: Record<string, string> = {
    struggling: "When struggling",
    okay:       "When okay",
    good:       "When doing well",
  };
  return mood ? (MAP[mood] ?? mood) : "";
}
