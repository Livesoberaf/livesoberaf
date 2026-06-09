export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-5xl">

        <a
          href="/home"
          className="mb-10 inline-block text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white transition"
        >
          BACK
        </a>

        <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
          CONTACT
        </p>

        <h1 className="mt-4 text-4xl sm:text-5xl md:text-7xl font-semibold tracking-[0.18em] break-words">
          GET IN TOUCH
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-8 text-white/75">
          Questions, partnerships, press, or anything else — we read everything.
        </p>

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            EMAIL US
          </h2>
          <a
            href="mailto:hello@livesoberaf.com"
            className="block text-2xl font-semibold tracking-[0.05em] text-white/75 hover:text-[#ff0099] transition-colors"
          >
            hello@livesoberaf.com
          </a>
        </section>

        <section className="mt-20 space-y-10">
          <h2 className="text-3xl font-semibold tracking-[0.15em]">
            WHAT TO INCLUDE
          </h2>
          <p className="text-lg leading-8 text-white/70">
            If you're reaching out about a partnership or sponsorship, tell us a
            little about who you are and what you have in mind.
          </p>
          <p className="text-lg leading-8 text-white/70">
            If you're a creator with lived experience of recovery and a following
            who might benefit from this platform, we'd especially love to hear
            from you.
          </p>
        </section>

        <section className="mt-24 border-t border-white/10 pt-12">
          <p className="text-xl leading-8 text-white/80">
            If you're struggling right now and need support, go to the{" "}
            <a href="/help" className="underline underline-offset-4 hover:text-[#ff0099] transition-colors">
              help page
            </a>{" "}
            for immediate resources.
          </p>
        </section>

      </section>
    </main>
  );
}
