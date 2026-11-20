"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { useToast } from "@/components/ui/Toaster";

export type VoiceNote = { url: string; seconds: number };

const MAX_SECONDS = 60;

/** Tap to record, tap again to send. Uses the browser microphone; needs localhost or https. */
export function VoiceRecorder({ onDone }: { onDone: (note: VoiceNote) => void }) {
  const toast = useToast((s) => s.show);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const startedRef = useRef(0);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isRecording) return;
    const timer = window.setInterval(() => {
      const secs = Math.floor((Date.now() - startedRef.current) / 1000);
      setElapsed(secs);
      if (secs >= MAX_SECONDS) recorderRef.current?.stop();
    }, 250);
    return () => window.clearInterval(timer);
  }, [isRecording]);

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast("Voice notes need a secure page. Open Nexo on localhost or https");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        const seconds = Math.max(1, Math.round((Date.now() - startedRef.current) / 1000));
        onDone({ url: URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType })), seconds });
      };
      recorderRef.current = recorder;
      startedRef.current = Date.now();
      setElapsed(0);
      recorder.start();
      setIsRecording(true);
    } catch {
      toast("Microphone access was blocked");
    }
  }

  return (
    <button
      type="button"
      onClick={() => (isRecording ? recorderRef.current?.stop() : start())}
      aria-label={isRecording ? "Stop and send voice note" : "Record voice note"}
      className={`flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-btn px-2 transition-colors cursor-pointer ${
        isRecording ? "bg-live/15 text-live" : "w-9 text-fg-muted hover:bg-overlay hover:text-fg"
      }`}
    >
      {isRecording ? <Square size={14} strokeWidth={1.5} fill="currentColor" aria-hidden /> : <Mic size={18} strokeWidth={1.5} aria-hidden />}
      {isRecording && <span className="font-mono text-[12px]">0:{String(elapsed).padStart(2, "0")}</span>}
    </button>
  );
}
