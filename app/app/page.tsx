"use client";

import { useState } from "react";

export default function AppPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/register-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setAlreadyRegistered(data.alreadyRegistered);
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function closeModal() {
    setModalOpen(false);
    setEmail("");
    setStatus("idle");
    setAlreadyRegistered(false);
  }

  return (
    <>
      <main className="min-h-screen bg-black text-white px-6 sm:px-10 py-16 overflow-hidden">
        <section className="mx-auto max-w-4xl">

          <a
            href="/"
            className="mb-10 inline-block text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white"
          >
            BACK
          </a>

          <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
            THE APP
          </p>

          <h1 className="mt-4 text-3xl sm:text-5xl md:text-7xl font-semibold tracking-[0.08em] sm:tracking-[0.25em] md:tracking-[0.35em] break-words">
            LIVESOBERAF
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/75">
            The LIVESOBERAF app is being built as the first recovery platform designed
            around real lived experience, real timelines, and real signals from the body.
          </p>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75">
            Most recovery tools rely on static advice, generic programmes, or support
            that appears only after someone actively asks for help. LIVESOBERAF works
            differently. It is structured around peer-to-peer recovery stories delivered
            at the exact moments people are most likely to struggle, creating recognition,
            stability and direction when they are needed most.
          </p>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75">
            At its core is a growing archive of structured recovery journeys from people
            who have already moved through addiction themselves. Each story follows the
            same timeline — what day one felt like, what nearly stopped them continuing,
            what helped them stay, and what life looks like now. Instead of abstract
            guidance, users hear from someone who has already been where they are.
          </p>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75">
            Alongside this lived-experience layer, the app introduces timeline-based
            support that matches recovery content to the stage someone is currently in.
            Early hours, early days, early weeks and later milestones each bring different
            risks and different questions. LIVESOBERAF responds to those stages directly
            rather than treating recovery as a single static process.
          </p>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75">
            The next layer connects recovery to wearable technology. Changes in sleep,
            stress patterns, heart-rate variability and routine disruption often appear
            before relapse becomes visible in behaviour. By recognising these signals
            early, the platform surfaces the right voices and experiences at the right
            time — before someone loses momentum.
          </p>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/80">
            Together, these elements create something new: a recovery system built from
            lived experience, delivered in real time, and responsive to the body as well
            as the mind.
          </p>

          <p className="mt-12 max-w-3xl text-lg leading-relaxed text-white/90">
            LIVESOBERAF is designed so that nobody begins recovery without hearing from
            someone who has already been there — and nobody continues recovery without
            support arriving when it matters most.
          </p>

          <div className="mt-12 border-t border-white/10 pt-12">
            <button
              onClick={() => setModalOpen(true)}
              className="border border-white/20 px-10 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
            >
              Register Your Interest
            </button>
          </div>

        </section>
      </main>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="w-full max-w-md bg-black border border-white/15 p-10">

            {status === "done" ? (
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#d28b95]">
                  {alreadyRegistered ? "Already registered" : "Registered"}
                </p>

                <h2 className="mt-4 text-3xl font-semibold">
                  {alreadyRegistered
                    ? "You're already on the list."
                    : "You're on the list."}
                </h2>

                <p className="mt-4 text-white/65">
                  {alreadyRegistered
                    ? "We already have your email. We'll be in touch when the app launches."
                    : "We'll let you know as soon as the app is ready."}
                </p>

                <button
                  onClick={closeModal}
                  className="mt-8 border border-white/20 px-8 py-4 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="text-sm uppercase tracking-[0.35em] text-[#d28b95]">
                  The App
                </p>

                <h2 className="mt-4 text-3xl font-semibold">
                  Register your interest.
                </h2>

                <p className="mt-4 text-white/65">
                  Be the first to know when LiveSoberAF launches. No spam — just a message when it's ready.
                </p>

                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-8 w-full border border-white/20 bg-black px-5 py-4 text-white placeholder:text-white/30 outline-none focus:border-white/50"
                />

                {status === "error" && (
                  <p className="mt-3 text-sm text-red-400">
                    Something went wrong. Please try again.
                  </p>
                )}

                <div className="mt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex-1 border border-white/20 px-6 py-4 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black disabled:opacity-40"
                  >
                    {status === "loading" ? "Saving..." : "Register"}
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="border border-white/10 px-6 py-4 text-sm uppercase tracking-[0.3em] text-white/50 transition hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
}
