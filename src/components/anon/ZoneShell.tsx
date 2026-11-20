"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useActiveIdentity, useAnonStore } from "@/lib/anon-store";
import { CreateIdentity } from "./CreateIdentity";
import { IdentityAvatar } from "./IdentityAvatar";
import { ZoneRail } from "./ZoneRail";

function ZoneTopBar() {
  const identity = useActiveIdentity();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-base/90 backdrop-blur md:top-0">
      <div className="mx-auto flex h-14 max-w-[880px] items-center gap-4 px-4 lg:px-8">
        <p className="font-display text-[24px] font-bold leading-none">
          nexo<span className="text-accent">.</span>
          <span className="ml-2 text-fg-muted">after dark</span>
        </p>
        <span className="flex-1" />
        {identity && (
          <Link
            href="/anon/me"
            className="flex h-9 items-center gap-2 rounded-full border border-line pl-1 pr-3 text-[13px] transition-colors hover:border-line-hover"
          >
            <IdentityAvatar hue={identity.hue} glyph={identity.glyph} size={28} />
            <span className="hidden text-fg-muted sm:inline">Posting as</span>
            <span className="max-w-[10rem] truncate font-medium" style={{ color: identity.hue }}>
              {identity.name}
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}

function ZoneLoading() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading the zone">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-28 rounded-card border border-line bg-raised" />
      ))}
    </div>
  );
}

/** The anonymous zone: its own palette, its own navigation and its own identities. */
export function ZoneShell({ children }: { children: React.ReactNode }) {
  const hasHydrated = useAnonStore((s) => s.hasHydrated);
  const identity = useActiveIdentity();
  const pathname = usePathname();

  useEffect(() => {
    useAnonStore.persist.rehydrate();
  }, []);

  const needsIdentity = hasHydrated && !identity && pathname !== "/anon/me";

  return (
    <div className="zone-anon flex min-h-screen flex-col md:flex-row">
      <ZoneRail />
      <div className="flex min-w-0 flex-1 flex-col">
        <ZoneTopBar />
        <main className="mx-auto w-full max-w-[880px] flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {!hasHydrated && <ZoneLoading />}
          {needsIdentity && (
            <div className="mx-auto max-w-md">
              <CreateIdentity isFirst />
            </div>
          )}
          {hasHydrated && !needsIdentity && children}
        </main>
      </div>
    </div>
  );
}
