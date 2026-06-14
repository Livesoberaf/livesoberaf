"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Creator = {
  id: string;
  name: string;
  pathway: string;
  region: string;
  sex: string;
  age_range: string;
  access_code: string;
  created_at: string;
};

export default function CreatorManager({ creators: initial }: { creators: Creator[] }) {
  const router                   = useRouter();
  const [creators, setCreators]  = useState<Creator[]>(initial);
  const [adding, setAdding]      = useState(false);
  const [saving, setSaving]      = useState(false);
  const [error, setError]        = useState("");

  const [form, setForm] = useState({
    name: "", pathway: "alcohol", region: "UK",
    sex: "male", age_range: "", access_code: "",
  });

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed."); return; }
      setCreators((c) => [...c, data.creator]);
      setAdding(false);
      setForm({ name: "", pathway: "alcohol", region: "UK", sex: "male", age_range: "", access_code: "" });
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove ${name}? Their clips in Supabase will remain but they won't be able to log in.`)) return;
    await fetch("/api/admin/creator", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setCreators((c) => c.filter((x) => x.id !== id));
  }

  const inputCls = "bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-white/30 text-sm outline-none focus:border-white/50 transition-colors w-full";

  return (
    <div className="mt-8">
      {creators.length === 0 ? (
        <p className="text-lg leading-8 text-white/50">No creators yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-white/5">
          {creators.map((c) => (
            <div key={c.id} className="py-5 flex items-start justify-between gap-8">
              <div>
                <p className="text-xl font-semibold tracking-[0.05em]">{c.name}</p>
                <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/35">
                  {c.pathway} · {c.region} · {c.sex}{c.age_range ? ` · ${c.age_range}` : ""}
                </p>
                <p className="mt-2 text-sm font-mono text-white/40">
                  code: <span className="text-white/70">{c.access_code}</span>
                </p>
              </div>
              <button
                onClick={() => handleDelete(c.id, c.name)}
                className="text-xs uppercase tracking-[0.2em] text-white/25 hover:text-red-300/70 transition shrink-0 mt-1"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <form onSubmit={handleAdd} className="mt-10 flex flex-col gap-4 max-w-md">
          <input placeholder="Name (e.g. Adam)"    value={form.name}        onChange={field("name")}        className={inputCls} required />
          <select value={form.pathway} onChange={field("pathway")} className={inputCls}>
            {["alcohol","codeine","cocaine","cannabis","gambling","nicotine"].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <input placeholder="Region (e.g. UK)"   value={form.region}      onChange={field("region")}      className={inputCls} required />
          <select value={form.sex} onChange={field("sex")} className={inputCls}>
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="non-binary">non-binary</option>
          </select>
          <input placeholder="Age range (e.g. 35-45, optional)" value={form.age_range} onChange={field("age_range")} className={inputCls} />
          <input placeholder="Access code (share privately with creator)" value={form.access_code} onChange={field("access_code")} className={inputCls} required />

          {error && <p className="text-red-300/70 text-sm">{error}</p>}

          <div className="flex gap-4 mt-2">
            <button
              type="submit"
              disabled={saving}
              className="border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black disabled:opacity-30"
            >
              {saving ? "Saving…" : "Add creator"}
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setError(""); }}
              className="text-sm uppercase tracking-[0.3em] text-white/30 hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-8 border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
        >
          + Add creator
        </button>
      )}
    </div>
  );
}
