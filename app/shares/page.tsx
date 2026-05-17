export default function SharesPage() {
  const stories = [
    {
      name: "KATY",
      focus: "ALCOHOL",
      title: "DAY ONE TO NOW",
      video:
        "https://res.cloudinary.com/dsllk1oan/video/upload/v1778414572/katy-alcohol-uk-25-35-female-foudation-q1_ugnrpt.mp4",
    },
    {
      name: "TATO",
      focus: "ALCOHOL",
      title: "RECOVERY IN HIS OWN WORDS",
      video:
        "https://res.cloudinary.com/dsllk1oan/video/upload/v1778421941/tato-alcohol-uk-35-45-male-foundation-q1_hlag60.mp4",
    },
    {
      name: "NIEVE",
      focus: "CODEINE",
      title: "EARLY RECOVERY",
      video:
        "https://res.cloudinary.com/dsllk1oan/video/upload/v1778409278/nieve-codeine-uk-25-40-female-foundation-q1_wti19z.mp4",
    },
    {
      name: "HELEN",
      focus: "ALCOHOL",
      title: "A DIFFERENT START",
      video:
        "https://res.cloudinary.com/dsllk1oan/video/upload/v1778422594/helen-alcohol-uk-45-60-femail-foundation-q1_advqan.mp4",
    },
    {
      name: "CHRIS",
      focus: "ALCOHOL",
      title: "ONE YEAR SOBER",
      video:
        "https://res.cloudinary.com/dsllk1oan/video/upload/chris-alcohol-new_tbcfbh.mp4",
    },
    {
      name: "JODIE",
      focus: "ALCOHOL",
      title: "LIFE AFTER ALCOHOL",
      video:
        "https://res.cloudinary.com/dsllk1oan/video/upload/v1778413756/jodie-alcohol-uk-35-45-female-foundation-q1_xtrdwa.mp4",
    },
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-7xl">
        <a
          href="/home"
          className="mb-10 inline-block text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white"
        >
          BACK
        </a>

        <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
          STORIES
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-[0.12em] sm:text-5xl md:text-7xl md:tracking-[0.2em]">
          THE 20 QUESTIONS
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-white/70">
          Every person who contributes to LIVESOBERAF is asked the same twenty
          questions. Not because every story is the same, but because asking the
          same questions helps reveal what sits underneath addiction and
          recovery.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/watch-stories"
            className="border border-white/20 px-6 py-4 text-center text-sm uppercase tracking-[0.25em] transition hover:bg-white hover:text-black"
          >
            Watch Stories
          </a>

          <a
            href="/share-your-story"
            className="border border-red-300/40 px-6 py-4 text-center text-sm uppercase tracking-[0.25em] text-red-200 transition hover:bg-red-200 hover:text-black"
          >
            Create Your Story
          </a>
        </div>

        <section className="mt-20">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-[0.15em]">
              FOUNDATION STORIES
            </h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {stories.map((story) => (
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
      </section>
    </main>
  );
}