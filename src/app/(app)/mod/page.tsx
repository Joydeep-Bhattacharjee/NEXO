"use client";

import { useState } from "react";
import { VenetianMask } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toaster";

type Severity = "high" | "medium" | "low";
type Report = { id: string; severity: Severity; text: string; by: string };

const QUEUE: Report[] = [
  { id: "q1", severity: "high", text: "Reported: harassment in Free Fire BD #general", by: "3 reports" },
  { id: "q2", severity: "medium", text: "Flagged: possible slur (Banglish) in a CoC Strategy thread", by: "auto" },
  { id: "q3", severity: "low", text: "Appeal: mute in Valorant South Asia", by: "user appeal" },
];

const SEVERITY_STYLE: Record<Severity, string> = {
  high: "bg-danger/15 text-danger",
  medium: "bg-warning/15 text-warning",
  low: "bg-overlay text-fg-muted",
};

const ACTIONS = [
  { key: "dismiss", label: "Dismiss", done: "Report dismissed" },
  { key: "warn", label: "Warn", done: "Warning sent" },
  { key: "mute", label: "Mute 24h", done: "Muted for 24 hours" },
] as const;

type LogEntry = { id: string; text: string };

/** §3.14 — Mod queue. Every action resolves the report and lands in the audit log. */
export default function ModPage() {
  const [queue, setQueue] = useState<Report[]>(QUEUE);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [confirmBan, setConfirmBan] = useState<string | null>(null);
  const toast = useToast((s) => s.show);

  function resolve(report: Report, outcome: string) {
    setQueue((q) => q.filter((r) => r.id !== report.id));
    setLog((l) => [{ id: `${report.id}-${l.length}`, text: `${outcome} · ${report.text}` }, ...l]);
    setConfirmBan(null);
    toast(outcome);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <h1 className="font-display text-[36px] font-bold leading-tight">Moderation</h1>
      <p className="text-[13px] text-fg-muted">
        Reports from your servers and Realms. Banning a Mask never reveals the account behind it
      </p>

      {queue.length === 0 && (
        <p className="rounded-card border border-line bg-raised p-6 text-center text-[14px] text-fg-muted">Queue is clear</p>
      )}

      <ul className="flex flex-col gap-3">
        {queue.map((q) => (
          <li key={q.id} className="rounded-card border border-line bg-raised p-4">
            <div className="flex items-center gap-2">
              <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${SEVERITY_STYLE[q.severity]}`}>
                {q.severity[0].toUpperCase() + q.severity.slice(1)} priority
              </span>
              <span className="font-mono text-[11px] text-fg-muted">{q.by}</span>
            </div>
            <p className="mt-2 text-[14px]">{q.text}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ACTIONS.map((a) => (
                <Button key={a.key} variant="secondary" size="compact" onClick={() => resolve(q, a.done)}>
                  {a.label}
                </Button>
              ))}
              <Button variant="mask" size="compact" onClick={() => resolve(q, "Mask banned, account untouched")}>
                <VenetianMask size={16} strokeWidth={1.5} aria-hidden />
                Ban Mask
              </Button>
              {confirmBan === q.id ? (
                <Button variant="danger" size="compact" onClick={() => resolve(q, "Account banned")}>
                  Confirm account ban
                </Button>
              ) : (
                <Button variant="danger" size="compact" onClick={() => setConfirmBan(q.id)}>
                  Ban account
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {log.length > 0 && (
        <section aria-labelledby="audit-heading" className="rounded-card border border-line bg-raised p-4">
          <h2 id="audit-heading" className="text-[14px] font-medium">Audit log</h2>
          <ul className="mt-2 flex flex-col gap-1 font-mono text-[12px] text-fg-muted">
            {log.map((e) => (
              <li key={e.id}>{e.text}</li>
            ))}
          </ul>
        </section>
      )}
      <p className="text-[12px] text-fg-muted">Every action is logged for audit</p>
    </div>
  );
}
