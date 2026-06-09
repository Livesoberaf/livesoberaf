import { ALCOHOL_CONTENT } from "@/lib/sponsor-content";
import { supabaseAdmin } from "@/lib/supabase";
import AdminClipList from "./AdminClipList";
import PeerClipQueue from "./PeerClipQueue";

// ── Creator clips (Cloudinary) ────────────────────────────────────────────────

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  tags?: string[];
};

type ClipStatus = "pending" | "approved" | "rejected";

function statusFromTags(tags: string[] = []): ClipStatus {
  if (tags.includes("approved")) return "approved";
  if (tags.includes("rejected")) return "rejected";
  return "pending";
}

async function getCreatorClips(): Promise<Map<string, CloudinaryResource>> {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey    = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) return new Map();

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const res  = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/upload?prefix=livesoberaf/sponsor/alcohol&max_results=100&tags=true`,
      { headers: { Authorization: `Basic ${auth}` }, cache: "no-store" }
    );
    if (!res.ok) return new Map();
    const data = await res.json();

    const map = new Map<string, CloudinaryResource>();
    for (const r of data.resources ?? []) {
      const slotId = (r.public_id as string).split("/").pop();
      if (slotId) map.set(slotId, r as CloudinaryResource);
    }
    return map;
  } catch {
    return new Map();
  }
}

// ── Peer clips (Supabase) ─────────────────────────────────────────────────────

type PeerClipRow = {
  id: string;
  session_id: string;
  question_index: number;
  sharer_name: string;
  day_number: number;
  pathway: string;
  age_range: string;
  sex: string;
  region: string;
  cloudinary_url: string;
  status: ClipStatus;
  created_at: string;
};

type PeerSession = {
  sessionId: string;
  sharerName: string;
  dayNumber: number;
  pathway: string;
  ageRange: string;
  sex: string;
  region: string;
  createdAt: string;
  clips: PeerClipRow[];
};

async function getPendingPeerSessions(): Promise<PeerSession[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("peer_clips")
      .select("*")
      .in("status", ["pending"])
      .order("created_at", { ascending: true });

    if (error || !data) return [];

    // Group by session_id
    const sessionMap = new Map<string, PeerSession>();
    for (const row of data as PeerClipRow[]) {
      if (!sessionMap.has(row.session_id)) {
        sessionMap.set(row.session_id, {
          sessionId:   row.session_id,
          sharerName:  row.sharer_name,
          dayNumber:   row.day_number,
          pathway:     row.pathway,
          ageRange:    row.age_range,
          sex:         row.sex,
          region:      row.region,
          createdAt:   row.created_at,
          clips:       [],
        });
      }
      sessionMap.get(row.session_id)!.clips.push(row);
    }

    return Array.from(sessionMap.values());
  } catch {
    return [];
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
  const [uploaded, peerSessions] = await Promise.all([
    getCreatorClips(),
    getPendingPeerSessions(),
  ]);

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? "";

  const creatorStages = ALCOHOL_CONTENT
    .map((stage) => {
      const clips = stage.slots
        .filter((slot) => uploaded.has(slot.id))
        .map((slot) => {
          const resource = uploaded.get(slot.id)!;
          return {
            slotId:     slot.id,
            title:      slot.title,
            stageLabel: stage.label,
            timeLabel:  slot.timeLabel,
            duration:   slot.duration,
            status:     statusFromTags(resource.tags),
            videoUrl:   `https://res.cloudinary.com/${cloudName}/video/upload/${resource.public_id}`,
          };
        });
      return { stageId: stage.id, stageLabel: stage.label, clips };
    })
    .filter((s) => s.clips.length > 0);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-5xl">

        <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
          LIVESOBERAF
        </p>

        <h1 className="mt-4 text-4xl sm:text-5xl md:text-7xl font-semibold tracking-[0.18em] break-words">
          ADMIN
        </h1>

        {/* Peer story moderation — safety-critical, shown first */}
        <section className="mt-20">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            PEER STORIES
          </h2>
          <PeerClipQueue sessions={peerSessions} />
        </section>

        {/* Creator clip approval */}
        <section className="mt-24">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            CREATOR STUDIO
          </h2>
          {creatorStages.length === 0 ? (
            <p className="mt-4 text-lg leading-8 text-white/50">
              No creator clips uploaded yet.
            </p>
          ) : (
            <AdminClipList stages={creatorStages} />
          )}
        </section>

        <section className="mt-24 border-t border-white/10 pt-12 flex items-center justify-between">
          <p className="text-white/20 text-xs uppercase tracking-[0.2em]">
            Approved clips go live immediately
          </p>
          <form action="/api/admin/logout" method="POST">
            <button className="text-sm uppercase tracking-[0.3em] text-white/30 hover:text-white transition">
              Sign out
            </button>
          </form>
        </section>

      </div>
    </main>
  );
}
