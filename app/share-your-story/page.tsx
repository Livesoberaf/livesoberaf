"use client";

import { useEffect, useRef, useState } from "react";

const QUESTIONS = [
  "What was life like before recovery?",
  "What made you realise things needed to change?",
  "What was the hardest part of addiction?",
  "What did your lowest point look like?",
  "Who did addiction affect around you?",
  "What finally pushed you toward recovery?",
  "What was your first day sober like?",
  "What fears did you have about getting clean?",
  "What helped you stay sober early on?",
  "What role did support play in recovery?",
  "How has your mindset changed?",
  "What does a normal day look like now?",
  "What are you most proud of?",
  "How has recovery changed relationships?",
  "What triggers still affect you?",
  "How do you handle difficult days now?",
  "What would you say to someone struggling?",
  "What have you rediscovered about yourself?",
  "What does happiness mean to you today?",
  "What is life like now?",
];

const FILTERS = [
  { id: "natural", label: "Natural", css: "none" },
  { id: "soft",    label: "Soft",    css: "brightness(1.08) contrast(0.9) saturate(0.85)" },
  { id: "warm",    label: "Warm",    css: "sepia(0.22) brightness(1.06) contrast(1.05)" },
  { id: "vivid",   label: "Vivid",   css: "contrast(1.15) saturate(1.3) brightness(1.02)" },
  { id: "mono",    label: "Mono",    css: "grayscale(1) contrast(1.1) brightness(1.08)" },
];

type UploadStatus = "idle" | "uploading" | "done" | "error";

