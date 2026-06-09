"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type ClipStatus = "pending" | "approved" | "rejected";

type Clip = {
  slotId: string;
  title: string;
  stageLabel: string;
  timeLabel: string;
  duration: string;
  status: ClipStatus;
  videoUrl: string;
};

type StageGroup = {
  stageId: string;
  stageLabel: string;
  clips: Clip[];
};

const STATUS_LABELS: Record<ClipStatus, string> = {
  pending:  "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_COLOURS: Record<ClipStatus, string> = {
  pending:  "text-white/40",
  approved: "text-green-400/70",
  rejected: "text-red-300/70",
};

function ClipRow({ clip }: { clip: Clip }) {
  const router                      = useRouter();
  const [isPending, startTransition] = useTransition();
  const [watchOpen, setWatchOpen]   = useState(false);
  const [localStatus, setLocalStatus] = useState<ClipStatus>(clip.status);
  const [error, setError]           = useState("");

  async function act(action: "approve" | "reject") {
    setError("");
    const endpoint = action === "approve" ? "/api/admin/approve" : "/api/admin/reject";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId: clip.slotId }),
    });
    if (res.ok) {
      setLocalStatus(action === "approve" ? "approved" : "rejected");
      startTransition(() => router.refresh());
    } else {
      setError("Something went wrong.");
    }
  }

  return (
    <div className="py-8">
      {/* Title + status */}
      <p className="text-2xl font-semibold tracking-[0.05em] text-white">
        {clip.title}
      </p>
      <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/30">
        {clip.timeLabel} · {clip.duration}
        <span className={`ml-4 ${STATUS_COLOURS[localStatus]}`}>
          {STATUS_LABELS[localStatus]}
        </span>
      </p>

      {/* Actions */}
      <div className="mt-5 flex items-center gap-8 flex-wrap">
        <button
          onClick={() => setWatchOpen((o) => !o)}
          className="text-sm uppercase tracking-[0.25em] text-white/50 hover:text-[#ff0099] transition-colors"
        >
          {watchOpen ? "Close" : "Watch clip"}
        </button>

        {localStatus !== "approved" && (
          <button
            onClick={() => act("approve")}
            disabled={isPending}
            className="text-sm uppercase tracking-[0.25em] text-white/50 hover:text-green-400 transition-colors disabled:opacity-30"
          >
            Approve
          </button>
        )}

        {localStatus !== "rejected" && (
          <button
            onClick={() => act("reject")}
            disabled={isPending}
            className="text-sm uppercase tracking-[0.25em] text-white/50 hover:text-red-300 transition-colors disabled:opacity-30"
          >
            Reject
          </button>
        )}

        {error && <p className="text-red-300/70 text-xs">{error}</p>}
      </div>

      {/* Video player — inline, expands on demand */}
      {watchOpen && (
        <div className="mt-6 aspect-video max-w-2xl overflow-hidden">
          <video
            src={clip.videoUrl}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

export default function AdminClipList({ stages }: { stages: StageGroup[] }) {
  const pendingCount = stages
    .flatMap((s) => s.clips)
    .filter((c) => c.status === "pending").length;

  return (
    <>
      <p className="mt-8 max-w-3xl text-xl leading-8 text-white/75">
        {pendingCount === 0
          ? "No clips waiting for review."
          : `${pendingCount} clip${pendingCount === 1 ? "" : "s"} waiting for review.`}
      </p>

      {stages.map((stage) => (
        <section key={stage.stageId} className="mt-20 space-y-2">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            {stage.stageLabel.toUpperCase()}
          </h2>

          <div className="flex flex-col divide-y divide-white/5">
            {stage.clips.map((clip) => (
              <ClipRow key={clip.slotId} clip={clip} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
