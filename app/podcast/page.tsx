export default function PodcastPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-5xl">
        <a
          href="/home"
          className="mb-10 inline-block text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white"
        >
          BACK
        </a>

        <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
          PODCAST
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-[0.2em] md:text-7xl">
          LIVESOBERAF
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-8 text-white/75">
          Real stories of addiction, recovery, relapse, change, and the long road
          back. Honest conversations with people who have lived it, alongside a
          deeper look at why we become who we become.
        </p>

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            WHAT SETS IT APART
          </h2>

          <p className="text-lg leading-8 text-white/70">
            LIVESOBERAF is not a polished recovery podcast built around theory,
            distance, or safe language. It is built around real people speaking in
            their own words about what addiction did to them, what recovery asked
            of them, and what changed when they finally stopped.
          </p>

          <p className="text-lg leading-8 text-white/70">
            These are not abstract conversations. They are lived accounts of fear,
            shame, isolation, relapse, survival, and hope.
          </p>
        </section>

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            MORE THAN JUST STORIES
          </h2>

          <p className="text-lg leading-8 text-white/70">
            The podcast is also an investigation into why we are as we are.
            Alongside recovery stories, LIVESOBERAF explores the patterns beneath
            addiction — trauma, behaviour, repetition, coping, identity, and the
            need to escape.
          </p>

          <p className="text-lg leading-8 text-white/70">
            It asks not only how people got clean, but what they were really trying
            to survive in the first place.
          </p>
        </section>

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            RECOVERY FROM PEOPLE WHO HAVE DONE IT
          </h2>

          <p className="text-lg leading-8 text-white/70">
            The heart of LIVESOBERAF is peer-to-peer learning. Recovery is spoken
            about by people who have actually walked through day one, the first
            week, the cravings, the boredom, the fear, the restarts, and the life
            that comes after.
          </p>

          <p className="text-lg leading-8 text-white/70">
            That makes the podcast more than content. It becomes a record of lived
            experience that others can return to when they need perspective,
            honesty, and proof that change is possible.
          </p>
        </section>

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            AVAILABLE ON SPOTIFY
          </h2>

          <p className="text-lg leading-8 text-white/70">
            LIVESOBERAF podcast episodes will be available on Spotify, building an
            archive of recovery conversations that listeners can return to at any
            stage of their journey.
          </p>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-white/40">
              LISTEN
            </p>

            <h3 className="mt-4 text-2xl font-semibold">
              SPOTIFY LINK COMING SOON
            </h3>

            <p className="mt-4 max-w-2xl text-white/70">
              Add your Spotify show link here when the first episodes are live.
            </p>

            <a
              href="#"
              className="mt-8 inline-block border border-white/20 px-8 py-4 text-sm tracking-[0.3em] transition hover:bg-white hover:text-black"
            >
              OPEN ON SPOTIFY
            </a>
          </div>
        </section>

        <section className="mt-24 border-t border-white/10 pt-12">
          <p className="text-xl leading-8 text-white/80">
            LIVESOBERAF is a podcast about addiction and recovery told by the
            people who know it from the inside.
          </p>
        </section>
      </section>
    </main>
  );
}