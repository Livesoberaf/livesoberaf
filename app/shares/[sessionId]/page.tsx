"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const QUESTIONS = [
  "What was life like before recovery?",
  "What made you realise things needed to change?",
  "What was the hardest part of addiction?",
  "What did your lowest point look like?",
  "Who did addiction affect around you?",
  "What finally pushed you toward recovery?",
  "What was your first day sober like?",
  "What fears did you have about getting clean?",
  "What helped you stay sober early on?",
  "What role did support play in recovery?",
  "How has your mindset changed?",
  "What does a normal day look like now?",
  "What are you most proud of?",
  "How has recovery changed relationships?",
  "What triggers still affect you?",
  "How do you handle difficult days now?",
  "What would you say to someone struggling?",
  "What have you rediscovered about yourself?",
  "What does happiness mean to you today?",
  "What is life like now?",
];

type Story = {
  sessionId: string;
  name: string;
  substance: string;
  stage: string;
  ageRange: string;
  sex: string;
  location: string;
  answers: Record<string, string>;
};

export default function StoryPlayerPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/published-stories");
        const data = await res.json();
        const found = (data.stories || []).find(
          (s: Story) => s.sessionId === sessionId
        );
        setStory(found || null);
      } catch {
        setStory(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [sessionId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <section className="mx-auto max-w-4xl">
          <p className="text-white/50">Loading...</p>
        </section>
      </main>
    );
  }

  if (!story) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <section className="mx-auto max-w-4xl">
          <Link
            href="/shares"
            className="text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white"
          >
            BACK
          </Link>
          <h1 className="mt-8 text-4xl font-semibold tracking-[0.2em]">
            Story not found.
          </h1>
        </section>
      </main>
    );
  }

  const answers = Object.entries(story.answers).sort(
    ([a], [b]) => Number(a) - Number(b)
  );

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-4xl">

        <Link
          href="/shares"
          className="text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white transition"
        >
          BACK
        </Link>

        <p className="mt-8 text-sm uppercase tracking-[0.35em] text-[#d28b95]">
          Recovery Story
        </p>

        <h1 className="mt-4 text-5xl font-semibold md:text-7xl">
          {story.name}
        </h1>

        <p className="mt-4 text-sm uppercase tracking-[0.25em] text-white/50">
          {story.substance}
          {story.ageRange ? ` • ${story.ageRange}` : ""}
          {story.location ? ` • ${story.location}` : ""}
        </p>

        <div className="mt-16 space-y-24">
          {answers.map(([index, videoUrl]) => {
            const qIndex = Number(index);
            const question = QUESTIONS[qIndex] || `Question ${qIndex + 1}`;

            return (
              <div key={index}>
                <div className="flex min-h-[30vh] items-center border-y border-white/10 px-2 py-12">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/40">
                      Question {qIndex + 1}
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
                      {question}
                    </h2>
                  </div>
                </div>

                <div className="mt-8">
                  <video
                    src={videoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full rounded-[2rem] bg-black"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-24 border-t border-white/10 pt-12">
          <Link
            href="/shares"
            className="text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white transition"
          >
            Back to all stories
          </Link>
        </div>

      </section>
    </main>
  );
}
