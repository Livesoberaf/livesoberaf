"use client";

import { useEffect, useRef, useState } from "react";

type RecorderState = "camera-off" | "camera-on" | "recording" | "preview" | "uploading" | "done";

type Props = {
  slotId?: string;
  promptId?: string;
  onDone: () => void;
};

function formatTime(s: number) {
  const m   = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function getBestMimeType() {
  const types = ["video/webm;codecs=vp9", "video/webm", "video/mp4"];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}

export default function StudioRecorder({ slotId, promptId, onDone }: Props) {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<Blob[]>([]);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef   = useRef<MediaStream | null>(null);

  const [state, setState]           = useState<RecorderState>("camera-off");
  const [seconds, setSeconds]       = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [progress, setProgress]     = useState(0);
  const [cameraError, setCameraError] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  async function startCamera() {
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setState("camera-on");
    } catch {
      setCameraError(true);
    }
  }

  function startRecording() {
    const stream = streamRef.current;
    if (!stream) return;

    chunksRef.current = [];
    setPreviewUrl(null);
    setRecordedBlob(null);
    setSeconds(0);

    const mimeType = getBestMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType || "video/webm" });
      setRecordedBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      setState("preview");
      if (timerRef.current) clearInterval(timerRef.current);
    };

    recorderRef.current = recorder;
    recorder.start();
    setState("recording");
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function stopRecording() {
    recorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function retake() {
    setPreviewUrl(null);
    setRecordedBlob(null);
    setSeconds(0);
    setState("camera-on");
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }

  async function uploadClip() {
    if (!recordedBlob) return;
    setState("uploading");
    setProgress(0);
    setUploadError("");

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 80));
    }, 400);

    try {
      // Step 1: get a signed upload URL from our server (tiny request)
      const sigRes = await fetch("/api/sponsor/cloudinary-signature", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ promptId, slotId }),
      });
      if (!sigRes.ok) { const d = await sigRes.json(); throw new Error(d.error ?? "Could not prepare upload."); }
      const sig = await sigRes.json();

      setProgress(10);

      // Step 2: upload directly to Cloudinary — bypasses Vercel's 4.5 MB limit
      const key       = promptId ?? slotId ?? "clip";
      const file      = new File([recordedBlob], `${key}.webm`, { type: recordedBlob.type });
      const cloudForm = new FormData();
      cloudForm.append("file",       file);
      cloudForm.append("api_key",    sig.apiKey);
      cloudForm.append("timestamp",  String(sig.timestamp));
      cloudForm.append("signature",  sig.signature);
      cloudForm.append("folder",     sig.folder);
      cloudForm.append("public_id",  sig.publicId);
      cloudForm.append("overwrite",  "true");

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`,
        { method: "POST", body: cloudForm }
      );
      if (!cloudRes.ok) throw new Error("Video upload failed — please try again.");
      const cloudData = await cloudRes.json();

      clearInterval(progressInterval);
      setProgress(90);

      // Step 3: save the Cloudinary URL + metadata to Supabase (no file, tiny request)
      const saveRes = await fetch("/api/sponsor/save-clip", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ cloudinaryUrl: cloudData.secure_url, promptId, slotId }),
      });
      if (!saveRes.ok) { const d = await saveRes.json(); throw new Error(d.error ?? "Failed to save clip."); }

      setProgress(100);
      setState("done");
      onDone();
    } catch (err) {
      clearInterval(progressInterval);
      setState("preview");
      setProgress(0);
      setUploadError(err instanceof Error ? err.message : "Upload failed — please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-white/40 mb-2">Saved</p>
        <p className="text-white/70">Submitted for review. It'll go live once approved.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Viewfinder */}
      <div className="relative bg-black border border-white/10 aspect-video overflow-hidden rounded-[2rem]">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover ${state === "preview" ? "hidden" : "block"}`}
        />

        {state === "preview" && previewUrl && (
          <video
            src={previewUrl}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {state === "camera-off" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <p className="text-white/20 text-sm uppercase tracking-[0.3em]">Camera off</p>
          </div>
        )}

        {state === "recording" && (
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-300 animate-pulse" />
            <span className="text-white/70 text-xs font-mono tracking-widest">{formatTime(seconds)}</span>
          </div>
        )}
      </div>

      {cameraError && (
        <p className="text-red-300/70 text-sm">
          Camera access was denied or unavailable. Use the &quot;Upload a file&quot; option instead, or check your browser permissions.
        </p>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        {state === "camera-off" && (
          <button
            onClick={startCamera}
            className="flex-1 border border-white/20 px-8 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
          >
            Turn on camera
          </button>
        )}

        {state === "camera-on" && (
          <button
            onClick={startRecording}
            className="flex-1 border border-white/20 px-8 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
          >
            Start recording
          </button>
        )}

        {state === "recording" && (
          <button
            onClick={stopRecording}
            className="flex-1 border border-red-300/40 text-red-300/80 px-8 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-red-300/10 flex items-center justify-center gap-3"
          >
            <span className="w-2.5 h-2.5 bg-red-300/80 inline-block" />
            Stop recording
          </button>
        )}

        {state === "preview" && (
          <>
            <button
              onClick={retake}
              className="flex-1 border border-white/20 px-8 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
            >
              Retake
            </button>
            <button
              onClick={uploadClip}
              className="flex-1 border border-white/20 px-8 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
            >
              Save this clip
            </button>
          </>
        )}

        {state === "uploading" && (
          <div className="flex-1 flex flex-col gap-3">
            <div className="h-px bg-white/10 relative">
              <div
                className="absolute top-0 left-0 h-px bg-white transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-white/35 text-sm uppercase tracking-[0.2em]">Saving your clip…</p>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="rounded-lg border border-red-300/30 bg-red-300/10 px-5 py-4 mt-4">
          <p className="text-red-300 text-sm font-medium">Upload failed</p>
          <p className="text-red-300/70 text-sm mt-1">{uploadError}</p>
        </div>
      )}
    </div>
  );
}
