"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  const handleEnter = () => {
    setLeaving(true);

    setTimeout(() => {
      router.push("/about");
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 flex flex-col items-center justify-center text-center overflow-hidden">
      <button
        onClick={handleEnter}
        className={`text-4xl sm:text-5xl md:text-7xl font-semibold tracking-[0.2em] transition-all duration-[1200ms] ease-out ${
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