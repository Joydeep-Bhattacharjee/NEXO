import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { CURRENT_USER, formatCount, SERVERS } from "@/lib/mock-data";

/** Desktop left rail (§3.4): profile card, servers stack, Realms shortcut, about. */
export function LeftRail() {
  const joined = SERVERS.filter((s) => s.joined && !s.parentSlug);
  return (
    <aside className="rail-scroll sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 flex-col gap-4 overflow-y-auto py-5 pr-2 lg:flex">
      {/* profile card */}
      <Link
        href={`/u/${CURRENT_USER.handle}`}
        className="rounded-card border border-line bg-raised p-4 transition-colors hover:border-line-hover"
      >
        <div className="flex items-center gap-3">
          <Avatar emoji={CURRENT_USER.avatar} size={44} label={CURRENT_USER.displayName} />
          <div className="min-w-0">
            <p className="truncate font-semibold">{CURRENT_USER.displayName}</p>
            <p className="truncate text-[12px] text-fg-muted">@{CURRENT_USER.handle}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-4 font-mono text-[12px] text-fg-muted">
          <span>
            <span className="text-fg">{formatCount(CURRENT_USER.followers)}</span> followers
          </span>
          <span>
            <span className="text-fg">{CURRENT_USER.following}</span> following
          </span>
        </div>
      </Link>

      {/* servers */}
      <nav aria-label="Your servers" className="rounded-card border border-line bg-raised p-3">
        <div className="flex items-center justify-between px-1 pb-2">
          <span className="text-[12px] font-semibold uppercase tracking-wide text-fg-muted">
            Servers
          </span>
          <Link href="/servers" className="text-[12px] text-accent hover:underline">
            All
          </Link>
        </div>
        <ul className="flex flex-col gap-0.5">
          {joined.map((s) => (
            <li key={s.id}>
              <Link
                href={`/s/${s.slug}`}
                className="flex items-center gap-2.5 rounded-[10px] px-2 py-1.5 text-[14px] transition-colors hover:bg-overlay"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-overlay text-base">
                  {s.icon}
                </span>
                <span className="min-w-0 flex-1 truncate">{s.name}</span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-fg-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  {formatCount(s.online)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* realms shortcut */}
      <Link
        href="/realms"
        className="flex items-center gap-3 rounded-card border border-mask/40 bg-mask/10 p-4 transition-colors hover:border-mask"
      >
        <span className="text-xl" aria-hidden>
          🎭
        </span>
        <span>
          <span className="block font-semibold text-mask">Realms</span>
          <span className="block text-[12px] text-fg-muted">The anonymous zone</span>
        </span>
      </Link>

      <p className="px-2 text-[11px] leading-4 text-fg-muted">
        About · Terms · Privacy · Guidelines
        <br />© 2026 Nexo
      </p>
    </aside>
  );
}
