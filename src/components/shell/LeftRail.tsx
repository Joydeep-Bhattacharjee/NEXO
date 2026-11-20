import Link from "next/link";
import { Bell, Clapperboard, House, Plus, type LucideIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { RailServers } from "./RailServers";
import { CURRENT_USER, formatCount } from "@/lib/mock-data";

const MAIN_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/home", label: "Home", icon: House },
  { href: "/videos", label: "Videos", icon: Clapperboard },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/create", label: "Create", icon: Plus },
];

/** Desktop left rail (§3.4): profile, servers, about. */
export function LeftRail() {
  return (
    <aside className="rail-scroll sticky top-[6.5rem] hidden h-[calc(100vh-6.5rem)] w-60 shrink-0 flex-col overflow-y-auto py-6 lg:flex">
      <Link
        href={`/u/${CURRENT_USER.handle}`}
        className="flex items-center gap-3 rounded-btn p-2 transition-colors hover:bg-raised"
      >
        <Avatar name={CURRENT_USER.displayName} size={40} />
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-medium">{CURRENT_USER.displayName}</span>
          <span className="block truncate font-mono text-[12px] text-fg-muted">
            {formatCount(CURRENT_USER.followers)} followers
          </span>
        </span>
      </Link>

      <nav aria-label="Main" className="mt-4 flex flex-col gap-0.5">
        {MAIN_LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex h-10 items-center gap-3 rounded-btn px-2 text-[14px] transition-colors hover:bg-raised"
          >
            <Icon size={18} strokeWidth={1.5} aria-hidden className="text-fg-muted" />
            {label}
          </Link>
        ))}
      </nav>

      <nav aria-label="Your servers" className="mt-6">
        <div className="flex items-center justify-between px-2 pb-2">
          <span className="text-[12px] text-fg-muted">Servers</span>
          <Link href="/servers" className="text-[12px] text-fg-muted transition-colors hover:text-fg">
            See all
          </Link>
        </div>
        <RailServers />
      </nav>

      <div className="mt-auto flex flex-col gap-1 px-2 pt-6 text-[12px] leading-5 text-fg-muted">
        <Link href="/about" className="w-fit text-[13px] transition-colors hover:text-fg">
          About us
        </Link>
        <p>
          <Link href="/about#terms" className="hover:text-fg">Terms</Link> ·{" "}
          <Link href="/about#privacy" className="hover:text-fg">Privacy</Link> ·{" "}
          <Link href="/about#guidelines" className="hover:text-fg">Guidelines</Link> · © 2026 Nexo
        </p>
      </div>
    </aside>
  );
}
