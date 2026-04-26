"use client";

import { useEffect, useRef, useState } from "react";

const QUESTIONS = [
  "WHAT WAS LIFE LIKE BEFORE THINGS CHANGED?",
  "WHEN DID YOU FIRST FEEL SOMETHING WASN’T RIGHT?",
  "WHAT DID ADDICTION BEGIN TAKING FROM YOU?",
  "WAS THERE A MOMENT YOU KNEW SOMETHING HAD TO CHANGE?",
  "WHAT WAS THE LOWEST POINT FOR YOU?",
  "WHAT NEARLY STOPPED YOU GETTING HELP?",
  "WHAT DID SUPPORT LOOK LIKE AT THE BEGINNING?",
  "WHAT WAS HARDER THAN YOU EXPECTED?",
  "WHAT SURPRISED YOU IN RECOVERY?",
  "WHAT DID YOU LEARN ABOUT YOURSELF?",
  "WHAT HELPED YOU KEEP GOING?",
  "WHAT DO PEOPLE MISUNDERSTAND ABOUT ADDICTION?",
  "WHAT DO PEOPLE MISUNDERSTAND ABOUT RECOVERY?",
  "WHEN DID LIFE BEGIN TO FEEL DIFFERENT?",
  "WHAT IS LIFE LIKE NOW?",
  "WHAT ARE YOU PROUD OF TODAY?",
  "WHAT WOULD YOU SAY TO SOMEONE WHO FEELS STUCK?",
  "WHAT WAS DAY 1 LIKE?",
  "WHAT NEARLY MADE YOU GIVE UP EARLY ON?",
  "WHAT WOULD YOU SAY TO SOMEONE ON DAY 1 RIGHT NOW?",
];

const SUBSTANCES = [
  "ALCOHOL",
  "CODEINE",
  "OPIATES",
  "COCAINE",
  "CANNABIS",
  "BENZODIAZEPINES",
  "KETAMINE",
  "NICOTINE",
  "VAPING",
  "SUGAR",
  "PORNOGRAPHY",
  "GAMBLING",
  "MULTIPLE",
  "OTHER",
];

const STAGES = [
  "DAY 1",
  "FIRST WEEK",
  "FIRST MONTH",
  "3 MONTHS+",
  "6 MONTHS+",
  "1 YEAR+",
  "LONG-TERM RECOVERY",
];

const FILTERS = [
  { label: "NATURAL", value: "none" },
  { label: "BLACK & WHITE", value: "grayscale(100%)" },
  { label: "WARM", value: "sepia(35%) saturate(115%) brightness(105%)" },
  { label: "COOL", value: "saturate(90%) hue-rotate(10deg) brightness(103%)" },
  { label: "CONTRAST", value: "contrast(125%) saturate(110%)" },
  { label: "FADED", value: "contrast(85%) brightness(108%) saturate(80%)" },
];

const TOTAL_QUESTIONS = 20;

