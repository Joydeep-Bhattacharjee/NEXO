"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, VenetianMask } from "lucide-react";
import { useActiveIdentity } from "@/lib/anon-store";
import { realmLabel } from "@/lib/anon-threads";
import { REALMS } from "@/lib/mock-data";
import { avatarTint, initials } from "@/lib/tones";
import { IdentityAvatar } from "./IdentityAvatar";
import { useZoneNavigate } from "./ZoneTransition";

const CIRCLE =
  "group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-[box-shadow,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95";

function Tip({ text }: { text: string }) {
  return (
    <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-[6px] border border-line bg-overlay px-2 py-1 text-[12px] text-fg opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
      {text}
    </span>
  );
}

/** The zone's own navigation: your identity on top, one circle per Realm, the way out at the bottom. */
export function ZoneRail() {
  const pathname = usePathname();
  const identity = useActiveIdentity();
  const navigate = useZoneNavigate();
  const ring = "0 0 0 2px var(--bg-base), 0 0 0 4px var(--accent)";

  return (
    <nav
      aria-label="Realms"
      className="rail-scroll sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 overflow-x-auto border-b border-line bg-[#090807] px-4 md:h-screen md:w-[76px] md:flex-col md:overflow-y-auto md:overflow-x-visible md:border-b-0 md:border-r md:px-0 md:py-4"
    >
      <Link href="/anon/me" className={CIRCLE} aria-label={identity ? `Your identity, ${identity.name}` : "Create an identity"}>
        {identity ? (
          <IdentityAvatar hue={identity.hue} glyph={identity.glyph} size={44} isActive={pathname === "/anon/me"} />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-line-hover text-fg-muted">
            <VenetianMask size={18} strokeWidth={1.5} aria-hidden />
          </span>
        )}
        <Tip text={identity ? `You are ${identity.name}` : "Create an identity"} />
      </Link>

      <span className="h-8 w-px shrink-0 bg-line md:h-px md:w-8" aria-hidden />

      <Link
        href="/anon"
        aria-current={pathname === "/anon" ? "page" : undefined}
        className={`${CIRCLE} bg-overlay text-fg-muted hover:text-fg`}
        style={pathname === "/anon" ? { boxShadow: ring, color: "var(--text-primary)" } : undefined}
      >
        <VenetianMask size={20} strokeWidth={1.5} aria-hidden />
        <span className="sr-only">All Realms</span>
        <Tip text="All Realms" />
      </Link>

      {REALMS.map((r) => {
        const href = `/anon/${r.slug}`;
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        const label = realmLabel(r.slug);
        return (
          <Link
            key={r.slug}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`${CIRCLE} font-display text-[14px] font-bold text-fg`}
            style={{ backgroundColor: avatarTint(r.name), boxShadow: isActive ? ring : undefined }}
          >
            {initials(label)}
            <span className="sr-only">{label}</span>
            <Tip text={label} />
          </Link>
        );
      })}

      <span className="flex-1" aria-hidden />

      <Link
        href="/home"
        onClick={(e) => navigate(e, "/home", "main")}
        className={`${CIRCLE} border border-line text-fg-muted hover:border-line-hover hover:text-fg`}
      >
        <LogOut size={18} strokeWidth={1.5} aria-hidden />
        <span className="sr-only">Leave the anonymous zone</span>
        <Tip text="Back to Nexo" />
      </Link>
    </nav>
  );
}
