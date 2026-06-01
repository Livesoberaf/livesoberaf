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
    name && substance && stage && ageRange && sex && location && consent;

  useEffect(() => {
    if (!started) return;

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
      } catch {
        alert("Could not access camera or microphone.");
      }
    }

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [started]);

  function startRecording() {
    if (!stream) return alert("Camera is not ready yet.");

    chunksRef.current = [];
    setRecordedBlob(null);
    setVideoUrl(null);

    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedBlob(blob);
      setVideoUrl(URL.createObjectURL(blob));
      setRecording(false);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  async function saveAnswer() {
    if (!recordedBlob) return alert("Please record an answer first.");

    setIsSaving(true);

    const formData = new FormData();
    formData.append("file", recordedBlob, `${sessionId}-q${currentQuestion + 1}.webm`);
    formData.append("sessionId", sessionId);
    formData.append("questionIndex", String(currentQuestion));
    formData.append("name", name);
    formData.append("substance", substance);
    formData.append("stage", stage);
    formData.append("ageRange", ageRange);
    formData.append("sex", sex);
    formData.append("location", location);
    formData.append("consent", String(consent));

    try {
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
    } catch {
      alert("Sorry, this answer could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-black px-6 py-12 text-white">
        <section className="mx-auto max-w-3xl">
          <p className="mb-6 text-sm uppercase tracking-[0.4em] text-[#d28b95]">
            Share Your Story
          </p>

          <h1 className="mb-10 text-5xl font-bold">Before We Begin</h1>

          <div className="space-y-5">
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-white/20 bg-black p-4" />

            <select value={substance} onChange={(e) => setSubstance(e.target.value)} className="w-full border border-white/20 bg-black p-4">
              <option value="">Recovery focus</option>
              <option>Alcohol</option>
              <option>Cocaine</option>
              <option>Codeine</option>
              <option>Heroin</option>
              <option>Gambling</option>
              <option>Cannabis</option>
              <option>Other</option>
            </select>

            <select value={stage} onChange={(e) => setStage(e.target.value)} className="w-full border border-white/20 bg-black p-4">
              <option value="">Recovery stage</option>
              <option>Day 1</option>
              <option>1 Week</option>
              <option>1 Month</option>
              <option>6 Months</option>
              <option>1 Year</option>
              <option>Multiple Years</option>
            </select>

            <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className="w-full border border-white/20 bg-black p-4">
              <option value="">Age range</option>
              <option>18-24</option>
              <option>25-34</option>
              <option>35-44</option>
              <option>45-54</option>
              <option>55+</option>
            </select>

            <select value={sex} onChange={(e) => setSex(e.target.value)} className="w-full border border-white/20 bg-black p-4">
              <option value="">Sex</option>
              <option>Male</option>
              <option>Female</option>
              <option>Non-binary</option>
              <option>Prefer not to say</option>
            </select>

            <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border border-white/20 bg-black p-4" />

            <label className="flex gap-3 text-sm text-white/70">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              I am happy for my story to be used by LiveSoberAF.
            </label>

            <button disabled={!canBegin} onClick={() => setStarted(true)} className="w-full border border-white/20 py-5 disabled:opacity-30">
              Begin Recording
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <div>
          <video ref={videoRef} autoPlay muted playsInline className="aspect-[4/5] w-full rounded-3xl bg-black object-cover" />

          {videoUrl && (
            <video src={videoUrl} controls playsInline className="mt-6 w-full rounded-3xl bg-black" />
          )}
        </div>

        <div className="space-y-8">
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">
            Question {currentQuestion + 1} / {QUESTIONS.length}
          </p>

          <h1 className="text-4xl font-bold">{QUESTIONS[currentQuestion]}</h1>

          <div className="flex flex-wrap gap-4">
            {!recording ? (
              <button onClick={startRecording} className="rounded-xl bg-white px-6 py-4 text-black">
                Start Recording
              </button>
            ) : (
              <button onClick={stopRecording} className="rounded-xl bg-red-500 px-6 py-4 text-white">
                Stop Recording
              </button>
            )}

            <button onClick={() => setCurrentQuestion((q) => Math.max(0, q - 1))} className="rounded-xl border border-white/20 px-6 py-4">
              Previous
            </button>

            <button onClick={() => setCurrentQuestion((q) => Math.min(QUESTIONS.length - 1, q + 1))} className="rounded-xl border border-white/20 px-6 py-4">
              Next
            </button>
          </div>

          <button onClick={saveAnswer} disabled={isSaving} className="w-full rounded-xl bg-white py-5 text-black">
            {isSaving ? "Saving..." : `Save Question ${currentQuestion + 1}`}
          </button>

          <a href="/shares" className="block text-center underline">
            View Community Stories
          </a>
        </div>
      </section>
    </main>
  );
}