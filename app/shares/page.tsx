export default function SharesPage() {
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
          STORIES
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-[0.2em] md:text-7xl">
          THE 20 QUESTIONS
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-8 text-white/75">
          Every person who contributes to LIVESOBERAF is asked the same twenty
          questions. Not because every story is the same, but because asking the
          same questions helps reveal what sits underneath addiction and
          recovery.
        </p>

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            DIFFERENT INGREDIENTS. SAME SOUP.
          </h2>

          <p className="text-lg leading-8 text-white/70">
            The substance may be different. The age may be different. The place,
            history, and circumstances may all be different. But when people talk
            honestly about addiction and recovery, something familiar begins to
            appear.
          </p>

          <p className="text-lg leading-8 text-white/70">
            The fear is familiar. The coping is familiar. The denial is familiar.
            The loss is familiar. And the moment something begins to change is
            familiar too.
          </p>

          <p className="text-lg leading-8 text-white/70">
            The ingredients might be different, but the structure underneath them
            is often recognisable. That structure is what the twenty questions
            are designed to reveal.
          </p>
        </section>

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            WHY TWENTY QUESTIONS
          </h2>

          <p className="text-lg leading-8 text-white/70">
            Each contributor is guided through the same sequence. The questions
            move from what life was like before addiction took hold, through the
            points where things began to shift, into the difficult early stages
            of recovery, and finally towards what life feels like now.
          </p>

          <p className="text-lg leading-8 text-white/70">
            Because the structure stays the same, stories can sit beside one
            another without losing what makes each voice unique. Patterns become
            visible. Recognition becomes possible. And recovery becomes easier to
            imagine.
          </p>
        </section>

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            HOW WE LEARN FROM STORIES
          </h2>

          <p className="text-lg leading-8 text-white/70">
            Addiction isolates people. Recovery stories reconnect them. When
            someone hears another person describe what day one felt like, what
            nearly stopped them continuing, or what helped them keep going, the
            experience becomes less abstract and more human.
          </p>

          <p className="text-lg leading-8 text-white/70">
            This is how understanding grows. Not only through research or
            explanation, but through listening carefully to people who have lived
            through the same uncertainty and found a way forward.
          </p>
        </section>

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            A GROWING ARCHIVE
          </h2>

          <p className="text-lg leading-8 text-white/70">
            LIVESOBERAF is building a living archive of recovery stories recorded
            in people’s own words. Together, these voices form a shared map of
            addiction and recovery that others can return to when they need
            perspective, recognition, or support.
          </p>

          <p className="text-lg leading-8 text-white/70">
            Each story strengthens the archive. Each voice becomes part of
            something that helps the next person begin.
          </p>
        </section>

        <section className="mt-24 rounded-[2rem] border border-white/10 bg-white/5 p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-white/40">
            NEXT STEP
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[0.12em]">
            TAKE PART OR LISTEN
          </h2>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Share your experience in your own words, or explore the stories of
            people who have already walked the path.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/share-your-story"
              className="inline-block border border-white/20 px-8 py-4 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
            >
              SHARE YOUR STORY
            </a>

            <a
              href="/watch-stories"
              className="inline-block border border-white/20 px-8 py-4 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
            >
              WATCH STORIES
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}