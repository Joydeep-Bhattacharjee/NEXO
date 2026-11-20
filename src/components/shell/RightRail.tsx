import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { formatCount, STREAMS } from "@/lib/mock-data";

/** Desktop right rail (§3.4): who is live right now. */
export function RightRail() {
  return (
    <aside className="rail-scroll sticky top-[6.5rem] hidden h-[calc(100vh-6.5rem)] w-[300px] shrink-0 flex-col gap-6 overflow-y-auto py-6 xl:flex">
      <section className="rounded-card border border-line bg-raised p-4">
        <div className="flex items-baseline justify-between">
          <h2 className="flex items-center gap-2 text-[14px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-live" aria-hidden />
            Live now
          </h2>
          <Link href="/live" className="text-[12px] text-fg-muted transition-colors hover:text-fg">
            See all
          </Link>
        </div>
        <ul className="mt-4 flex flex-col gap-3">
          {STREAMS.map((st) => (
            <li key={st.id}>
              <Link href={`/live/${st.streamerHandle}`} className="group flex items-center gap-3">
                <Avatar name={st.streamer} size={32} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium transition-colors group-hover:text-accent">
                    {st.streamer}
                  </span>
                  <span className="block truncate text-[12px] text-fg-muted">{st.game}</span>
                </span>
                <span className="font-mono text-[12px] text-fg-muted">{formatCount(st.viewers)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
