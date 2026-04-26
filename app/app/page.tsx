export default function AppPage() {
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
          THE APP
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-[0.2em] md:text-7xl">
          LIVESOBERAF
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-8 text-white/75">
          A recovery app built from real voices, real moments, and real day-one
          experience. Not theory. Not lectures. Real people helping real people
          stay sober — minute by minute.
        </p>

        {/* SECTION */}

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            WHAT THE APP IS
          </h2>

          <p className="text-lg leading-8 text-white/70">
            LIVESOBERAF is a peer-to-peer recovery platform designed around the
            moments people actually struggle. Instead of generic advice, the app
            delivers support exactly when it is needed most — early morning
            instability, evening cravings, social pressure, boredom, loneliness,
            and near-relapse moments.
          </p>

          <p className="text-lg leading-8 text-white/70">
            Every part of the experience is built from lived recovery stories.
            You don’t just read about recovery. You hear it. You see it. You walk
            through it.
          </p>
        </section>

        {/* SECTION */}

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            BUILT FROM REAL STORIES
          </h2>

          <p className="text-lg leading-8 text-white/70">
            The foundation of LIVESOBERAF is a growing archive of recovery
            voices. People in recovery answer structured questions about what
            life was like before, what changed, what day one felt like, what
            nearly stopped them continuing, and what helped them stay sober.
          </p>

          <p className="text-lg leading-8 text-white/70">
            These become support clips delivered inside the app at the exact
            moment they are most useful. Recovery becomes something you can
            follow — not something you have to figure out alone.
          </p>
        </section>

        {/* SECTION */}

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            SUPPORT THAT ARRIVES AT THE RIGHT MOMENT
          </h2>

          <p className="text-lg leading-8 text-white/70">
            Most recovery tools expect users to search for help. LIVESOBERAF
            delivers support before you ask for it.
          </p>

          <ul className="space-y-3 text-lg text-white/70">
            <li>Morning instability</li>
            <li>Afternoon dips</li>
            <li>Evening triggers</li>
            <li>Social pressure windows</li>
            <li>Near-relapse patterns</li>
          </ul>

          <p className="text-lg leading-8 text-white/70">
            Each stage unlocks real voices from people who have already passed
            through the same moment.
          </p>
        </section>

        {/* SECTION */}

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            TECHNOLOGY THAT HELPS RECOGNISE RELAPSE RISK
          </h2>

          <p className="text-lg leading-8 text-white/70">
            LIVESOBERAF is designed to grow into a predictive recovery support
            platform. Using behavioural signals and optional wearable
            integrations, the app can begin to recognise patterns linked with
            vulnerability.
          </p>

          <ul className="space-y-3 text-lg text-white/70">
            <li>Changes in sleep rhythm</li>
            <li>Elevated stress indicators</li>
            <li>Routine disruption</li>
            <li>Isolation periods</li>
            <li>Repeated high-risk time windows</li>
          </ul>

          <p className="text-lg leading-8 text-white/70">
            When these signals appear, support is delivered earlier — before
            relapse begins to take shape.
          </p>
        </section>

        {/* SECTION */}

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            PEER-TO-PEER RECOVERY
          </h2>

          <p className="text-lg leading-8 text-white/70">
            Traditional recovery apps deliver information. LIVESOBERAF delivers
            connection. Users hear directly from people who have already
            navigated day one, week one, month one, the first social event, and
            the first real tests of sobriety.
          </p>

          <p className="text-lg leading-8 text-white/70">
            This turns recovery into something visible and shared — not something
            hidden.
          </p>
        </section>

        {/* SECTION */}

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            A TIMELINE YOU CAN WALK THROUGH
          </h2>

          <p className="text-lg leading-8 text-white/70">
            Inside the app, recovery is structured as a timeline. Users move
            through support moments across the day with guidance from real
            contributors.
          </p>

          <p className="text-lg leading-8 text-white/70">
            Instead of asking what should I do right now, the app answers: here’s
            what helped someone else at this exact moment.
          </p>
        </section>

        {/* SECTION */}

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            BUILT FOR DAY ONE
          </h2>

          <p className="text-lg leading-8 text-white/70">
            Many recovery tools assume stability already exists. LIVESOBERAF
            starts earlier than that.
          </p>

          <ul className="space-y-3 text-lg text-white/70">
            <li>Day one</li>
            <li>First week</li>
            <li>Early uncertainty</li>
            <li>Repeat restarts</li>
            <li>People who don’t yet trust themselves</li>
          </ul>

          <p className="text-lg leading-8 text-white/70">
            It supports the most fragile stage — when help matters most.
          </p>
        </section>

        {/* FINAL */}

        <section className="mt-24 border-t border-white/10 pt-12">
          <p className="text-xl leading-8 text-white/80">
            LIVESOBERAF is not just an app. It is a shared map of recovery built
            by the people already walking the path — so nobody has to walk day
            one alone.
          </p>
        </section>
      </section>
    </main>
  );
}