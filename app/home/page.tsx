export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 sm:px-10 py-16">

      {/* CENTERED TITLE */}

      <div className="text-center mb-16 sm:mb-24">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-[0.25em] sm:tracking-[0.35em]">
          LIVESOBERAF
        </h1>
      </div>


      {/* NAVIGATION */}

      <div className="max-w-6xl mx-auto flex justify-center sm:justify-start">

        <div className="flex flex-col items-center sm:items-start space-y-6 sm:space-y-8 text-lg sm:text-2xl tracking-[0.22em] sm:tracking-[0.3em]">

          <a href="/about" className="hover:opacity-60 transition">
            ABOUT
          </a>

          <a href="/shares" className="hover:opacity-60 transition">
            STORIES
          </a>

          <a href="/podcast" className="hover:opacity-60 transition">
            PODCAST
          </a>

          <a href="/merch" className="hover:opacity-60 transition">
            MERCHANDISE
          </a>

          <a href="/app" className="hover:opacity-60 transition">
            APP
          </a>

          <a
            href="/help"
            className="hover:opacity-60 transition mt-6 sm:mt-8"
          >
            GET HELP NOW
          </a>

        </div>

      </div>

    </main>
  );
}