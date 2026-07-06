"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/home", label: "Home", icon: "🏠" },
  { href: "/servers", label: "Servers", icon: "🗂️" },
  { href: "/create", label: "Create", icon: "➕" },
  { href: "/realms", label: "Realms", icon: "🎭" },
  { href: "/inbox", label: "Inbox", icon: "✉️" },
];

/** Mobile bottom tab bar (§3.4). */
export function BottomTabs() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-raised lg:hidden"
    >
      <ul className="flex h-14 items-stretch">
        {TABS.map((t) => {
          const isActive = pathname.startsWith(t.href);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                  isActive ? "text-accent" : "text-fg-muted hover:text-fg"
                }`}
              >
                <span className="text-[18px]" aria-hidden>
                  {t.icon}
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
