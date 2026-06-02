"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TARGET = "LIVESOBERAF";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Letter = { char: string; settled: boolean; active: boolean };

export default function LandingPage() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const [showEnter, setShowEnter] = useState(false);
  const [letters, setLetters] = useState<Letter[]>(
    TARGET.split("").map(() => ({ char: "", settled: false, active: false }))
  );

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    TARGET.split("").forEach((targetChar, i) => {
      // Each letter starts scrambling 80ms after the previous
      const t = setTimeout(() => {
        let elapsed = 0;
        const tickRate = 55;
        const scrambleDuration = 550;

        const interval = setInterval(() => {
          elapsed += tickRate;

          if (elapsed >= scrambleDuration) {
            setLetters((prev) => {
              const next = [...prev];
              next[i] = { char: targetChar, settled: true, active: true };
              return next;
            });
            clearInterval(interval);

            if (i === TARGET.length - 1) {
              setTimeout(() => setShowEnter(true), 350);
            }
          } else {
            setLetters((prev) => {
              const next = [...prev];
              next[i] = {
                char: CHARS[Math.floor(Math.random() * CHARS.length)],
                settled: false,
                active: true,
              };
              return next;
            });
          }
        }, tickRate);

        intervals.push(interval);
      }, i * 75);

      timeouts.push(t);
    });

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, []);

  function handleEnter() {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => router.push("/home"), 1100);
  }

  return (
    <main
      onClick={handleEnter}
      className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center cursor-pointer overflow-hidden select-none"
    >
      {/* Film grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Content */}
      <div
        className={`relative z-20 flex flex-col items-center transition-all ease-in-out ${
          leaving
            ? "opacity-0 scale-[1.06] duration-[1100ms]"
            : "opacity-100 scale-100 duration-0"
        }`}
      >
        {/* Scrambling title */}
        <div className="flex items-baseline">
          {letters.map((l, i) => (
            <span
              key={i}
              className="font-bold tabular-nums transition-colors duration-200"
              style={{
                fontSize: "clamp(2.8rem, 7.5vw, 9rem)",
                letterSpacing: "0.12em",
                color: l.settled
                  ? "rgba(255,255,255,1)"
                  : l.active
                  ? "rgba(255,255,255,0.25)"
                  : "transparent",
              }}
            >
              {l.char || " "}
            </span>
          ))}
        </div>

        {/* Enter prompt */}
        <div
          className={`mt-10 flex items-center gap-5 transition-all duration-700 ${
            showEnter
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
          }`}
        >
          <div className="h-px w-12 bg-white/25" />
          <span className="text-[10px] uppercase tracking-[0.55em] text-white/40">
            Enter
          </span>
          <div className="h-px w-12 bg-white/25" />
        </div>
      </div>
    </main>
  );
}
