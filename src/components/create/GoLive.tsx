"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Radio, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toaster";
import { useAppStore } from "@/lib/app-store";
import { CURRENT_USER, GAMES } from "@/lib/mock-data";
import { FIELD, FlowShell, formatDuration, GameSelect } from "./shared";

const TITLE_MAX = 80;

/**
 * Browser streaming: shows your camera (or screen) locally and announces the stream in the feed.
 * Sending video to viewers needs the streaming backend, which isn't built yet.
 */
export function GoLive({ onBack }: { onBack: () => void }) {
  const addPost = useAppStore((s) => s.addPost);
  const toast = useToast((s) => s.show);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [title, setTitle] = useState("");
  const [game, setGame] = useState(GAMES[0].name);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
    if (!stream) return;
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [stream]);

  useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream]);

  async function start(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("Give your stream a title");
    if (!navigator.mediaDevices) return setError("Streaming needs a secure page. Open Nexo on localhost or https");
    try {
      const media = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      setSeconds(0);
      setStream(media);
      setError(null);
      addPost({ authorId: CURRENT_USER.id, kind: "live", game, body: title });
      toast("You're live. Your followers can see it in their feed");
    } catch {
      setError("Screen sharing was blocked or cancelled");
    }
  }

  function stop() {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    toast(`Stream ended after ${formatDuration(seconds)}`);
  }

  if (stream) {
    return (
      <FlowShell title="You're live" onBack={stop}>
        <div className="relative overflow-hidden rounded-card bg-black">
          <video ref={videoRef} autoPlay muted playsInline className="aspect-video w-full" />
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-[4px] bg-live px-1.5 text-[11px] font-medium leading-5 text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
            Live · {formatDuration(seconds)}
          </span>
        </div>
        <p className="text-[14px]">{title}</p>
        <Button variant="danger" onClick={stop}>
          <Square size={16} strokeWidth={1.5} aria-hidden />
          End stream
        </Button>
      </FlowShell>
    );
  }

  return (
    <FlowShell title="Go live" onBack={onBack}>
      <form onSubmit={start} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-[13px] text-fg-muted">
          Stream title
          <input value={title} maxLength={TITLE_MAX} onChange={(e) => setTitle(e.target.value)} className={`h-11 ${FIELD}`} />
        </label>
        <GameSelect value={game} onChange={setGame} />
        <p className="text-[13px] text-fg-muted">Nexo streams your game window straight from the browser. You&apos;ll pick which window to share</p>
        {error && <p className="text-[13px] text-danger">{error}</p>}
        <Button type="submit">
          <Radio size={16} strokeWidth={1.5} aria-hidden />
          Start streaming
        </Button>
      </form>
    </FlowShell>
  );
}
