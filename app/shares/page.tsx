"use client";

import { useEffect, useState } from "react";
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

function cloudinaryPoster(videoUrl: string): string {
  return videoUrl
    .replace("/video/upload/", "/video/upload/so_2/")
    .replace(/\.(mp4|webm)$/, ".jpg");
}

const FOUNDATION_STORIES = [
  {
    id: "katy-1",
    name: "Katy",
    substance: "Alcohol",
    timeSober: "30 Days",
    description: "Katy describes what early recovery felt like, what nearly stopped her continuing, and what helped her keep going.",
    video: "https://res.cloudinary.com/dsllk1oan/video/upload/v1778414572/katy-alcohol-uk-25-35-female-foudation-q1_ugnrpt.mp4",
  },
  {
    id: "tato-1",
    name: "Tato",
    substance: "Alcohol",
    timeSober: "In Recovery",
    description: "Tato shares his experience of addiction, recovery, and what helped him begin to move forward.",
    video: "https://res.cloudinary.com/dsllk1oan/video/upload/v1778421941/tato-alcohol-uk-35-45-male-foundation-q1_hlag60.mp4",
  },
  {
    id: "nieve-1",
    name: "Nieve",
    substance: "Codeine",
    timeSober: "3 Months",
    description: "Nieve shares what the first months away from codeine felt like and what helped her stay steady.",
    video: "https://res.cloudinary.com/dsllk1oan/video/upload/v1778409278/nieve-codeine-uk-25-40-female-foundation-q1_wti19z.mp4",
  },
  {
    id: "helen-1",
    name: "Helen",
    substance: "Alcohol",
    timeSober: "In Recovery",
    description: "Helen talks honestly about recognising the problem and what helped her begin recovery.",
    video: "https://res.cloudinary.com/dsllk1oan/video/upload/v1778422594/helen-alcohol-uk-45-60-femail-foundation-q1_advqan.mp4",
  },
  {
    id: "chris-1",
    name: "Chris",
    substance: "Alcohol",
    timeSober: "1 Year",
    description: "Chris shares what changed, what kept him going, and what one year of sobriety has meant.",
    video: "https://res.cloudinary.com/dsllk1oan/video/upload/chris-alcohol-new_tbcfbh.mp4",
  },
  {
    id: "jodie-1",
    name: "Jodie",
    substance: "Alcohol",
    timeSober: "Recovered",
    description: "Jodie shares what recovery looks like long-term and how life changed once alcohol was no longer part of it.",
    video: "https://res.cloudinary.com/dsllk1oan/video/upload/v1778413756/jodie-alcohol-uk-35-45-female-foundation-q1_xtrdwa.mp4",
  },
];

type Story = {
  sessionId: string;
  name: string;
  substance: string;
  ageRange: string;
  sex: string;
  location: string;
  answerCount: number;
  answers: Record<string, string>;
};

type PeerStory = {
  sessionId: string;
  sharerName: string;
  pathway: string;
  dayNumber: number;
  ageRange: string;
  sex: string;
  region: string;
  firstVideoUrl: string;
  firstQuestion: string;
  answerCount: number;
};

