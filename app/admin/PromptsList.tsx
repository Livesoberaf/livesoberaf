import { getSupabaseAdmin } from "@/lib/supabase";
import { momentLabel, moodLabel } from "@/lib/prompts";

type PromptRow = {
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

export default async function PromptsList() {
  const { data } = await getSupabaseAdmin()
    .from("prompts")
    .select("id, role, trigger_type, day_number, moment, mood, event, pathway, title, sequence, active, brief")
    .order("role").order("day_number", { nullsFirst: false }).order("sequence");

  const prompts = (data ?? []) as PromptRow[];

  if (prompts.length === 0) {
    return (
      <p className="mt-4 text-lg leading-8 text-white/50">
        No prompts yet. Run the seed SQL to add the Day 1 and Matt prompts.
      </p>
    );
  }

  const byRole: Record<string, PromptRow[]> = {};
  for (const p of prompts) {
    (byRole[p.role] ??= []).push(p);
  }

  return (
    <div className="mt-8 space-y-16">
      {Object.entries(byRole).map(([role, rows]) => (
        <div key={role}>
          <h3 className="text-xl font-semibold tracking-[0.12em] text-white/60 mb-6">
            {role.toUpperCase()}
          </h3>
          <div className="flex flex-col divide-y divide-white/5">
            {rows.map((p) => {
              const address = [
                p.day_number != null ? `Day ${p.day_number}` : null,
                p.moment  ? momentLabel(p.moment)  : null,
                p.mood    ? moodLabel(p.mood)       : null,
                p.event   ?? null,
                p.pathway ?? "universal",
              ].filter(Boolean).join(" · ");

              return (
                <div key={p.id} className="py-5">
                  <p className={`text-lg font-semibold ${p.active ? "text-white" : "text-white/30"}`}>
                    {p.title}
                  </p>
                  <p className="mt-1 text-sm uppercase tracking-[0.18em] text-white/30">
                    {address}
                  </p>
                  <p className="mt-2 text-sm text-white/40 leading-6 max-w-xl line-clamp-2">
                    {p.brief}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
