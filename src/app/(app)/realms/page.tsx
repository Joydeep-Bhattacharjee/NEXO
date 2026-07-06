import Link from "next/link";
import { formatCount, REALMS } from "@/lib/mock-data";

/** §3.7 — Realm directory, grouped by game. */
export default function RealmsPage() {
  return (
    <div className="flex flex-col gap-5">
      <header className="rounded-card border border-mask/40 bg-mask/10 p-5">
        <h1 className="font-display text-2xl font-bold text-mask">🎭 Realms</h1>
        <p className="mt-1 max-w-lg text-[14px] text-fg-muted">
          The anonymous zone. One persistent Mask per Realm — build reputation
          without revealing who you are. Nothing here links back to your profile.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {REALMS.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/r/${r.slug}`}
              className="flex h-full flex-col rounded-card border border-line bg-raised p-4 transition-colors hover:border-mask"
            >
              <span className="font-semibold text-mask">r/{r.name}</span>
              <span className="mt-1 flex-1 text-[13px] text-fg-muted">{r.description}</span>
              <span className="mt-3 flex gap-3 font-mono text-[11px] text-fg-muted">
                <span>🎭 {formatCount(r.maskCount)} masks</span>
                <span>{r.threadsPerDay} threads/day</span>
                <span className="rounded bg-overlay px-1.5">{r.game}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
