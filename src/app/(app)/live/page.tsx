import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { formatCount, STREAMS } from "@/lib/mock-data";
import { ClipThumb } from "@/components/media/ClipThumb";

/** §3.8 — Live directory. */
export default function LivePage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-[36px] font-bold leading-tight">Live</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {STREAMS.map((st) => (
          <li key={st.id}>
            <Link
              href={`/live/${st.streamerHandle}`}
              className="group block overflow-hidden rounded-card border border-line bg-raised transition-colors hover:border-line-hover"
            >
              <div className="p-2 pb-0">
                <ClipThumb game={st.game} isLive meta={`${formatCount(st.viewers)} watching`} />
              </div>
              <div className="flex gap-3 p-3">
                <Avatar size={36} isLive name={st.streamer} />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium">{st.title}</p>
                  <p className="truncate text-[12px] text-fg-muted">
                    {st.streamer} · {st.game}
                  </p>
                  <div className="mt-1 flex gap-1.5">
                    {st.tags.map((t) => (
                      <span key={t} className="rounded-[4px] border border-line px-1.5 text-[11px] leading-5 text-fg-muted">
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
