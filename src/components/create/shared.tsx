"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GAMES } from "@/lib/mock-data";

export const FIELD =
  "rounded-btn border border-transparent bg-overlay px-3 text-[15px] text-fg outline-none transition-colors focus:border-accent";

export function GameSelect({ value, onChange }: { value: string; onChange: (game: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] text-fg-muted">
      Game
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`h-11 ${FIELD}`}>
        {GAMES.map((g) => (
          <option key={g.id} value={g.name}>
            {g.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FlowShell({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <section className="card-rise flex flex-col gap-4 rounded-card border border-line bg-raised p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="compact" onClick={onBack} aria-label="Back" className="-ml-2 px-2">
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
        </Button>
        <h2 className="text-[16px] font-medium">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
