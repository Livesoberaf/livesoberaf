"use client";

import { useEffect, useRef, useState } from "react";

function ReflectionRecorderModal({
  isOpen,
  onClose,
  profile,
  setProfile,
  question,
}: any) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    async function startCamera() {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(cameraStream);

      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }
    }

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [isOpen]);

  function startRecording() {
    if (!stream) return;

    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    };

    recorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setIsRecording(false);
  }

  function saveReflection() {
    if (!videoUrl) return;

    setProfile((prev: any) => ({
      ...prev,
      dailyReflections: [
        ...(prev.dailyReflections || []),
        {
          id: crypto.randomUUID(),
          day: Number(prev.soberDays || 1),
          question,
          substance: prev.substances?.[0] || "",
          trigger: prev.triggers?.[0] || "",
          ageRange: prev.ageRange,
          sex: prev.sex,
          videoUrl,
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    stream?.getTracks().forEach((track) => track.stop());
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-black">
        <h3 className="text-lg font-semibold">Record today's reflection</h3>

        <p className="mt-2 text-sm text-black/60">{question}</p>

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="mt-4 aspect-video w-full rounded-xl bg-black"
        />

        {videoUrl && (
          <video
            src={videoUrl}
            controls
            className="mt-4 aspect-video w-full rounded-xl bg-black"
          />
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          {!isRecording ? (
            <button onClick={startRecording} className="rounded-lg bg-black px-4 py-2 text-white">
              Start recording
            </button>
          ) : (
            <button onClick={stopRecording} className="rounded-lg bg-red-600 px-4 py-2 text-white">
              Stop recording
            </button>
          )}

          <button onClick={onClose} className="rounded-lg bg-gray-200 px-4 py-2">
            Cancel
          </button>

          <button
            disabled={!videoUrl}
            onClick={saveReflection}
            className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-40"
          >
            Save reflection
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReflectionRecorderModal;