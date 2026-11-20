"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type Props = {
  seconds: number;
  url?: string;
};

/** Plays a voice note. Seeded notes have no audio file yet, so they play a silent timeline. */
export function VoiceNotePlayer({ seconds, url }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying || url) return;
    const started = Date.now() - progress * seconds * 1000;
    const timer = window.setInterval(() => {
      const p = Math.min(1, (Date.now() - started) / (seconds * 1000));
      setProgress(p);
      if (p >= 1) {
        setIsPlaying(false);
        setProgress(0);
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [isPlaying, url, seconds, progress]);

  function toggle() {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) audio.pause();
      else void audio.play();
    }
    setIsPlaying((p) => !p);
  }

  return (
    <div className="mt-1 flex h-10 w-60 items-center gap-2 rounded-full bg-overlay px-2 text-[13px] text-fg-muted">
      <button
        onClick={toggle}
        aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fg text-[color:var(--bg-base)] transition-transform active:scale-95 cursor-pointer"
      >
        {isPlaying ? <Pause size={12} fill="currentColor" aria-hidden /> : <Play size={12} fill="currentColor" aria-hidden />}
      </button>
      <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-line">
        <span className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-fg-muted" style={{ transform: `scaleX(${progress})` }} />
      </span>
      <span className="font-mono text-[12px]">0:{String(seconds).padStart(2, "0")}</span>
      {url && (
        <audio
          ref={audioRef}
          src={url}
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || seconds))}
          onEnded={() => {
            setIsPlaying(false);
            setProgress(0);
          }}
        />
      )}
    </div>
  );
}
