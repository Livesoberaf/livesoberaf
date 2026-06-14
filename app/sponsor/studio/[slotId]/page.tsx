import { notFound } from "next/navigation";
import Link from "next/link";
import { getSlotById, getStageForSlot } from "@/lib/sponsor-content";
import UploadForm from "../UploadForm";

// A short note about who watches this specific clip and why it matters
const IMPACT_NOTES: Record<string, string> = {
  "day1-morning":       "They woke up this morning and didn't drink. They're scared and shaking and they don't know if they can do this. You're the first voice they hear.",
  "day1-mid-morning":   "Physical symptoms are peaking right now. They may think something is wrong with them specifically. Your job is to name it and normalise it.",
  "day1-lunch":         "They made it to lunch — the first small promise they kept today. They need to hear that it counts.",
  "day1-afternoon":     "Bargaining thoughts are hitting hard. 'One won't hurt.' 'I'll start tomorrow.' They need to be warned before those thoughts win.",
  "day1-late-afternoon":"Before the evening gets hard, they need to reach out. This clip is the push that gets them to do it.",
  "day1-evening":       "The highest-risk hour of the hardest day. They need to know the craving will pass — and that all they have to do is outlast this one.",
  "day1-before-bed":    "They made it through Day 1. No one who watches this clip has had a harder day than today. Tell them that.",
  "d1-3-morning":    "Someone who woke up sober for one of the first times. They're shaking. They need to hear a human voice that has been here.",
  "d1-3-afternoon":  "Peak withdrawal. The urge is loudest right now. Your words are what stands between them and giving up.",
  "d1-3-evening":    "The hardest hour of the hardest days. Getting them to tomorrow morning is everything.",
  "d1-3-craving":    "They're watching this mid-craving. Keep it short, warm and direct — you've got about 60 seconds.",
  "d4-7-morning":    "They made it through the worst. They might not feel it yet — help them see it.",
  "d4-7-afternoon":  "Still wobbly, but getting through it. Your experience of this exact stretch gives them permission to feel how they feel.",
  "d4-7-evening":    "Building new habits is strange and uncomfortable. You know that. Tell them.",
  "d4-7-sleep":      "Lying awake at 3am, thinking the insomnia will never end. Give them the truth — and the hope.",
  "d8-14-morning":   "The physical is clearing but the emotional is hardening. Many people relapse in week two. This clip is why they don't.",
  "d8-14-afternoon": "Flat. Irritable. Wondering if they're getting worse. This is the moment your honesty matters most.",
  "d8-14-evening":   "Week two evenings can feel lonelier than week one. Remind them connection is the answer.",
  "d15-30-morning":  "Nearly a month. They've done something extraordinary and probably don't know it. Tell them.",
  "d15-30-midday":   "The changes are real — they just need someone to point them out. Be that person.",
  "d15-30-evening":  "Approaching the first big milestone. Help them feel the significance of what they've built.",
  "m2-morning":      "Weeks 5–8 blindside people. You can warn them before it hits — and that warning keeps them in recovery.",
  "m2-evening":      "Two months in. The real rebuilding starts here. Your story of what changed is what they need.",
  "m3-morning":      "Three months. Most people who reach here started where they were on Day 1. You're proof it's possible.",
  "m3-evening":      "Recovery as a way of life, not just a crisis to survive. Help them see the long view.",
  "ongoing-monthly": "A monthly reminder that someone who's been through it is still showing up. That consistency is everything.",
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

export default async function StudioPage({ params }: { params: Promise<{ slotId: string }> }) {
  const { slotId }      = await params;
  const slot            = getSlotById(slotId);
  if (!slot) notFound();

  const stage           = getStageForSlot(slotId);
  const uploadedSlots   = await getUploadedSlots();
  const alreadyUploaded = uploadedSlots.has(slotId);
  const impactNote      = IMPACT_NOTES[slotId];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-2xl">

        {/* Back */}
        <Link
          href="/sponsor"
          className="text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white transition mb-10 inline-block"
        >
          ← Back
        </Link>

        {/* Header */}
        <p className="text-sm uppercase tracking-[0.35em] text-red-300/70 mb-6">
          {stage?.label ?? ""} · {slot.timeLabel}
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-[0.15em] uppercase mb-5">
          {slot.title}
        </h1>
        <p className="text-white/40 text-sm uppercase tracking-[0.2em] mb-10">{slot.duration}</p>

        {/* What to say — the core message, shown prominently when a prompt exists */}
        {slot.prompt && (
          <div className="mb-20">
            <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-4">What to say</p>
            <p className="text-2xl leading-9 text-white/90">&ldquo;{slot.prompt}&rdquo;</p>
          </div>
        )}

        {/* Who watches this + context — merged into one section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 shrink-0">Who watches this</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {impactNote && (
            <p className="text-white/75 text-lg leading-8 mb-6">{impactNote}</p>
          )}

          <p className="text-white/50 leading-7">{slot.context}</p>
        </section>

        {/* Talking points */}
        <section className="mt-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 shrink-0">What to cover</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="flex flex-col gap-6">
            {slot.talkingPoints.map((point, i) => (
              <div key={i} className="flex gap-6 items-start border-b border-white/10 pb-6 last:border-0 last:pb-0">
                <span className="text-white/20 text-sm shrink-0 font-mono w-4">{i + 1}</span>
                <p className="text-white/75 leading-7">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recording tips */}
        <section className="mt-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 shrink-0">A few things that help</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <ul className="flex flex-col gap-4">
            {[
              "Clear audio matters more than a perfect background — a quiet room is enough",
              "Look directly into the camera lens, not at yourself on screen",
              "Lived honesty lands better than polish — don't overthink it",
              "Record a few takes and pick the one that feels most like you",
            ].map((tip) => (
              <li key={tip} className="flex gap-4 items-start text-white/50">
                <span className="text-white/20 shrink-0">·</span>
                <span className="leading-7">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Record / upload */}
        <section className="mt-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 shrink-0">Record or upload</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <UploadForm slotId={slotId} alreadyUploaded={alreadyUploaded} />
        </section>

      </div>
    </main>
  );
}
