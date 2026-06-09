"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const NAV_ITEMS = [
  { label: "ABOUT",         href: "/about" },
  { label: "STORIES",       href: "/shares" },
  { label: "SHARE",           href: "/share-your-story" },
  { label: "PODCAST",       href: "/podcast" },
  { label: "MERCHANDISE",   href: "/merch" },
  { label: "APP",           href: "/app" },
  { label: "CONTACT",       href: "/contact" },
];

function ScrambleLink({
  label,
  href,
  className = "",
}: {
  label: string;
  href: string;
  className?: string;
}) {
  const router = useRouter();
  const [display, setDisplay] = useState(label);
  const [active, setActive] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (active) return;
    setActive(true);

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    label.split("").forEach((targetChar, i) => {
      const t = setTimeout(() => {
        let elapsed = 0;
        const tick = 45;
        const duration = 320;

        const interval = setInterval(() => {
          elapsed += tick;

          if (elapsed >= duration) {
            setDisplay((prev) => {
              const chars = prev.split("");
              chars[i] = targetChar;
              return chars.join("");
            });
            clearInterval(interval);

            if (i === label.length - 1) {
              setTimeout(() => router.push(href), 80);
            }
          } else {
            setDisplay((prev) => {
              const chars = prev.split("");
              chars[i] = CHARS[Math.floor(Math.random() * CHARS.length)];
              return chars.join("");
            });
          }
        }, tick);

        intervals.push(interval);
      }, i * 40);

      timeouts.push(t);
    });
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`group w-full border-b border-white/10 py-6 sm:py-7 transition-opacity duration-200 ${
        active ? "opacity-25" : "hover:text-[#ff0099] cursor-pointer"
      } ${className}`}
    >
      {display}
    </a>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden px-8 sm:px-16 pt-24 pb-16 flex flex-col justify-between">

      {/* Film grain */}
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
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div className="relative z-20">

        {/* Nav */}
        <nav className="flex flex-col items-start border-t border-white/10 w-full max-w-2xl">
          {NAV_ITEMS.map((item) => (
            <ScrambleLink
              key={item.href}
              label={item.label}
              href={item.href}
              className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[0.18em]"
            />
          ))}
        </nav>

      </div>

      {/* Footer — GET HELP NOW + discreet Creator login */}
      <div className="relative z-20">
        <ScrambleLink
          label="GET HELP NOW"
          href="/help"
          className="text-sm sm:text-base tracking-[0.35em] text-white/60"
        />
        <a
          href="/sponsor/login"
          className="mt-4 inline-block text-xs uppercase tracking-[0.25em] text-white/20 hover:text-[#ff0099] transition-colors"
        >
          Creator login
        </a>
      </div>

    </main>
  );
}
