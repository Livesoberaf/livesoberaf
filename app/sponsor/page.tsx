import Link from "next/link";
import { ALCOHOL_CONTENT, ALL_SLOT_IDS } from "@/lib/sponsor-content";

const TIME_LABELS: Record<string, string> = {
  Morning:           "Morning",
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

async function getUploadedSlots(): Promise<Set<string>> {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey    = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) return new Set();

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const res  = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/upload?prefix=livesoberaf/sponsor/alcohol&max_results=100`,
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

export default async function SponsorDashboard() {
  const uploadedSlots = await getUploadedSlots();
  const total    = ALL_SLOT_IDS.length;
  const uploaded = ALL_SLOT_IDS.filter((id) => uploadedSlots.has(id)).length;

  const impactLine =
    uploaded === 0
      ? "Start with Days 1–3 — those reach people in their very first hours."
      : uploaded === total
      ? "Every slot is recorded. You've built something that will genuinely help people."
      : uploaded <= 4
      ? "These first clips are already reaching people on their hardest days."
      : `${uploaded} clips live. Every one of them is helping someone right now.`;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
          LIVESOBERAF
        </p>

        <h1 className="mt-4 text-4xl sm:text-5xl md:text-7xl font-semibold tracking-[0.18em] break-words">
          CREATOR STUDIO
        </h1>

        {/* Impact — open text, no card */}
        <p className="mt-8 max-w-3xl text-xl leading-8 text-white/75">
          {uploaded} of {total} clips recorded.
        </p>

        <p className="mt-4 text-lg leading-8 text-white/60">
          {impactLine}
        </p>

        <form action="/api/sponsor/logout" method="POST" className="mt-8">
          <button className="text-sm uppercase tracking-[0.3em] text-white/30 hover:text-white transition">
            Sign out
          </button>
        </form>

        {/* Clip stages */}
        {ALCOHOL_CONTENT.map((stage) => {
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

              {/* Clips — editorial links, no borders, no table rows */}
              <div className="flex flex-col">
                {stage.slots.map((slot) => {
                  const done = uploadedSlots.has(slot.id);
                  return (
                    <Link
                      key={slot.id}
                      href={`/sponsor/studio/${slot.id}`}
                      className="group flex items-start gap-5 py-5 transition-colors"
                    >
                      {/* Tick — holds space whether recorded or not */}
                      <span className="mt-1 text-sm w-4 shrink-0 text-white/60 group-hover:text-[#ff0099] transition-colors">
                        {done ? "✓" : ""}
                      </span>

                      <div className="min-w-0">
                        <p className={`text-2xl font-semibold tracking-[0.05em] transition-colors group-hover:text-[#ff0099] ${done ? "text-white/40" : "text-white"}`}>
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

        <section className="mt-24 border-t border-white/10 pt-12">
          <p className="text-white/20 text-xs uppercase tracking-[0.2em]">
            Content is reviewed by admin before going live
          </p>
        </section>

      </div>
    </main>
  );
}
