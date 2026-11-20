"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutGrid, Upload, VenetianMask } from "lucide-react";
import { useZoneNavigate } from "@/components/anon/ZoneTransition";
import { ClipThumb } from "@/components/media/ClipThumb";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toaster";
import { useAppStore } from "@/lib/app-store";
import { CURRENT_USER, GAMES } from "@/lib/mock-data";
import { FlowShell, GameSelect } from "./shared";

const STAGES = [
  "Uploading footage…",
  "Finding your best plays…",
  "Cutting highlights and captions…",
  "3 cuts ready to post",
] as const;
const STAGE_MS = 1200;
const CUTS = ["0:00–0:22", "1:14–1:39", "3:02–3:31"] as const;

/** Raw footage in, three highlight cuts out, then choose where they go. */
export function AutoCut({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const navigateZone = useZoneNavigate();
  const addPost = useAppStore((s) => s.addPost);
  const toast = useToast((s) => s.show);
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState(-1);
  const [picked, setPicked] = useState<string>(CUTS[0]);
  const [game, setGame] = useState(GAMES[0].name);

  useEffect(() => {
    if (stage < 0 || stage >= STAGES.length - 1) return;
    const timer = window.setTimeout(() => setStage((s) => s + 1), STAGE_MS);
    return () => window.clearTimeout(timer);
  }, [stage]);

  const isDone = stage === STAGES.length - 1;

  function postAsYou() {
    addPost({ authorId: CURRENT_USER.id, kind: "clip", game, body: `Highlight from my last ${game} session`, mediaLabel: `clip · ${picked.split("–")[0]}`, views: 0 });
    toast("Highlight posted");
    router.push("/home");
  }

  if (stage < 0) {
    return (
      <FlowShell title="Auto-cut highlights" onBack={onBack}>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed border-line-hover bg-base py-12 text-[14px] text-fg-muted transition-colors hover:border-accent">
          <Upload size={24} strokeWidth={1.5} aria-hidden />
          {file ? file.name : "Choose a full match recording"}
          <input type="file" accept="video/*" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <GameSelect value={game} onChange={setGame} />
        <Button disabled={!file} onClick={() => setStage(0)}>
          Find my highlights
        </Button>
      </FlowShell>
    );
  }

  return (
    <FlowShell title="Auto-cut highlights" onBack={onBack}>
      <div className="h-2 overflow-hidden rounded-full bg-overlay">
        <div
          className="h-full origin-left rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `scaleX(${(stage + 1) / STAGES.length})` }}
        />
      </div>
      <p className="text-[14px] text-fg-muted" role="status">
        {STAGES[stage]}
      </p>

      {isDone && (
        <>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Pick a cut">
            {CUTS.map((cut) => (
              <button
                key={cut}
                role="radio"
                aria-checked={picked === cut}
                onClick={() => setPicked(cut)}
                className={`group rounded-[12px] p-0.5 transition-colors cursor-pointer ${picked === cut ? "bg-accent" : "bg-transparent"}`}
              >
                <ClipThumb game={game} duration={cut} />
              </button>
            ))}
          </div>
          <p className="text-[13px] text-fg-muted">Post it as</p>
          <div className="flex flex-wrap gap-2">
            <Button size="compact" onClick={postAsYou}>
              Yourself
            </Button>
            <Button variant="mask" size="compact" onClick={(e) => navigateZone(e, "/anon", "anon")}>
              <VenetianMask size={16} strokeWidth={1.5} aria-hidden />
              Your Mask, in a Realm
            </Button>
            <Button variant="secondary" size="compact" onClick={() => { toast("Pick a server, then share it in a channel"); router.push("/servers"); }}>
              <LayoutGrid size={16} strokeWidth={1.5} aria-hidden />
              A server channel
            </Button>
          </div>
        </>
      )}
    </FlowShell>
  );
}
