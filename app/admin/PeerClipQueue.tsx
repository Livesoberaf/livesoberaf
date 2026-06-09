"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const QUESTIONS = [
  "How are you feeling today, honestly?",
  "What's been hardest about today?",
  "What's been helping you get through it?",
  "What would you say to someone else on this exact day?",
];

type ClipStatus = "pending" | "approved" | "rejected";

type PeerClip = {
  id: string;
  question_index: number;
  cloudinary_url: string;
  status: ClipStatus;
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
  clips: PeerClip[];
};

const STATUS_COLOURS: Record<ClipStatus, string> = {
  pending:  "text-white/40",
  approved: "text-green-400/70",
  rejected: "text-red-300/70",
};

function ClipRow({ clip }: { clip: PeerClip }) {
  const router                       = useRouter();
  const [, startTransition]          = useTransition();
  const [localStatus, setLocalStatus] = useState<ClipStatus>(clip.status);
  const [watchOpen, setWatchOpen]    = useState(false);
  const [error, setError]            = useState("");

  async function act(action: "approve" | "reject") {
    setError("");
    const endpoint = action === "approve"
      ? "/api/admin/peer-clip/approve"
      : "/api/admin/peer-clip/reject";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: clip.id }),
    });

    if (res.ok) {
      setLocalStatus(action === "approve" ? "approved" : "rejected");
      startTransition(() => router.refresh());
    } else {
      setError("Something went wrong.");
    }
  }

  const question = QUESTIONS[clip.question_index] ?? `Question ${clip.question_index + 1}`;

  return (
    <div className="py-6">
      <p className="text-lg font-medium text-white leading-snug">
        {question}
      </p>
      <p className={`mt-1 text-sm uppercase tracking-[0.2em] ${STATUS_COLOURS[localStatus]}`}>
        {localStatus}
      </p>

      <div className="mt-4 flex items-center gap-8 flex-wrap">
        <button
          onClick={() => setWatchOpen((o) => !o)}
          className="text-sm uppercase tracking-[0.25em] text-white/50 hover:text-[#ff0099] transition-colors"
        >
          {watchOpen ? "Close" : "Watch clip"}
        </button>

        {localStatus !== "approved" && (
          <button
            onClick={() => act("approve")}
            className="text-sm uppercase tracking-[0.25em] text-white/50 hover:text-green-400 transition-colors"
          >
            Approve
          </button>
        )}

        {localStatus !== "rejected" && (
          <button
            onClick={() => act("reject")}
            className="text-sm uppercase tracking-[0.25em] text-white/50 hover:text-red-300 transition-colors"
          >
            Reject
          </button>
        )}

        {error && <p className="text-red-300/70 text-xs">{error}</p>}
      </div>

      {watchOpen && (
        <div className="mt-5 aspect-video max-w-xl overflow-hidden">
          <video
            src={clip.cloudinary_url}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

function SessionBlock({ session }: { session: PeerSession }) {
  const date = new Date(session.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long",
  });

  return (
    <div className="mt-16">
      <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
        Day {session.dayNumber} · {session.pathway}
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[0.08em]">
        {session.sharerName}
      </h3>
      <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/30">
        {session.ageRange} · {session.sex} · {session.region} · {date}
      </p>

      <div className="mt-6 flex flex-col divide-y divide-white/5">
        {session.clips
          .sort((a, b) => a.question_index - b.question_index)
          .map((clip) => (
            <ClipRow key={clip.id} clip={clip} />
          ))}
      </div>
    </div>
  );
}

export default function PeerClipQueue({ sessions }: { sessions: PeerSession[] }) {
  const pendingCount = sessions
    .flatMap((s) => s.clips)
    .filter((c) => c.status === "pending").length;

  if (sessions.length === 0) {
    return (
      <p className="mt-4 text-lg leading-8 text-white/50">
        No peer clips waiting for review.
      </p>
    );
  }

  return (
    <>
      <p className="mt-4 text-xl leading-8 text-white/75">
        {pendingCount === 0
          ? "All peer clips reviewed."
          : `${pendingCount} clip${pendingCount === 1 ? "" : "s"} from ${sessions.length} ${sessions.length === 1 ? "person" : "people"} waiting for review.`}
      </p>

      {sessions.map((session) => (
        <SessionBlock key={session.sessionId} session={session} />
      ))}
    </>
  );
}
