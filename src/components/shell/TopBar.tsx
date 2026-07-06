import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { AnonToggle } from "./AnonToggle";
import { CURRENT_USER, NOTIFICATIONS } from "@/lib/mock-data";

export function TopBar() {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-3 px-4">
        <Link
          href="/home"
          className="font-display text-lg font-bold tracking-tight text-fg"
        >
          nexo<span className="text-accent">.</span>
        </Link>
        <Link
          href="/search"
          className="ml-2 hidden h-9 flex-1 max-w-sm items-center gap-2 rounded-btn border border-line bg-overlay px-3 text-[13px] text-fg-muted transition-colors hover:border-line-hover md:flex"
        >
          🔍 Search games, servers, realms…
        </Link>
        <span className="flex-1" />
        <AnonToggle />
        <Link
          href="/inbox"
          aria-label={`Inbox, ${unread} unread`}
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-[17px] transition-colors hover:bg-overlay"
        >
          ✉️
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-live px-1 font-mono text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </Link>
        <Link href={`/u/${CURRENT_USER.handle}`} aria-label="Your profile">
          <Avatar emoji={CURRENT_USER.avatar} size={32} label="Your avatar" />
        </Link>
      </div>
    </header>
  );
}
