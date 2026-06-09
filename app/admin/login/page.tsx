"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
      } else {
        setError(data.error ?? "Incorrect password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-sm uppercase tracking-[0.35em] text-red-300/70 mb-6">
          LIVESOBERAF
        </p>
        <h1 className="text-4xl font-semibold tracking-[0.15em] uppercase mb-2">
          ADMIN
        </h1>
        <p className="text-white/50 mb-12">Enter your password to continue.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent border border-white/20 px-5 py-4 text-white placeholder:text-white/30 text-sm outline-none focus:border-white/50 transition-colors w-full"
            autoComplete="current-password"
            required
          />

          {error && <p className="text-red-300/70 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="border border-white/20 px-8 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black disabled:opacity-30"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </main>
  );
}
