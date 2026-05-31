"use client";

import { useEffect, useState } from "react";

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
  const [openStories, setOpenStories] = useState<Record<string, boolean>>({});

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

  function toggleStory(sessionId: string) {
    setOpenStories((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">
            LiveSoberAF
          </p>

          <h1 className="mt-4 text-5xl font-bold">Recovery Stories</h1>

          <p className="mt-4 max-w-2xl text-white/70">
            Watch foundation stories first, then explore recovery journeys
            shared by the community.
          </p>

          <a
            href="/share-your-story"
            className="mt-8 inline-block border border-white/20 px-8 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
          >
            Record Your Share
          </a>
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

                  <h3 className="text-2xl font-semibold">{story.title}</h3>

                  <a
                    href={story.video}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full border border-white/20 px-6 py-4 text-center text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
                  >
                    Watch Story
                  </a>
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
            <p className="text-white/50">Loading community stories...</p>
          ) : stories.length === 0 ? (
            <p className="text-white/50">No community stories uploaded yet.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {stories.map((story) => {
                const isOpen = !!openStories[story.sessionId];

                const sortedAnswers = Object.entries(story.answers || {}).sort(
                  ([a], [b]) => Number(a) - Number(b)
                );

                const firstAnswer = sortedAnswers[0];
                const remainingAnswers = sortedAnswers.slice(1);

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
                          controls
                          playsInline
                          preload="metadata"
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

                      <div className="space-y-2 text-sm text-white/70">
                        <p>Age: {story.ageRange || "Unknown"}</p>
                        <p>Sex: {story.sex || "Unknown"}</p>
                        <p>Location: {story.location || "Unknown"}</p>
                      </div>

                      {remainingAnswers.length > 0 && (
                        <button
                          onClick={() => toggleStory(story.sessionId)}
                          className="w-full border border-white/20 px-6 py-4 text-sm uppercase tracking-[0.25em] transition hover:bg-white hover:text-black"
                        >
                          {isOpen ? "Hide Full Story" : "Watch Full Story"}
                        </button>
                      )}

                      {isOpen && remainingAnswers.length > 0 && (
                        <div className="border-t border-white/10 pt-6">
                          <div className="space-y-8">
                            {remainingAnswers.map(([question, video]) => {
                              const index = Number(question);

                              return (
                                <div
                                  key={question}
                                  className="rounded-2xl border border-white/10 p-4"
                                >
                                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#d28b95]">
                                    Question {index + 1}
                                  </p>

                                  <h4 className="mb-4 text-lg font-semibold leading-tight">
                                    {QUESTIONS[index] ||
                                      `Question ${index + 1}`}
                                  </h4>

                                  <video
                                    src={video}
                                    controls
                                    playsInline
                                    preload="metadata"
                                    className="w-full rounded-xl bg-black"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}