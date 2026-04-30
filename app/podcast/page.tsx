"use client";

import Link from "next/link";

export default function PodcastPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 sm:px-10 py-16 overflow-hidden">
      <section className="mx-auto max-w-4xl">

        <Link
          href="/about"
          className="mb-10 inline-block text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white"
        >
          BACK
        </Link>

        <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
          PODCAST
        </p>

     <h1 className="mt-4 text-3xl sm:text-5xl md:text-7xl font-semibold tracking-[0.08em] sm:tracking-[0.25em] md:tracking-[0.35em] break-words px-2">   
  LIVESOBERAF
</h1>
         

<p className="mt-8 max-w-2xl text-lg text-white/75 leading-relaxed">
          The LIVESOBERAF podcast shares real recovery stories from people who
          have lived through addiction and come out the other side.
          Honest conversations. No filters. No performance.
        </p>

        <div className="mt-12 space-y-6">

          <div className="border border-white/10 p-6 rounded-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">
              Episode 1
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Coming Soon
            </h2>
            <p className="mt-2 text-white/60">
              First recovery story launching shortly.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}