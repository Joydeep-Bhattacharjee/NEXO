import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { formatCount, STREAMS } from "@/lib/mock-data";

/** §3.8 — Live directory. */
export default function LivePage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold">Live</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {STREAMS.map((st) => (
          <li key={st.id}>
            <Link
              href={`/live/${st.streamerHandle}`}
              className="block overflow-hidden rounded-card border border-line bg-raised transition-colors hover:border-line-hover"
            >
              <div className="relative flex aspect-video items-center justify-center bg-base text-5xl">
                {st.avatar}
                <span className="absolute left-2 top-2 rounded bg-live px-1.5 py-0.5 text-[11px] font-bold uppercase text-white">
                  ● Live
                </span>
                <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[11px] text-white">
                  {formatCount(st.viewers)} watching
                </span>
              </div>
              <div className="flex gap-3 p-3">
                <Avatar emoji={st.avatar} size={36} isLive label={st.streamer} />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold">{st.title}</p>
                  <p className="truncate text-[12px] text-fg-muted">
                    {st.streamer} · {st.game}
                  </p>
                  <div className="mt-1 flex gap-1.5">
                    {st.tags.map((t) => (
                      <span key={t} className="rounded bg-overlay px-1.5 py-0.5 text-[11px] text-fg-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