export default function SharesPage() {
  const [stories, setStories]         = useState<Story[]>([]);
  const [peerStories, setPeerStories] = useState<PeerStory[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    async function loadStories() {
      try {
        const [archiveRes, peerRes] = await Promise.all([
          fetch("/api/published-stories"),
          fetch("/api/community-stories"),
        ]);
        const archiveData = await archiveRes.json();
        const peerData    = await peerRes.json();
        if (archiveData.success) setStories(archiveData.stories);
        if (peerData.stories)    setPeerStories(peerData.stories);
      } catch {
        // fall through — foundation stories always show
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <section className="mx-auto max-w-7xl">

        <div className="mb-16">
          <a
            href="/home"
            className="mb-8 inline-block text-sm uppercase tracking-[0.3em] text-white/50 transition hover:text-white"
          >
            BACK
          </a>

          <p className="text-sm uppercase tracking-[0.3em] text-white/50">
            LiveSoberAF
          </p>

          <h1 className="mt-4 text-5xl font-bold">
            Recovery Stories
          </h1>

          <p className="mt-4 max-w-2xl text-white/70">
            Real recovery stories shared by real people.
          </p>

          <a
            href="/share-your-story"
            className="mt-8 inline-block border border-white/20 px-8 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
          >
            Share Your Day
          </a>
        </div>

        {/* Foundation stories — always visible */}
        <div className="mb-6 flex items-center gap-4">
          <h2 className="text-xs uppercase tracking-[0.3em] text-white/40">Foundation Stories</h2>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {FOUNDATION_STORIES.map((story) => (
            <div
              key={story.id}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
            >
              <div className="p-4">
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#d28b95]">
                  Question 1
                </p>

                <h3 className="mb-4 text-xl font-semibold leading-tight">
                  {QUESTIONS[0]}
                </h3>

                <video
                  src={story.video}
                  poster={cloudinaryPoster(story.video)}
                  controls
                  playsInline
                  preload="none"
                  className="aspect-[4/5] w-full rounded-[1.5rem] bg-black object-cover"
                />
              </div>

              <div className="space-y-3 p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                  {story.name} • {story.substance}
                </p>

                <p className="text-white/70">{story.description}</p>

                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                  {story.timeSober} sober
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Community stories */}
        {!loading && stories.length > 0 && (
          <div className="mt-20">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-xs uppercase tracking-[0.3em] text-white/40">Community Stories</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {stories.map((story) => {
                const sortedAnswers = Object.entries(story.answers || {}).sort(
                  ([a], [b]) => Number(a) - Number(b)
                );
                const firstAnswer = sortedAnswers[0];

                return (
                  <div
                    key={story.sessionId}
                    className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
                  >
                    {firstAnswer && (
                      <div className="p-4">
                        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#d28b95]">
                          Question 1
                        </p>

                        <h3 className="mb-4 text-xl font-semibold leading-tight">
                          {QUESTIONS[0]}
                        </h3>

                        <video
                          src={firstAnswer[1]}
                          poster={cloudinaryPoster(firstAnswer[1])}
                          controls
                          playsInline
                          preload="none"
                          className="aspect-[4/5] w-full rounded-[1.5rem] bg-black object-cover"
                        />
                      </div>
                    )}

                    <div className="space-y-4 p-6">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                        {story.name} • {story.substance}
                      </p>

                      <h3 className="text-2xl font-semibold">
                        {story.answerCount} Answers Shared
                      </h3>

                      <div className="space-y-1 text-sm text-white/60">
                        {story.ageRange && <p>Age: {story.ageRange}</p>}
                        {story.location && <p>Location: {story.location}</p>}
                      </div>

                      {story.answerCount > 1 && (
                        <Link
                          href={`/shares/${story.sessionId}`}
                          className="block w-full border border-white/20 px-6 py-4 text-center text-sm uppercase tracking-[0.25em] transition hover:bg-white hover:text-black"
                        >
                          Watch Full Story
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Community stories — approved peer clips from Supabase */}
        {!loading && peerStories.length > 0 && (
          <div className="mt-20">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-xs uppercase tracking-[0.3em] text-white/40">Community Stories</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {peerStories.map((story) => (
                <div
                  key={story.sessionId}
                  className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
                >
                  <div className="p-4">
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#d28b95]">
                      {story.pathway} · Day {story.dayNumber}
                    </p>

                    <h3 className="mb-4 text-xl font-semibold leading-tight">
                      {story.firstQuestion}
                    </h3>

                    <video
                      src={story.firstVideoUrl}
                      poster={cloudinaryPoster(story.firstVideoUrl)}
                      controls
                      playsInline
                      preload="none"
                      className="aspect-[4/5] w-full rounded-[1.5rem] bg-black object-cover"
                    />
                  </div>

                  <div className="space-y-3 p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                      {story.sharerName}
                      {story.ageRange ? ` · ${story.ageRange}` : ""}
                      {story.region   ? ` · ${story.region}`   : ""}
                    </p>

                    <p className="text-white/70">
                      {story.answerCount} question{story.answerCount !== 1 ? "s" : ""} answered
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
