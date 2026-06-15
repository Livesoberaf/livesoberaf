import Link from "next/link";
import { ALCOHOL_CONTENT, ALL_SLOT_IDS } from "@/lib/sponsor-content";
import { getSessionCreator } from "@/lib/auth-helpers";
import {
  getCreatorPrompts,
  getMattPrompts,
  getRecordedPromptIds,
  momentLabel,
  moodLabel,
  type Prompt,
} from "@/lib/prompts";

export const dynamic = "force-dynamic";

const TIME_LABELS: Record<string, string> = {
  Morning:           "Morning",
  "Mid-morning":     "Mid-morning",
  Midday:            "Midday",
  Afternoon:         "Afternoon",
  Evening:           "Evening",
  "Sleep support":   "Sleep",
  "Craving support": "Craving",
  Monthly:           "Monthly",
};

const IMPACT_MESSAGES: Record<string, string> = {
  "d1-3":    "People watch these on Day 1. Your voice is the first thing they hear.",
  "d4-7":    "Week one is brutal. These clips are what gets people to week two.",
  "d8-14":   "Week two is when many people give up. You're the reason they don't.",
  "d15-30":  "The first month matters more than any other. These carry people through it.",
  "m2":      "Month two is when the pink cloud fades. Your clips keep them steady.",
  "m3":      "Three months is a milestone most people never reach. You helped them get there.",
  "ongoing": "Long-term recovery needs long-term voices. Yours keeps people going.",
};

