import fs from "fs";
import path from "path";
import Link from "next/link";

type Session = {
  sessionId?: string;
  name: string;
  substance: string;
  stage: string;
  consent: boolean;
  createdAt?: string;
  updatedAt?: string;
  isPublished?: boolean;
  answers: Record<number, string>;
};

type SessionWithFileId = Session & {
  fileId: string;
};

type ManualStory = {
  id: string;
  firstName: string;
  recoveryFocus: string;
  timeSober: string;
  title: string;
  description: string;
  video: string;
};

const MANUAL_STORIES: ManualStory[] = [
  {
    id: "katy-1",
    firstName: "KATY",
    recoveryFocus: "ALCOHOL",
    timeSober: "30 DAYS",
    title: "DAY ONE TO NOW",
    description:
      "Katy describes what early recovery felt like, what nearly stopped her continuing, and what helped her keep going.",
    video:
      "https://res.cloudinary.com/dsllk1oan/video/upload/v1778414572/katy-alcohol-uk-25-35-female-foudation-q1_ugnrpt.mp4",
  },
  {
    id: "tato-1",
    firstName: "TATO",
    recoveryFocus: "ALCOHOL",
    timeSober: "IN RECOVERY",
    title: "RECOVERY IN HIS OWN WORDS",
    description:
      "Tato shares his experience of addiction, recovery, and what helped him begin to move forward.",
    video:
      "https://res.cloudinary.com/dsllk1oan/video/upload/v1778421941/tato-alcohol-uk-35-45-male-foundation-q1_hlag60.mp4",
  },
  {
    id: "nieve-1",
    firstName: "NIEVE",
    recoveryFocus: "CODEINE",
    timeSober: "3 MONTHS",
    title: "EARLY RECOVERY",
    description:
      "Nieve shares what the first months away from codeine felt like and what helped her stay steady.",
    video:
      "https://res.cloudinary.com/dsllk1oan/video/upload/v1778409278/nieve-codeine-uk-25-40-female-foundation-q1_wti19z.mp4",
  },
  {
    id: "helen-1",
    firstName: "HELEN",
    recoveryFocus: "ALCOHOL",
    timeSober: "IN RECOVERY",
    title: "A DIFFERENT START",
    description:
      "Helen talks honestly about recognising the problem and what helped her begin recovery.",
    video:
      "https://res.cloudinary.com/dsllk1oan/video/upload/v1778422594/helen-alcohol-uk-45-60-femail-foundation-q1_advqan.mp4",
  },
  {
    id: "chris-1",
    firstName: "CHRIS",
    recoveryFocus: "ALCOHOL",
    timeSober: "1 YEAR",
    title: "ONE YEAR SOBER",
    description:
      "Chris shares what changed, what kept him going, and what one year of sobriety has meant.",
    video:
      "https://res.cloudinary.com/dsllk1oan/video/upload/chris-alcohol-new_tbcfbh.mp4",
  },
  {
    id: "jodie-1",
    firstName: "JODIE",
    recoveryFocus: "ALCOHOL",
    timeSober: "RECOVERED",
    title: "LIFE AFTER ALCOHOL",
    description:
      "Jodie shares what recovery looks like long-term and how life changed once alcohol was no longer part of it.",
    video:
      "https://res.cloudinary.com/dsllk1oan/video/upload/v1778413756/jodie-alcohol-uk-35-45-female-foundation-q1_xtrdwa.mp4",
  },
];

export default function WatchStoriesPage() {
  const sessionsDir = path.join(process.cwd(), "public", "uploads", "sessions");

  let sessions: SessionWithFileId[] = [];

  if (fs.existsSync(sessionsDir)) {
    const files = fs.readdirSync(sessionsDir);

    sessions = files
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const filePath = path.join(sessionsDir, file);
        const content = fs.readFileSync(filePath, "utf8");
        const parsed = JSON.parse(content) as Session;

        return {
          ...parsed,
          fileId: file.replace(/\.json$/, ""),
        };
      });
  }

  const publishedSessions = sessions
    .filter(
      (session) =>
        session.consent &&
        session.isPublished &&
        Object.keys(session.answers || {}).length >= 20
    )
    .sort((a, b) => {
      const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bDate - aDate;
    });

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-7xl">
        <a
          href="/shares"
          className="mb-10 inline-block text-sm uppercase tracking-[0.3em] text-white/50 transition hover:text-white"
        >
          BACK
        </a>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
              WATCH STORIES
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-[0.12em] sm:text-5xl md:text-7xl md:tracking-[0.2em]">
              LIVESOBERAF
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              A growing archive of real recovery stories. Foundation stories are
              visible below now, and completed 20-question stories recorded on
              the site will appear here automatically once finished.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 text-sm uppercase tracking-[0.2em] text-white/60">
            GROWING STORY ARCHIVE
          </div>
        </div>

        <section className="mt-16">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-[0.15em]">
              FOUNDATION STORIES
            </h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {MANUAL_STORIES.map((story) => (
              <div
                key={story.id}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
              >
                <video
                  src={story.video}
                  controls
                  playsInline
                  className="aspect-[4/5] w-full bg-black object-cover"
                />

                <div className="space-y-6 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                      {story.firstName} • {story.recoveryFocus}
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold leading-tight">
                      {story.title}
                    </h3>

                    <p className="mt-4 text-white/70">{story.description}</p>
                  </div>

                  <div className="space-y-2 border-t border-white/10 pt-4 text-sm uppercase tracking-[0.2em] text-white/50">
                    <p>FIRST NAME: {story.firstName}</p>
                    <p>RECOVERY FOCUS: {story.recoveryFocus}</p>
                    <p>TIME SOBER: {story.timeSober}</p>
                  </div>

                  <a
                    href={story.video}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full border border-white/20 px-6 py-4 text-center text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
                  >
                    WATCH STORY
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-[0.15em]">
              COMPLETE RECORDED STORIES
            </h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {publishedSessions.length === 0 ? (
            <p className="text-white/50">
              No completed stories yet. Once a contributor finishes all 20
              answers, their full story will appear here.
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {publishedSessions.map((session) => {
                const firstAnswer = session.answers[0];

                return (
                  <div
                    key={session.fileId}
                    className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
                  >
                    {firstAnswer ? (
                      <video
                        src={firstAnswer}
                        controls
                        playsInline
                        className="aspect-[4/5] w-full bg-black object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[4/5] w-full items-center justify-center bg-neutral-900 text-center text-sm uppercase tracking-[0.35em] text-white">
                        STORY THUMBNAIL
                      </div>
                    )}

                    <div className="space-y-6 p-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                          {session.name} • {session.substance}
                        </p>

                        <h3 className="mt-3 text-2xl font-semibold leading-tight">
                          FULL STORY
                        </h3>

                        <p className="mt-4 text-white/70">
                          A complete 20-question recovery story shared in the
                          contributor’s own words.
                        </p>
                      </div>

                      <div className="space-y-2 border-t border-white/10 pt-4 text-sm uppercase tracking-[0.2em] text-white/50">
                        <p>FIRST NAME: {session.name}</p>
                        <p>RECOVERY FOCUS: {session.substance}</p>
                        <p>STAGE: {session.stage}</p>
                      </div>

                      <Link
                        href={`/watch-stories/${session.fileId}`}
                        className="block w-full border border-white/20 px-6 py-4 text-center text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
                      >
                        WATCH FULL STORY
                      </Link>
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