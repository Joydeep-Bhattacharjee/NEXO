import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { formatCount, REALM_THREADS, STREAMS } from "@/lib/mock-data";

/** Desktop right rail (§3.4): Top 5 Gaming Inbox digest + live-now module. */
export function RightRail() {
  const digest = REALM_THREADS.slice(0, 5);
  return (
    <aside className="rail-scroll sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[300px] shrink-0 flex-col gap-4 overflow-y-auto py-5 pl-2 xl:flex">
      {/* top 5 gaming inbox */}
      <section className="rounded-card border border-line bg-raised p-4">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-fg-muted">
          Top 5 Gaming Inbox
        </h2>
        <ol className="mt-3 flex flex-col gap-3">
          {digest.map((t, i) => (
            <li key={t.id}>
              <Link
                href={`/r/${t.realmSlug}/${t.id}`}
                className="group flex gap-3"
              >
                <span className="font-mono text-[13px] font-bold text-accent">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium group-hover:text-accent">
                    {t.title}
                  </span>
                  <span className="block font-mono text-[11px] text-fg-muted">
                    r/{t.realmSlug} · {formatCount(t.comments)} comments
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* live now */}
      <section className="rounded-card border border-line bg-raised p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-fg-muted">
            Live now
          </h2>
          <Link href="/live" className="text-[12px] text-accent hover:underline">
            All
          </Link>
        </div>
        <ul className="mt-3 flex flex-col gap-3">
          {STREAMS.map((st) => (
            <li key={st.id}>
              <Link href={`/live/${st.streamerHandle}`} className="group flex items-center gap-3">
                <Avatar emoji={st.avatar} size={36} isLive label={st.streamer} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium group-hover:text-accent">
                    {st.streamer}
                  </span>
                  <span className="block truncate text-[11px] text-fg-muted">{st.game}</span>
                </span>
                <span className="font-mono text-[11px] text-live">
                  {formatCount(st.viewers)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