export default function ShareYourStoryPage() {
  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const [name, setName] = useState("");
  const [substance, setSubstance] = useState("");
  const [stage, setStage] = useState("");
  const [consent, setConsent] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [savedAnswers, setSavedAnswers] = useState<Record<number, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const canStart =
    name.trim() !== "" &&
    substance !== "" &&
    stage !== "" &&
    consent === true;

  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      setCameraReady(true);

      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }
    } catch {
      setError("WE COULD NOT ACCESS YOUR CAMERA OR MICROPHONE.");
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      setError("START THE CAMERA FIRST.");
      return;
    }

    setError(null);
    setRecordedBlob(null);
    setRecordedVideoUrl(null);
    chunksRef.current = [];

    let mimeType = "";

    if (MediaRecorder.isTypeSupported("video/mp4")) {
      mimeType = "video/mp4";
    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
      mimeType = "video/webm;codecs=vp9";
    } else if (MediaRecorder.isTypeSupported("video/webm")) {
      mimeType = "video/webm";
    }

    const recorder = mimeType
      ? new MediaRecorder(streamRef.current, { mimeType })
      : new MediaRecorder(streamRef.current);

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      if (chunksRef.current.length === 0) {
        setError("NO VIDEO WAS CAPTURED.");
        setIsRecording(false);
        return;
      }

      const actualType =
        chunksRef.current[0]?.type || recorder.mimeType || "video/mp4";

      const blob = new Blob(chunksRef.current, { type: actualType });
      const url = URL.createObjectURL(blob);

      setRecordedBlob(blob);
      setRecordedVideoUrl(url);
      setIsRecording(false);
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
  };

  const saveCurrentAnswer = async () => {
    if (!recordedBlob) {
      setError("RECORD AN ANSWER BEFORE SAVING.");
      return false;
    }

    try {
      setIsSavingAnswer(true);
      setError(null);

      const extension = recordedBlob.type.includes("mp4") ? "mp4" : "webm";
      const file = new File(
        [recordedBlob],
        `answer-${currentQuestion + 1}.${extension}`,
        {
          type: recordedBlob.type || "video/mp4",
        }
      );

      const formData = new FormData();
      formData.append("file", file);
      formData.append("sessionId", sessionId);
      formData.append("questionIndex", String(currentQuestion));
      formData.append("name", name);
      formData.append("substance", substance);
      formData.append("stage", stage);
      formData.append("consent", String(consent));

      const response = await fetch("/api/upload-story-answer", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.videoUrl) {
        throw new Error(data.error || "Upload failed.");
      }

      setSavedAnswers((prev) => ({
        ...prev,
        [currentQuestion]: data.videoUrl as string,
      }));

      setIsPublished(Boolean(data.isPublished));
      return true;
    } catch {
      setError("WE COULD NOT SAVE THIS ANSWER.");
      return false;
    } finally {
      setIsSavingAnswer(false);
    }
  };

  const goToNextQuestion = async () => {
    if (!recordedVideoUrl && !savedAnswers[currentQuestion]) {
      setError("RECORD AN ANSWER BEFORE MOVING ON.");
      return;
    }

    let updatedAnswers = savedAnswers;

    if (recordedBlob) {
      const saved = await saveCurrentAnswer();
      if (!saved) return;

      const response = await fetch(`/uploads/sessions/${sessionId}.json`);
      if (response.ok) {
        try {
          const session = await response.json();
          updatedAnswers = session.answers || savedAnswers;
          setSavedAnswers(updatedAnswers);
        } catch {
          // ignore
        }
      }
    }

    setRecordedBlob(null);
    setRecordedVideoUrl(null);
    chunksRef.current = [];

    if (currentQuestion < QUESTIONS.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setRecordedVideoUrl(updatedAnswers[nextQuestion] ?? null);
      setError(null);
    } else {
      setShowReview(true);
      setError(null);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      setRecordedBlob(null);
      setRecordedVideoUrl(savedAnswers[prevQuestion] ?? null);
      setError(null);
      chunksRef.current = [];
    }
  };

  const clearThisAnswer = () => {
    const updatedAnswers = { ...savedAnswers };
    delete updatedAnswers[currentQuestion];
    setSavedAnswers(updatedAnswers);
    setRecordedBlob(null);
    setRecordedVideoUrl(null);
    setError(null);
    chunksRef.current = [];
  };

  const restartEntireStory = () => {
    setStarted(false);
    setSessionId(crypto.randomUUID());
    setName("");
    setSubstance("");
    setStage("");
    setConsent(false);
    setCurrentQuestion(0);
    setCameraReady(false);
    setIsRecording(false);
    setIsSavingAnswer(false);
    setRecordedVideoUrl(null);
    setRecordedBlob(null);
    setSavedAnswers({});
    setShowReview(false);
    setSelectedFilter("none");
    setIsPublished(false);
    setError(null);
    chunksRef.current = [];
  };

  if (!started) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <section className="mx-auto max-w-3xl">
          <a
            href="/home"
            className="mb-10 inline-block text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white"
          >
            BACK
          </a>

          <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
            SHARE YOUR STORY
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-[0.2em] md:text-7xl">
            BEFORE WE BEGIN
          </h1>

          <div className="mt-12 space-y-8">
            <div>
              <label className="block text-sm uppercase tracking-[0.25em] text-white/50">
                FIRST NAME OR NAME YOU WANT TO USE
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-3 w-full border border-white/20 bg-black px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-[0.25em] text-white/50">
                PRIMARY RECOVERY FOCUS
              </label>
              <select
                value={substance}
                onChange={(e) => setSubstance(e.target.value)}
                className="mt-3 w-full border border-white/20 bg-black px-4 py-3 text-white"
              >
                <option value="">SELECT</option>
                {SUBSTANCES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm uppercase tracking-[0.25em] text-white/50">
                WHERE ARE YOU IN RECOVERY?
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="mt-3 w-full border border-white/20 bg-black px-4 py-3 text-white"
              >
                <option value="">SELECT</option>
                {STAGES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1"
              />
              <p className="text-sm text-white/70">
                I AM HAPPY FOR MY STORY TO BE USED BY LIVESOBERAF TO HELP OTHERS
                IN RECOVERY.
              </p>
            </div>

            <button
              disabled={!canStart}
              onClick={() => setStarted(true)}
              className="mt-6 border border-white/20 px-8 py-4 tracking-[0.3em] transition hover:bg-white hover:text-black disabled:opacity-30"
            >
              BEGIN RECORDING
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (showReview) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <section className="mx-auto max-w-5xl">
          <a
            href="/home"
            className="mb-10 inline-block text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white"
          >
            BACK
          </a>

          <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
            SHARE YOUR STORY
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-[0.2em] md:text-7xl">
            YOUR STORY SO FAR
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-8 text-white/75">
            {Object.keys(savedAnswers).length} / {TOTAL_QUESTIONS} ANSWERS SAVED
          </p>

          {isPublished && (
            <p className="mt-4 text-sm uppercase tracking-[0.25em] text-red-300/80">
              STORY PUBLISHED TO WATCH STORIES
            </p>
          )}

          <div className="mt-12 space-y-4">
            {QUESTIONS.map((question, index) => {
              const saved = !!savedAnswers[index];
              const isAppQuestion = index >= 17;

              return (
                <div
                  key={index}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
                >
                  <p className="text-sm uppercase tracking-[0.25em] text-white/40">
                    QUESTION {index + 1} {isAppQuestion ? "• APP RESOURCE" : "• STORY / PODCAST"}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight">
                    {question}
                  </h2>
                  <p className="mt-3 text-white/70">
                    {saved ? "SAVED ✓" : "NOT YET RECORDED"}
                  </p>

                  {saved && (
                    <video
                      src={savedAnswers[index]}
                      controls
                      playsInline
                      style={{ filter: selectedFilter }}
                      className="mt-4 aspect-video w-full rounded-[1.5rem] bg-black"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={restartEntireStory}
              className="border border-white/20 px-8 py-4 text-sm tracking-[0.3em] transition hover:bg-white hover:text-black"
            >
              RECORD AGAIN
            </button>

            <a
              href="/watch-stories"
              className="inline-block border border-white/20 px-8 py-4 text-sm tracking-[0.3em] transition hover:bg-white hover:text-black"
            >
              WATCH STORIES
            </a>

            <a
              href="/home"
              className="inline-block border border-white/20 px-8 py-4 text-sm tracking-[0.3em] transition hover:bg-white hover:text-black"
            >
              RETURN HOME
            </a>
          </div>
        </section>
      </main>
    );
  }

  const isAppQuestion = currentQuestion >= 17;

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-5xl">
        <a
          href="/home"
          className="mb-10 inline-block text-sm uppercase tracking-[0.3em] text-white/50 hover:text-white"
        >
          BACK
        </a>

        <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
          SHARE YOUR STORY
        </p>

        <p className="mt-6 text-sm uppercase tracking-[0.25em] text-white/40">
          QUESTION {currentQuestion + 1} OF {TOTAL_QUESTIONS}
        </p>

        <p className="mt-4 text-sm uppercase tracking-[0.25em] text-white/40">
          {isAppQuestion ? "APP RESOURCE QUESTION" : "STORY / PODCAST QUESTION"}
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
          {QUESTIONS[currentQuestion]}
        </h1>

        <div className="mt-8">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-white/40">
            CAMERA LOOK
          </p>

          <div className="flex flex-wrap gap-3">
            {FILTERS.map((filter) => (
              <button
                key={filter.label}
                onClick={() => setSelectedFilter(filter.value)}
                className={`border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                  selectedFilter === filter.value
                    ? "border-white bg-white text-black"
                    : "border-white/20 text-white hover:bg-white hover:text-black"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-white/40">
              LIVE CAMERA
            </p>

            <video
              ref={liveVideoRef}
              autoPlay
              muted
              playsInline
              style={{ filter: selectedFilter }}
              className="aspect-video w-full rounded-[1.5rem] bg-black object-cover"
            />

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={startCamera}
                className="border border-white/20 px-6 py-3 text-sm tracking-[0.25em] transition hover:bg-white hover:text-black"
              >
                START CAMERA
              </button>

              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="border border-white/20 px-6 py-3 text-sm tracking-[0.25em] transition hover:bg-white hover:text-black"
                >
                  RECORD
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="border border-red-400/40 px-6 py-3 text-sm tracking-[0.25em] text-red-200 transition hover:bg-red-400/10"
                >
                  STOP
                </button>
              )}
            </div>

            {cameraReady && (
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-white/40">
                CAMERA READY
              </p>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-white/40">
              THIS QUESTION
            </p>

            <p className="mt-4 text-lg leading-8 text-white/75">
              Take your time. Speak naturally. This should feel honest, not polished.
            </p>

            <div className="mt-6 space-y-2 text-sm uppercase tracking-[0.2em] text-white/40">
              <p>NAME: {name || "NOT SET"}</p>
              <p>FOCUS: {substance || "NOT SET"}</p>
              <p>STAGE: {stage || "NOT SET"}</p>
            </div>

            {savedAnswers[currentQuestion] && !recordedVideoUrl && (
              <div className="mt-6 border border-white/10 bg-black/30 px-4 py-3 text-sm uppercase tracking-[0.08em] text-white/70">
                THIS ANSWER HAS BEEN SAVED.
              </div>
            )}

            {error && (
              <div className="mt-6 border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm tracking-[0.08em] text-red-100">
                {error}
              </div>
            )}

            <div className="mt-8 space-y-4">
              <button
                onClick={goToPreviousQuestion}
                disabled={currentQuestion === 0 || isSavingAnswer}
                className="block w-full border border-white/20 px-6 py-3 text-sm tracking-[0.25em] transition hover:bg-white hover:text-black disabled:opacity-30"
              >
                PREVIOUS
              </button>

              <button
                onClick={goToNextQuestion}
                disabled={isSavingAnswer}
                className="block w-full border border-white/20 px-6 py-3 text-sm tracking-[0.25em] transition hover:bg-white hover:text-black disabled:opacity-30"
              >
                {isSavingAnswer ? "SAVING..." : "SAVE ANSWER & NEXT QUESTION"}
              </button>

              <button
                onClick={clearThisAnswer}
                disabled={isSavingAnswer}
                className="block w-full border border-white/20 px-6 py-3 text-sm tracking-[0.25em] transition hover:bg-white hover:text-black disabled:opacity-30"
              >
                CLEAR THIS ANSWER
              </button>
            </div>
          </div>
        </div>

        {recordedVideoUrl && (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-white/40">
              PREVIEW
            </p>

            <video
              src={recordedVideoUrl}
              controls
              playsInline
              style={{ filter: selectedFilter }}
              className="aspect-video w-full rounded-[1.5rem] bg-black"
            />
          </div>
        )}

        {!recordedVideoUrl && savedAnswers[currentQuestion] && (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-white/40">
              SAVED ANSWER
            </p>

            <video
              src={savedAnswers[currentQuestion]}
              controls
              playsInline
              style={{ filter: selectedFilter }}
              className="aspect-video w-full rounded-[1.5rem] bg-black"
            />
          </div>
        )}
      </section>
    </main>
  );
}