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

export default function ShareYourStoryPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [started, setStarted] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recording, setRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [sessionId] = useState(() => crypto.randomUUID());

  const [name, setName] = useState("");
  const [substance, setSubstance] = useState("");
  const [stage, setStage] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [sex, setSex] = useState("");
  const [location, setLocation] = useState("");
  const [consent, setConsent] = useState(false);

  const canBegin =
    name.trim() !== "" &&
    substance !== "" &&
    stage !== "" &&
    ageRange !== "" &&
    sex !== "" &&
    location.trim() !== "" &&
    consent;

  useEffect(() => {
    if (!started) return;

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [started]);

  async function startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error(error);
      alert("Could not access camera or microphone.");
    }
  }

  function startRecording() {
    if (!stream) {
      alert("Camera is not ready yet.");
      return;
    }

    chunksRef.current = [];
    setRecordedBlob(null);
    setVideoUrl(null);

    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: "video/webm",
      });

      const url = URL.createObjectURL(blob);

      setRecordedBlob(blob);
      setVideoUrl(url);
      setRecording(false);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  async function publishStory() {
    if (!recordedBlob) {
      alert("Please record an answer first.");
      return;
    }

    try {
      setIsSaving(true);

      const formData = new FormData();

      formData.append(
        "file",
        recordedBlob,
        `${sessionId}-q${currentQuestion + 1}.webm`
      );

      formData.append("sessionId", sessionId);
      formData.append("questionIndex", String(currentQuestion));
      formData.append("name", name);
      formData.append("substance", substance);
      formData.append("stage", stage);
      formData.append("ageRange", ageRange);
      formData.append("sex", sex);
      formData.append("location", location);
      formData.append("consent", String(consent));

      const response = await fetch("/api/upload-story-answer", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.videoUrl) {
        throw new Error(data.error || "Upload failed");
      }

      alert(`Question ${currentQuestion + 1} saved.`);

      setRecordedBlob(null);
      setVideoUrl(null);
    } catch (error) {
      console.error(error);
      alert("Sorry, this answer could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  function nextQuestion() {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setRecordedBlob(null);
      setVideoUrl(null);
    }
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setRecordedBlob(null);
      setVideoUrl(null);
    }
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-black text-white">
        <section className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
          <div className="w-full">
            <p className="mb-6 text-sm uppercase tracking-[0.4em] text-[#d28b95]">
              Share Your Story
            </p>

            <h1 className="mb-14 text-6xl font-bold leading-[0.95] tracking-[0.18em] md:text-7xl">
              BEFORE WE
              <br />
              BEGIN
            </h1>

            <div className="space-y-8">
              <div>
                <label className="mb-3 block text-sm uppercase tracking-[0.28em] text-white/40">
                  First name or name you want to use
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-white/20 bg-transparent px-5 py-4 text-white outline-none focus:border-white/60"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm uppercase tracking-[0.28em] text-white/40">
                  Primary Recovery Focus
                </label>

                <select
                  value={substance}
                  onChange={(e) => setSubstance(e.target.value)}
                  className="w-full border border-white/20 bg-black px-5 py-4 text-white outline-none focus:border-white/60"
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
                <label className="mb-3 block text-sm uppercase tracking-[0.28em] text-white/40">
                  Where are you in recovery?
                </label>

                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full border border-white/20 bg-black px-5 py-4 text-white outline-none focus:border-white/60"
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

              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className="w-full border border-white/20 bg-black px-5 py-4 text-white outline-none focus:border-white/60"
                >
                  <option value="">Age Range</option>
                  <option>18-24</option>
                  <option>25-34</option>
                  <option>35-44</option>
                  <option>45-54</option>
                  <option>55+</option>
                </select>

                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-full border border-white/20 bg-black px-5 py-4 text-white outline-none focus:border-white/60"
                >
                  <option value="">Sex</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="mb-3 block text-sm uppercase tracking-[0.28em] text-white/40">
                  Location
                </label>

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City / Country"
                  className="w-full border border-white/20 bg-transparent px-5 py-4 text-white outline-none focus:border-white/60"
                />
              </div>

              <label className="flex items-start gap-4 text-sm uppercase tracking-[0.12em] text-white/60">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1"
                />
                I am happy for my story to be used by LiveSoberAF to help others
                in recovery.
              </label>

              <button
                disabled={!canBegin}
                onClick={() => setStarted(true)}
                className="w-full border border-white/20 py-5 text-sm uppercase tracking-[0.35em] transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
              >
                Begin Recording
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          {videoUrl && (
            <div className="mt-6">
              <p className="mb-3 text-xs uppercase tracking-[0.28em] text-white/40">
                Preview
              </p>

              <video
                src={videoUrl}
                controls
                playsInline
                className="w-full rounded-2xl border border-white/10 bg-black"
              />
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/40">
              Question {currentQuestion + 1} / {QUESTIONS.length}
            </p>

            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              {QUESTIONS[currentQuestion]}
            </h1>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
            <p>
              <span className="text-white/35">Name:</span> {name}
            </p>
            <p>
              <span className="text-white/35">Focus:</span> {substance}
            </p>
            <p>
              <span className="text-white/35">Stage:</span> {stage}
            </p>
            <p>
              <span className="text-white/35">Age:</span> {ageRange}
            </p>
            <p>
              <span className="text-white/35">Sex:</span> {sex}
            </p>
            <p>
              <span className="text-white/35">Location:</span> {location}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {!recording ? (
              <button
                onClick={startRecording}
                className="rounded-xl bg-white px-6 py-4 font-semibold text-black"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="rounded-xl bg-red-500 px-6 py-4 font-semibold text-white"
              >
                Stop Recording
              </button>
            )}

            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0 || isSaving}
              className="rounded-xl border border-white/20 px-6 py-4 disabled:opacity-30"
            >
              Previous
            </button>

            <button
              onClick={nextQuestion}
              disabled={currentQuestion === QUESTIONS.length - 1 || isSaving}
              className="rounded-xl border border-white/20 px-6 py-4 disabled:opacity-30"
            >
              Next
            </button>
          </div>

          <button
            onClick={publishStory}
            disabled={isSaving}
            className="w-full rounded-xl bg-white py-5 text-lg font-semibold text-black disabled:opacity-40"
          >
            {isSaving
              ? "Saving..."
              : `Save Question ${currentQuestion + 1}`}
          </button>

          <a
            href="/shares"
            className="block w-full rounded-xl border border-white/20 py-5 text-center text-sm uppercase tracking-[0.28em] text-white/70"
          >
            View Community Stories
          </a>
        </div>
      </section>
    </main>
  );
}