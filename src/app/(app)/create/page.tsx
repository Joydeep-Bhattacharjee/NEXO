"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const OPTIONS = [
  { key: "upload", icon: "📤", title: "Upload clip", desc: "Post a ready clip to your feed" },
  { key: "ai", icon: "✨", title: "AI Edit gameplay", desc: "Raw footage in, highlights out" },
  { key: "live", icon: "🔴", title: "Go Live", desc: "Stream from your browser — no OBS" },
  { key: "post", icon: "✍️", title: "Post", desc: "Text, image or poll" },
] as const;

const AI_STAGES = [
  "Uploading footage…",
  "Finding your best plays…",
  "Cutting highlights + captions…",
  "Done! 3 suggested cuts ready.",
];

/** §3.9 — Create hub + user-visible AI edit pipeline (mocked async states). */
export default function CreatePage() {
  const [mode, setMode] = useState<string | null>(null);
  const [stage, setStage] = useState(0);

  function startAI() {
    setMode("ai");
    setStage(0);
    AI_STAGES.forEach((_, i) => setTimeout(() => setStage(i), (i + 1) * 1200));
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <h1 className="font-display text-2xl font-bold">Create</h1>

      {!mode && (
        <div className="grid gap-3 sm:grid-cols-2">
          {OPTIONS.map((o) => (
            <button
              key={o.key}
              onClick={() => (o.key === "ai" ? startAI() : setMode(o.key))}
              className="flex flex-col items-start gap-1 rounded-card border border-line bg-raised p-5 text-left transition-colors hover:border-accent cursor-pointer"
            >
              <span className="text-2xl" aria-hidden>{o.icon}</span>
              <span className="font-semibold">{o.title}</span>
              <span className="text-[13px] text-fg-muted">{o.desc}</span>
            </button>
          ))}
        </div>
      )}

      {mode === "ai" && (
        <section className="rounded-card border border-line bg-raised p-6">
          <h2 className="font-semibold">✨ AI Edit gameplay</h2>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-overlay">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${((stage + 1) / AI_STAGES.length) * 100}%` }}
            />
          </div>
          <p className="mt-3 text-[14px] text-fg-muted" role="status">
            {AI_STAGES[stage]}
          </p>
          {stage === AI_STAGES.length - 1 && (
            <div className="mt-5 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2">
                {["0:00–0:22", "1:14–1:39", "3:02–3:31"].map((cut) => (
                  <div key={cut} className="flex aspect-video items-center justify-center rounded-[10px] border border-line bg-base font-mono text-[12px] text-fg-muted">
                    ▶ {cut}
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-fg-muted">Post as:</p>
              <div className="flex flex-wrap gap-2">
                <Button size="compact">As yourself</Button>
                <Button variant="mask" size="compact">🎭 As Mask to a Realm</Button>
                <Button variant="secondary" size="compact">To a server channel</Button>
              </div>
            </div>
          )}
          <Button variant="ghost" size="compact" className="mt-4" onClick={() => setMode(null)}>
            ← Back
          </Button>
        </section>
      )}

      {mode && mode !== "ai" && (
        <section className="rounded-card border border-line bg-raised p-6">
          <p className="text-fg-muted">
            {OPTIONS.find((o) => o.key === mode)?.title} flow — mock MVP. Processing is async; you get
            a notification when it&apos;s ready.
          </p>
          <Button variant="ghost" size="compact" className="mt-4" onClick={() => setMode(null)}>
            ← Back
          </Button>
        </section>
      )}
    </div>
  );
}