export default function ShareYourStoryPage() {
  // Live camera feed shown to user
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Offscreen canvas used only during recording to bake filter in
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [started, setStarted] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const selectedFilterRef = useRef(FILTERS[0]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [finished, setFinished] = useState(false);

  const [uploadStatuses, setUploadStatuses] = useState<Record<number, UploadStatus>>({});

  const [sessionId] = useState(() => crypto.randomUUID());
  const [name, setName] = useState("");
  const [substance, setSubstance] = useState("");
  const [stage, setStage] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [sex, setSex] = useState("");
  const [location, setLocation] = useState("");
  const [consent, setConsent] = useState(false);

  const canBegin = name && substance && stage && ageRange && sex && location && consent;

  // Keep ref in sync so the draw loop always reads the latest filter
  function selectFilter(f: typeof FILTERS[0]) {
    setSelectedFilter(f);
    selectedFilterRef.current = f;
  }

  useEffect(() => {
    if (!started) return;

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch {
        setCameraError(true);
      }
    }

    startCamera();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [started]);

  function startRecording() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !stream) return;

    chunksRef.current = [];
    setRecordedBlob(null);
    setPreviewUrl(null);
    setSeconds(0);

    // Size the offscreen canvas to match the video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Draw loop: copies video frames to canvas with filter baked in
    function drawFrame() {
      if (!canvas || !video) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.filter = selectedFilterRef.current.css;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      animationRef.current = requestAnimationFrame(drawFrame);
    }
    drawFrame();

    // Record from canvas stream + original audio
    const canvasStream = canvas.captureStream(30);
    stream.getAudioTracks().forEach((t) => canvasStream.addTrack(t));

    const recorder = new MediaRecorder(canvasStream, { mimeType: "video/webm" });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecording(true);

    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function uploadInBackground(blob: Blob, questionIndex: number) {
    setUploadStatuses((prev) => ({ ...prev, [questionIndex]: "uploading" }));

    const formData = new FormData();
    formData.append("file", blob, `${sessionId}-q${questionIndex + 1}.webm`);
    formData.append("sessionId", sessionId);
    formData.append("questionIndex", String(questionIndex));
    formData.append("name", name);
    formData.append("substance", substance);
    formData.append("stage", stage);
    formData.append("ageRange", ageRange);
    formData.append("sex", sex);
    formData.append("location", location);
    formData.append("consent", String(consent));

    fetch("/api/upload-story-answer", { method: "POST", body: formData })
      .then((res) => res.json())
      .then((data) => {
        setUploadStatuses((prev) => ({
          ...prev,
          [questionIndex]: data.videoUrl ? "done" : "error",
        }));
      })
      .catch(() => {
        setUploadStatuses((prev) => ({ ...prev, [questionIndex]: "error" }));
      });
  }

  function saveAndNext() {
    if (!recordedBlob) return;

    const blob = recordedBlob;
    const questionIndex = currentQuestion;

    setRecordedBlob(null);
    setPreviewUrl(null);

    uploadInBackground(blob, questionIndex);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((q) => q + 1);
    } else {
      setFinished(true);
    }
  }

  function reRecord() {
    setRecordedBlob(null);
    setPreviewUrl(null);
    setSeconds(0);
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const answeredCount = Object.values(uploadStatuses).filter(
    (s) => s === "done" || s === "uploading"
  ).length;

  // ── Onboarding form ──────────────────────────────────────────────────────────

  if (!started) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <section className="mx-auto max-w-2xl">

          <p className="text-sm uppercase tracking-[0.4em] text-[#d28b95]">
            Share Your Story
          </p>

          <h1 className="mt-4 text-5xl font-bold">Before We Begin</h1>

          <p className="mt-6 max-w-xl text-lg text-white/60">
            A few details before you start. This helps us organise your story and show it to the right people.
          </p>

          <div className="mt-12 space-y-8">

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-white/50">
                Your first name
              </label>
              <input
                placeholder="e.g. Anna"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-white/20 bg-black px-5 py-4 text-white outline-none focus:border-white/50 transition"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-white/50">
                Recovery focus
              </label>
              <select
                value={substance}
                onChange={(e) => setSubstance(e.target.value)}
                className="w-full border border-white/20 bg-black px-5 py-4 text-white outline-none focus:border-white/50 transition"
              >
                <option value="">Select</option>
                <option>Alcohol</option>
                <option>Cocaine</option>
                <option>Codeine</option>
                <option>Heroin</option>
                <option>Gambling</option>
                <option>Cannabis</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-white/50">
                Where are you in recovery?
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full border border-white/20 bg-black px-5 py-4 text-white outline-none focus:border-white/50 transition"
              >
                <option value="">Select</option>
                <option>Day 1</option>
                <option>1 Week</option>
                <option>1 Month</option>
                <option>6 Months</option>
                <option>1 Year</option>
                <option>Multiple Years</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-white/50">
                  Age range
                </label>
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className="w-full border border-white/20 bg-black px-5 py-4 text-white outline-none focus:border-white/50 transition"
                >
                  <option value="">Select</option>
                  <option>18-24</option>
                  <option>25-34</option>
                  <option>35-44</option>
                  <option>45-54</option>
                  <option>55+</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-white/50">
                  Sex
                </label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-full border border-white/20 bg-black px-5 py-4 text-white outline-none focus:border-white/50 transition"
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-white/50">
                Location
              </label>
              <input
                placeholder="e.g. Manchester, UK"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-white/20 bg-black px-5 py-4 text-white outline-none focus:border-white/50 transition"
              />
            </div>

            <div className="border border-white/10 p-6">
              <label className="flex cursor-pointer items-start gap-4">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0"
                />
                <div>
                  <p className="text-white/90">
                    I am happy for my story to be shared by LiveSoberAF.
                  </p>
                  <p className="mt-1 text-sm text-white/45">
                    Your story may appear on the website and help others in recovery.
                  </p>
                </div>
              </label>
            </div>

            <button
              disabled={!canBegin}
              onClick={() => setStarted(true)}
              className="w-full border border-white/20 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black disabled:opacity-30"
            >
              Begin Recording
            </button>

          </div>
        </section>
      </main>
    );
  }

  // ── Finished state ───────────────────────────────────────────────────────────

  if (finished) {
    const pendingCount = Object.values(uploadStatuses).filter((s) => s === "uploading").length;
    const errorCount = Object.values(uploadStatuses).filter((s) => s === "error").length;

    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white flex items-center">
        <section className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d28b95]">Thank you</p>

          <h1 className="mt-6 text-5xl font-bold">Your story is being saved.</h1>

          <p className="mt-6 text-lg text-white/65">
            {pendingCount > 0
              ? `${pendingCount} answer${pendingCount > 1 ? "s" : ""} still uploading — keep this tab open for a moment.`
              : errorCount > 0
              ? "Most answers saved. A few had upload errors — you can re-record those questions."
              : "All answers saved. Your story will appear in the community shortly."}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {QUESTIONS.map((_, i) => {
              const status = uploadStatuses[i] || "idle";
              return (
                <div
                  key={i}
                  title={`Q${i + 1}`}
                  className={`h-3 w-3 rounded-full transition-all ${
                    status === "done" ? "bg-white"
                    : status === "uploading" ? "animate-pulse bg-white/50"
                    : status === "error" ? "bg-red-500"
                    : "bg-white/15"
                  }`}
                />
              );
            })}
          </div>

          <a
            href="/shares"
            className="mt-12 inline-block border border-white/20 px-10 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
          >
            View Community Stories
          </a>
        </section>
      </main>
    );
  }

  // ── Camera error ─────────────────────────────────────────────────────────────

  if (cameraError) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white flex items-center justify-center">
        <p className="text-white/60">
          Camera access is required. Please allow camera permissions and reload.
        </p>
      </main>
    );
  }

  // ── Recording interface ──────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Offscreen canvas — only used during recording to bake filter in */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Progress bar */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-black/90 backdrop-blur px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </p>

          <div className="flex gap-1.5">
            {QUESTIONS.map((_, i) => {
              const status = uploadStatuses[i] || "idle";
              const isCurrent = i === currentQuestion;
              return (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    status === "done" ? "bg-white"
                    : status === "uploading" ? "animate-pulse bg-white/60"
                    : status === "error" ? "bg-red-500"
                    : isCurrent ? "bg-white/40"
                    : "bg-white/15"
                  }`}
                />
              );
            })}
          </div>

          <p className="text-sm text-white/40">{answeredCount} saved</p>
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-2 lg:min-h-[calc(100vh-57px)]">

        {/* Camera / Preview */}
        <div className="relative flex flex-col bg-neutral-950">

          {/* Live camera with CSS filter applied, or playback preview */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{ filter: selectedFilter.css, display: previewUrl ? "none" : "block" }}
            className="h-full w-full flex-1 object-cover lg:max-h-[calc(100vh-57px-52px)]"
          />

          {previewUrl && (
            <video
              src={previewUrl}
              controls
              autoPlay
              playsInline
              className="h-full w-full flex-1 object-cover lg:max-h-[calc(100vh-57px-52px)]"
            />
          )}

          {/* Recording indicator */}
          {recording && (
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              <span className="text-sm tabular-nums text-white">{formatTime(seconds)}</span>
            </div>
          )}

          {/* Filter picker — hidden while previewing */}
          {!previewUrl && (
            <div className="flex items-center justify-center gap-2 border-t border-white/10 bg-black/80 px-4 py-3 backdrop-blur">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => selectFilter(f)}
                  className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] transition ${
                    selectedFilter.id === f.id
                      ? "bg-white text-black"
                      : "border border-white/20 text-white/60 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col justify-center gap-8 px-8 py-12 lg:px-12">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#d28b95]">
              Question {currentQuestion + 1}
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight lg:text-4xl">
              {QUESTIONS[currentQuestion]}
            </h2>
          </div>

          {!recording && !previewUrl && (
            <button
              onClick={startRecording}
              className="flex items-center gap-4 self-start border border-white/20 px-8 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
            >
              <span className="h-3 w-3 rounded-full bg-red-500" />
              Start Recording
            </button>
          )}

          {recording && (
            <button
              onClick={stopRecording}
              className="flex items-center gap-4 self-start border border-red-500/50 bg-red-500/10 px-8 py-5 text-sm uppercase tracking-[0.3em] text-red-400 transition hover:bg-red-500 hover:text-white"
            >
              <span className="h-3 w-3 rounded-sm bg-red-500" />
              Stop Recording
            </button>
          )}

          {!recording && previewUrl && (
            <div className="flex flex-col gap-3">
              <button
                onClick={saveAndNext}
                className="border border-white/20 px-8 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
              >
                {currentQuestion < QUESTIONS.length - 1 ? "Save & Next Question" : "Save & Finish"}
              </button>

              <button
                onClick={reRecord}
                className="px-8 py-4 text-sm uppercase tracking-[0.3em] text-white/40 transition hover:text-white"
              >
                Re-record
              </button>
            </div>
          )}

          {Object.values(uploadStatuses).some((s) => s === "error") && (
            <p className="text-sm text-red-400">
              One or more answers failed to upload. You can re-record them before finishing.
            </p>
          )}
        </div>

      </section>
    </main>
  );
}
