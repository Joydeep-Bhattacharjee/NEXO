import { Button } from "@/components/ui/Button";

const QUEUE = [
  { id: "q1", severity: "high", text: "Reported: harassment in Free Fire BD #general", by: "3 reports" },
  { id: "q2", severity: "medium", text: "AI-flagged: possible slur (Banglish) in r/FreeFire-BD thread", by: "auto" },
  { id: "q3", severity: "low", text: "Appeal: mute in Valorant South Asia", by: "user appeal" },
];

const SEVERITY_STYLE: Record<string, string> = {
  high: "bg-danger/15 text-danger",
  medium: "bg-warning/15 text-warning",
  low: "bg-overlay text-fg-muted",
};

/** §3.14 — Mod dashboard: queues + actions incl. Mask-ban without unmasking. */
export default function ModPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <h1 className="font-display text-2xl font-bold">🛡️ Mod dashboard</h1>
      <p className="text-[13px] text-fg-muted">
        Scope: your servers & realms. Mask bans never reveal the account behind a Mask.
      </p>
      <ul className="flex flex-col gap-3">
        {QUEUE.map((q) => (
          <li key={q.id} className="rounded-card border border-line bg-raised p-4">
            <div className="flex items-center gap-2">
              <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold uppercase ${SEVERITY_STYLE[q.severity]}`}>
                {q.severity}
              </span>
              <span className="font-mono text-[11px] text-fg-muted">{q.by}</span>
            </div>
            <p className="mt-2 text-[14px]">{q.text}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" size="compact">Dismiss</Button>
              <Button variant="secondary" size="compact">Warn</Button>
              <Button variant="secondary" size="compact">Mute 24h</Button>
              <Button variant="mask" size="compact">🎭 Ban Mask</Button>
              <Button variant="danger" size="compact">Ban account</Button>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-[12px] text-fg-muted">All actions are audit-logged.</p>
    </div>
  );
}
