import { notFound } from "next/navigation";
import Link from "next/link";
import { getPromptById, getRecordedPromptIds, momentLabel, moodLabel } from "@/lib/prompts";
import { getSessionCreator } from "@/lib/auth-helpers";
import UploadForm from "../../UploadForm";

export const dynamic = "force-dynamic";

export default async function PromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }    = await params;
  const [prompt, creator] = await Promise.all([getPromptById(id), getSessionCreator()]);

  if (!prompt || !creator) notFound();

  const recorded      = await getRecordedPromptIds(creator.id);
  const alreadyDone   = recorded.has(id);

  // Sub-label under the title: moment, mood, or event
  const subLabel =
    prompt.trigger_type === "mood"  ? moodLabel(prompt.mood)
    : prompt.trigger_type === "day" ? momentLabel(prompt.moment)
    : (prompt.event ?? "");

  const dayLine = prompt.day_number != null ? `Day ${prompt.day_number}` : null;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-2xl">

        <Link
          href="/sponsor"
          className="text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white transition mb-10 inline-block"
        >
          ← Back
        </Link>

        {/* Header */}
        <p className="text-sm uppercase tracking-[0.35em] text-red-300/70 mb-6">
          {[dayLine, subLabel].filter(Boolean).join(" · ")}
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-[0.15em] uppercase mb-10">
          {prompt.title}
        </h1>

        {/* The brief — what to say */}
        <section className="mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-4">What to say</p>
          <p className="text-2xl leading-9 text-white/90">&ldquo;{prompt.brief}&rdquo;</p>
        </section>

        {/* Tips */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 shrink-0">A few things that help</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <ul className="flex flex-col gap-4">
            {[
              "Clear audio matters more than a perfect background — a quiet room is enough",
              "Look directly into the camera lens, not at yourself on screen",
              "Lived honesty lands better than polish — don't overthink it",
              "Record a few takes and pick the one that feels most like you",
            ].map((tip) => (
              <li key={tip} className="flex gap-4 items-start text-white/50">
                <span className="text-white/20 shrink-0">·</span>
                <span className="leading-7">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Record / upload */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 shrink-0">Record or upload</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <UploadForm promptId={id} alreadyUploaded={alreadyDone} />
        </section>

      </div>
    </main>
  );
}
