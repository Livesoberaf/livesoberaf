"use client";

import { useEffect, useRef, useState } from "react";

// Website story library — 15 deep questions.
// appPlacement: the app feed slot this answer can be served into.
// null ("STORY") means website library only — never served into the app.
type Question = { text: string; appPlacement: string | null };

const QUESTIONS: Question[] = [
  { text: "Before recovery, what was life like when things were at their worst?",        appPlacement: null },
  { text: "Looking back, what was your lowest point?",                                   appPlacement: null },
  { text: "What finally made you decide to change?",                                     appPlacement: "early_days" },
  { text: "What was day one like?",                                                      appPlacement: "day_1" },
  { text: "What got you through the first week?",                                        appPlacement: "week_1" },
  { text: "When a craving hit hard, what did you actually do to get through it?",        appPlacement: "craving" },
  { text: "What was the hardest part of early recovery for you?",                        appPlacement: null },
  { text: "Was there a moment you nearly gave up — and what kept you going?",            appPlacement: "low_moment" },
  { text: "What's something you've got back that you thought you'd lost for good?",      appPlacement: null },
  { text: "What surprised you most about getting sober?",                                appPlacement: null },
  { text: "What's a small, ordinary thing you love about life sober now?",               appPlacement: "low_moment" },
  { text: "What does life look like for you now?",                                       appPlacement: "milestone" },
  { text: "How are you different now from the person you were then?",                    appPlacement: null },
  { text: "What would you say to someone on their very first day?",                      appPlacement: "day_1" },
  { text: "What would you say to someone who feels like giving up right now?",           appPlacement: "low_moment" },
];

const FILTERS = [
  { id: "natural", label: "Natural", css: "none" },
  { id: "soft",    label: "Soft",    css: "brightness(1.08) contrast(0.9) saturate(0.85)" },
  { id: "warm",    label: "Warm",    css: "sepia(0.22) brightness(1.06) contrast(1.05)" },
  { id: "vivid",   label: "Vivid",   css: "contrast(1.15) saturate(1.3) brightness(1.02)" },
  { id: "mono",    label: "Mono",    css: "grayscale(1) contrast(1.1) brightness(1.08)" },
];

type UploadStatus = "idle" | "uploading" | "done" | "error";

type SavedSession = {
  sessionId: string;
  currentQuestion: number;
  name: string;
  dayNumber: string;
  pathway: string;
  ageRange: string;
  sex: string;
  region: string;
  consent: boolean;
  savedAt: string;
};

const STORAGE_KEY = "lsaf_story_v3";

function saveProgress(data: Record<string, unknown>) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...existing, ...data, savedAt: new Date().toISOString() })
    );
  } catch {}
}

