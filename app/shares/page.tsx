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

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Loading stories...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">
            LiveSoberAF
          </p>

          <h1 className="mt-4 text-5xl font-bold">
            Community Recovery Stories
          </h1>

          <p className="mt-4 max-w-2xl text-white/70">
            Real recovery journeys shared anonymously by the community.
          </p>
        </div>

        {stories.length === 0 ? (
          <p>No stories uploaded yet.</p>
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
    </main>
  );
}