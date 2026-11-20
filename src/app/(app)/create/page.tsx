"use client";

import { useState } from "react";
import { PenLine, Radio, Scissors, Upload, type LucideIcon } from "lucide-react";
import { AutoCut } from "@/components/create/AutoCut";
import { GoLive } from "@/components/create/GoLive";
import { TextPost } from "@/components/create/TextPost";
import { UploadClip } from "@/components/create/UploadClip";

type Mode = "upload" | "ai" | "live" | "post";

const OPTIONS: { key: Mode; icon: LucideIcon; title: string; desc: string }[] = [
  { key: "upload", icon: Upload, title: "Upload clip", desc: "Post a finished clip to your feed" },
  { key: "ai", icon: Scissors, title: "Auto-cut highlights", desc: "Raw footage in, your best plays out" },
  { key: "live", icon: Radio, title: "Go live", desc: "Stream from your browser, no OBS needed" },
  { key: "post", icon: PenLine, title: "Post", desc: "Text for your feed" },
];

/** §3.9 — Create hub. Each option opens its own flow. */
export default function CreatePage() {
  const [mode, setMode] = useState<Mode | null>(null);
  const back = () => setMode(null);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <h1 className="font-display text-[36px] font-bold leading-tight">Create</h1>

      {!mode && (
        <div className="grid gap-3 sm:grid-cols-2">
          {OPTIONS.map(({ key, icon: Icon, title, desc }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className="flex flex-col items-start gap-1 rounded-card border border-line bg-raised p-5 text-left transition-colors hover:border-line-hover cursor-pointer"
            >
              <Icon size={20} strokeWidth={1.5} aria-hidden className="mb-3 text-fg-muted" />
              <span className="font-medium">{title}</span>
              <span className="text-[13px] text-fg-muted">{desc}</span>
            </button>
          ))}
        </div>
      )}

      {mode === "upload" && <UploadClip onBack={back} />}
      {mode === "ai" && <AutoCut onBack={back} />}
      {mode === "live" && <GoLive onBack={back} />}
      {mode === "post" && <TextPost onBack={back} />}
    </div>
  );
}