function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export default function ShareYourStoryPage() {
  const videoRef         = useRef<HTMLVideoElement | null>(null);
  const canvasRef        = useRef<HTMLCanvasElement | null>(null);
  const animationRef     = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef        = useRef<Blob[]>([]);
  const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null);

  const [started, setStarted]         = useState(false);
  const [stream, setStream]           = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const selectedFilterRef = useRef(FILTERS[0]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recording, setRecording]       = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl]     = useState<string | null>(null);
  const [seconds, setSeconds]           = useState(0);
  const [finished, setFinished]         = useState(false);

  const [uploadStatuses, setUploadStatuses] = useState<Record<number, UploadStatus>>({});

  const [sessionId, setSessionId]         = useState(() => crypto.randomUUID());
  const [savedSession, setSavedSession]   = useState<SavedSession | null>(null);

  // Form fields
  const [name, setName]         = useState("");
  const [dayNumber, setDayNumber] = useState("");   // which recovery day they're on
  const [pathway, setPathway]   = useState("");     // drug / addiction
  const [ageRange, setAgeRange] = useState("");
  const [sex, setSex]           = useState("");
  const [region, setRegion]     = useState("");     // country / city — enough to feel "someone like me"
  const [consent, setConsent]   = useState(false);

  const canBegin = name && dayNumber && pathway && ageRange && sex && region && consent;

  // Check localStorage for a saved session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: SavedSession = JSON.parse(raw);
      if (parsed.sessionId && parsed.currentQuestion > 0) {
        setSavedSession(parsed);
      }
    } catch {}
  }, []);

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
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
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
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !stream) return;

    chunksRef.current = [];
    setRecordedBlob(null);
    setPreviewUrl(null);
    setSeconds(0);

    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;

    function drawFrame() {
      if (!canvas || !video) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const f = selectedFilterRef.current;
      ctx.filter = f.id === "mono" ? "none" : f.css;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      if (f.id === "mono") {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          const gray = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
          d[i] = d[i + 1] = d[i + 2] = gray;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      animationRef.current = requestAnimationFrame(drawFrame);
    }
    drawFrame();

    const canvasStream = canvas.captureStream(30);
    stream.getAudioTracks().forEach((t) => canvasStream.addTrack(t));

    const recorder = new MediaRecorder(canvasStream, { mimeType: "video/webm" });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
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

    const safe = (v: string) =>
      v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    // public_id encodes enough to find/group the clip later
    const publicId = `${safe(pathway)}-day${dayNumber}-${safe(ageRange)}-${safe(sex)}-${sessionId}-q${questionIndex + 1}`;

    // All the metadata the matching engine will need
    const appPlacement = QUESTIONS[questionIndex].appPlacement;

    const context = [
      `sessionId=${sessionId}`,
      `name=${name}`,
      `dayNumber=${dayNumber}`,
      `pathway=${pathway}`,
      `ageRange=${ageRange}`,
      `sex=${sex}`,
      `region=${region}`,
      `consent=${consent}`,
      `questionIndex=${questionIndex}`,
      `appPlacement=${appPlacement ?? "story"}`,
      `source=story`,
    ].join("|");

    const formData = new FormData();
    formData.append("file", blob, `${publicId}.webm`);
    formData.append("upload_preset", "livesoberaf_stories");
    formData.append("folder", "livesoberaf/stories/peer");
    formData.append("public_id", publicId);
    formData.append("context", context);
    formData.append("resource_type", "video");

    fetch("https://api.cloudinary.com/v1_1/dsllk1oan/video/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.secure_url) {
          // Record in Supabase — fire-and-forget, Cloudinary is the source of truth
          fetch("/api/peer-clip", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              questionIndex,
              sharerName:    name,
              dayNumber,
              pathway,
              ageRange,
              sex,
              region,
              cloudinaryUrl: data.secure_url,
              consent,
              appPlacement,
            }),
          }).catch(() => null);

          setUploadStatuses((prev) => ({ ...prev, [questionIndex]: "done" }));
        } else {
          setUploadStatuses((prev) => ({ ...prev, [questionIndex]: "error" }));
        }
      })
      .catch(() => {
        setUploadStatuses((prev) => ({ ...prev, [questionIndex]: "error" }));
      });
  }

  function saveAndNext() {
    if (!recordedBlob) return;

    const blob          = recordedBlob;
    const questionIndex = currentQuestion;

    setRecordedBlob(null);
    setPreviewUrl(null);

    uploadInBackground(blob, questionIndex);

    if (currentQuestion < QUESTIONS.length - 1) {
      saveProgress({ currentQuestion: questionIndex + 1 });
      setCurrentQuestion((q) => q + 1);
    } else {
      clearProgress();
      setFinished(true);
    }
  }

  function reRecord() {
    setRecordedBlob(null);
    setPreviewUrl(null);
    setSeconds(0);
  }

  function handleResumeContinue() {
    if (!savedSession) return;
    setSessionId(savedSession.sessionId);
    setName(savedSession.name);
    setDayNumber(savedSession.dayNumber);
    setPathway(savedSession.pathway);
    setAgeRange(savedSession.ageRange);
    setSex(savedSession.sex);
    setRegion(savedSession.region);
    setConsent(savedSession.consent);
    setCurrentQuestion(savedSession.currentQuestion);
    const statuses: Record<number, UploadStatus> = {};
    for (let i = 0; i < savedSession.currentQuestion; i++) statuses[i] = "done";
    setUploadStatuses(statuses);
    setSavedSession(null);
    setStarted(true);
  }

  function handleResumeStartFresh() {
    clearProgress();
    setSavedSession(null);
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const answeredCount = Object.values(uploadStatuses).filter(
    (s) => s === "done" || s === "uploading"
  ).length;

  // ── Resume prompt ─────────────────────────────────────────────────────────────

  if (savedSession && !started) {
    const savedDate = new Date(savedSession.savedAt).toLocaleDateString("en-GB", {
      day: "numeric", month: "long",
    });

    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <section className="mx-auto max-w-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">LIVESOBERAF</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-[0.18em] break-words">
            CONTINUE YOUR STORY
          </h1>
          <p className="mt-8 max-w-xl text-xl leading-8 text-white/75">
            You answered {savedSession.currentQuestion} of {QUESTIONS.length} questions on {savedDate}.
          </p>
          <p className="mt-4 text-lg leading-8 text-white/60">
            Those answers are saved. Pick up where you left off, or start again from scratch.
          </p>
          <div className="mt-12 flex flex-col gap-4 max-w-sm">
            <button
              onClick={handleResumeContinue}
              className="border border-white/20 px-8 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
            >
              Continue from question {savedSession.currentQuestion + 1}
            </button>
            <button
              onClick={handleResumeStartFresh}
              className="px-8 py-4 text-sm uppercase tracking-[0.3em] text-white/30 transition hover:text-white"
            >
              Start fresh instead
            </button>
          </div>
        </section>
      </main>
    );
  }

  // ── Onboarding form ──────────────────────────────────────────────────────────

  if (!started) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <section className="mx-auto max-w-2xl">

          <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">LIVESOBERAF</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-[0.18em] break-words">
            SHARE YOUR STORY
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
            A few quick details, then fifteen questions about your recovery in your own words.
            Your story will help others find themselves in yours.
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
                What day of recovery are you on?
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 7"
                value={dayNumber}
                onChange={(e) => setDayNumber(e.target.value)}
                className="w-full border border-white/20 bg-black px-5 py-4 text-white outline-none focus:border-white/50 transition"
              />
              <p className="mt-2 text-xs text-white/30">
                Day 1 is your first sober day. This is what connects your answers to others on the same day.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-white/50">
                What are you recovering from?
              </label>
              <select
                value={pathway}
                onChange={(e) => setPathway(e.target.value)}
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
                  <option>18–24</option>
                  <option>25–34</option>
                  <option>35–44</option>
                  <option>45–54</option>
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
                Where are you? (country or city)
              </label>
              <input
                placeholder="e.g. Manchester, UK"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
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
                    I'm happy for my answers to be shown to others on the same day of their recovery.
                  </p>
                  <p className="mt-1 text-sm text-white/45">
                    Your answers will only be shown to people in recovery, matched to your day.
                    You can use just your first name.
                  </p>
                </div>
              </label>
            </div>

            <button
              disabled={!canBegin}
              onClick={() => {
                saveProgress({ sessionId, currentQuestion: 0, name, dayNumber, pathway, ageRange, sex, region, consent });
                setStarted(true);
              }}
              className="w-full border border-white/20 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black disabled:opacity-30"
            >
              Start recording
            </button>

          </div>
        </section>
      </main>
    );
  }

  // ── Finished ─────────────────────────────────────────────────────────────────

  if (finished) {
    const pendingCount = Object.values(uploadStatuses).filter((s) => s === "uploading").length;
    const errorCount   = Object.values(uploadStatuses).filter((s) => s === "error").length;

    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white flex items-center">
        <section className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">Thank you</p>
          <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-[0.18em]">
            YOUR STORY IS SAVED.
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/65">
            {pendingCount > 0
              ? `${pendingCount} answer${pendingCount > 1 ? "s" : ""} still uploading — keep this tab open for a moment.`
              : errorCount > 0
              ? "Most answers saved. A few had upload errors."
              : "All answers saved. Your story will help others find themselves in yours."}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {QUESTIONS.map((_, i) => {
              const status = uploadStatuses[i] || "idle";
              return (
                <div
                  key={i}
                  title={`Q${i + 1}`}
                  className={`h-3 w-3 rounded-full transition-all ${
                    status === "done"      ? "bg-white"
                    : status === "uploading" ? "animate-pulse bg-white/50"
                    : status === "error"     ? "bg-red-500"
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
            View community stories
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

      <canvas ref={canvasRef} className="hidden" />

      {/* Progress bar */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-black/90 backdrop-blur px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">
            Day {dayNumber} · Question {currentQuestion + 1} of {QUESTIONS.length}
          </p>
          <div className="flex gap-2">
            {QUESTIONS.map((_, i) => {
              const status    = uploadStatuses[i] || "idle";
              const isCurrent = i === currentQuestion;
              return (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all ${
                    status === "done"      ? "bg-white"
                    : status === "uploading" ? "animate-pulse bg-white/60"
                    : status === "error"     ? "bg-red-500"
                    : isCurrent            ? "bg-white/50"
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
          <video
            ref={videoRef}
            autoPlay muted playsInline
            style={{ filter: selectedFilter.css, display: previewUrl ? "none" : "block" }}
            className="h-full w-full flex-1 object-cover max-h-[45vh] lg:max-h-[calc(100vh-57px-52px)]"
          />
          {previewUrl && (
            <video
              src={previewUrl}
              controls autoPlay playsInline
              style={{ filter: selectedFilter.css }}
              className="h-full w-full flex-1 object-cover max-h-[45vh] lg:max-h-[calc(100vh-57px-52px)]"
            />
          )}
          {recording && (
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              <span className="text-sm tabular-nums text-white">{formatTime(seconds)}</span>
            </div>
          )}
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
            <p className="text-sm uppercase tracking-[0.3em] text-red-300/70">
              Question {currentQuestion + 1} of {QUESTIONS.length}
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight lg:text-4xl">
              {QUESTIONS[currentQuestion].text}
            </h2>
          </div>

          {!recording && !previewUrl && (
            <button
              onClick={startRecording}
              className="flex items-center gap-4 self-start border border-white/20 px-8 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
            >
              <span className="h-3 w-3 rounded-full bg-red-500" />
              Start recording
            </button>
          )}

          {recording && (
            <button
              onClick={stopRecording}
              className="flex items-center gap-4 self-start border border-red-500/50 bg-red-500/10 px-8 py-5 text-sm uppercase tracking-[0.3em] text-red-400 transition hover:bg-red-500 hover:text-white"
            >
              <span className="h-3 w-3 rounded-sm bg-red-500" />
              Stop recording
            </button>
          )}

          {!recording && previewUrl && (
            <div className="flex flex-col gap-3">
              <button
                onClick={saveAndNext}
                className="border border-white/20 px-8 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
              >
                {currentQuestion < QUESTIONS.length - 1 ? "Save & next question" : "Save & finish"}
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
              One or more answers failed to upload. You can re-record before finishing.
            </p>
          )}
        </div>

      </section>
    </main>
  );
}