async function getUploadedSlots(pathway: string): Promise<Set<string>> {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey    = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) return new Set();

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const res  = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/upload?prefix=livesoberaf/sponsor/${pathway}&max_results=100`,
      { headers: { Authorization: `Basic ${auth}` }, next: { revalidate: 60 } }
    );
    if (!res.ok) return new Set();
    const data = await res.json();
    const ids  = new Set<string>();
    for (const r of data.resources ?? []) {
      const id = (r.public_id as string).split("/").pop();
      if (id) ids.add(id);
    }
    return ids;
  } catch {
    return new Set();
  }
}

function promptSubLabel(p: Prompt): string {
  if (p.trigger_type === "mood") return moodLabel(p.mood);
  if (p.trigger_type === "day")  return momentLabel(p.moment);
  return p.event ?? "";
}

// ── Matt's dashboard ──────────────────────────────────────────────────────────

async function MattDashboard({ creatorId }: { creatorId: string }) {
  const [prompts, recorded] = await Promise.all([
    getMattPrompts(),
    getRecordedPromptIds(creatorId),
  ]);

  const moodPrompts  = prompts.filter((p) => p.trigger_type === "mood");
  const dayPrompts   = prompts.filter((p) => p.trigger_type === "day");

  const done = prompts.filter((p) => recorded.has(p.id)).length;

  return (
    <>
      <p className="mt-8 max-w-3xl text-xl leading-8 text-white/75">
        {done} of {prompts.length} responses recorded.
      </p>
      <p className="mt-4 text-lg leading-8 text-white/60">
        {done === 0
          ? "Start with the mood responses — they're triggered whenever someone checks in."
          : done === prompts.length
          ? "All responses recorded. The pipeline is live."
          : "Every response you record reaches someone at the right moment."}
      </p>

      {moodPrompts.length > 0 && (
        <section className="mt-20 space-y-8">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">MOOD RESPONSES</h2>
          <p className="text-lg leading-8 text-white/60">
            Triggered when someone checks in and says how they&apos;re feeling.
          </p>
          <PromptList prompts={moodPrompts} recorded={recorded} />
        </section>
      )}

      {dayPrompts.length > 0 && (
        <section className="mt-20 space-y-8">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">DAILY IDEAS</h2>
          <p className="text-lg leading-8 text-white/60">
            Delivered at a specific point in someone&apos;s recovery journey.
          </p>
          <PromptList prompts={dayPrompts} recorded={recorded} showDay />
        </section>
      )}
    </>
  );
}

// ── Shared prompt list component ─────────────────────────────────────────────

function PromptList({
  prompts,
  recorded,
  showDay = false,
}: {
  prompts: Prompt[];
  recorded: Set<string>;
  showDay?: boolean;
}) {
  return (
    <div className="flex flex-col">
      {prompts.map((p) => {
        const done   = recorded.has(p.id);
        const sub    = [
          showDay && p.day_number != null ? `Day ${p.day_number}` : null,
          promptSubLabel(p),
        ].filter(Boolean).join(" · ");

        return (
          <Link
            key={p.id}
            href={`/sponsor/studio/prompt/${p.id}`}
            className="group flex items-start gap-5 py-5 transition-colors"
          >
            <span className="mt-1 text-sm w-4 shrink-0 text-white/60 group-hover:text-[#ff0099] transition-colors">
              {done ? "✓" : ""}
            </span>
            <div className="min-w-0">
              <p className={`text-2xl font-semibold tracking-[0.05em] transition-colors group-hover:text-[#ff0099] ${done ? "text-white/40" : "text-white"}`}>
                {p.title}
              </p>
              {sub && (
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/30">{sub}</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ── Creator dashboard ─────────────────────────────────────────────────────────

async function CreatorDashboard({
  creatorId,
  pathway,
  uploadedSlots,
}: {
  creatorId: string;
  pathway: string;
  uploadedSlots: Set<string>;
}) {
  const [dbPrompts, recorded] = await Promise.all([
    getCreatorPrompts(pathway),
    getRecordedPromptIds(creatorId),
  ]);

  // Group DB prompts by day_number
  const promptsByDay = new Map<number, Prompt[]>();
  for (const p of dbPrompts) {
    const day = p.day_number ?? 0;
    if (!promptsByDay.has(day)) promptsByDay.set(day, []);
    promptsByDay.get(day)!.push(p);
  }
  const sortedDays = [...promptsByDay.keys()].sort((a, b) => a - b);

  const totalLegacy   = ALL_SLOT_IDS.filter((id) => !id.startsWith("day1")).length;
  const uploadedCount = ALL_SLOT_IDS
    .filter((id) => !id.startsWith("day1"))
    .filter((id) => uploadedSlots.has(id)).length;

  const dbDone  = dbPrompts.filter((p) => recorded.has(p.id)).length;
  const total   = dbPrompts.length + totalLegacy;
  const done    = dbDone + uploadedCount;

  return (
    <>
      <p className="mt-8 max-w-3xl text-xl leading-8 text-white/75">
        {done} of {total} clips recorded.
      </p>
      <p className="mt-4 text-lg leading-8 text-white/60">
        {done === 0
          ? "Start with Day 1 — those reach people in their very first hours."
          : done === total
          ? "Every clip is recorded. You've built something that will genuinely help people."
          : done <= 4
          ? "These first clips are already reaching people on their hardest days."
          : `${done} clips live. Every one of them is helping someone right now.`}
      </p>

      {/* DB-driven prompts by day */}
      {sortedDays.map((day) => (
        <section key={day} className="mt-20 space-y-8">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            DAY {day}
          </h2>
          <PromptList prompts={promptsByDay.get(day)!} recorded={recorded} />
        </section>
      ))}

      {/* Legacy hardcoded stages (all except day1 which is now DB-driven) */}
      {ALCOHOL_CONTENT.filter((s) => s.id !== "day1").map((stage) => {
        const impact = IMPACT_MESSAGES[stage.id];
        return (
          <section key={stage.id} className="mt-20 space-y-8">
            <div>
              <h2 className="text-3xl font-semibold tracking-[0.15em]">
                {stage.label.toUpperCase()}
              </h2>
              {impact && (
                <p className="mt-6 text-lg leading-8 text-white/70">{impact}</p>
              )}
            </div>
            <div className="flex flex-col">
              {stage.slots.map((slot) => {
                const slotDone = uploadedSlots.has(slot.id);
                return (
                  <Link
                    key={slot.id}
                    href={`/sponsor/studio/${slot.id}`}
                    className="group flex items-start gap-5 py-5 transition-colors"
                  >
                    <span className="mt-1 text-sm w-4 shrink-0 text-white/60 group-hover:text-[#ff0099] transition-colors">
                      {slotDone ? "✓" : ""}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-2xl font-semibold tracking-[0.05em] transition-colors group-hover:text-[#ff0099] ${slotDone ? "text-white/40" : "text-white"}`}>
                        {slot.title}
                      </p>
                      <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/30">
                        {TIME_LABELS[slot.timeLabel] ?? slot.timeLabel} · {slot.duration}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function SponsorDashboard() {
  const creator = await getSessionCreator();
  // middleware guarantees creator exists, but guard for type safety
  if (!creator) return null;

  const isMatt        = creator.role === "matt";
  const pathway       = creator.pathway ?? "alcohol";
  const uploadedSlots = isMatt ? new Set<string>() : await getUploadedSlots(pathway);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-5xl">

        <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">LIVESOBERAF</p>

        <h1 className="mt-4 text-4xl sm:text-5xl md:text-7xl font-semibold tracking-[0.18em] break-words">
          {isMatt ? "MATT'S STUDIO" : "CREATOR STUDIO"}
        </h1>

        <form action="/api/sponsor/logout" method="POST" className="mt-8">
          <button className="text-sm uppercase tracking-[0.3em] text-white/30 hover:text-white transition">
            Sign out — {creator.name}
          </button>
        </form>

        {isMatt ? (
          <MattDashboard creatorId={creator.id} />
        ) : (
          <CreatorDashboard
            creatorId={creator.id}
            pathway={pathway}
            uploadedSlots={uploadedSlots}
          />
        )}

        <section className="mt-24 border-t border-white/10 pt-12">
          <p className="text-white/20 text-xs uppercase tracking-[0.2em]">
            Content is reviewed by admin before going live
          </p>
        </section>

      </div>
    </main>
  );
}
