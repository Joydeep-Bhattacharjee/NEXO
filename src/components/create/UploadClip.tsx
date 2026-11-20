"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toaster";
import { TEXT_MAX, useAppStore } from "@/lib/app-store";
import { CURRENT_USER, GAMES } from "@/lib/mock-data";
import { FIELD, FlowShell, formatDuration, GameSelect } from "./shared";

const MAX_BYTES = 500 * 1024 * 1024;

/** Pick a video, add a caption, post it to your feed. The file stays on this device for now. */
export function UploadClip({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const addPost = useAppStore((s) => s.addPost);
  const toast = useToast((s) => s.show);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [game, setGame] = useState(GAMES[0].name);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    setError(null);
    setDuration(null);
    if (!picked) return;
    if (!picked.type.startsWith("video/")) {
      setError("That isn't a video file");
      return;
    }
    if (picked.size > MAX_BYTES) {
      setError("Keep clips under 500 MB");
      return;
    }
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return setError("Pick a clip first");
    if (!caption.trim()) return setError("Write a caption");
    const post = addPost({
      authorId: CURRENT_USER.id,
      kind: "clip",
      game,
      body: caption,
      mediaLabel: `clip · ${duration ?? "0:00"}`,
      views: 0,
    });
    if (!post) return setError("Couldn't post that. Check the caption length");
    toast("Clip posted");
    router.push("/home");
  }

  return (
    <FlowShell title="Upload clip" onBack={onBack}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-card border border-dashed border-line-hover bg-base text-[14px] text-fg-muted transition-colors hover:border-accent">
          {preview ? (
            <video
              src={preview}
              controls
              className="aspect-video w-full bg-black"
              onLoadedMetadata={(e) => setDuration(formatDuration(e.currentTarget.duration))}
            />
          ) : (
            <span className="flex aspect-video w-full flex-col items-center justify-center gap-2">
              <Film size={28} strokeWidth={1.5} aria-hidden />
              Choose a video
              <span className="text-[12px]">MP4, MOV or WebM, up to 500 MB</span>
            </span>
          )}
          <input type="file" accept="video/*" onChange={handleFile} className="sr-only" />
        </label>
        {file && (
          <p className="font-mono text-[12px] text-fg-muted">
            {file.name} {duration && `· ${duration}`}
          </p>
        )}
        <label className="flex flex-col gap-1.5 text-[13px] text-fg-muted">
          Caption
          <textarea value={caption} maxLength={TEXT_MAX} rows={3} onChange={(e) => setCaption(e.target.value)} className={`py-2.5 ${FIELD}`} />
        </label>
        <GameSelect value={game} onChange={setGame} />
        {error && <p className="text-[13px] text-danger">{error}</p>}
        <Button type="submit">Post clip</Button>
      </form>
    </FlowShell>
  );
}
