"use client";

import { useState, useRef } from "react";
import StudioRecorder from "./StudioRecorder";

type Props = {
  slotId?: string;
  promptId?: string;
  alreadyUploaded: boolean;
};

type Tab = "record" | "upload";

export default function UploadForm({ slotId, promptId, alreadyUploaded }: Props) {
  const [tab, setTab] = useState<Tab>("record");
  const [uploaded, setUploaded] = useState(alreadyUploaded);

  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  }

  async function handleFileUpload() {
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    setUploadStatus("uploading");
    setErrorMsg("");
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 4, 90));
    }, 400);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (slotId)   formData.append("slotId",   slotId);
      if (promptId) formData.append("promptId", promptId);

      const res = await fetch("/api/sponsor/upload", { method: "POST", body: formData });
      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Upload failed.");
      }

      setUploadStatus("done");
      setUploaded(true);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      setUploadStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload failed. Please try again.");
    }
  }

  // Success state
  if (uploaded && (uploadStatus === "done" || (alreadyUploaded && uploadStatus === "idle" && !fileName))) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-white/40 mb-2">Saved</p>
        <p className="text-white/70 mb-6">Submitted for review. It'll go live once approved.</p>
        <button
          onClick={() => { setUploaded(false); setUploadStatus("idle"); setFileName(null); if (inputRef.current) inputRef.current.value = ""; }}
          className="border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
        >
          Replace clip
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Tab switcher */}
      <div className="flex gap-8 border-b border-white/10 pb-4">
        <button
          onClick={() => setTab("record")}
          className={`text-sm uppercase tracking-[0.3em] transition ${
            tab === "record" ? "text-white" : "text-white/30 hover:text-white/60"
          }`}
        >
          Record now
        </button>
        <button
          onClick={() => setTab("upload")}
          className={`text-sm uppercase tracking-[0.3em] transition ${
            tab === "upload" ? "text-white" : "text-white/30 hover:text-white/60"
          }`}
        >
          Upload a file
        </button>
      </div>

      {/* Record tab */}
      {tab === "record" && (
        <StudioRecorder slotId={slotId} promptId={promptId} onDone={() => setUploaded(true)} />
      )}

      {/* Upload tab */}
      {tab === "upload" && (
        <div className="flex flex-col gap-6">
          <div
            className="rounded-[2rem] border border-white/10 bg-white/5 p-10 flex flex-col items-center gap-4 cursor-pointer hover:bg-white/8 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <p className="text-white/60 text-sm">
              {fileName ? fileName : "Choose a video file"}
            </p>
            <p className="text-white/25 text-xs uppercase tracking-[0.2em]">
              MP4 · MOV · WebM · up to 500 MB
            </p>
          </div>

          <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />

          {uploadStatus === "uploading" && (
            <div className="flex flex-col gap-2">
              <div className="h-px bg-white/10 relative">
                <div className="absolute top-0 left-0 h-px bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-white/35 text-sm uppercase tracking-[0.2em]">Uploading…</p>
            </div>
          )}

          {errorMsg && <p className="text-red-300/70 text-sm">{errorMsg}</p>}

          <button
            onClick={handleFileUpload}
            disabled={!fileName || uploadStatus === "uploading"}
            className="border border-white/20 px-8 py-5 text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black disabled:opacity-30"
          >
            {uploadStatus === "uploading" ? "Uploading…" : "Upload video"}
          </button>
        </div>
      )}
    </div>
  );
}
