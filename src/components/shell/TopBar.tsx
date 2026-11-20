import Link from "next/link";
import { Suspense } from "react";
import { Mail } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { CURRENT_USER, DMS } from "@/lib/mock-data";
import { MenuDrawer } from "./MenuDrawer";
import { SearchBox } from "./SearchBox";

/**
 * Two-row header. Top: the name and the menu. Below: you, search, messages.
 * Total height is 6.5rem; the sticky rails and the server view offset by the same amount.
 */
export function TopBar() {
  const unread = DMS.reduce((sum, d) => sum + d.unread, 0);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base">
      <div className="mx-auto flex h-12 max-w-[1280px] items-center justify-between px-4 lg:px-6">
        <Link href="/home" className="font-display text-[26px] font-bold leading-none text-fg">
          nexo<span className="text-accent">.</span>
        </Link>
        <MenuDrawer />
      </div>

      <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-3 px-4 pb-2 lg:px-6">
        <Link
          href={`/u/${CURRENT_USER.handle}`}
          aria-label="Your profile"
          className="shrink-0 rounded-full transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Avatar name={CURRENT_USER.displayName} size={40} />
        </Link>
        <Suspense fallback={<div className="h-10 min-w-0 flex-1 rounded-btn border border-line bg-raised" />}>
          <SearchBox />
        </Suspense>
        <Link
          href="/inbox"
          aria-label={`Messages, ${unread} unread`}
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-btn border border-line text-fg-muted transition-colors hover:border-line-hover hover:text-fg"
        >
          <Mail size={18} strokeWidth={1.5} aria-hidden />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-live px-1 font-mono text-[10px] leading-none text-white">
              {unread}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
