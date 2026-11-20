"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Clapperboard, House, LayoutGrid, Plus, type LucideIcon } from "lucide-react";

const TABS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/home", label: "Home", icon: House },
  { href: "/servers", label: "Servers", icon: LayoutGrid },
  { href: "/create", label: "Create", icon: Plus },
  { href: "/videos", label: "Videos", icon: Clapperboard },
  { href: "/notifications", label: "Alerts", icon: Bell },
];

/** Mobile bottom tab bar (§3.4). */
export function BottomTabs() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-raised pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="flex h-14 items-stretch">
        {TABS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-full items-center justify-center transition-colors ${
                  isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                }`}
              >
                <Icon size={22} strokeWidth={1.5} aria-hidden className={isActive ? "text-accent" : ""} />
                <span className="sr-only">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
