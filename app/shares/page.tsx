"use client";

import { useEffect, useState } from "react";

type Story = {
  sessionId: string;
  name: string;
  substance: string;
  stage: string;
  ageRange: string;
  sex: string;
  location: string;
  createdAt: string;
  answerCount: number;
  firstVideo: string;
  answers: Record<string, string>;
};

const FOUNDATION_STORIES = [
  {
    name: "Katy",
    focus: "Alcohol",
    title: "What life looked like before things changed",
    video:
      "https://res.cloudinary.com/dsllk1oan/video/upload/v1778414572/katy-alcohol-uk-25-35-female-foudation-q1_ugnrpt.mp4",
  },
  {
    name: "Chris",
    focus: "Alcohol",
    title: "The moment I knew I needed help",
    video:
      "https://res.cloudinary.com/dsllk1oan/video/upload/chris-alcohol-new_tbcfbh.mp4",
  },
  {
    name: "Helen",
    focus: "Alcohol",
    title: "What recovery gave back to me",
    video:
      "https://res.cloudinary.com/dsllk1oan/video/upload/v1778422594/helen-alcohol-uk-45-60-femail-foundation-q1_advqan.mp4",
  },
  {
    name: "Jodie",
    focus: "Alcohol",
    title: "Learning to live differently",
    video:
      "https://res.cloudinary.com/dsllk1oan/video/upload/v1778413756/jodie-alcohol-uk-35-45-female-foundation-q1_xtrdwa.mp4",
  },
  {
    name: "Nieve",
    focus: "Codeine",
    title: "The quiet addiction nobody saw",
    video:
      "https://res.cloudinary.com/dsllk1oan/video/upload/v1778409278/nieve-codeine-uk-25-40-female-foundation-q1_wti19z.mp4",
  },
  {
    name: "Tato",
    focus: "Alcohol",
    title: "Why I keep going",
    video:
      "https://res.cloudinary.com/dsllk1oan/video/upload/v1778421941/tato-alcohol-uk-35-45-male-foundation-q1_hlag60.mp4",
  },
];

export default function SharesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      try {
        const response = await fetch("/api/published-stories");
        const data = await response.json();

        if (data.success) {
          setStories(data.stories);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadStories();
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">
            LiveSoberAF
          </p>

          <h1 className="mt-4 text-5xl font-bold">
            Recovery Stories
          </h1>

          <p className="mt-4 max-w-2xl text-white/70">
            Watch foundation stories first, then explore recovery journeys
            shared by the community.
          </p>
        </div>

        <section className="mb-20">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#d28b95]">
              Start Here
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              Foundation Stories
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {FOUNDATION_STORIES.map((story) => (
              <div
                key={story.name}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
              >
                <video
                  src={story.video}
                  controls
                  playsInline
                  className="aspect-[4/5] w-full bg-black object-cover"
                />

                <div className="space-y-4 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                    {story.name} • {story.focus}
                  </p>

                  <h3 className="text-2xl font-semibold">
                    {story.title}
                  </h3>

                  <button className="w-full border border-white/20 px-6 py-4 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black">
                    Watch Story
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#d28b95]">
              Community
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              Community Recovery Stories
            </h2>
          </div>

          {loading ? (
            <p className="text-white/50">
              Loading community stories...
            </p>
          ) : stories.length === 0 ? (
            <p className="text-white/50">
              No community stories uploaded yet.
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {stories.map((story) => (
                <div
                  key={story.sessionId}
                  className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
                >
                  <video
                    src={story.firstVideo}
                    controls
                    playsInline
                    className="aspect-[4/5] w-full bg-black object-cover"
                  />

                  <div className="space-y-4 p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                      {story.name} • {story.substance}
                    </p>

                    <h3 className="text-2xl font-semibold">
                      {story.answerCount} Answers Shared
                    </h3>

                    <div className="space-y-2 text-sm text-white/70">
                      <p>Age: {story.ageRange || "Unknown"}</p>
                      <p>Sex: {story.sex || "Unknown"}</p>
                      <p>Location: {story.location || "Unknown"}</p>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                        Story Timeline
                      </p>

                      <div className="mt-4 space-y-4">
                        {Object.entries(story.answers).map(
                          ([question, video]) => (
                            <div
                              key={question}
                              className="rounded-2xl border border-white/10 p-3"
                            >
                              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/40">
                                Question {Number(question) + 1}
                              </p>

                              <video
                                src={video}
                                controls
                                playsInline
                                className="w-full rounded-xl"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}