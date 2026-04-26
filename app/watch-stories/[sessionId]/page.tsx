import fs from "fs";
import path from "path";
import Link from "next/link";

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

export default async function StoryPlayer({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const sessionsDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "sessions"
  );

  const filePath = path.join(sessionsDir, `${sessionId}.json`);

  if (!fs.existsSync(filePath)) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <section className="mx-auto max-w-4xl">
          <Link
            href="/watch-stories"
            className="text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white"
          >
            BACK
          </Link>

          <h1 className="mt-8 text-4xl font-semibold tracking-[0.2em]">
            STORY NOT FOUND
          </h1>
        </section>
      </main>
    );
  }

  const session = JSON.parse(
    fs.readFileSync(filePath, "utf8")
  ) as Session;

  if (
    !session.consent ||
    !session.isPublished ||
    Object.keys(session.answers || {}).length < 20
  ) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <section className="mx-auto max-w-4xl">
          <Link
            href="/watch-stories"
            className="text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white"
          >
            BACK
          </Link>

          <h1 className="mt-8 text-4xl font-semibold tracking-[0.2em]">
            STORY NOT AVAILABLE
          </h1>
        </section>
      </main>
    );
  }

  const answers = Object.entries(session.answers).sort(
    ([a], [b]) => Number(a) - Number(b)
  );

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-4xl">

        <Link
          href="/watch-stories"
          className="text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white"
        >
          BACK
        </Link>

        <p className="mt-8 text-sm uppercase tracking-[0.35em] text-red-300/70">
          FULL STORY
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-[0.2em] md:text-7xl">
          {session.name}
        </h1>

        <p className="mt-4 text-sm uppercase tracking-[0.2em] text-white/50">
          {session.substance} • {session.stage}
        </p>

        <div className="mt-16 space-y-24">
          {answers.map(([index, videoPath]) => (
            <div key={index}>

              {/* QUESTION TITLE CARD */}

              <div className="flex min-h-[40vh] items-center justify-center border-y border-white/10 bg-black px-8 text-center">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/40">
                    QUESTION {Number(index) + 1}
                  </p>

                  <h2 className="mt-6 text-3xl font-semibold uppercase tracking-[0.15em] md:text-5xl">
                    {QUESTIONS[Number(index)]}
                  </h2>
                </div>
              </div>

              {/* VIDEO */}

              <div className="mt-10">
                <video
                  src={videoPath}
                  controls
                  playsInline
                  className="w-full rounded-[2rem] bg-black"
                />
              </div>

            </div>
          ))}
        </div>

      </section>
    </main>
  );
}