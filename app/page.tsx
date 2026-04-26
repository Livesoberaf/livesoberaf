"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  const handleEnter = () => {
    setLeaving(true);

    setTimeout(() => {
      router.push("/home");
    }, 1200);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white overflow-hidden">
      <button
        onClick={handleEnter}
        className={`text-5xl md:text-7xl font-semibold tracking-[0.2em] transition-all duration-[1200ms] ease-out ${
          leaving
            ? "-translate-y-32 opacity-0 scale-[1.02]"
            : "opacity-100 scale-100"
        }`}
      >
        LIVESOBERAF
      </button>
    </main>
  );
}