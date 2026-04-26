"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type PublishedStory = {
  fileId: string;
  name: string;
  substance: string;
  stage: string;
  answers: Record<number, string>;
};

const QUESTIONS = [
  "WHAT WAS LIFE LIKE BEFORE THINGS CHANGED?",
  "WHEN DID YOU FIRST FEEL SOMETHING WASN’T RIGHT?",
  "WHAT DID ADDICTION BEGIN TAKING FROM YOU?",
  "WAS THERE A MOMENT YOU KNEW SOMETHING HAD TO CHANGE?",
  "WHAT WAS THE LOWEST POINT FOR YOU?",
  "WHAT NEARLY STOPPED YOU GETTING HELP?",
  "WHAT DID SUPPORT LOOK LIKE AT THE BEGINNING?",
  "WHAT WAS HARDER THAN YOU EXPECTED?",
  "WHAT SURPRISED YOU IN RECOVERY?",
  "WHAT DID YOU LEARN ABOUT YOURSELF?",
  "WHAT HELPED YOU KEEP GOING?",
  "WHAT DO PEOPLE MISUNDERSTAND ABOUT ADDICTION?",
  "WHAT DO PEOPLE MISUNDERSTAND ABOUT RECOVERY?",
  "WHEN DID LIFE BEGIN TO FEEL DIFFERENT?",
  "WHAT IS LIFE LIKE NOW?",
  "WHAT ARE YOU PROUD OF TODAY?",
  "WHAT WOULD YOU SAY TO SOMEONE WHO FEELS STUCK?",
  "WHAT WAS DAY 1 LIKE?",
  "WHAT NEARLY MADE YOU GIVE UP EARLY ON?",
  "WHAT WOULD YOU SAY TO SOMEONE ON DAY 1 RIGHT NOW?",
];

export default function AppStoryPlayerPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [story, setStory] = useState<PublishedStory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStory = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/published-stories", {
          cache: "no-store",
        });

        const data = await response.json();

        const foundStory =
          (data.sessions || []).find(
            (item: PublishedStory) => item.fileId === sessionId
          ) || null;

        setStory(foundStory);
      } catch {
        setStory(null);
      } finally {
        setLoading(false);
      }
    };

    loadStory();
  }, [sessionId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
        <section className="mx-auto max-w-5xl">
          <p className="text-white/60">Loading story...</p>
        </section>
      </main>
    );
  }

  if (!story) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
        <section className="mx-auto max-w-5xl">
          <Link
            href="/the-app"
            className="text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white"
          >
            Back to app
          </Link>

          <h1 className="mt-8 text-4xl font-semibold">Story not found</h1>
        </section>
      </main>
    );
  }

  const orderedAnswers = Object.entries(story.answers || {}).sort(
    ([a], [b]) => Number(a) - Number(b)
  );

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-5xl">
        <Link
          href="/the-app"
          className="text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white"
        >
          Back to app
        </Link>

        <p className="mt-8 text-sm uppercase tracking-[0.35em] text-red-300/70">
          LiveSoberAF story
        </p>

        <h1 className="mt-3 text-5xl font-semibold">{story.name}</h1>

        <p className="mt-3 text-white/60">
          {story.substance} • {story.stage}
        </p>

        <div className="mt-10 space-y-12">
          {orderedAnswers.map(([index, videoPath]) => (
            <div
              key={index}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">
                Question {Number(index) + 1}
              </p>

              <h2 className="mt-3 text-2xl font-semibold leading-tight">
                {QUESTIONS[Number(index)] || `Question ${Number(index) + 1}`}
              </h2>

              <video
                src={videoPath}
                controls
                playsInline
                className="mt-6 w-full rounded-[1.5rem] border border-white/10 bg-black"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}