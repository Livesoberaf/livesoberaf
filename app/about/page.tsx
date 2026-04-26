"use client";

import { useEffect, useState } from "react";

export default function AboutPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white overflow-hidden">
      <section
        className={`mx-auto max-w-5xl transition-all duration-[1200ms] ease-out ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
        }`}
      >
        <a
          href="/home"
          className="mb-10 inline-block text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white"
        >
          BACK
        </a>

        <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
          ABOUT
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-[0.2em] md:text-7xl">
          LIVESOBERAF
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-8 text-white/75">
          LIVESOBERAF exists to make recovery visible, understandable, and
          possible at the moment someone needs it most.
        </p>

        {/* WHY THIS MATTERS */}

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            WHY THIS MATTERS
          </h2>

          <p className="text-lg leading-8 text-white/70">
            Addiction is often experienced in isolation. People believe their
            situation is unique, their thinking is different, or their struggle
            is something no one else will recognise. Recovery stories change
            that. They replace isolation with recognition and uncertainty with
            possibility.
          </p>

          <p className="text-lg leading-8 text-white/70">
            When someone hears another person describe what day one felt like,
            what nearly stopped them continuing, and what helped them keep going,
            recovery stops feeling abstract and starts to feel real.
          </p>
        </section>

        {/* WHY STORIES HELP */}

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            WHY YOUR STORY HELPS THE NEXT PERSON
          </h2>

          <p className="text-lg leading-8 text-white/70">
            One honest recovery story can change how someone understands their
            own situation. It can reduce shame. It can create recognition. It can
            make change feel possible sooner than it otherwise would.
          </p>

          <p className="text-lg leading-8 text-white/70">
            Every voice added to the archive becomes support for someone else.
            Someone listening later, somewhere else, at exactly the moment they
            need it.
          </p>
        </section>

        {/* THE MISSION */}

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            THE MISSION
          </h2>

          <p className="text-lg leading-8 text-white/70">
            LIVESOBERAF is building a structured archive of recovery stories
            using the same twenty questions asked to people from different
            backgrounds, different ages, and different addictions. The details
            may change, but the structure underneath is recognisable.
          </p>

          <p className="text-lg leading-8 text-white/70">
            The podcast explores these stories in depth. The website preserves
            them. The app delivers them back at the moments people are most
            likely to struggle. Together they form a peer-to-peer recovery system
            built from lived experience.
          </p>
        </section>

        {/* CLOSING */}

        <section className="mt-24 border-t border-white/10 pt-12">
          <p className="text-xl leading-8 text-white/80">
            LIVESOBERAF exists so nobody begins recovery without hearing from
            someone who has already been there. Every story shared today becomes
            support for someone else tomorrow.
          </p>
        </section>
      </section>
    </main>
  );
}