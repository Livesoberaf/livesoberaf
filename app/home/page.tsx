export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white px-10 py-16">

      {/* CENTERED TITLE */}

      <div className="text-center mb-24">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-[0.35em]">
          LIVESOBERAF
        </h1>
      </div>


      {/* LEFT NAVIGATION */}

      <div className="max-w-6xl mx-auto flex">

        <div className="flex flex-col space-y-8 text-2xl tracking-[0.3em]">

          <a
            href="/about"
            className="hover:opacity-60 transition"
          >
            ABOUT
          </a>

          <a
            href="/shares"
            className="hover:opacity-60 transition"
          >
            STORIES
          </a>

          <a
            href="/podcast"
            className="hover:opacity-60 transition"
          >
            PODCAST
          </a>

          <a
            href="/merch"
            className="hover:opacity-60 transition"
          >
            MERCHANDISE
          </a>

          <a
            href="/app"
            className="hover:opacity-60 transition"
          >
            APP
          </a>

          <a
            href="/help"
            className="hover:opacity-60 transition mt-8"
          >
            GET HELP NOW
          </a>

        </div>

      </div>

    </main>
  );
}