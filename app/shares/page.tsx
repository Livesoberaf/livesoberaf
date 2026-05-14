"use client";

export default function SharesPage() {
  const videos = [
    "https://res.cloudinary.com/dsllk1oan/video/upload/chris-alcohol-new_tbcfbh.mp4",
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <section className="max-w-5xl mx-auto">
        <a
          href="/home"
          className="mb-10 inline-block text-sm uppercase tracking-wide text-white/50 hover:text-white"
        >
          Back
        </a>

        <p className="text-sm uppercase tracking-[0.35em] text-red-400/70">
          Stories
        </p>

        <h1 className="mt-4 text-4xl font-semibold">
          The 20 Questions
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-white/70">
          Every person who contributes to LIVESOBERAF is asked the same twenty
          questions. Not because every story is the same, but because asking the
          same questions helps reveal what sits underneath addiction and recovery.
        </p>

        <div className="mt-12 space-y-12">
          {videos.map((video, index) => (
            <div key={index} className="w-full">
              <video
                controls
                playsInline
                className="w-full rounded-lg"
              >
                <source src={video} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}